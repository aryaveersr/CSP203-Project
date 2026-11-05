import express from "express";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("./frontend", { extensions: ["html"] }));

app.use((_req, res) => {
  res.status(404).sendFile("404.html", { root: "./frontend" });
});

app.listen(port, () => {
  console.log(`Serving at http://localhost:${port}/`);
});
