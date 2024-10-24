const { gql } = require('apollo-server');

module.exports = gql`
  type Ticket {
    id: ID!
    name: String!
    description: String
    price: Float!
    city: String!
    imageUrl: String
    rating: Float
  }

  type Query {
    ticketsByCity(cityName: String!, page: Int, limit: Int): [Ticket!]
    ticketById(id: ID!): Ticket
  }
`;
