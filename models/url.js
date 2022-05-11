const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// membuat schema model
const UrlSchema = new Schema({
  original_url: {
    type: String,
    required: true,
  },
  short_url: {
    type: Number,
    required: true,
  },
});

// membuat model Url
const Url = mongoose.model('Url', UrlSchema);

// export Modul
module.exports = Url;
