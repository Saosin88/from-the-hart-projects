# From The Hart Projects API

A Fastify-based API for managing From The Hart projects. This API is designed to support both traditional server deployments and serverless AWS Lambda deployments.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Docker (for containerized deployment)
- AWS CLI (for Lambda deployment)

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Saosin88/from-the-hart-projects.git
cd from-the-hart-projects
npm install
```

## Local Development

To start the server in development mode:

```bash
npm run dev
```

This will start the server with hot-reload enabled, allowing you to make changes without restarting the server.

## Docker

### Building the Docker Image

To build the Docker image with specific environment settings:

```bash
docker build --build-arg NODE_ENV=local --build-arg LOG_LEVEL=debug -t from-the-hart-projects .
```

### Running the Docker Container

To run the container in detached mode and map it to port 8080:

```bash
docker run --name from_the_hart_projects -d -p 127.0.0.1:8080:8080 from-the-hart-projects
```

### Viewing Logs

To follow the container logs:

```bash
docker logs -f from_the_hart_projects
```

### Docker Management

List all containers:

```bash
docker ps -a
```

### Cleanup

Stop all running containers:

```bash
docker stop $(docker ps -a -q)
```

Remove all containers:

```bash
docker rm -v $(docker ps -a -q)
```

Remove all images:

```bash
docker rmi -f $(docker images -a -q)
```

## AWS Lambda Deployment

This project supports deployment as an AWS Lambda function:

```bash
# Build the Lambda Docker image
docker build -f Dockerfile.lambda -t from-the-hart-projects-lambda .

# Deploy using AWS CLI (requires proper AWS credentials)
aws lambda update-function-code \
  --function-name from-the-hart-projects \
  --image-uri <your-ecr-repository-uri>:latest
```

The Lambda entry point is defined in `src/lambda.ts`.

## API Documentation

Once the server is running, you can access the Swagger documentation at:

```
http://localhost:8080/projects/documentation
```

## Project Structure

```
from-the-hart-projects/
├── src/
│   ├── controllers/        # API request handlers (e.g., projectController.ts)
│   ├── models/             # Data models with TypeBox schemas (e.g., Project.ts)
│   ├── public/             # Static assets and files
│   ├── lambda.ts           # AWS Lambda entry point handler
│   └── server.ts           # Main application entry point
├── .dockerignore           # Files excluded from Docker builds
├── .gitignore              # Files ignored by git
├── Dockerfile              # Container build configuration for regular deployments
├── Dockerfile.lambda       # Container build for AWS Lambda deployments
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

This project uses Fastify with the TypeBox type provider (@fastify/type-provider-typebox) for type-safe API development. It supports both traditional server deployments and serverless AWS Lambda deployments.

## Testing

Run tests with:

```bash
npm test
```

The project uses Jest for unit tests and includes coverage reporting.

## Infrastructure

Key AWS resources used:

- API Gateway for REST API endpoints
- Lambda for serverless execution
- CloudFront for edge caching and content delivery
- IAM roles and policies for security

## Environment Variables

The following environment variables can be set:

- `NODE_ENV` - Environment (dev, prod, local)
- `LOG_LEVEL` - Logging level (debug, info, warn, error)
- `PORT` - Port to run the server on (defaults to 8080)
- `HOST` - Host address to bind the server to (defaults to "0.0.0.0")

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm start` - Start the production server
- `npm test` - Run tests

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Sheldon Hart - [LinkedIn](https://www.linkedin.com/in/sheldon-hart/)

Project Link: [https://github.com/Saosin88/from-the-hart-projects.git](https://github.com/Saosin88/from-the-hart-projects.git)
