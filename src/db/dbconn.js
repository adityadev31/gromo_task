const mongoose = require("mongoose");

const dbconn = (dburl) => {
   mongoose.connect(dburl);
}

module.exports = dbconn;