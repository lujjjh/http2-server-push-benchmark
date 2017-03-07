const fs = require('fs');
const http2 = require('http2');
const path = require('path');
const { PassThrough } = require('stream');
const Throttle = require('throttle');

const LIMIT_IN = 20;
const LIMIT_OUT = 20;

let server = module.exports = http2.createServer({
  key: fs.readFileSync(path.join(__dirname, '/localhost.key')),
  cert: fs.readFileSync(path.join(__dirname, '/localhost.crt'))
}, handleRequest).listen(() => {
  console.log(`listening on https://localhost:${server.address().port}`);
});

function handleRequest(req, res) {
  let throttledReq = req.pipe(new Throttle(LIMIT_IN));
  let throttledRes = new PassThrough();
  throttledRes.pipe(new Throttle(LIMIT_OUT)).pipe(res);
  res.writeHead(200);
  throttledRes.end('Hello HTTP/2\n');
};
