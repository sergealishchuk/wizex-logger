const pg = require("pg");
const Client = pg.Client;
const ADMIN_DB = "postgres";

function createFunction(action) {
  return async function (opts, dbName) {
    if (!dbName) throw new TypeError("dbName not set");

    const config = {
      ...opts,
      database: ADMIN_DB,
    };
    const client = new Client(config);
    try {
      await client.connect();
      const escapedDatabaseName = dbName.replace(/\"/g, '""');
      const sql = `${action} DATABASE "${escapedDatabaseName}"`;
      const result = await client.query(sql);
      return result;
    } catch (err) {
      console.log('error:', err);
    } finally {
      client.end();
    }
  };
};

async function createUser(opts, params) {
  const { username, userpassword } = params;
  const config = {
    ...opts,
  };
  const client = new Client(config);
  try {
    await client.connect();
    //const escapedDatabaseName = dbName.replace(/\"/g, '""');
    //const sql = `${action} DATABASE "${escapedDatabaseName}"`;
    const sql = `create user ${username} with encrypted password '${userpassword}';`
    const result = await client.query(sql);

    const sql2 = `grant all privileges on database "${opts.database}" to ${username}`;
    console.log('sql2=', sql2);
    const result2 = await client.query(sql2);

    return {result, result2};
  } catch (err) {
    console.log('error:', err);
  } finally {
    client.end();
  }
};

const utils = {
  createdb: createFunction("CREATE"),
  dropdb: createFunction("DROP"),
};

// console.log('utils:', utils);
// const res = utils.createdb({
//   user: 'postgres',
//   password: 'postgres',
//   host: 'localhost',
// },'aliokskbedb');
// console.log('res:', res);

const resCreateUser = createUser({
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  database: 'aliokskbedb'
}, {
  username: 'aliokskbeuser',
  userpassword: '@jvfd5Yx'
});
console.log('resCreateUser', resCreateUser);



module.exports = utils;