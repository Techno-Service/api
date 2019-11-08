const mongoose = require('mongoose')
const config = require('../config')

module.exports = function() {
	const db = config.db
	 mongoose.set('useUnifiedTopology', true)
	mongoose.set('useNewUrlParser', true)
	mongoose.set('useCreateIndex', true)
	mongoose.set('useFindAndModify', false)
	mongoose.connect(db)
		.then(() => console.log(`Connected to ${db}...`))
}
