const { spawn } = require("child_process");
const path = require("path");

console.log("🚀 Launching The Hidden Bakers Full-Stack Application...");
console.log("🔹 Express Backend API: http://localhost:5001");
console.log("🔹 React Vite Frontend: http://localhost:5173");

const server = spawn("npx", ["nodemon", "server.js"], {
  cwd: path.join(__dirname, "server"),
  stdio: "inherit",
  shell: true
});

const client = spawn("npx", ["vite"], {
  cwd: path.join(__dirname, "client"),
  stdio: "inherit",
  shell: true
});

process.on("SIGINT", () => {
  server.kill();
  client.kill();
  process.exit();
});
