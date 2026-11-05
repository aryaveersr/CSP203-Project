import { scrypt, timingSafeEqual, randomBytes } from "node:crypto";
import { promisify } from "node:util";
import db from "../config/db.js";

const KEY_LEN = 64;
const hashPassword = promisify(scrypt);

const findUser = db.prepare("SELECT * FROM users WHERE username = ?");
const insertUser = db.prepare(
  "INSERT INTO users (username, password_hash, salt) VALUES (?, ?, ?) ON CONFLICT(username) DO NOTHING",
);

export async function createUser(username, password) {
  const salt = randomBytes(8).toString("hex");
  const hashedPassword = await hashPassword(password, salt, KEY_LEN);
  const result = insertUser.run(username, hashedPassword, salt);

  if (result.changes === 0) throw new UserAlreadyExistsError();
}

export async function authenticateUser(username, password) {
  const user = findUser.get(username);
  if (!user) throw new InvalidCredentialsError();

  const hashedPassword = await hashPassword(password, user.salt, KEY_LEN);

  if (!timingSafeEqual(hashedPassword, user.password_hash)) {
    throw new InvalidCredentialsError();
  }

  return { username };
}

export class UserAlreadyExistsError extends Error {
  constructor() {
    super("Username already exists");
    this.name = "UserAlreadyExistsError";
  }
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid credentials");
    this.name = "InvalidCredentialsError";
  }
}
