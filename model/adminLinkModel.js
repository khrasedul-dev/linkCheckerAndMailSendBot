const mongoose = require('mongoose')


const addSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    userName: {
        type: String
    },
    link: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{versionKey: false})

module.exports = mongoose.model('admin_link',addSchema)