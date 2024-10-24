const Cart = require('../models/Cart');

module.exports = {
  Query: {
    cartItems: async (_, { userId }) => {
      const cart = await Cart.findOne({ userId });
      return cart ? cart.items : [];
    },
  },
  Mutation: {
    addTicketToCart: async (_, { ticketId, userId }) => {
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({ userId, items: [] });
      }

      const existingItem = cart.items.find(item => item.ticketId.toString() === ticketId);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({ ticketId, quantity: 1 });
      }

      await cart.save();
      return cart;
    },
  },
};
