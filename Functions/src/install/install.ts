import * as functions from 'firebase-functions';
import { Client } from 'ssh2';
export const installFunction = functions.https.onRequest((req:functions.Request, res) => {
  const conn = new Client();
  conn.connect({
    host: req.body.host,
    port: req.body.host,
    username: req.body.username,
    // privateKey: require('fs').readFileSync('/path/to/your/private/key'),
   password: req.body.password
  })
  conn.on('ready', () => {  console.log('Client :: ready');
  conn.exec('v2ray', (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
      conn.end();
    }).on('data', (data) => {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      console.log('STDERR: ' + data);
    });
  });
});
  res.send('Installation started');
});