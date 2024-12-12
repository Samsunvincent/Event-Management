

const Language = require("../Model/languageSchema");
const mongoose = require('mongoose')

module.exports = {
  up: async () => {
    try {
      const result = await Language.insertMany([
        {
          _id: new mongoose.Types.ObjectId("675a47153c0d71c19f948214"),
          Language: "Malayalam"
        },
        {
          _id: new mongoose.Types.ObjectId("675a47243c0d71c19f948215"),
          Language: "Hindi"
        },
        {
          _id: new mongoose.Types.ObjectId("675a472e3c0d71c19f948216"),
          Language: "Tamil"
        },
        {
          _id: new mongoose.Types.ObjectId("675a47393c0d71c19f948217"),
          Language: "English"
        },
        {
          _id: new mongoose.Types.ObjectId("675a47433c0d71c19f948218"),
          Language: "Marathi"
        }
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
      const result = await Language.deleteMany({
        _id: {
          $in: [
            new mongoose.Types.ObjectId("675a47153c0d71c19f948214"),
            new mongoose.Types.ObjectId("675a47243c0d71c19f948215"),
            new mongoose.Types.ObjectId("675a472e3c0d71c19f948216"),
            new mongoose.Types.ObjectId("675a47393c0d71c19f948217"),
            new mongoose.Types.ObjectId("675a47433c0d71c19f948218"),

            
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
