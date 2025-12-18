import { Server, Socket } from "socket.io";
import prisma from "../config/database";
import chatSocketEvents from "../enums/chatSocketEvents";

export const initSocket = (io: Server) => {
  // 🔐 Socket auth middleware
  io.use((socket, next) => {
    try {
      // Replace with real auth later
      socket.data.userId = 1;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  // 🔌 Socket connection
  io.on("connection", (socket: Socket) => {
    console.log("Socket connected:", socket.id);

    socket.on(chatSocketEvents.JOIN_TASK_CHAT, async ({ taskId }) => {
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

      const chat = await prisma.chat.upsert({
        where: { taskId },
        update: {},
        create: { taskId },
      });

      socket.join(`task:${taskId}`);

      console.log(`User ${userId} joined room task:${taskId}`);

      socket.emit(chatSocketEvents.JOINED_TASK_CHAT, {
        chatId: chat.id,
        taskId,
      });
    });

    socket.on(chatSocketEvents.SEND_MESSAGE, async ({ taskId, content }) => {
      const userId = socket.data.userId;
      const room = `task:${taskId}`;

      if (!socket.rooms.has(room)) {
        return socket.emit("ERROR", "Join task chat first");
      }

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

      io.to(room).emit(chatSocketEvents.NEW_MESSAGE, message);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.data.userId);
    });
  });
};
