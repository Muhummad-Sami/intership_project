import app from "../server.js";

export default async function handler(req, res) {
  try {
    await new Promise((resolve, reject) => {
      app(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}