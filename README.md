## Steps to Set Up and Run the Backend locally

1. Clone the repository and navigate into the project directory:
   ```bash
   git clone https://github.com/KoltaG/thesis_pm_api.git
   cd thesis_pm_api
   ```
2. Run the following command to start the MongoDB container:
   ```bash
   docker compose up -d mongodb
   ```
3. Install the dependencies by running:
   ```bash
   yarn
   ```
4. Seed the database with initial data using the following command:
   ```bash
   yarn ts-node-dev src/seed.ts
   ```
5. Start the backend server by running:
   ```bash
   yarn dev
   ```
6. The backend will be accessible at:
   ```
   http://localhost:5000
   ```
7. Swagger API documentation is available at:
   ```
   http://localhost:5000/api-docs
   ```
