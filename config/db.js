const mongoose = require('mongoose')

const mongConnect = async () => {

    try {

        mongoose.connect('mongodb://127.0.0.1:27017/e-commerce')
        console.log("mongoose connected")

    } catch (err) {
        console.log(err)
    }


}

module.exports = mongConnect