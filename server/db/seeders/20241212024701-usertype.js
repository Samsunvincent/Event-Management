const userType = require('../Model/userType'); // Assuming this is the Mongoose model
const mongoose = require('mongoose');

'use strict';

module.exports = {
  up: async () => {
    try {
      // Explicitly cast _id to ObjectId
      const result = await userType.insertMany([
        {
          _id: new mongoose.Types.ObjectId("675988dadbb73a46140a4430"), // Cast to ObjectId
          userType: "Organizer"
        },
        {
          _id: new mongoose.Types.ObjectId("675988dadbb73a46140a4431"), // Cast to ObjectId
          userType: "Attendees"
        }
      ]);
      console.log("Seeding successful");
      console.log(result.length); // Logs the number of inserted documents
    } catch (error) {
      console.error("Seeding failed:", error);
    }
  },

  down: async () => {
    try {
      // Deleting based on the fixed _id values
      const result = await userType.deleteMany({
        _id: {
          $in: [
            new mongoose.Types.ObjectId("675988dadbb73a46140a4430"), // Cast to ObjectId
            new mongoose.Types.ObjectId("675988dadbb73a46140a4431")  // Cast to ObjectId
          ]
        }
      });
      console.log("Seeder rollback successful");
      console.log(result.deletedCount); // Logs the number of deleted documents
    } catch (error) {
      console.error("Rollback failed:", error);
    }
  }
};
