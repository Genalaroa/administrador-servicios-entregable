import app from './app.js';
import { connectDB } from './config/db.config.js';
import { PORT } from './config/env.config.js';
import { createServer } from "http";
import { Server } from "socket.io"

const startServer = async () => {
    await connectDB();

    const httpServer = createServer(app);
    const io = new Server(httpServer);
    app.set("io", io);

    io.on("connection", (socket) => {
    console.log("Cliente conectado:", socket.id);
    });

    httpServer.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
};

startServer();