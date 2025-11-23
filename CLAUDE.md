# From The Hart Projects Service

Fastify API managing project data, deployed on AWS Lambda.

## Overview

**Responsibilities:**
- Project data management and retrieval
- RESTful API endpoints for project operations
- Type-safe request/response validation
- OpenAPI/Swagger documentation
- Pagination and filtering support

**Architecture:** Fastify + TypeBox → AWS Lambda (container image)

## Technology Stack

- **Framework:** Fastify v5 with TypeScript
- **Type Safety:** TypeBox (@fastify/type-provider-typebox)
- **API Docs:** @fastify/swagger + @fastify/swagger-ui
- **Serverless:** @fastify/aws-lambda
- **Testing:** Vitest with supertest

## Common Commands

```bash
# Development
npm install                          # Install dependencies
npm run dev                          # Start dev server at localhost:8080

# Building
npm run build                        # Compile TypeScript to dist/
npm start                            # Start production server

# Testing
npm test                             # Run tests
npm run test:watch                   # Watch mode
npm run test:coverage                # Generate coverage
```

## Environment Variables

- `NODE_ENV` - development, production
- `PORT` - Server port (default: 8080)
- `LOG_LEVEL` - Logging level (debug, info, warn, error)
- `AWS_REGION` - AWS region (default: us-east-1)
- `DYNAMODB_TABLE` - DynamoDB table name (if using)
- `CORS_ORIGIN` - CORS allowed origin(s)

## Local Development

```bash
npm install
cp .env.example .env
npm run dev
```

**API Documentation:** http://localhost:8080/projects/documentation

## Docker

```bash
# Build for Lambda
docker build -f Dockerfile.lambda -t projects-lambda .

# Build for traditional deployment
docker build -t projects-service .

# Run
docker run -p 8080:8080 projects-service
```

## Deployment

**Lambda:**
1. Build Docker image
2. Tag for ECR
3. Push to ECR
4. Deploy via Terraform

**GitHub Actions** handles automated deployment on push to main.

## Related Services

- **Infrastructure:** Terraform for Lambda, ECR, DynamoDB
- **API Reverse Proxy:** Routes requests through Cloudflare
- **Tech Website:** Displays project data
