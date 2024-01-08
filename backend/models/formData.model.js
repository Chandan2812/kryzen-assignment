const mongoose = require("mongoose");

const formDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 2, 
    maxlength: 50, 
    trim: true,   
  },
  age: {
    type: Number,
    required: true,
    min: 1,      
  },
  address: {
    type: String,
    required: true,
    minlength: 5, 
    maxlength: 100,
    trim: true,   
  },
  photo: {
    type: String, 
  },
});

const FormDataModel = mongoose.model("FormData", formDataSchema);

module.exports = { FormDataModel };
