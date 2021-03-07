const mongoose = require('mongoose');

const Task = mongoose.model('Task', new mongoose.Schema({
	name: String,
	description: String
}));

module.exports = {Task};