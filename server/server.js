const app = require("./src/app");

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 The Hidden Bakers Backend running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`ℹ️ Express Backend Server is already active on http://localhost:${PORT}`);
  } else {
    console.error("Server Error:", err);
  }
});
