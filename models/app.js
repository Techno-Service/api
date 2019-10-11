
const config = require('../config')
const Joi = require('joi')
const mongoose = require('mongoose')
const _ = require('lodash')
const deskafSchema = new mongoose.Schema({
	background: {
		type: String,
		required: true,
		minlength: 1,
		maxlength: 2000,
		default: '/background.jpg'
	},
	background_redirect: {
		type: Object,
		required: true,
		minlength: 1,
		maxlength: 2000,
		default: {
			url: null,
			placeholder: null,
			caption: null,
			btn_style: null
		}
	},
	facebook: {
		type: String,
		minlength: 5,
		maxlength: 255,
		default: 'https://www.facebook.com/Design.kaf/'
	},
	twitter: {
		type: String,
		minlength: 5,
		maxlength: 255,
		default: 'https://twitter.com/designkaf'
	},
	instagram: {
		type: String,
		minlength: 5,
		maxlength: 255,
		default: 'https://www.instagram.com/design.kaf'
	},
	socialmedia: {
		type: Object,
		minlength: 5,
		maxlength: 255,
		default: null
	},
	jobs_count: {
		type: Number,
		default: 0
	}
})


const Deskaf = mongoose.model('Deskaf', deskafSchema)

function validateDeskaf(deskaf) {
	const schema = {
		background: Joi.string().min(1).max(2000),
		background_redirect: Joi.object(),
		facebook: Joi.string().min(5).max(255),
		twitter: Joi.string().min(5).max(255),
		instagram: Joi.string().min(5).max(255)
	}
	return Joi.validate(deskaf, schema)
}

exports.Deskaf = Deskaf 
exports.validate = validateDeskaf