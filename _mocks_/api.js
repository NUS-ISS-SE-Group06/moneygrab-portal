// __mocks__/api.js
const mockApi = {
  get: jest.fn((url) => {
    if (url.includes('money-changers')) {
      return Promise.resolve({
        data: [
          { id: 1, name: 'Mock Money Changer A' },
          { id: 2, name: 'Mock Money Changer B' }
        ]
      });
    } else if (url.includes('commission-schemes')) {
      return Promise.resolve({
        data: [
          { id: 'scheme1', name: 'FX Scheme 1' },
          { id: 'scheme2', name: 'FX Scheme 2' }
        ]
      });
    }

    return Promise.resolve({ data: [] });
  }),
  post: jest.fn(() => Promise.resolve({ data: {} })),
};

export default mockApi;
