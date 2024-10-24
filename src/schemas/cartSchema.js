const { gql } = require('apollo-server');

module.exports = gql`
  type CartItem {
    ticketId: ID!
    quantity: Int!
  }

  type Cart {
    userId: String!
    items: [CartItem!]!
  }

  type Mutation {
    addTicketToCart(ticketId: ID!, userId: ID!): Cart
  }

  type Query {
    cartItems(userId: ID!): [CartItem!]
  }
`;
