app.use(express.static("frontend/build"));

app.get("*", (_req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
});
