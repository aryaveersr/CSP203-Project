import express from "express";
import db from "../config/db.js";

const getAllEvents = db.prepare("SELECT * FROM events");
const insertEvent = db.prepare(
  "INSERT INTO events (title, description, date, venue) VALUES (?, ?, ?, ?)",
);

async function getEvents(_req, res) {
  const events = getAllEvents.all();
  res.json(events);
}

async function createEvent(req, res) {
  const { title, description, date, venue } = req.body;

  for (const value of [title, description, date, venue]) {
    if (!value || value.trim() === "") {
      return res.status(400).json({ message: "All fields are required" });
    }
  }

  insertEvent.run(title, description, date, venue);
  res.json({ message: "Event created successfully" });
}

const router = express.Router();

router.post("/create_event", createEvent);
router.get("/get_events", getEvents);

export default router;
