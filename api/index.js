import app from "../backend/server.js";

export default async function handler(req, res) {
  await new Promise((resolve, reject) => {
    app(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}