const _ = require('lodash')
const moment = require('moment')


const config = require('../config')
const { Job, ValidateJob } = require('../models/job')
const { Deskaf } = require('../models/app')

// Sortable Attributes  
const sortableAttributes = ['timein', 'sales', 'price']
// Validate Sort Key
const validSort = val => (sortableAttributes.indexOf(val) !== -1) ? val : false

const handleSpecialChars = val => val.replace(/[!@#$%^&*(),.?":{}|<>+-]/, t => `\\${t}`)

module.exports = {
	async getAll(req, res) {
		const page = req.query.page ? parseInt(req.query.page, 10) : 0
		const sort = validSort(req.query.sort) || 'timein'
		const date = req.query.date ? req.query.date.split(',').map(d => (d && d.length ? d : null)) : null
		const price = req.query.price ? req.query.price.split(',').map(d => (d ? parseInt(d, 10) : null)) : null
		const desc = req.query.desc && req.query.desc !== 'yes' ? 1 : -1
		const stats = !!(req.query.stats && req.query.stats === 'yes')
		const job_no = req.query.job_no && req.query.job_no.length ? parseInt(req.query.job_no) : null
		const phone = req.query.phone || null
		const name = req.query.name || null
		const brand = req.query.brand || null
		const model = req.query.model || null
		const part = req.query.part || null
		const status = req.query.status ? req.query.status : null
		const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5
		const select = req.query.select ? req.query.select.split(',').join(' ') : null
		const filters = {}
		if (job_no && typeof job_no === 'number') {
			filters.job_no = parseInt(job_no, 10)
		}
		if (phone && phone.length) {
			filters['client.phone'] = {  $regex: new RegExp( handleSpecialChars(phone), 'i') }
		}
		if (name && name.length) {
			filters['client.name'] = {  $regex: new RegExp( handleSpecialChars(name), 'i') }
		}
		if (brand && brand.length) {
			filters['car.brand'] = {  $regex: new RegExp( handleSpecialChars(brand), 'i') }
		}
		if (model && model.length) {
			filters['car.model'] = {  $regex: new RegExp( handleSpecialChars(model), 'i') }
		}
		if (part && part.length) {
			filters['operations.part'] = { $regex: new RegExp( handleSpecialChars(part), 'i') } 
		}
		if (status) {
			filters.status = status
		}
		if (date) {
			if (date.length === 2) {
				if (date[0])
					filters.timein = { $gte: new Date(date[0]) }
				if (date[1])
					filters.timein = date[0] ? { ...filters.timein, $lte: new Date(date[1]) } : { $lte: new Date(date[1]) }
			}
		}
		if (price) {
			if (price.length === 2) {
				filters['price'] = {}
				if (price[0])
					filters['price'].$gte = price[0]
				if (price[1])
					filters['price'].$lte = price[1]
			}
		}

		const count = await Job.find(filters)
		const pages = Math.ceil(count.length / limit, 10)
		const sorter = {}
		sorter[sort] = desc
		try {
			const jobs = stats ? null : await Job.find(filters)
		    .select(select)
				.skip(page * limit)
				.limit(limit)
				.sort(sorter)
			const result = {
				jobs: stats ? count : jobs,
				page : stats ? null : page,
				pages : stats ? null : pages,
				limit : stats ? null : limit ,
				stats,
				// filters,
				totalPrice: _.sumBy(count, p => p.price)
			}
			return res.send(result)
		} catch(err) {
			return res.status(500).send(err)
		}
	},

	async add(req, res) {
		const { error } = ValidateJob(req.body) 
		if (error) return res.status(400).send(error.details[0].message)
		const instance = await Deskaf.find({})
	    const job_no = instance && instance[0].jobs_count ? instance[0].jobs_count : 0
	    await Deskaf.updateMany({}, { $set: { jobs_count: job_no + 1 } })
			job = new Job({...req.body, job_no})
			await job.save()
			return res.send(job)
	},


	// Per One
	async getOne(req, res) {

		if (!req.params.id || !req.params.id.length) return res.status(400).send('Job number is required')

		const job = await Job.findOne({job_no: parseInt(req.params.id, 10)})
		if (!job) {
			return res.status(404).send('Job Not Found')
		}
		res.send(job)
	},

	async update(req, res) {
		const { error } = ValidateJob(req.body, true) 
		if (error) return res.status(400).send(error.details[0].message)
		let payload = req.body
		if (payload.status && payload.status.toLowerCase() === 'finished') {
			payload.timeleave = Date.now()
		}
		const updated = await Job.findOneAndUpdate(
			{_id: req.params.id},
			{
				$set: payload 
			},
			{
				new: true
			}
		)
		if (!updated) {
			return res.status(404).send('Job Not Found')
		}
		return res.send(updated)
	},
	async deleteJob(req, res) {
		const job = await Job.findById(req.params.id)
		if (!job) {
			return res.status(404).send('Job Not Found')
		}
		Job.deleteOne({ _id: req.params.id }, function(err) {
				   return res.send('Deleted')
		})
	}
}
