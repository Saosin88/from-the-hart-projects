# Projects Service Architecture

Last updated: 2025-11-22

## Current State

### Core Framework & Tech Stack
- **Framework**: Fastify 5.6.1 with TypeScript
- **Type Safety**: TypeBox (@fastify/type-provider-typebox) for schema validation
- **API Documentation**: Swagger/OpenAPI (fastify-swagger + fastify-swagger-ui)
- **Deployment**: Dual entry points - traditional server (Cloud Run compatible) and AWS Lambda
- **Testing**: Vitest with integrated app testing
- **Logging**: Pino with pretty-printing in local mode
- **Node Version**: 22 (Alpine base)

### Architecture Highlights
1. **Dual Deployment Pattern**
   - `src/server.ts` - Traditional HTTP server (8080 port)
   - `src/lambda.ts` - AWS Lambda handler with @fastify/aws-lambda wrapper
   - Cold start optimization: App initialization cached on lambda global scope

2. **Plugin Architecture**
   - TypeBox type provider registration
   - Swagger/OpenAPI integration with logo branding
   - Project routes mounted under `/projects` prefix

3. **API Design**
   - Clean controller → service → external API pattern
   - Type-safe route schemas using TypeBox
   - Consistent response wrapping: `{ data: T }` or `{ error: string }`
   - HTTP caching headers (Cache-Control: public, max-age=86400)

4. **Data Model**
   - GitHub project schema with TypeBox
   - Fields: id, name, description, html_url, stargazers_count, language, updated_at
   - Type-safe destructuring with Static<typeof GitHubProjectSchema>

5. **Error Handling**
   - Try-catch in service layer with error logging
   - 404 responses for missing data
   - Generic error throwing for API failures

6. **Configuration**
   - Environment-based setup (local/dev/prod)
   - Log level control (debug, info, warn, error)
   - Server host/port customization
   - Proper defaults: port 8080, host 0.0.0.0

### Service Responsibilities
- **Health checks**: Uptime, timestamp, status monitoring
- **GitHub API proxy**: Fetch public repositories for any GitHub username
- **Response transformation**: Map raw GitHub API responses to schema

## Directory Structure

```
src/
├── app.ts                    # Fastify app builder with plugins
├── server.ts               # Traditional server entry point
├── lambda.ts               # Lambda handler wrapper
├── config/
│   ├── index.ts           # Config exports and environment setup
│   ├── logger.ts          # Pino logger factory with Fastify integration
│   └── swagger.ts         # OpenAPI documentation configuration
├── controllers/
│   └── projectsController.ts  # Request handlers
├── models/
│   └── Projects.ts        # TypeBox schemas (GitHubProject, UsernameParam)
├── routes/
│   └── projects.ts        # Route definitions with schema
├── services/
│   └── projectsService.ts # Business logic (GitHub API calls)
└── public/
    └── images/            # Static assets (logo)
```

## API Endpoints

### GET /projects/health
- **Purpose**: Service health check
- **Response**: `{ data: { status: "ok", uptime: number, timestamp: number } }`
- **Status**: 200

### GET /projects/github/:username
- **Purpose**: Fetch GitHub repositories for user
- **Params**: `username` (string, minLength: 1)
- **Response**: `{ data: GitHubProject[] }`
- **Caching**: 24-hour cache control header
- **Error**: 404 if user not found or has no repos

### GET /projects/documentation
- **Purpose**: Swagger/OpenAPI UI
- **Features**: Deep linking, list expansion, branded logo

## Architectural Issues

### High Priority
1. **[2025-11-22] Untyped service response mapping**
   - File: `src/services/projectsService.ts` line 22
   - Issue: Using `any` type in map function despite having GitHubProject schema
   - Impact: Type safety gap, potential runtime errors
   - Recommendation: Use `as GitHubProject` or stricter typing

2. **[2025-11-22] Lambda proxy type not declared**
   - File: `src/lambda.ts` line 11
   - Issue: `proxy` variable typed as `any`
   - Impact: Loss of type information from aws-lambda-fastify wrapper
   - Recommendation: Define proper return type from awsLambdaFastify()

3. **[2025-11-22] console.log in Lambda handler**
   - File: `src/lambda.ts` lines 18, 24, 27
   - Issue: Using console instead of structured logging via Fastify logger
   - Impact: Inconsistent logging format, harder to parse in CloudWatch
   - Recommendation: Use `app.log` for structured logging

### Medium Priority
4. **[2025-11-22] No error handling wrapping**
   - File: `src/controllers/projectsController.ts`
   - Issue: Service errors not caught, propagate up as 500s
   - Impact: Better error detail needed, no rate limit handling
   - Recommendation: Add error boundary middleware

5. **[2025-11-22] No rate limiting or request validation**
   - Issue: External GitHub API calls unbounded
   - Impact: Potential DDoS vector, no protection against rapid requests
   - Recommendation: Add rate limiting middleware, request caching

6. **[2025-11-22] Logger request ID generation**
   - File: `src/config/logger.ts` line 16
   - Issue: Using `req: any` instead of typed request
   - Impact: Type safety issue, unclear API
   - Recommendation: Proper Fastify request typing

### Low Priority
7. **[2025-11-22] Hardcoded Swagger server URL**
   - File: `src/config/swagger.ts` line 17
   - Issue: Only http://localhost:8080 defined
   - Impact: Production/staging URLs not in documentation
   - Recommendation: Use environment-based server URLs

8. **[2025-11-22] No graceful shutdown**
   - Issue: Lambda handler doesn't implement cleanup
   - Impact: Connection pooling issues in long-lived processes
   - Recommendation: Add app.close() in error handlers

## Performance Notes

### Observed
- Test response time: 245ms for 404 (GitHub API call timeout)
- Test response time: 376ms for successful GitHub API call
- Cold start handling: Cached app initialization in Lambda handler
- Build time: Unknown (needs measurement)
- Bundle size: Unknown (needs measurement)

### Potential Optimizations
- GitHub API response caching strategy
- Connection pooling for external API calls
- Lambda memory/timeout optimization (currently 256MB, 10s timeout)
- Docker layer caching in multi-stage builds

## Testing Coverage

### Current Tests
- ✅ Health endpoint: Status, uptime, timestamp validation
- ✅ GitHub endpoint success: Data structure and field type validation
- ✅ GitHub endpoint 404: Error response structure
- ✅ Test files located: `tests/routes/projects.test.ts`
- ✅ Test runner: Vitest with 3 tests passing

### Coverage Gaps
- No tests for error handling (500, 503)
- No tests for GitHub API timeout scenarios
- No tests for Lambda handler specifically
- No integration tests with actual GitHub API
- No tests for response caching headers
- No performance tests

### Testing Strategy
- Unit tests use Fastify app injection
- No mocking of GitHub API (integration tests)
- Uses Vitest with node environment
- CI support: JUnit XML reporting configured

## Deployment & Infrastructure

### AWS Lambda Configuration
- Function name: `from-the-hart-projects-dev` (dev environment)
- Package type: Container image (ECR)
- Memory: 256 MB
- Timeout: 10 seconds
- Auth: AWS IAM
- Logging: CloudWatch logs with 1-day retention
- Role: Shared Lambda execution role from infrastructure

### Docker Strategy
- **Regular deployment** (Dockerfile): Node.js Alpine base, exposes 8080
- **Lambda deployment** (Dockerfile.lambda): AWS Lambda Node.js 22 runtime
- Multi-stage build: Compile TypeScript in builder, copy artifacts
- Build args: NODE_ENV, LOG_LEVEL

### Environment Variables
- `NODE_ENV`: local (default), dev, prod
- `LOG_LEVEL`: debug (default), info, warn, error
- `PORT`: 8080 (default)
- `HOST`: 0.0.0.0 (default)

## Dependencies Analysis

### Production
- fastify (5.6.1): Core HTTP server
- @fastify/aws-lambda (6.1.1): Lambda integration
- @fastify/swagger (9.5.2): OpenAPI schema generation
- @fastify/swagger-ui (5.2.3): Swagger UI
- @fastify/type-provider-typebox (6.1.0): TypeBox integration
- @sinclair/typebox (0.34.41): Schema validation and TypeScript support

### Dev
- TypeScript 5.9.3: Type safety
- Vitest 4.0.2: Testing framework
- ts-node-dev 2.0.0: Hot-reload during development
- pino-pretty 13.1.2: Pretty logging in local mode
- esbuild 0.25.11: TypeScript compilation alternative

## Security Considerations

1. **External API Integration**
   - GitHub API is public, no auth needed
   - No sensitive data in requests/responses
   - Consider rate limiting GitHub's public API

2. **Lambda Execution**
   - Restricted to AWS IAM authentication
   - No public invocation without API Gateway

3. **Input Validation**
   - Username parameter validated with minLength: 1
   - TypeBox ensures type safety

4. **No Known Vulnerabilities**
   - Dependencies up-to-date (as of 2025-11-22)
   - No hardcoded secrets in code
   - Environment variables properly sourced

## Operational Readiness

- ✅ Health check endpoint for monitoring
- ✅ Structured logging with request IDs
- ✅ API documentation via Swagger
- ✅ Test coverage for happy path
- ⚠️ No performance baselines established
- ⚠️ No error budget defined
- ⚠️ No rate limiting protection
- ⚠️ Logging uses console in Lambda (non-standard format)
