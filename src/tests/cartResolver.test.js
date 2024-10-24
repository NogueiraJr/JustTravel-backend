const { makeExecutableSchema } = require('@graphql-tools/schema');
const { graphql } = require('graphql');
const CartResolver = require('../resolvers/cartResolver');
const Cart = require('../models/Cart');
const typeDefs = require('../graphql/cartSchema');

jest.mock('../models/Cart');

describe('Cart Resolver', () => {
  const schema = makeExecutableSchema({ typeDefs, resolvers: CartResolver });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deve retornar itens do carrinho por userId', async () => {
    const userId = '123';
    Cart.findOne.mockResolvedValue({
      userId,
      items: [{ ticketId: '456', quantity: 2 }]
    });

    const query = `
      query GetCartItems($userId: ID!) {
        cartItems(userId: $userId) {
          ticketId
          quantity
        }
      }
    `;

    const variables = { userId };
    const response = await graphql({ schema, source: query, variableValues: variables });

    expect(response.data.cartItems).toEqual([{ ticketId: '456', quantity: 2 }]);
    expect(Cart.findOne).toHaveBeenCalledWith({ userId });
  });

  it('Deve adicionar um ticket ao carrinho', async () => {
    const userId = '123';
    const ticketId = '456';
    const mockCart = {
      userId,
      items: [],
      save: jest.fn().mockResolvedValue({
        userId,
        items: [{ ticketId, quantity: 1 }]
      })
    };
    
    Cart.findOne.mockResolvedValue(null);
    Cart.mockImplementation(() => mockCart);

    const mutation = `
      mutation AddTicketToCart($ticketId: ID!, $userId: ID!) {
        addTicketToCart(ticketId: $ticketId, userId: $userId) {
          userId
          items {
            ticketId
            quantity
          }
        }
      }
    `;

    const variables = { ticketId, userId };
    const response = await graphql({ schema, source: mutation, variableValues: variables });

    expect(response.data.addTicketToCart).toEqual({
      userId,
      items: [{ ticketId, quantity: 1 }]
    });
    expect(Cart.findOne).toHaveBeenCalledWith({ userId });
    expect(mockCart.save).toHaveBeenCalled();
  });
});
