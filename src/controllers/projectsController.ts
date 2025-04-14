import { FastifyReply, FastifyRequest } from "fastify";
import * as projectService from "../services/projectsService";

type UsernameParam = {
  username: string;
};

export const checkHealth = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  return reply.code(200).send({
    data: {
      status: "ok",
      uptime: process.uptime(),
      timestamp: Date.now(),
    },
  });
};

export const getGitHubProjectsByUsername = async (
  request: FastifyRequest<{ Params: UsernameParam }>,
  reply: FastifyReply
) => {
  const { username } = request.params;
  const gitHubProjects = await projectService.getGitHubProjectsByUsername(
    username
  );

  reply.header("Cache-Control", "public, max-age=600, s-maxage=600");
  reply.header("CDN-Cache-Control", "max-age=600");

  if (!gitHubProjects || gitHubProjects.length === 0) {
    return reply.code(404).send({ error: "GitHub Projects not found" });
  }

  return reply.code(200).send({ data: gitHubProjects });
};
