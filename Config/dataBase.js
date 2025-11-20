const mongoose = require("mongoose");

const connectDatabase = async () => {
  await mongoose
    .connect(process.env.MongoDB_URI)

    .then((con) => {
      console.log(
        `MongoDB is connected to the host: ${mongoose.connection.host}`
      );
    });
};

module.exports = connectDatabase;
