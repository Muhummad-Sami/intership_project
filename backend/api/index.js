import app from "../server.js";

export default async function handler(req, res) {
  // Vercel calls this for every request to /api/*
  await new Promise((resolve, reject) => {
    app(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}