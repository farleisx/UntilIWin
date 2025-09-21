import fs from "fs/promises";
import path from "path";
import axios from "axios";

const USERS_PATH = path.join(process.cwd(), "data", "users.json");

async function readUsersFile() {
  try {
    const raw = await fs.readFile(USERS_PATH, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    // If file doesn't exist, return empty array
    return [];
  }
}

async function writeUsersFileLocal(users) {
  await fs.mkdir(path.join(process.cwd(), "data"), { recursive: true });
  await fs.writeFile(USERS_PATH, JSON.stringify(users, null, 2), "utf-8");
}

// Save users persistently. If GitHub env vars set, commit to GitHub repo,
// otherwise attempt local write (works only in local dev / Codespaces)
async function saveUsers(users) {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const filePath = "data/users.json";

  // If GitHub token & repo info present, commit to GitHub to persist
  if (token && owner && repo) {
    try {
      // get current file sha (if exists)
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(filePath)}`;
      const getRes = await axios.get(url, {
        headers: { Authorization: `token ${token}`, Accept: "application/vnd.github+json" },
      }).catch(() => null);

      const contentBase64 = Buffer.from(JSON.stringify(users, null, 2)).toString("base64");
      const body = {
        message: "Update users.json via Infiner auth",
        content: contentBase64,
      };
      if (getRes && getRes.data && getRes.data.sha) body.sha = getRes.data.sha;

      await axios.put(url, body, {
        headers: { Authorization: `token ${token}`, Accept: "application/vnd.github+json" },
      });
      return;
    } catch (err) {
      console.error("GitHub commit failed:", err.response?.data || err.message || err);
      // fallback to local write
    }
  }

  // fallback: local filesystem write
  try {
    await writeUsersFileLocal(users);
  } catch (err) {
    console.error("Local write users.json failed:", err);
    throw new Error("Unable to persist users. Configure GITHUB_* env vars for persistence on Vercel.");
  }
}

export { readUsersFile, saveUsers };
