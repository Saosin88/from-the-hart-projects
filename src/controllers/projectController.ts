import { FastifyReply, FastifyRequest } from "fastify";
import { Project } from "../models/Project";
import * as projectService from "../services/projectService";

type IdParam = {
  id: string;
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

export const getProjects = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const projects = projectService.getProjects();
  return reply.code(200).send({ data: projects });
};

export const getProjectById = async (
  request: FastifyRequest<{ Params: IdParam }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const project = projectService.getProjectById(id);

  if (!project) {
    return reply.code(404).send({ error: "Project not found" });
  }

  return reply.code(200).send({ data: project });
};

export const addProject = async (
  request: FastifyRequest<{ Body: Omit<Project, "id"> }>,
  reply: FastifyReply
) => {
  try {
    const newProject = projectService.addProject(request.body);
    return reply.code(201).send({ data: newProject });
  } catch (error) {
    request.log.error(error);
    return reply.code(400).send({ error: "Invalid project data" });
  }
};

export const updateProject = async (
  request: FastifyRequest<{
    Params: IdParam;
    Body: Partial<Omit<Project, "id">>;
  }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const updatedProject = projectService.updateProject(id, request.body);

  if (!updatedProject) {
    return reply.code(404).send({ error: "Project not found" });
  }

  return reply.code(200).send({ data: updatedProject });
};

export const deleteProject = async (
  request: FastifyRequest<{ Params: IdParam }>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const deleted = projectService.deleteProject(id);

  if (!deleted) {
    return reply.code(404).send({ error: "Project not found" });
  }

  return reply.code(204).send();
};
