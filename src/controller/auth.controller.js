import express from "express";
import {
  createUser,
  authenticateUser,
  InvalidCredentialsError,
  UserAlreadyExistsError,
} from "../service/auth.service.js";

async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await authenticateUser(username, password);

    req.session.regenerate((err) => {
      if (err) throw err;

      req.session.user = user;
      req.session.save((err) => {
        if (err) throw err;
        return res.status(200).end();
      });
    });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return res.status(401).json({ message: err.message });
    } else throw err;
  }
}

async function register(req, res) {
  const { username, password } = req.body;

  try {
    await createUser(username, password);
    return res.status(201).end();
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return res.status(409).json({ message: err.message });
    } else throw err;
  }
}

function validateBody(req, res, next) {
  const { username, password } = req.body;

  if (
    !username ||
    !password ||
    username.trim() === "" ||
    password.trim() === ""
  ) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  next();
}

const router = express.Router();

router.post("/login", validateBody, login);
router.post("/register", validateBody, register);

export default router;
