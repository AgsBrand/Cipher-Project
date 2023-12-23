const { connect } = require("mongoose")
const URI = "mongodb://localhost:27017/cipher"
const connectToDb = async () => {
    try {
      await connect(URI);
      console.log("Connected to MongoDB successfully");
      // You can perform further operations or handle successful connection here
    } catch (error) {
      console.error("Error connecting to MongoDB:", error.message);
    }
  };

module.exports = connectToDb;