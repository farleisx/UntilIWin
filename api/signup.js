import { readUsersFile, saveUsers } from "./_users.js";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

  const users = await readUsersFile();
  const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) return res.status(409).json({ error: "User already exists" });

  const hash = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), email: email.toLowerCase(), passwordHash: hash, createdAt: new Date().toISOString() };
  users.push(user);
  try {
    await saveUsers(users);
    // Return user without password hash
    const { passwordHash, ...safe } = user;
    return res.status(201).json({ ok: true, user: safe });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to save user" });
  }
}
