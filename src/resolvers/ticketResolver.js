const Ticket = require('../models/Ticket');

module.exports = {
  Query: {
    ticketsByCity: async (_, { cityName, page = 1, limit = 10 }) => {
      return await Ticket.find({ city: cityName })
        .skip((page - 1) * limit)
        .limit(limit);
    },
    ticketById: async (_, { id }) => {
      return await Ticket.findById(id);
    },
  },
};
