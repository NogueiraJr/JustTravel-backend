const { makeExecutableSchema } = require('@graphql-tools/schema');
const { graphql } = require('graphql');
const TicketResolver = require('../resolvers/ticketResolver');
const Ticket = require('../models/Ticket');
const typeDefs = require('../graphql/ticketSchema');

jest.mock('../models/Ticket', () => ({
  find: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockResolvedValue([]),
  findById: jest.fn(),
}));

describe('Ticket Resolver', () => {
  const schema = makeExecutableSchema({ typeDefs, resolvers: TicketResolver });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deve retornar tickets por cidade', async () => {
    const cityName = 'São Paulo';
    const mockTickets = [
      { id: '1', name: 'Bilhete A', city: cityName },
      { id: '2', name: 'Bilhete B', city: cityName }
    ];

    Ticket.limit.mockResolvedValue(mockTickets);

    const query = `
      query GetTicketsByCity($cityName: String!, $page: Int, $limit: Int) {
        ticketsByCity(cityName: $cityName, page: $page, limit: $limit) {
          id
          name
          city
        }
      }
    `;

    const variables = { cityName, page: 1, limit: 10 };
    const response = await graphql({ schema, source: query, variableValues: variables });

    console.log('Response:', JSON.stringify(response, null, 2));

    expect(response.data.ticketsByCity).toEqual(mockTickets);
    expect(Ticket.find).toHaveBeenCalledWith({ city: cityName });
  });

  it('Deve retornar um ticket por ID', async () => {
    const id = '1';
    const mockTicket = { id, name: 'Bilhete A', city: 'São Paulo' };

    Ticket.findById.mockResolvedValue(mockTicket);

    const query = `
      query GetTicketById($id: ID!) {
        ticketById(id: $id) {
          id
          name
          city
        }
      }
    `;

    const variables = { id };
    const response = await graphql({ schema, source: query, variableValues: variables });

    expect(response.data.ticketById).toEqual(mockTicket);
    expect(Ticket.findById).toHaveBeenCalledWith(id);
  });
});
