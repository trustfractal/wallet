import express from "express";

const app = express();
const port = process.env["PORT"] || 3000;

app.get("/", (_req, res) => {
  res.send("Hello World!");
});

const start = () =>
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });

export default { start };
