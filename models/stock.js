const config = require('../config')
const Joi = require('joi')
const mongoose = require('mongoose')
const _ = require('lodash')
const car_compatibility = new mongoose.Schema({
	brand: { type: String, default: 'BMW'},
	model: { type: String, default: 'M3' }
	release:{ type: Number, default:  2019 }
})
const stock = new mongoose.Schema({
	name: {
		type: String,
		default: 'Mobile Engine Oil x5'
	},
	category: {
		type: String,
		default: 'Engine Oil'
	},
	vendor: {
		type: Object,
		default: {
			phone: '+201011133122',
			name: 'Jhon Doe',
			address: 'al-khalifa al maamon, heliopolis'
		},
	},
	created_at: {
		type: Date,
		default: Date.now()
	},
	price: {
		type: Number,
		default: 0,
		min: 0
	},
	count: {
		type: Number,
		default: 0
	},
	points: {
		type: Number,
		default: 0
	},
	notes: {
		type: String,
		default: null
	},
	status: {
		type: String,
		default: 'instock'
	},
	car_compatibility: {
		type: [ car_compatibility ],
		type: Array,
		default: []
	},
	extrnal: {
		type: Boolean,
		default: false
	}
})



const Job = mongoose.model('stock', stock)
exports.Stock = stock 