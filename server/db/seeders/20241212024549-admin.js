const bcrypt = require('bcrypt');
const userdata = require('../Model/userModel');  // Adjust the path based on your folder structure

'use strict';

module.exports = {
  up: async (models, mongoose) => {
    try {
      // Check if the admin already exists
      const existingAdmin = await userdata.findOne({ email: "admin@gmail.com" });

      if (existingAdmin) {
        console.log("Admin already exists!");
        return;
      }

      // Hash the password if you are not using a pre-hashed password
      const hashedPassword = await bcrypt.hash("admin#123", 10);

      // Insert Admin data into Register collection
      const result = await userdata.insertMany([
        {
          _id: "675981512c704a4ab2309e3b",
          name: "Admin",
          email: "admin@gmail.com",
          password: hashedPassword,  // Insert hashed password
          role: "Admin",  // Set role to Admin in Register schema
          isActive: true,
        }
      ]);

      console.log(`${result.length} Admin user inserted`);  // Use result.length to log the inserted count
    } catch (error) {
      console.error("Error inserting Admin user:", error);
    }
  },

  down: async (models, mongoose) => {
    try {
      const result = await userdata.deleteMany({
        _id: { $in: ["675981512c704a4ab2309e3b"] }
      });

      console.log(`${result.deletedCount} Admin user deleted`);
    } catch (error) {
      console.error("Error deleting Admin user:", error);
    }
  }
};
