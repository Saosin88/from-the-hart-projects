import { Type, Static } from "@fastify/type-provider-typebox";

export const GitHubProjectSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  description: Type.String(),
  html_url: Type.String(),
  stargazers_count: Type.Number(),
  language: Type.String(),
  updated_at: Type.String(),
});

export type GitHubProject = Static<typeof GitHubProjectSchema>;
export const UsernameParamSchema = Type.Object({ username: Type.String() });
