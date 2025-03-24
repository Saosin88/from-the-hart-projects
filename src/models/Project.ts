import { Type, Static } from "@fastify/type-provider-typebox";

export const ProjectSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  description: Type.String(),
  startDate: Type.String({ format: "date" }),
  endDate: Type.Union([Type.String({ format: "date" }), Type.Null()]),
  status: Type.Enum({
    planned: "planned",
    "in-progress": "in-progress",
    completed: "completed",
    "on-hold": "on-hold",
    cancelled: "cancelled",
  }),
  budget: Type.Number(),
});

export type Project = Static<typeof ProjectSchema>;

export const ProjectInputSchema = Type.Omit(ProjectSchema, ["id"]);
export const ProjectUpdateSchema = Type.Partial(ProjectInputSchema);
export const IdParamSchema = Type.Object({ id: Type.String() });
