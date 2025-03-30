import { buildApp } from "../../src/app";

describe("Project endpoints", () => {
  const app = buildApp();

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /projects returns projects list", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/projects",
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toHaveProperty("data");
  });
});
