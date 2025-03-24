import { Project } from "../models/Project";
import { randomUUID } from "crypto";

let projects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Redesigning company website with modern UI/UX",
    startDate: "2023-01-10",
    endDate: "2023-03-15",
    status: "completed",
    budget: 15000,
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Creating a mobile app for both iOS and Android",
    startDate: "2023-02-01",
    endDate: null,
    status: "in-progress",
    budget: 50000,
  },
  {
    id: "3",
    name: "SEO Optimization",
    description: "Improving search engine rankings",
    startDate: "2023-04-15",
    endDate: "2023-05-30",
    status: "completed",
    budget: 8000,
  },
];

export const getProjects = (): Project[] => {
  return projects;
};

export const getProjectById = (id: string): Project | undefined => {
  return projects.find((project) => project.id === id);
};

export const addProject = (project: Omit<Project, "id">): Project => {
  const newProject = {
    id: randomUUID(),
    ...project,
  };

  projects.push(newProject);
  return newProject;
};

export const updateProject = (
  id: string,
  updatedProject: Partial<Omit<Project, "id">>
): Project | null => {
  const index = projects.findIndex((project) => project.id === id);

  if (index === -1) {
    return null;
  }

  projects[index] = {
    ...projects[index],
    ...updatedProject,
  };

  return projects[index];
};

export const deleteProject = (id: string): boolean => {
  const initialLength = projects.length;
  projects = projects.filter((project) => project.id !== id);

  return projects.length !== initialLength;
};
