import app from "./app";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { initSocket } from "./sockets";

dotenv.config();

const PORT = process.env.PORT || 3000;

// ⬇️ Create HTTP server
const httpServer = http.createServer(app);

// ⬇️ Attach Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*", // tighten later
  },
});

// Initialize socket logic
initSocket(io);

// ⬇️ Start server
httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
