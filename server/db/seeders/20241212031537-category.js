

const Category = require("../Model/categorySchema");
const mongoose = require('mongoose')

module.exports = {
  up: async () => {
    try {
      const result = await Category.insertMany([
        {
          _id: new mongoose.Types.ObjectId("675a56b594a8745fdde82fbf"),
          Category: "Comedy Shows"
        },
        {
          _id: new mongoose.Types.ObjectId("675a56bf94a8745fdde82fc0"),
          Category: "Music Shows"
        },
        {
          _id: new mongoose.Types.ObjectId("675a56c894a8745fdde82fc1"),
          Category: "Kids"
        },
        {
          _id: new mongoose.Types.ObjectId("675a56d294a8745fdde82fc2"),
          Category: "Workshops"
        },
        {
          _id: new mongoose.Types.ObjectId("675a56db94a8745fdde82fc3"),
          Category: "Performances"
        },
        
        // ...
      ]);
      console.log("Seeding successful");
      console.log(result.length); // Logs the number of inserted documents
    } catch (error) {
      console.error("Seeding failed:", error);
    }
  },

  down: async () => {
    try {
      const result = await Category.deleteMany({
        _id: {
          $in: [
            new mongoose.Types.ObjectId("675a56b594a8745fdde82fbf"),
            new mongoose.Types.ObjectId("675a56bf94a8745fdde82fc0"),
            new mongoose.Types.ObjectId("675a56c894a8745fdde82fc1"),
            new mongoose.Types.ObjectId("675a56d294a8745fdde82fc2"),
            new mongoose.Types.ObjectId("675a56db94a8745fdde82fc3"),

            // ...
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
