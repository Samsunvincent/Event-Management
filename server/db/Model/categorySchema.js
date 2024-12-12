
const mongoose = require('mongoose');

let categorySchema = new mongoose.Schema(
  {
    Category: {
      type: String,
      required: true,  // This ensures that the userType is always set
    }
  },
  { timestamps: true }  // Adds createdAt and updatedAt fields automatically
);

module.exports = mongoose.model('Category', categorySchema);
