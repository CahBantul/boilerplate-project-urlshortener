const Schema = require('mongoose').Schema;

// membuat schema model
module.exports = {
  Url: new Schema({
    original_url: {
      type: String,
      required: true,
    },
    short_url: {
      type: Number,
      required: true,
    },
  }),
};
