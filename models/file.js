import mongoose from 'mongoose';

const File = mongoose.model('file', { 
	owner: ObjectId,
	name: {
  	type: String,
		required: 'Nombre requerido'
  },
	date: { type: Date, default: Date.now }
});

export default File;