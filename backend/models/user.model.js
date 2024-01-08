const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 20,
    validate: {
        validator: (value) => /^[a-zA-Z0-9_-]+$/.test(value),
        message: "Invalid username format. Use only letters, numbers, hyphens, and underscores.",
      },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    validate: {
      validator: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/.test(value),
      message: "Invalid password format. Must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.",
    },
  },
});

const UserModel = mongoose.model("User",userSchema)

module.exports={UserModel}