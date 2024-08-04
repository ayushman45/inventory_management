const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    academyEnabled:{
        type: Boolean,
        default: false
    },
    adminUser:{
        type: String,
        default: "admin"
    }
})

export const User = mongoose.models.User || mongoose.model("User", userSchema);