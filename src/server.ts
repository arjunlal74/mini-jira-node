import app from "./app";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();

const PORT = process.env.PORT || 3000;

// ⬇️ Create HTTP server
const httpServer = http.createServer(app);

// ⬇️ Attach Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*", // tighten later
  },
});

// 🔐 Socket authentication (example)
io.use(async (socket, next) => {
  try {
    const userId = socket.handshake.auth.userId; // replace with JWT later
    if (!userId) return next(new Error("Unauthorized"));

    socket.data.userId = Number(userId);
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
});

// 🔌 Socket logic
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.data.userId);

  socket.on("JOIN_TASK_CHAT", async ({ taskId }) => {
    const userId = socket.data.userId;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        project: true,
        taskAssignments: true,
      },
    });

    if (!task) return socket.emit("ERROR", "Task not found");

    const isMerchant = task.project.merchantId === userId;
    const isAssigned = task.taskAssignments.some(
      (ta) => ta.userId === userId
    );

    if (!isMerchant && !isAssigned) {
      return socket.emit("ERROR", "Access denied");
    }

    // Ensure chat exists
    const chat = await prisma.chat.upsert({
      where: { taskId },
      update: {},
      create: { taskId },
    });

    socket.join(`task:${taskId}`);

    socket.emit("JOINED_TASK_CHAT", {
      chatId: chat.id,
      taskId,
    });
  });

  socket.on("SEND_MESSAGE", async ({ taskId, content }) => {
    const userId = socket.data.userId;

    const chat = await prisma.chat.findUnique({
      where: { taskId },
    });

    if (!chat) return;

    const message = await prisma.message.create({
      data: {
        chatId: chat.id,
        senderId: userId,
        content,
      },
      include: {
        sender: { select: { id: true, name: true } },
      },
    });

    io.to(`task:${taskId}`).emit("NEW_MESSAGE", message);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.data.userId);
  });
});

// ⬇️ Start server
httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


// import app from "./app";
// import dotenv from "dotenv";

// dotenv.config();

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });

