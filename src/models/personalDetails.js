const mongoose = require("mongoose");

const personalSchema = mongoose.Schema({
   email: {
      type: String,
      require: true,
   },
   pincode: {
      type: String,
      require: true,
   },
   state: {
      type: String,
      require: true,
   },
   country: {
      type: String,
      require: true,
   }
});

module.exports = mongoose.model("personalDetails", personalSchema);