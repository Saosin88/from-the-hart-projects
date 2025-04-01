import { buildApp } from "../../src/app";

describe("Project endpoints", () => {
  const app = buildApp();

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /projects/health returns health status information", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/projects/health",
    });

    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.payload);
    expect(responseBody).toHaveProperty("data");

    expect(responseBody.data).toHaveProperty("status");
    expect(responseBody.data).toHaveProperty("uptime");
    expect(responseBody.data).toHaveProperty("timestamp");

    expect(typeof responseBody.data.status).toBe("string");
    expect(responseBody.data.status).toBe("ok");
    expect(typeof responseBody.data.uptime).toBe("number");
    expect(typeof responseBody.data.timestamp).toBe("number");
  });

  it("GET /projects/github/Saosin88 returns structured GitHub projects list", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/projects/github/Saosin88",
    });

    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.payload);
    expect(responseBody).toHaveProperty("data");
    expect(Array.isArray(responseBody.data)).toBe(true);
    expect(responseBody.data.length).toBeGreaterThan(0);

    responseBody.data.forEach((repo) => {
      expect(repo).toHaveProperty("id");
      expect(typeof repo.id).toBe("number");
      expect(repo).toHaveProperty("name");
      expect(typeof repo.name).toBe("string");
      expect(repo).toHaveProperty("html_url");
      expect(typeof repo.html_url).toBe("string");
      expect(repo).toHaveProperty("stargazers_count");
      expect(typeof repo.stargazers_count).toBe("number");

      expect(repo).toHaveProperty("description");
      expect(repo).toHaveProperty("language");
      expect(repo).toHaveProperty("updated_at");
    });
  });

  it("GET /projects/github/non-existent-user returns 404 error", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/projects/github/this-user-does-not-exist-12345",
    });

    expect(response.statusCode).toBe(404);
    const responseBody = JSON.parse(response.payload);

    expect(responseBody).toHaveProperty("error");
    expect(responseBody.error).toBe("GitHub Projects not found");

    expect(responseBody).not.toHaveProperty("data");
  });
});
