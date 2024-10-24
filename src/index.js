const { ApolloServer } = require('apollo-server');
const connectDB = require('./config/database');
const ticketSchema = require('./schemas/ticketSchema');
const cartSchema = require('./schemas/cartSchema');
const ticketResolver = require('./resolvers/ticketResolver');
const cartResolver = require('./resolvers/cartResolver');

require('dotenv').config();
connectDB();

const typeDefs = [ticketSchema, cartSchema];
const resolvers = [ticketResolver, cartResolver];

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
