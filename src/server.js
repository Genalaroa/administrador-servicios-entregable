import app from './app.js';
import { connectDB } from './config/db.config.js';
import { PORT } from './config/env.config.js';

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
};

startServer();