const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  from: {
    type: String, 
    required: true,
  },
  to: {
    type: String, 
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdTime: {
    type: Date,
    default: Date.now,
  },
  openTime: {
    type: Date, 
    required: true,
  },
  isOpened: {
    type: Boolean,
    default: false,
  },
  deletedFromInbox: {
    type: Boolean,
    default: false,
  },

  
  reactions: {
    type: Map,
    of: [String],
    default: () => ({
      '❤️': [],
      '😮': [],
      '😂': [],
      '😢': [],
      '👍': [],
      '👎': []
    })
  }
});

module.exports = mongoose.model("Message", messageSchema);
