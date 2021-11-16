const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  email: {
    type: String
  },
  slot: {
    type: String,
  }
});

const Slot = mongoose.model('Slot', SlotSchema);

module.exports = Slot;