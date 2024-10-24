const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  city: String,
  imageUrl: String,
  rating: Number,
});

module.exports = mongoose.model('Ticket', ticketSchema);
