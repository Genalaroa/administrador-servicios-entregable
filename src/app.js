import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";
import serviceRouter from "./routes/services.router.js";
import bookingRouter from "./routes/bookings.router.js";
import viewsRouter from "./routes/views.router.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/services", serviceRouter);
app.use("/api/bookings", bookingRouter);
app.use("/views", viewsRouter);


export default app;

