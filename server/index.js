var express = require('express');
var app = express();
var jwt = require('express-jwt');
var cors = require('cors');

app.use(cors());

var authCheck = jwt({
    secret: new Buffer('YOUR_SECRET_KEY', 'base64'),
    audience: 'YOUR_AUDIENCE'
});

app.get('/api/public', function (req, res) {
    res.json({message: 'Hello from a public endpoint! You don\'t need to be authenticated to se this'});
});

app.get('/api/private', authCheck, function (req, res) {
    res.json({message: 'Hello from a private endpoint! You DO need to be authenticated to se this'});
});

app.listen(8001);
console.log('Listening on http://localhost:8001');
