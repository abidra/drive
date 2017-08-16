import google from 'googleapis';
import request from 'superagent';
import axios from 'axios';
import fs from 'fs';
const OAuth2 = google.auth.OAuth2;
const api = require('../client_id.json');
const ClientId = api.web.client_id;
const ClientSecret = api.web.client_secret;
const RedirectionUrl = "http://localhost:4040/oauthCallback";
const oauth2Client = new OAuth2( ClientId, ClientSecret, RedirectionUrl ); 

const driveApi = {
	getAccess(req, res) {
		const scopes = [
			'https://www.googleapis.com/auth/drive.appfolder', 
			'https://www.googleapis.com/auth/drive.file'
		];
		
		let url = oauth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: scopes,
		});

		return res.json(url);
	},

	getTokens(req, res) {
		const code = req.query.code;
		oauth2Client.getToken(code, function (err, tokens) {
 	 		// Now tokens contains an access_token and an optional refresh_token. Save them.
			if (err) return console.error(err);
			
			oauth2Client.setCredentials(tokens);
			req.session['credentials'] = tokens;
			return res.json(req.session);
		});
	},

	refreshToken(req, res) {
		let tokens = req.session['credentials'];
		oauth2Client.setCredentials(tokens);

		oauth2Client.refreshAccessToken(function(err, tokens) {
			if (err) return console.error(err);
			oauth2Client.setCredentials(tokens);

			return res.json({success: true});
		});
	},

	upload(req, res) {
		const {file} = req;
		let token = 'ya29.GlzqAy9FyekVzXcU5NbZHgunRSr3EoIw8uUE82X414e3oKNewq0I1R626i9kVAC8cvXZgyofA8Q2CJSR3mTgnEil5DqS9cV5--dZPhK0AqEj_ByOYVg8wpUum2v_UA';
		let data = fs.createReadStream(`${__dirname.replace('controllers', '')}/${file.path}`);

		axios
		.post('https://www.googleapis.com/upload/drive/v3/files?uploadType=media', data, {	
			headers: {
				'Content-Type': file.mimetype,
				'Content-Length': file.size,
				'Authorization': `Bearer ${token}`
			}
		})
		.then(response => {
			return driveApi.updateFileName(response.data.id, file.filename, token);
		})
		.then(response => {
			return res.json({...response.data, url: `https://drive.google.com/file/d/${response.data.id}/view?usp=sharing`});
		})
		.catch((err) => console.log(err));

	},

	updateFileName(id, name, token) {
		return axios
		.patch(`https://www.googleapis.com/drive/v3/files/${id}`, {name}, {
			headers: {
				'Authorization': `Bearer ${token}`
			}
		});
	},

	download() {
		`https://www.googleapis.com/drive/v3/files/${id}?alt=media`
	}
}

export default driveApi;