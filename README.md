# From The Hart Projects API

A Fastify-based API for managing From The Hart projects. This API is designed to support both traditional server deployments and serverless AWS Lambda deployments.

![Status](https://img.shields.io/badge/Status-Live-success)
![Platform](https://img.shields.io/badge/Platform-AWS_Lambda-orange)
![Framework](https://img.shields.io/badge/Framework-Fastify-blue)

## 🔍 Overview

The From The Hart Projects API provides endpoints for managing and displaying projects across the From The Hart ecosystem. Key capabilities include:

- Project data management with structured schemas
- Support for both traditional server and serverless deployments
- Swagger documentation for API exploration
- Type-safe API implementation with TypeBox
- Part of the broader From The Hart multi-cloud architecture

## 🛠️ Tech Stack

- **Framework**: Fastify with TypeScript
- **Type Safety**: TypeBox (@fastify/type-provider-typebox)
- **Documentation**: Swagger/OpenAPI
- **Testing**: Vitest for unit tests
- **Containerization**: Docker for deployments
- **Serverless**: AWS Lambda container support
- **Infrastructure**: Terraform (managed in the `from-the-hart-infrastructure` repository)

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Docker (for containerized deployment)
- AWS CLI (for Lambda deployment)

## 🚀 Getting Started

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Saosin88/from-the-hart-projects.git
cd from-the-hart-projects
npm install
```

### Local Development

To start the server in development mode:

```bash
npm run dev
```

This will start the server with hot-reload enabled, allowing you to make changes without restarting the server.

### Docker Configuration

#### Building the Docker Image

To build the Docker image with specific environment settings:

```bash
docker build --build-arg NODE_ENV=local --build-arg LOG_LEVEL=debug -t from-the-hart-projects .
```

#### Running the Docker Container

To run the container in detached mode and map it to port 8080:

```bash
docker run --name from_the_hart_projects -d -p 127.0.0.1:8080:8080 from-the-hart-projects
```

#### Viewing Logs

To follow the container logs:

```bash
docker logs -f from_the_hart_projects
```

## 🧪 Testing

Run tests with:

```bash
npm test
```

The project uses Vitest for unit tests.

Watch mode:

```bash
npm run test:watch
```

Generate coverage locally:

```bash
npm run test:coverage
```

## 🌐 Infrastructure

This service is part of the "From The Hart" multi-cloud architecture managed with Terraform. The infrastructure is defined in the separate `from-the-hart-infrastructure` repository using the Infrastructure as Code (IaC) approach.

### Cloud Provider Details

- **Primary Platform**: AWS Lambda
- **Storage**: AWS S3 for Terraform state
- **Container Registry**: AWS ECR for Lambda container images
- **Access Control**: AWS IAM with least-privilege policy
- **API Gateway Integration**: Through Cloudflare Workers reverse proxy

The infrastructure is managed using Terraform with modules for reusability:

- State is stored remotely in an S3 bucket (`from-the-hart-terraform`)
- Cloudflare Workers provide API reverse proxying and routing

For infrastructure deployments, refer to the `terraform/` directory which contains separate configurations for `dev` and `prod` environments.

## 📚 API Documentation

Once the server is running, you can access the Swagger documentation at:

```
http://localhost:8080/projects/documentation
```

## ⚙️ Environment Variables

The following environment variables can be set:

- `NODE_ENV` - Environment (dev, prod, local)
- `LOG_LEVEL` - Logging level (debug, info, warn, error)
- `PORT` - Port to run the server on (defaults to 8080)
- `HOST` - Host address to bind the server to (defaults to "0.0.0.0")

## 📁 Project Structure

```
from-the-hart-projects/
├── src/
│   ├── app.ts              # Application setup and plugin configuration
│   ├── lambda.ts           # AWS Lambda entry point handler
│   ├── server.ts           # Main application entry point for traditional servers
│   ├── config/             # Application configuration
│   │   ├── index.ts        # Configuration exports
│   │   ├── logger.ts       # Logging setup
│   │   └── swagger.ts      # API documentation configuration
│   ├── controllers/        # API request handlers
│   │   └── projectController.ts
│   ├── models/             # Data models with TypeBox schemas
│   │   └── Project.ts
│   ├── public/             # Static assets and files
│   ├── routes/             # API route definitions
│   │   └── project.ts
│   └── services/           # Business logic services
├── terraform/              # Infrastructure as Code configurations
│   ├── dev/                # Development environment resources
│   └── prod/               # Production environment resources
├── tests/                  # Test files
│   └── routes/             # API route tests
├── .dockerignore           # Files excluded from Docker builds
├── Dockerfile              # Container build configuration for regular deployments
├── Dockerfile.lambda       # Container build for AWS Lambda deployments
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation
```

## 📚 Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm start` - Start the production server
- `npm test` - Run tests
