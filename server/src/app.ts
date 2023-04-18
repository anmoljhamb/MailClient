import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "..", "public")));

export default app;
