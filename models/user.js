import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({ 
	name: String,
	email: String,
	password: String,
	google: {
		access_token: String,
    refresh_token: String,
		expiry_date: Number
	},
	date: { 
		type: Date, 
		default: Date.now 
	}
});

UserSchema.methods.generateHash = password => {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = password => {
	return bcrypt.compareSync(password, this.local.password);
};

export default mongoose.model('User', UserSchema);