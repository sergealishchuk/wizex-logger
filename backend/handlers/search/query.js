const fs = require('fs');
const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  node: 'https://192.168.0.108:9200',
  //node: 'https://workpc:9200',
  auth: {
    username: 'elastic',
    password: 'oaEjYDNfmcFOZ-OIXSbV',
  },
  tls: {
    ca: fs.readFileSync('handlers/search/certs/http_ca.crt'),
    rejectUnauthorized: false,
  }
});

module.exports = async (req, res, tokenPayload) => {
  const { body = {} } = req;

  const { text } = body;

  let result;
  try {
    result = await client.search({
      index: 'products',
      query: {
        "bool": {
          "must": [
            {"match": {
              "name": text,
            }}
          ],
        }
      }
    });

    return {
      ok: true,
      result,
    }
  } catch (e) {
    console.log('error', e);
    res.status(400).json(
      { error: createErrorMessage("Error change status product.") }
    );
  }
};
