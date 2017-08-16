import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import session from 'express-session';
import multer from 'multer';
var storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() +'.'+ file.mimetype.split('/')[1] )
  }
})

var upload = multer({ storage: storage });

mongoose.connect('mongodb://localhost/drive');
const app = express();
import driveApi from './controllers/drive';
import usersApi from './controllers/users';

app.use(session({
  secret: 'drive_api_test',
  resave: false,
	saveUninitialized: false
}));

app.use(bodyParser.urlencoded({ 
	extended: false 
}));

app.use(bodyParser.json());

app.get('/', (req, res) => {
  return res.sendFile(`${__dirname}/public/index.html`);
});

app.get('/api/v1/drive', driveApi.getAccess);
app.get('/api/v1/drive/refresh', driveApi.refreshToken);
app.get('/oauthCallback', driveApi.getTokens);
app.post('/api/v1/drive/upload', upload.single('photo'), driveApi.upload);
app.get('/api/v1/users', usersApi.getAll);
app.post('/api/v1/users', usersApi.store);

var server = http.createServer(app);
server.listen(4040);
