import "dotenv/config";

const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;
const MONGO_URI = process.env.MONGO_URI;

if (!PORT || !NODE_ENV || !MONGO_URI) {
  throw new Error("Faltan variables de entorno obligatorias");
}

export { PORT, NODE_ENV, MONGO_URI };