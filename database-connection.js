const mongoose = require('mongoose');
const db_path = 'mongodb://localhost/tasks';

const config = {
	useNewUrlParser: true,
	useUnifiedTopology:true
};

mongoose.connect(db_path, config, error =>{
	if(!error)
		console.log('Conexión exitosa');
	else
		console.log('Error: Conexión fallida');
});
