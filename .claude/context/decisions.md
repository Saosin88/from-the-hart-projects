# Projects Service Decisions

Last updated: 2025-11-22

## Decisions Made

### [2025-11-22] Dual Entry Point Architecture
- **Decision**: Maintain both `server.ts` (traditional) and `lambda.ts` (serverless) entry points
- **Rationale**: Supports multiple deployment targets (Cloud Run, Lambda, standalone)
- **Trade-offs**: Code duplication, separate build paths
- **Status**: Currently implemented and working
- **Related Files**: src/server.ts, src/lambda.ts, Dockerfile, Dockerfile.lambda

### [2025-11-22] TypeBox for Schema Validation
- **Decision**: Use TypeBox with Fastify type provider for all schemas
- **Rationale**: Type safety, runtime validation, automatic OpenAPI schema generation
- **Benefits**: Single source of truth for types and validation
- **Status**: Implemented for all route schemas
- **Related Files**: src/models/Projects.ts, src/routes/projects.ts

### [2025-11-22] GitHub Public API Integration (No Auth)
- **Decision**: Call GitHub public repos API without authentication
- **Rationale**: Repos are public, simpler implementation, no token management needed
- **Trade-offs**: Subject to GitHub API rate limits (60 req/hour unauthenticated)
- **Status**: Currently implemented
- **Related Files**: src/services/projectsService.ts

### [2025-11-22] Health Check Endpoint
- **Decision**: Implement GET /projects/health with uptime and timestamp
- **Rationale**: Standard practice for service health monitoring in distributed systems
- **Impact**: Enables CloudWatch alarms and Kubernetes liveness probes
- **Status**: Implemented and tested
- **Related Files**: src/routes/projects.ts, src/controllers/projectsController.ts

### [2025-11-22] 24-Hour Cache Control Header
- **Decision**: Set Cache-Control: public, max-age=86400 on GitHub projects endpoint
- **Rationale**: GitHub repo data doesn't change frequently, reduces external API calls
- **Impact**: CDN-friendly, reduces load on GitHub API
- **Status**: Implemented
- **Related Files**: src/controllers/projectsController.ts line 30

### [2025-11-22] Alpine Node.js Docker Base
- **Decision**: Use node:22-alpine for regular Docker builds
- **Rationale**: Small image size, optimized for containerized deployments
- **Trade-offs**: Limited debugging tools compared to full image
- **Status**: Used in both Dockerfile and Dockerfile.lambda
- **Related Files**: Dockerfile, Dockerfile.lambda

### [2025-11-22] Lambda Cold Start Optimization
- **Decision**: Cache Fastify app instance in Lambda handler global scope
- **Rationale**: Subsequent invocations skip app initialization, faster response times
- **Implementation**: Check `if (!app)` on every invocation
- **Status**: Implemented with initialization logging
- **Related Files**: src/lambda.ts lines 10-25

### [2025-11-22] Pino Logger with Local Pretty-Printing
- **Decision**: Use Pino logger with conditional pretty-printing only in local mode
- **Rationale**: Structured JSON logging for prod, human-readable for dev
- **Implementation**: Check `config.env === "local"` to enable transport
- **Status**: Configured in logger factory
- **Related Files**: src/config/logger.ts

### [2025-11-22] Request ID Generation
- **Decision**: Generate unique request IDs from x-request-id header or random suffix
- **Rationale**: Trace requests through logs, support external request ID propagation
- **Trade-offs**: Random generation is non-cryptographic
- **Status**: Implemented in logger
- **Related Files**: src/config/logger.ts line 16

### [2025-11-22] Fastify Logger Serializers
- **Decision**: Define custom request/response/error serializers
- **Rationale**: Control what fields appear in logs, sanitize sensitive data
- **Implementation**: Serialize method, url, headers, body, statusCode, error details
- **Status**: Configured in logger factory
- **Related Files**: src/config/logger.ts lines 35-56

### [2025-11-22] Single Route File Pattern
- **Decision**: Keep all project routes in single routes/projects.ts file
- **Rationale**: Simple service with only 2 endpoints, avoids over-engineering
- **Scalability**: Would split into multiple files if service grows beyond 5 endpoints
- **Status**: Currently appropriate for project scope
- **Related Files**: src/routes/projects.ts

### [2025-11-22] Response Format Consistency
- **Decision**: All successful responses wrapped in `{ data: T }`
- **Rationale**: Consistent API format, easier client-side parsing
- **Error responses**: `{ error: string }` format
- **Status**: Implemented across all controllers
- **Related Files**: src/controllers/projectsController.ts

### [2025-11-22] Vitest for Unit Testing
- **Decision**: Use Vitest instead of Jest for testing framework
- **Rationale**: Faster test execution, native ES modules, better DX
- **CI Integration**: Configured for JUnit XML reporting
- **Status**: All tests passing
- **Related Files**: tests/routes/projects.test.ts, vitest.config.ts

### [2025-11-22] TypeScript Strict Mode
- **Decision**: Enable all strict mode compiler options
- **Rationale**: Catch type errors early, improve code quality
- **Coverage**: strictNullChecks, noImplicitAny, noImplicitReturns, etc.
- **Status**: Fully enabled in tsconfig.json
- **Related Files**: tsconfig.json

### [2025-11-22] Swagger Logo Branding
- **Decision**: Include From The Hart SVG logo in Swagger UI
- **Rationale**: Professional API documentation, brand consistency
- **Implementation**: Read SVG from file system at build time
- **Potential Issue**: Hard-coded path may fail if public assets not included in build
- **Status**: Implemented with logo link to fromthehart.tech
- **Related Files**: src/config/swagger.ts lines 23-43

## Pending Decisions

### Rate Limiting Strategy
- **Issue**: GitHub API has 60 requests/hour limit for unauthenticated access
- **Options**:
  1. Implement request-level rate limiting (in-memory or Redis-backed)
  2. Use GitHub token with higher limits (need token management)
  3. Implement client-side rate limiting headers
  4. Accept risk of hitting limits
- **Stakeholders**: Backend team, DevOps
- **Timeline**: Before production deployment
- **Related Files**: src/services/projectsService.ts

### Response Caching Strategy
- **Issue**: GitHub API data cached via HTTP headers, but no local cache layer
- **Options**:
  1. In-memory cache with TTL (simple, works for single instance)
  2. Redis cache (supports multiple instances, persistent)
  3. Database cache (overkill for this use case)
  4. Rely solely on HTTP caching headers
- **Trade-offs**: Complexity vs performance improvement
- **Timeline**: After rate limiting is addressed

### Error Handling Middleware
- **Issue**: Service errors propagate as 500 responses without structured error responses
- **Options**:
  1. Add global error handler hook (Fastify style)
  2. Try-catch wrapper in controller layer
  3. Service layer error codes with controller mapping
- **Related Files**: src/controllers/projectsController.ts

### GitHub API Authentication
- **Issue**: Unauthenticated requests subject to strict rate limits
- **Options**:
  1. Add optional GitHub token environment variable
  2. Support client-provided tokens in header
  3. Upgrade to GitHub App token (requires registration)
- **Impact**: Would affect 10x rate limit improvement
- **Timeline**: Medium priority

### Production Server URLs in Swagger
- **Issue**: Only localhost:8080 documented in OpenAPI spec
- **Options**:
  1. Environment-based server array in swagger config
  2. Dynamic URL generation from request headers
  3. Manual documentation update per deployment
- **Related Files**: src/config/swagger.ts

### Lambda Memory/Timeout Optimization
- **Issue**: Currently 256MB memory, 10s timeout - not validated for performance
- **Options**:
  1. Profile with actual GitHub API calls
  2. Measure cold start times
  3. Adjust based on metrics
- **Timeline**: After initial deployment to production

### Console Logging in Lambda
- **Issue**: Using console.log instead of app.log in handler
- **Options**:
  1. Replace with app.log for structured logging
  2. Keep console for Lambda-specific debug info
  3. Use Lambda context.log API
- **Impact**: CloudWatch log readability and metrics
- **Related Files**: src/lambda.ts lines 18-27

### TypeBox Schema Type Safety
- **Issue**: Service layer using `any` type in map function
- **Options**:
  1. Use `as GitHubProject` for explicit casting
  2. Stricter GitHub API response typing
  3. Runtime validation of response structure
- **Impact**: Type safety, debugging, maintainability
- **Related Files**: src/services/projectsService.ts line 22

### GitHub API Timeout Handling
- **Issue**: No explicit timeout or retry logic on external API calls
- **Options**:
  1. Add fetch timeout with AbortController
  2. Implement retry logic with exponential backoff
  3. Accept current behavior (may fail fast)
- **Impact**: Service resilience, user experience
- **Related Files**: src/services/projectsService.ts

### Graceful Shutdown
- **Issue**: Server doesn't implement graceful shutdown on process signals
- **Options**:
  1. Add SIGTERM handler with app.close()
  2. Wait for in-flight requests before shutdown
  3. CloudWatch alarms for sudden termination
- **Impact**: Data consistency, customer experience during deployments
- **Related Files**: src/server.ts

### API Versioning Strategy
- **Issue**: No versioning in current API design
- **Options**:
  1. URL path versioning (/projects/v1, /projects/v2)
  2. Header-based versioning (Accept: application/vnd.fth.v1+json)
  3. Single version (accept breaking changes)
- **Timeline**: Before 2.0 release
