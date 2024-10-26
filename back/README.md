# Backend Project

This is the backend part of the project, built with NestJS.

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- PostgreSQL (or any other database supported by TypeORM)

## Getting Started

1. Clone the repository:

   ```sh
   git clone https://github.com/your-repo.git
   cd your-repo/back
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Copy the `.env.example` to `.env` and configure your environment variables:

   ```sh
   cp .env.example .env
   ```

4. Run migration to create tables

   ```sh
   npm run typeorm migration:run
   ```

5. Run the application:
   ```sh
   npm run start:dev
   ```
