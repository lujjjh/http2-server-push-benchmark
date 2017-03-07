const browserPerf = require('browser-perf');

const server = require('./server');

let url = `https://localhost:${server.address().port}`;

let options = {
  selenium: 'http://localhost:4444/wd/hub',
  browsers: [ 'chrome' ]
};

const perf = url => new Promise((resolve, reject) => {
  browserPerf(url, (err, res) => err ? reject(err) : resolve(res), options);
});

server.once('listening', async () => {
  let timeline = await perf(url);
  server.close();
});
