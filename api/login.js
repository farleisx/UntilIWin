import { readUsersFile } from "./_users.js";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

  const users = await readUsersFile();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const { passwordHash, ...safe } = user;
  // NOTE: this is a simple login response. For real auth use JWT/sessions.
  return res.status(200).json({ ok: true, user: safe });
}
