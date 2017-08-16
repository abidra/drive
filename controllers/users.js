import User from '../models/user';

const Users = {
	getAll(req, res) {
		User.find()
		.limit(10)
		.then(users => res.json(users));
	},

	store(req, res) {
		let data = req.body;
		
		let model = new User(data);
		model['password'] = model.generateHash(model.password);
		model.save()
		.then(stored => res.json(stored))
		.catch(errs => res.json(errs));
	},

	login() {

	}
}

export default Users; 