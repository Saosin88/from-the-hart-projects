# From The Hart Projects

> **Hierarchy:** Service-specific rules for projects. Extends [master AGENTS.md](../AGENTS.md).
> Rules here take precedence over both master and personal AGENTS.md.
> **Stack:** TypeScript + Fastify + AWS Lambda (Docker). When reading the master AGENTS.md, Rust/Vue/Terraform sections apply to other services.
>
> GitHub project data domain service. Fastify on AWS Lambda (Docker).
> Domain glossary: [CONTEXT.md](./CONTEXT.md).

## Responsibilities

- Fetch public GitHub repos for a username
- Return mapped/filtered project data
- 24-hour cache via `Cache-Control` header (CloudFront caches the response)

## Tech Stack

- **Framework:** Fastify v5 with `@fastify/type-provider-typebox`
- **Deploy:** AWS Lambda (Function URL) via Docker + ECR
- **Testing:** Vitest + supertest
- **API Docs:** `@fastify/swagger` + `@fastify/swagger-ui`

## Common Commands

```bash
npm install              # Install deps
npm run dev              # Dev server with hot reload
npm run build            # Compile TypeScript
npm start                # Run compiled output
npm test                 # Run all tests
npm run test:coverage    # Test with coverage
```

## Docker

Two Dockerfiles for dual-entry-point pattern:

| Dockerfile | Target | Entry |
|------------|--------|-------|
| `Dockerfile` | Local/ECS | `node server.js` |
| `Dockerfile.lambda` | AWS Lambda | `lambda.handler` |

Same code, same image layer, different CMD.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/projects/health` | Health check |
| GET | `/projects/github/:username` | List public GitHub repos |
| GET | `/projects/documentation` | Swagger UI |

## Directory Structure

```
src/
├── config/
│   ├── index.ts          # Env var loading → typed config
│   ├── logger.ts         # Pino logger config
│   └── swagger.ts        # Swagger registration
├── controllers/
│   └── projectsController.ts # Request handlers
├── models/
│   └── Projects.ts       # TypeBox schemas + types
├── routes/
│   └── projects.ts       # Route definitions with OpenAPI schemas
├── services/
│   └── projectsService.ts # GitHub API call + field mapping
├── app.ts                # buildApp() factory
├── server.ts             # Local entry point
└── lambda.ts             # Lambda entry (awsLambdaFastify adapter)
```

## Key Patterns

- Same Fastify patterns as auth service: `buildApp()`, TypeBox schemas, thin controllers
- Caching via response header: `Cache-Control: public, max-age=86400`
- Lambda adapter: `@fastify/aws-lambda` transforms API Gateway events → Fastify requests
- Cold start mitigation: module-level `let app` cache; initialized once on first invocation

## Boundaries

- ✅ **Always:** Run `npm test` before changes. Use TypeBox schemas for route validation. Return `{ data }` envelope for success responses.
- ⚠️ **Ask first:** Adding dependencies, changing cache TTL, modifying the response shape.
- 🚫 **Never:** Return non-standard error shapes (use `{ error: { message } }`). Store GitHub tokens in code.
