import express from "express";
import userRoutes from "./routes/userRoutes";


const app = express();

app.use(express.json());

app.use("/api/user",userRoutes)

export default app;