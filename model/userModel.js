const mongoose = require('mongoose')


const checkSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    userName: {
        type: String
    },
    email: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{versionKey: false})

module.exports = mongoose.model('user',checkSchema)