// models/languageSchema.js

const mongoose = require('mongoose');

let languageSchema = new mongoose.Schema(
  {
    Language: {
      type: String,
      required: true,  // This ensures that the userType is always set
    }
  },
  { timestamps: true }  // Adds createdAt and updatedAt fields automatically
);

module.exports = mongoose.model('Language', languageSchema);
