import express from "express";
import session from "./config/session.js";
import authRoutes from "./controller/auth.controller.js";
import { isAuthenticated } from "./middleware/auth.js";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(session);
  app.use(express.static("./frontend", { extensions: ["html"] }));

  app.use("/api/auth", authRoutes);
  app.get("/test", isAuthenticated, (req, res) => {
    return res.send(`${JSON.stringify(req.session.user)}`);
  });

  app.use((_req, res) => {
    res.status(404).sendFile("404.html", { root: "./frontend" });
  });

  return app;
}
