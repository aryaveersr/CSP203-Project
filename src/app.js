import express from "express";
import eventsRoutes from "./controller/events.controller.js";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.static("./frontend", { extensions: ["html"] }));

  app.use("/api", eventsRoutes);
  app.use((_, res) => {
    return res.status(404).sendFile("404.html", { root: "./frontend" });
  });

  app.use((err, _, res) => {
    console.error(err);
    return res.status(500);
  });

  return app;
}
