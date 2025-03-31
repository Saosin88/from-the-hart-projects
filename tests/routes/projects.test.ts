import { buildApp } from "../../src/app";

describe("Project endpoints", () => {
  const app = buildApp();
  let createdProjectId: string;

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

  it("POST /projects creates a new project", async () => {
    const newProject = {
      name: "Test Project",
      description: "Project for testing",
      startDate: "2023-09-01",
      endDate: null,
      status: "in-progress",
      budget: 5000,
    };

    const response = await app.inject({
      method: "POST",
      url: "/projects",
      payload: newProject,
    });

    expect(response.statusCode).toBe(201);
    const responseBody = JSON.parse(response.payload);

    // Updated assertions to check nested data object
    expect(responseBody).toHaveProperty("data");
    expect(responseBody.data).toHaveProperty("id");
    expect(responseBody.data.name).toBe(newProject.name);
    expect(responseBody.data.description).toBe(newProject.description);

    // Save the ID from the nested data object
    createdProjectId = responseBody.data.id;
  });

  it("GET /projects/:id returns a specific project", async () => {
    // Skip this test if we couldn't create a project
    if (!createdProjectId) {
      return;
    }

    const response = await app.inject({
      method: "GET",
      url: `/projects/${createdProjectId}`,
    });

    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.payload);
    expect(responseBody).toHaveProperty("data");
    expect(responseBody.data).toHaveProperty("id", createdProjectId);
    expect(responseBody.data).toHaveProperty("name");
    expect(responseBody.data).toHaveProperty("description");
  });

  it("GET /projects/:id returns 404 for non-existent project", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/projects/non-existent-id",
    });

    expect(response.statusCode).toBe(404);
  });

  it("PUT /projects/:id updates a project", async () => {
    // Skip this test if we couldn't create a project
    if (!createdProjectId) {
      return;
    }

    const updatedProject = {
      name: "Updated Test Project",
      description: "Updated description",
    };

    const response = await app.inject({
      method: "PUT",
      url: `/projects/${createdProjectId}`,
      payload: updatedProject,
    });

    expect(response.statusCode).toBe(200);
    const responseBody = JSON.parse(response.payload);
    expect(responseBody).toHaveProperty("data");
    expect(responseBody.data).toHaveProperty("id", createdProjectId);
    expect(responseBody.data.name).toBe(updatedProject.name);
    expect(responseBody.data.description).toBe(updatedProject.description);
  });

  it("PUT /projects/:id returns 404 for non-existent project", async () => {
    const response = await app.inject({
      method: "PUT",
      url: "/projects/non-existent-id",
      payload: {
        name: "Updated Test Project",
        description: "Updated description",
      },
    });

    expect(response.statusCode).toBe(404);
  });

  it("DELETE /projects/:id deletes a project", async () => {
    // Skip this test if we couldn't create a project
    if (!createdProjectId) {
      return;
    }

    const response = await app.inject({
      method: "DELETE",
      url: `/projects/${createdProjectId}`,
    });

    expect(response.statusCode).toBe(204);

    // Verify the project is gone
    const getResponse = await app.inject({
      method: "GET",
      url: `/projects/${createdProjectId}`,
    });

    expect(getResponse.statusCode).toBe(404);
  });

  it("DELETE /projects/:id returns 404 for non-existent project", async () => {
    const response = await app.inject({
      method: "DELETE",
      url: "/projects/non-existent-id",
    });

    expect(response.statusCode).toBe(404);
  });
});
