# CLAUDE.md - From The Hart Projects Service

This file provides guidance to Claude Code when working with the Projects Service in this repository.

## Service Overview

The **From The Hart Projects Service** is a Fastify-based API that manages and serves project data for the From The Hart ecosystem. It provides endpoints for retrieving, creating, and managing project information with full type-safety through TypeBox schemas. The service is deployed on AWS Lambda but also supports traditional server deployments.

### Key Responsibilities
- Project data management and retrieval
- RESTful API endpoints for project operations
- Type-safe request/response validation
- OpenAPI/Swagger documentation
- Support for both Lambda and traditional server deployments
- Pagination and filtering support
- Project metadata and categorization

### Architecture
- **Framework**: Fastify with TypeScript
- **Deployment**: AWS Lambda (primary), traditional server (alternative)
- **Database**: DynamoDB or PostgreSQL (depends on configuration)
- **Type Safety**: TypeBox for runtime validation and OpenAPI schemas
- **API Documentation**: Auto-generated Swagger UI
- **State**: Stateless API (reads from database/cache)

## Technology Stack

### Core Technologies
- **Framework**: Fastify v5 with TypeScript
- **Type Safety**: TypeBox (@fastify/type-provider-typebox) for runtime validation
- **API Documentation**: @fastify/swagger and @fastify/swagger-ui
- **Serverless**: @fastify/aws-lambda for Lambda support
- **Logging**: Fastify's built-in Pino logger
- **ORM/Query**: Depends on database choice (can add Prisma, TypeORM, etc.)

### Development Tools
- **Build**: TypeScript compiler (tsc)
- **Development**: ts-node-dev for hot-reload
- **Testing**: Vitest with supertest for API testing
- **Coverage**: @vitest/coverage-v8
- **Code Building**: esbuild for fast builds

### AWS Services
- **Compute**: Lambda with container image support
- **Container Registry**: ECR (Elastic Container Registry)
- **Database**: DynamoDB for project metadata
- **Caching**: ElastiCache (optional)
- **Logging**: CloudWatch Logs

## Project Structure

```
from-the-hart-projects/
├── src/
│   ├── app.ts                      # Fastify app setup and plugin registration
│   ├── server.ts                   # Entry point for traditional server
│   ├── lambda.ts                   # Entry point for AWS Lambda
│   ├── config/
│   │   ├── index.ts                # Configuration exports and types
│   │   ├── logger.ts               # Pino logger setup with structured output
│   │   └── swagger.ts              # Swagger/OpenAPI configuration
│   ├── controllers/
│   │   └── projectController.ts    # HTTP request handlers
│   ├── models/
│   │   └── Project.ts              # TypeBox schemas for project data
│   ├── routes/
│   │   └── project.ts              # API route definitions
│   ├── services/
│   │   ├── projectService.ts       # Project business logic
│   │   └── database.ts             # Database connection and queries
│   ├── repository/
│   │   ├── projectRepository.ts    # Data access layer
│   │   └── cache.ts                # Caching logic
│   ├── public/                     # Static files (projects JSON, images)
│   │   ├── projects.json           # Project database
│   │   └── images/
│   └── utils/
│       ├── errors.ts               # Custom error definitions
│       ├── validators.ts           # Validation utilities
│       └── helpers.ts              # Helper functions
├── tests/
│   └── routes/
│       └── project.spec.ts         # API route tests
├── .env                            # Local environment variables
├── .env.example                    # Environment template
├── Dockerfile                      # Container build configuration
├── Dockerfile.lambda               # Lambda-specific container build
├── docker-compose.yml              # Local Docker development
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── vitest.config.ts                # Vitest configuration
├── terraform/
│   ├── dev/                        # Development environment resources
│   └── prod/                       # Production environment resources
└── README.md                       # Service documentation
```

## Common Commands

### Installation & Setup
```bash
# Install dependencies
npm install

# Prepare environment
cp .env.example .env
# Edit .env with your configuration
```

### Development
```bash
# Start development server with hot-reload
npm run dev

# The server will start at http://localhost:8080

# API documentation available at:
# http://localhost:8080/projects/documentation
```

### Building
```bash
# Compile TypeScript to dist/
npm run build

# This creates JavaScript files in dist/
# Ready for Node.js or Lambda execution
```

### Running Production Build
```bash
# Build
npm run build

# Start production server
npm start

# Or run directly with Node.js
node dist/server.js
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run specific test file
npm test -- project.spec.ts

# Run tests with UI
npm test -- --ui
```

### Docker Operations
```bash
# Build Docker image
docker build \
  --build-arg NODE_ENV=local \
  --build-arg LOG_LEVEL=debug \
  -t from-the-hart-projects .

# Build Lambda-specific image
docker build \
  -f Dockerfile.lambda \
  --build-arg NODE_ENV=local \
  -t from-the-hart-projects:lambda .

# Run container
docker run \
  --name from-the-hart-projects \
  -d \
  -p 8080:8080 \
  from-the-hart-projects

# View logs
docker logs -f from-the-hart-projects

# Stop and remove container
docker stop from-the-hart-projects
docker rm from-the-hart-projects
```

### Local Docker Compose Development
```bash
# Start all services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f projects

# Rebuild after code changes
docker-compose up -d --build

# Stop services
docker-compose down
```

## Environment Variables

### Environment Detection
- `NODE_ENV` - Environment mode (development, production)
- `APP_ENVIRONMENT` - Alternative environment name (local, dev, prod)

### Server Configuration
- `PORT` - Server port (default: 8080)
- `HOST` - Host to bind to (default: 0.0.0.0)

### Logging
- `LOG_LEVEL` - Logging level (debug, info, warn, error)

### Database Configuration
- `DB_TYPE` - Database type (dynamodb, postgresql, sqlite)
- `DB_HOST` - Database host (for SQL databases)
- `DB_PORT` - Database port
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DYNAMODB_TABLE` - DynamoDB table name (for DynamoDB)

### AWS Configuration
- `AWS_REGION` - AWS region (default: us-east-1)
- `AWS_ACCESS_KEY_ID` - AWS access key (local only)
- `AWS_SECRET_ACCESS_KEY` - AWS secret key (local only)

### API Configuration
- `CORS_ORIGIN` - CORS allowed origin(s)
- `API_PREFIX` - API endpoint prefix (default: /projects)
- `API_VERSION` - API version (default: v1)

### Caching
- `CACHE_ENABLED` - Enable/disable caching (true/false)
- `CACHE_TTL` - Cache time-to-live in seconds (default: 3600)
- `REDIS_URL` - Redis connection URL (if using Redis)

## Local Development Setup

### Prerequisites
- Node.js v16+ (check with `node --version`)
- npm v8+ (included with Node.js)
- Docker (for database containers)
- AWS CLI (optional, for AWS integration)

### Initial Setup

#### Option 1: Using Local JSON Database
```bash
# Clone repository
git clone https://github.com/Saosin88/from-the-hart-projects.git
cd from-the-hart-projects

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure for JSON database:
# DB_TYPE=json
# or leave DB configuration empty for file-based storage

# Start development server
npm run dev

# Server is now at http://localhost:8080
# API docs at http://localhost:8080/projects/documentation
```

#### Option 2: Using Docker PostgreSQL
```bash
# Clone repository
git clone https://github.com/Saosin88/from-the-hart-projects.git
cd from-the-hart-projects

# Install dependencies
npm install

# Start PostgreSQL with Docker
docker run -d \
  --name projects-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=from_the_hart_projects \
  -p 5432:5432 \
  postgres:15

# Create environment file
cp .env.example .env

# Configure in .env:
# DB_TYPE=postgresql
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=from_the_hart_projects
# DB_USER=postgres
# DB_PASSWORD=postgres

# Run migrations (if applicable)
npm run migrate

# Start development server
npm run dev
```

#### Option 3: Using AWS DynamoDB Local
```bash
# Clone repository
git clone https://github.com/Saosin88/from-the-hart-projects.git
cd from-the-hart-projects

# Install dependencies
npm install

# Start DynamoDB Local
docker run -d \
  --name dynamodb-local \
  -p 8000:8000 \
  amazon/dynamodb-local

# Create environment file
cp .env.example .env

# Configure in .env:
# DB_TYPE=dynamodb
# AWS_REGION=us-east-1
# AWS_ENDPOINT_URL=http://localhost:8000
# DYNAMODB_TABLE=projects-dev

# Create DynamoDB table
aws dynamodb create-table \
  --table-name projects-dev \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:8000

# Start development server
npm run dev
```

### Testing API Endpoints
```bash
# 1. Open Swagger UI at http://localhost:8080/projects/documentation

# 2. Test list projects endpoint
GET /api/v1/projects
Query params:
  - page=1
  - limit=10
  - category=web (optional)

# 3. Test get single project
GET /api/v1/projects/:id

# 4. Test create project (if authentication required)
POST /api/v1/projects
Headers: Authorization: Bearer <token>
Body: {
  "title": "Project Name",
  "description": "Project description",
  "tags": ["tag1", "tag2"],
  "url": "https://example.com"
}

# 5. Test update project
PUT /api/v1/projects/:id
Headers: Authorization: Bearer <token>
Body: { /* updated fields */ }

# 6. Test delete project
DELETE /api/v1/projects/:id
Headers: Authorization: Bearer <token>
```

## Testing Approach

### Unit & Integration Tests
Tests use Vitest and supertest to verify API endpoints and business logic:

```bash
# Run all tests
npm test

# Run in watch mode for development
npm run test:watch

# Run specific test file
npm test -- project.spec.ts

# Generate coverage report
npm run test:coverage
```

### Test Structure
Tests are organized by feature:
- `tests/routes/project.spec.ts` - API endpoint tests
- `tests/services/projectService.spec.ts` - Business logic tests
- `tests/repository/projectRepository.spec.ts` - Data access tests

### Example Test Pattern
```typescript
import { describe, it, expect } from 'vitest';
import { app } from '../src/app';

describe('Project Routes', () => {
  it('should list all projects', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/projects?page=1&limit=10'
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('data');
    expect(response.json()).toHaveProperty('pagination');
  });

  it('should get single project by ID', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/projects/project-1'
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('id', 'project-1');
  });

  it('should filter projects by category', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/projects?category=web'
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ category: 'web' })
      ])
    );
  });
});
```

## Deployment Information

### Deployment Targets

**Primary: AWS Lambda**
- Container image deployment
- Entry point: `src/lambda.ts`
- Uses `@fastify/aws-lambda` wrapper
- Auto-scaling based on traffic
- Managed by Terraform

**Alternative: Traditional Server**
- Container or Node.js deployment
- Entry point: `src/server.ts`
- Can run on Cloud Run, Kubernetes, EC2, etc.

### Lambda Deployment

**Requirements**
- Docker image in AWS ECR
- Lambda function with container image support
- IAM execution role with DynamoDB/S3 permissions
- API Gateway or reverse proxy for HTTP routing
- Environment variables configured in Lambda

**Deployment Process**
```bash
# 1. Build Docker image for Lambda
docker build -f Dockerfile.lambda -t from-the-hart-projects:latest .

# 2. Tag for ECR
docker tag from-the-hart-projects:latest \
  123456789.dkr.ecr.us-east-1.amazonaws.com/from-the-hart-projects:latest

# 3. Push to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  123456789.dkr.ecr.us-east-1.amazonaws.com

docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/from-the-hart-projects:latest

# 4. Deploy via Terraform (recommended)
cd terraform/prod
terraform apply
```

### Docker Image Optimization

The Dockerfiles use multi-stage builds:
1. **Build stage**: Compiles TypeScript, installs dependencies
2. **Runtime stage**: Minimal Node.js image with production dependencies
3. **Lambda optimization**: Removed unnecessary files, optimized for Lambda size limits

### Production Deployment Checklist
- [ ] Run tests: `npm test`
- [ ] Build successfully: `npm run build`
- [ ] Docker builds without errors
- [ ] Environment variables verified
- [ ] Database connectivity confirmed
- [ ] CORS settings appropriate
- [ ] Logging level set to info or warn
- [ ] Database migrations run successfully
- [ ] Caching strategy validated
- [ ] Error handling covers edge cases
- [ ] API documentation reviewed

### Scaling Considerations
- **Vertical**: Increase Lambda memory to scale CPU
- **Horizontal**: Lambda auto-scales replicas based on requests
- **Caching**: Implement Redis caching for frequently accessed projects
- **CDN**: Use CloudFront for API response caching
- **Database**: Use DynamoDB on-demand or adjust provisioned capacity
- **Pagination**: Enforce limits to prevent large responses

### Performance Optimization
- Implement pagination for list endpoints
- Add caching headers to responses
- Use database indexes on frequently queried fields
- Consider materialized views for complex queries
- Monitor CloudWatch metrics for bottlenecks

## Claude Code Integration Notes

### .claude Directory
Commands and context files are located in `.claude/commands/`:
- Custom slash commands for common Fastify operations
- Integration with Claude Code agents

### Useful Patterns for Agent Work

**Understanding Fastify Routes**
- Routes defined in `src/routes/project.ts`
- Handlers in `src/controllers/projectController.ts`
- Schemas in `src/models/Project.ts` (TypeBox)

**TypeBox Schema Pattern**
```typescript
// Schemas define both runtime validation and OpenAPI documentation
export const ProjectSchema = Type.Object({
  id: Type.String({ format: 'uuid' }),
  title: Type.String({ minLength: 1 }),
  description: Type.String(),
  tags: Type.Array(Type.String()),
  category: Type.Enum({ web: 'web', mobile: 'mobile', backend: 'backend' }),
  createdAt: Type.String({ format: 'date-time' })
});

// Auto-generates OpenAPI documentation from schema
```

**Database Integration**
- All database operations in `src/repository/projectRepository.ts`
- Service layer in `src/services/projectService.ts`
- Configuration in environment variables

### Common Claude Code Tasks

**Adding New Project Endpoint**
1. Define TypeBox schema in `src/models/Project.ts`
2. Create handler in `src/controllers/projectController.ts`
3. Register route in `src/routes/project.ts`
4. Add tests in `tests/routes/project.spec.ts`
5. Document in Swagger via schema comments

**Modifying Database Schema**
1. Update TypeBox schemas in `src/models/Project.ts`
2. Update database migration/script
3. Update repository queries in `src/repository/projectRepository.ts`
4. Add tests for new fields

**Adding Filtering/Pagination**
- Implement in `src/services/projectService.ts`
- Define query parameters in route schemas
- Test with various parameter combinations

**Error Handling**
- Custom errors in `src/utils/errors.ts`
- Use TypeBox Type.Object for error responses
- Consistent error format across API

### Debugging Tips
- Enable debug logging: `LOG_LEVEL=debug npm run dev`
- Use Fastify hooks to log requests: `onRequest`, `onResponse`
- Check database connectivity: test query directly in service
- Verify query parameters are properly validated
- Use Swagger UI to test endpoints with various inputs
- Check Docker logs if deployment fails

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/app.ts` | Fastify app initialization and plugins |
| `src/server.ts` | Traditional server entry point |
| `src/lambda.ts` | AWS Lambda entry point |
| `src/routes/project.ts` | API route definitions |
| `src/controllers/projectController.ts` | Request handlers |
| `src/services/projectService.ts` | Project business logic |
| `src/repository/projectRepository.ts` | Data access layer |
| `src/models/Project.ts` | TypeBox schemas for project data |
| `src/config/logger.ts` | Pino logger configuration |
| `src/config/swagger.ts` | OpenAPI/Swagger setup |
| `tests/routes/project.spec.ts` | API tests |
| `Dockerfile.lambda` | Lambda container build |

## Related Services

This service integrates with:
- **Infrastructure** (`from-the-hart-infrastructure`): Terraform configs for Lambda, ECR, DynamoDB
- **API Reverse Proxy** (`from-the-hart-tech-api-reverse-proxy-worker`): Routes requests through Cloudflare
- **Tech Website** (`from-the-hart-tech-website`): Displays project data
- **Auth Service** (`from-the-hart-auth`): Optional authentication for management endpoints
