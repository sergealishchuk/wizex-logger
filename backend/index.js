const _ = require('lodash');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: '../.env' });
const { APP_ENV, JWT_SECRET_KEY } = process.env;
global.APP_ENV = APP_ENV || 'development';
console.log('Environment: ', global.APP_ENV);

const { baseUrl, port } = require('./config/config')["server"];

const { Sids, sequelize } = require('./models');

const routes = require('./tools/read_routers');

const app = express();

const isPromise = (promise) => promise instanceof Promise;

const App = app
  .use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }))
  .use(bodyParser.json());

_.map(routes, ({ route, method, handlerPath, auth }) => {
  App[method.toLowerCase()](`${baseUrl}${route}`, async (req, res, next) => {
    let result = {};
    let promiseResult = false;
    console.log(route)
    try {
      delete require.cache[require.resolve(handlerPath)];
      const runner = require(handlerPath);

      let tokenPayload;

      const tokenHeader = _.get(req, 'headers.authorization', '');
      const token = tokenHeader && tokenHeader.slice(7);

      try {
        if (token) {
          tokenPayload = jwt.verify(token, JWT_SECRET_KEY);
          const { id, session } = tokenPayload;
          const allSessions = await Sids.findOne({
            where: {
              userId: id,
            },
            raw: true,
          });

          if (allSessions) {
            const { sids = [] } = allSessions;
            if (!sids.includes(session)) {
              throw "SessionNotFound";
            }
          }
        }
      } catch (error) {
        console.log('error:', error);
        if (auth) {
          result = {
            status: 401,
            code: 'TOKEN_IS_EXPIRED',
            error: {
              errors: [
                {
                  message: 'JWT must be provided'
                }
              ]
            }
          }
          res.status(401).json(result);
          return;
        }
      }

      if (!auth || (auth && tokenPayload)) {
        //console.log('auth', auth);
        //console.log('tokenPayload:', tokenPayload);
        result = runner(req, res, tokenPayload);
        promiseResult = isPromise(result);

        if (promiseResult) {
          result.then((queryResult) => {
            if (queryResult) {
              const { status = 200 } = queryResult;
              res.status(status).json(queryResult);
              return;
            }
            next();
          })
            .catch((error) => {
              console.log('error:', error);
              res.status(400).json({ error: { errors: [{ message: "Unexpected error...." }] }, e: error });
            })
        }
      }
    } catch (error) {
      result = {
        code: 417,
        ERROR_CODE: "REQUEST_PROCESSING_ERROR",
        stack: error.stack,
      }
    } finally {
      if (!promiseResult && result.code !== 'TOKEN_IS_EXPIRED') {
        res.json(result);
      }
    }
  })
});

app.listen(port, async () => {
  console.log(`Server started ${baseUrl} : ${port}`);
  //await sequelize.sync({force: true});
  await sequelize.authenticate();
  console.log('Database synced!');
});
