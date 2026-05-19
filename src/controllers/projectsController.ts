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

export const getRepositoriesByUsername = async (
  request: FastifyRequest<{ Params: UsernameParam }>,
  reply: FastifyReply
) => {
  const { username } = request.params;
  const repositories = await projectService.getRepositoriesByUsername(
    username
  );

  reply.header("Cache-Control", "public, max-age=86400");

  if (!repositories || repositories.length === 0) {
    return reply.code(404).send({ error: { message: "Repositories not found" } });
  }

  return reply.code(200).send({ data: repositories });
};
