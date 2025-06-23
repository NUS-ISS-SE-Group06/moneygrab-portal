const axiosMock = {
  get: jest.fn((url) => {
    if (url.includes("/schemes")) {
      return Promise.resolve({ data: [{ id: 1, nameTag: "Default", description: "Desc", isDefault: true }] });
    }
    if (url.includes("/commission-rates")) {
      return Promise.resolve({ data: [{ id: 1, currency: "USD", rate: 1.5 }] });
    }
    if (url.includes("/company-commission-schemes")) {
      return Promise.resolve({ data: [{ id: 1, companyName: "ABC", nameTag: "Default" }] });
    }
    if (url.includes("/money-changers")) {
      return Promise.resolve({ data: [{ id: 1, name: "ABC Exchange", status: "Active" }] });
    }
    return Promise.resolve({ data: [] }); // fallback
  }),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({})),
  create: function () {
    return this;
  }
};

export default axiosMock;
