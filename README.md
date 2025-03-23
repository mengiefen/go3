# Go3 Application

A modern Rails 8 application with PostgreSQL database.

## Development Setup

### Prerequisites

- Ruby 3.3.3
- Rails 8.0.1
- PostgreSQL 15+
- Docker and Docker Compose
- Node.js and Yarn

### Setup with Docker (Recommended)

1. Clone the repository

   ```bash
   git clone https://github.com/mengiefen/go3.git
   cd go3
   ```

2. Copy environment file and fill in necessary values

   ```bash
   cp .env.example .env
   ```

3. Start Docker containers

   ```bash
   docker-compose up
   ```

4. Access the application at http://localhost:3000

### Manual Setup

1. Clone the repository

   ```bash
   git clone https://github.com/mengiefen/go3.git
   cd go3
   ```

2. Install dependencies

   ```bash
   bundle install
   ```

3. Create and setup the database

   ```bash
   bin/rails db:prepare
   ```

4. Start the Rails server

   ```bash
   bin/rails server
   ```

5. Access the application at http://localhost:3000

## Testing

```bash
bin/rails test
```

## Deployment

This application is configured for deployment using Docker containers. See the `Dockerfile` for production builds.

## CI/CD

GitHub Actions are configured for continuous integration. See `.github/workflows/ci.yml` for details.
