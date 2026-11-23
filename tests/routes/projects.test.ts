import { buildApp } from "../../src/app";
import { vi } from "vitest";

describe("Project endpoints", () => {
  const app = buildApp();
  const fetchMock = vi.fn();

  beforeAll(async () => {
    await app.ready();
  });

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterAll(async () => {
    vi.unstubAllGlobals();
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
    fetchMock.mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => [
        {
          id: 1,
          name: "repo-one",
          description: "First repo",
          html_url: "https://github.com/Saosin88/repo-one",
          language: "TypeScript",
          stargazers_count: 10,
          updated_at: "2026-01-01T00:00:00Z",
        },
        {
          id: 2,
          name: "repo-two",
          description: "",
          html_url: "https://github.com/Saosin88/repo-two",
          language: null,
          stargazers_count: 0,
          updated_at: "2026-02-01T00:00:00Z",
        },
      ],
    } as unknown as Response);

    const response = await app.inject({
      method: "GET",
      url: "/projects/github/Saosin88",
    });

    expect(response.statusCode).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.github.com/users/Saosin88/repos"
    );
    const responseBody = JSON.parse(response.payload);
    expect(responseBody).toHaveProperty("data");
    expect(Array.isArray(responseBody.data)).toBe(true);
    expect(responseBody.data.length).toBeGreaterThan(0);

    responseBody.data.forEach((repo: any) => {
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
    fetchMock.mockResolvedValue({
      status: 404,
      ok: false,
      json: async () => ({}),
    } as unknown as Response);

    const response = await app.inject({
      method: "GET",
      url: "/projects/github/this-user-does-not-exist-12345",
    });

    expect(response.statusCode).toBe(404);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.github.com/users/this-user-does-not-exist-12345/repos"
    );
    const responseBody = JSON.parse(response.payload);

    expect(responseBody).toHaveProperty("error");
    expect(responseBody.error.message).toBe("Repositories not found");

    expect(responseBody).not.toHaveProperty("data");
  });
});
