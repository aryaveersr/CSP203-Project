import express from "express";
import path from "path";
import multer from "multer";
import db from "../config/db.js";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "user_uploads";
const upload = multer({ dest: UPLOAD_DIR });

const statements = {
  getNotes: db.prepare(`
    SELECT
      notes.*,
      attachments.id as attachment_id,
      attachments.filename as filename
    FROM notes
    LEFT JOIN attachments ON notes.id = attachments.note_id
    ORDER BY notes.id, attachments.id
  `),

  getAttachment: db.prepare(`
    SELECT
      *
    FROM attachments
    WHERE id = ?
  `),

  insertAttachment: db.prepare(
    `INSERT
      INTO attachments (id, note_id, filename)
      VALUES (?, ?, ?)`,
  ),

  insertNote: db.prepare(
    `INSERT
      INTO notes (code, title, author, content, uploaded_at)
      VALUES (?, ?, ?, ?, ?)`,
  ),
};

async function getNotes(req, res) {
  const rows = statements.getNotes.all();
  const notesMap = new Map();

  for (const { attachment_id, filename, ...note } of rows) {
    if (!notesMap.has(note.id)) {
      notesMap.set(note.id, { ...note, attachments: [] });
    }
    if (attachment_id) {
      notesMap.get(note.id).attachments.push({ attachment_id, filename });
    }
  }

  res.json(Array.from(notesMap.values()));
}

async function createNote(req, res) {
  const { code, title, author, content } = req.body;
  const files = req.files;

  for (const value of [code, title, author, content]) {
    if (!value || value.trim() === "") {
      return res.status(400).send(`Missing required fields.`);
    }
  }

  const uploaded_at = new Date().toISOString();
  const noteId = statements.insertNote.run(
    code,
    title,
    author,
    content,
    uploaded_at,
  ).lastInsertRowid;

  for (const file of files) {
    const { originalname, filename: fileId } = file;
    statements.insertAttachment.run(fileId, noteId, originalname);
  }

  res.json({
    code,
    title,
    author,
    content,
    uploaded_at,
    attachments: files.map((f) => ({
      filename: f.originalname,
      attachment_id: f.filename,
    })),
  });
}

async function downloadAttachment(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).send("Attachment ID is required");

  const attachment = statements.getAttachment.get(id);
  if (!attachment) return res.status(404).send("Attachment not found");

  const filePath = path.join(UPLOAD_DIR, id);
  res.download(filePath);
}

const router = express.Router();

router.get("/get_notes", getNotes);
router.get("/download_attachment", downloadAttachment);
router.post("/create_note", upload.array("files"), createNote);

export default router;
