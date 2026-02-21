import express from "express";
import userRoutes from "./routes/userRoutes";
import { globalErrorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(express.json());

app.use("/api/user", userRoutes);

// Global Error Handler
app.use(globalErrorHandler);

export default app;