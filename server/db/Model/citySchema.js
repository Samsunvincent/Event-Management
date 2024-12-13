
const mongoose = require('mongoose');

let citySchema = new mongoose.Schema(
  {
    City: {
      type: String,
      required: true,  // This ensures that the userType is always set
    }
  },
  { timestamps: true }  // Adds createdAt and updatedAt fields automatically
);

module.exports = mongoose.model('City', citySchema);