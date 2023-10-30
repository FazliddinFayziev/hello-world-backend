const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    },
})

// Model
const User = mongoose.model("user", UserSchema);

// Export 
exports.User = User;