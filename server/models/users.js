const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fName: String,
    lName: String,
    email: String,
    password: String,
    image: String,
    role: String,
    isBanned: Boolean
})

module.exports = mongoose.model('User', userSchema);