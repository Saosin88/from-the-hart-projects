import { Type, Static } from "@sinclair/typebox";

export const RepositorySchema = Type.Object({
  id: Type.Number({
    description: "Unique repository ID from GitHub",
  }),
  name: Type.String({
    description: "Repository name",
  }),
  description: Type.String({
    description: "Short repository description",
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

export type Repository = Static<typeof RepositorySchema>;
