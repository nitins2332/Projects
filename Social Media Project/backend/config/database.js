const mongoose = require("mongoose");

exports.connnectDatabase = () => {
  mongoose
    .connect(precess.env.MONGO_URI)
    .then((con) => {
      console.log(`Database connected: ${con.database.host}`);
    })
    .catch((err) => {
      console.log(`err`);
    });
};
