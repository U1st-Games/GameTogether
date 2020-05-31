import * as express from 'express';
import path from 'path';

const app = express.default();
app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
    return res.send('pong');
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port);
console.log('Server started on port:', port);
