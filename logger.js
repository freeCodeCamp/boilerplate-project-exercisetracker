const pino = require('pino');
const { createWriteStream } = require('pino-logflare');

const stream = createWriteStream({
    apiKey: process.env.LOGFLARE_API_KEY,
    sourceToken: process.env.LOGFLARE_SOURCE_TOKEN
});

const options = {};

const logger = pino(options, stream);

module.exports = logger;