# From The Hart Projects — Domain Glossary

> Canonical terms specific to the Projects service. Extends [master CONTEXT.md](../CONTEXT.md).
> Code conventions: [AGENTS.md](./AGENTS.md).

---

## Domain

### Projects

The collection of project artifacts that Sheldon wants to showcase. Currently scoped to code projects sourced from Git hosts, but designed to accommodate non-code project types in the future (curated entries, design portfolio, writing, etc.). The **Projects Service** is the domain owner; the **Website** displays Projects.

- _Avoid:_ "GitHub projects" (too narrow — GitHub is a source, not the domain)
- _Relationships:_ Each **Project** is currently a **Repository**.
  The **Projects Service** serves them.
  Consumed by the **Website** via the **API Gateway**.

---

## Data Model

### Repository

A public Git-hosted repository fetched via the Git host API — the core domain object returned by this service. This service is the domain owner for **Repository**. Displayed on the **Website** as a **Repository** listing.

- _Avoid:_ "GitHub project", "project" (ambiguous with [**Work Project**](../from-the-hart-tech-website/CONTEXT.md#work-project))
- _Relationships:_ A **Repository** is currently the only kind of **Project**.
  Fetched by the **Projects Service** from the Git host API.
  Returned in array form and displayed on the **Website**.

---

## Flagged Ambiguities

- **"GitHubProject" / "GitHub projects" vs. Repository:** The codebase uses `GitHubProject`, `GitHubProjectSchema`, `getGitHubProjectsByUsername`, and "GitHub projects" in OpenAPI descriptions. The canonical domain term is **Repository**. → See [TODO.md](../TODO.md#14-projects-service--repository-terminology-rename).
- **Error envelope mismatch:** This service returns `{ error: "..." }` (flat string) while the canonical **Error Envelope** (defined in gateway CONTEXT.md) is `{ error: { message: "..." } }`. → See [TODO.md](../TODO.md#12-projects-service--error-envelope-mismatch).
