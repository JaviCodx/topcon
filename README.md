# Topcon

A TypeScript-based REST API built with Fastify for managing todos.

## Considerations

Pattern implemented was MVC, with a repository pattern for the database interactions. This pattern suffices for the requirements of the project. For a more robust project, I would consider a more robust pattern like DDD.

Project API is not protected with api keys or tokens, so you can use it freely. Although, it has rate limiting implemented. Testing was done only for the GET /todos endpoint due to time constraints.

Label info from the label serice is cached in memory to avoid long running request since it may fail at any point or have unreasonably long response times.

## Going further

Some improvements can be made to the project for it to be a production-ready project:

1. Add more testing
2. Build auth

## Technologies

- **Framework**: Fastify
- **Language**: TypeScript
- **Database**: SQLite
- **Documentation**: Swagger/OpenAPI with Scalar as UI

## Features

- RESTful API endpoints for todos management
- API documentation with Swagger
- Rate limiting for API protection
- CORS support

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Docker (optional)


## Development

A devcontainer matching the requisites is provided for VSCode, but you can use any editor of your choice.

Start the development server:
```bash
npm run dev
```

The server will start on port 3000 with hot-reload enabled.

## Testing

Start test sutite:
```bash
npm run test
```

Only one test is available for now, but more can be added.

## Docker Support


Build and run separately:
```bash
docker build -t todos .
docker run -p 3000:3000 todos
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the project

## API Endpoints

Api documentation is avaiable at `/docs`


## Database

The project uses SQLite as its database. The database file is located in the `db` directory. Some data is already seeded in the database.
