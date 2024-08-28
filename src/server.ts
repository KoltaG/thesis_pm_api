import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./config/db";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerOptions from "./config/swaggerConfig";
import swaggerUi from "swagger-ui-express";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Swagger setup
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/users", require("./routes/authRoutes").default);
app.use("/api/projects", require("./routes/projectRoutes").default);
app.use("/api/tasks", require("./routes/taskRoutes").default);
app.use("/api/projects", require("./routes/projectTaskRoutes").default);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
