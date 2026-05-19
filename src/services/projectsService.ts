import { Repository } from "../models/Repository";

export const getRepositoriesByUsername = async (
  username: string
): Promise<Repository[]> => {
  try {
    const apiUrl = `https://api.github.com/users/${username}/repos`;

    const response = await fetch(apiUrl);

    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return data.map(
      (repo: any): Repository => ({
        id: repo.id,
        name: repo.name,
        description: repo.description || "",
        html_url: repo.html_url,
        language: repo.language || null,
        stargazers_count: repo.stargazers_count,
        updated_at: repo.updated_at,
      })
    );
  } catch (error) {
    console.error(
      `Error fetching GitHub repositories for user ${username}:`,
      error
    );
    throw error;
  }
};
