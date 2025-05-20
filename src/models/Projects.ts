import { Type, Static } from "@fastify/type-provider-typebox";

export const GitHubProjectSchema = Type.Object({
  id: Type.Number({
    description: "Unique project ID from GitHub",
  }),
  name: Type.String({
    description: "Repository name",
  }),
  description: Type.String({
    description: "Short project description",
  }),
  html_url: Type.String({
    description: "URL to the GitHub repository",
    format: "uri",
  }),
  stargazers_count: Type.Number({
    description: "Number of GitHub stars",
  }),
  language: Type.String({
    description: "Primary programming language",
  }),
  updated_at: Type.String({
    description: "Last update timestamp (ISO 8601)",
    format: "date-time",
  }),
});

export type GitHubProject = Static<typeof GitHubProjectSchema>;

export const UsernameParamSchema = Type.Object({
  username: Type.String({
    description: "GitHub username to fetch projects for",
    minLength: 1,
  }),
});
