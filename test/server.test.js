const supertest = require("supertest");
process.env.DB_URI = process.env.MONGO_URL;
process.env.PORT = 0;
const { mongoose, listener } = require("../server");

let request;

beforeAll(() => {
  request = supertest(listener);
});

afterAll(() => {
  return Promise.all([mongoose.disconnect(), listener.close()]);
});

describe("GET", () => {
  test("/", async () => {
    const response = await request.get("/");

    expect(response.status).toBe(200);
  });
});
