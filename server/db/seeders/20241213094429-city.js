

const City = require("../Model/citySchema");
const mongoose = require('mongoose')

module.exports = {
  up: async () => {
    try {
      const result = await City.insertMany([
        {
          _id: new mongoose.Types.ObjectId("675c0336c090e6701021cc6d"),
          City: "Thiruvananthapuram"
        },
        {
          _id: new mongoose.Types.ObjectId("675c0340c090e6701021cc6e"),
          City: "Kochi"
        },
        {
          _id: new mongoose.Types.ObjectId("675c034ac090e6701021cc6f"),
          City: "Kozhikode"
        },
        {
          _id: new mongoose.Types.ObjectId("675c0352c090e6701021cc70"),
          City: "Thrissur"
        },
        {
          _id: new mongoose.Types.ObjectId("675c035bc090e6701021cc71"),
          City: "Alappuzha"
        },
        {
          _id: new mongoose.Types.ObjectId("675c0364c090e6701021cc72"),
          City: "Varkala "
        },
        {
          _id: new mongoose.Types.ObjectId("675c036dc090e6701021cc73"),
          City: "Chalakudy  "
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
      const result = await City.deleteMany({
        _id: {
          $in: [
            new mongoose.Types.ObjectId("675c0336c090e6701021cc6d"),
            new mongoose.Types.ObjectId("675c0340c090e6701021cc6e"),
            new mongoose.Types.ObjectId("675c034ac090e6701021cc6f"),
            new mongoose.Types.ObjectId("675c0352c090e6701021cc70"),
            new mongoose.Types.ObjectId("675c035bc090e6701021cc71"),
            new mongoose.Types.ObjectId("675c0364c090e6701021cc72"),
            new mongoose.Types.ObjectId("675c036dc090e6701021cc73"),


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
