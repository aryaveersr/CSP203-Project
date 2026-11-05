import session from "express-session";
import { randomBytes } from "crypto";

const MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours
const SESSION_SECRET =
  process.env.SESSION_SECRET || randomBytes(32).toString("hex");

export default session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax", maxAge: MAX_AGE },
});
