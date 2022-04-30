const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
   name: {
      type: String,
      require: true,
   },
   email: {
      type: String,
      unique: true,
      require: true,
   },
   password: {
      type: String,
      require: true,
   },
   phone: {
      type: String,
      require: true,
   }
});

module.exports = mongoose.model("users", userSchema);