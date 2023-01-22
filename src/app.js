import express from "express";
import morgan from "morgan";

// Import routes
import projectsRoutes from "./routes/projects.routes.js";
import workpackagesRoutes from "./routes/workpackages.routes.js";
import usersRoutes from "./routes/user.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();

// middleware
app.use(morgan("dev"));
app.use(express.json());

// routes
app.use("/api/projects", projectsRoutes);
app.use("/api/workpackages", workpackagesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/upload", uploadRoutes);

export default app;
