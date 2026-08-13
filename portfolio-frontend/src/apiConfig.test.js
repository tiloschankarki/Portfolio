describe("API_BASE_URL", () => {
  const originalValue = process.env.REACT_APP_API_BASE_URL;

  afterEach(() => {
    jest.resetModules();
    if (originalValue === undefined) {
      delete process.env.REACT_APP_API_BASE_URL;
    } else {
      process.env.REACT_APP_API_BASE_URL = originalValue;
    }
  });

  test("defaults to the live Render backend", () => {
    delete process.env.REACT_APP_API_BASE_URL;

    const { API_BASE_URL } = require("./apiConfig");

    expect(API_BASE_URL).toBe("https://tfolio-backend.onrender.com/api");
  });

  test("allows Vercel to override the backend URL", () => {
    process.env.REACT_APP_API_BASE_URL = "https://example.test/api/";

    const { API_BASE_URL } = require("./apiConfig");

    expect(API_BASE_URL).toBe("https://example.test/api");
  });
});
