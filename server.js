const http = require('http');
const app = require('./app');
const https = require('https');
var fs = require('fs');

// var privateKey = fs.readFileSync('/etc/letsencrypt/live/fifbet.com/privkey.pem');
// var certificate = fs.readFileSync('/etc/letsencrypt/live/fifbet.com/cert.pem');
// var ca = fs.readFileSync('/etc/letsencrypt/live/fifbet.com/chain.pem');

// const credentials = {
//     key: privateKey,
//     cert: certificate,
//     ca: ca
// }

const port = process.env.PORT || 6544;
const server = http.createServer(app);

// const httpsServer = https.createServer(credentials, app);
// httpsServer.listen(9865, () => {
//     console.log("HTTPS FORTLAN RUNNING 9865")
// })


server.listen(port, function() {
    console.log("HTTPS FORTLAN RUNNING 9865");
});