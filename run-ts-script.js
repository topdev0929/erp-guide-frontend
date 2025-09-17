const path = require("path");
const { spawn } = require("child_process");
require("dotenv").config();

const scriptPath = process.argv[2];

if (!scriptPath) {
  console.error("Please provide a script path");
  process.exit(1);
}

const fullScriptPath = path.resolve(process.cwd(), scriptPath);

const tsNodeProcess = spawn(
  "ts-node",
  [
    "-r",
    "tsconfig-paths/register",
    "-P",
    "tsconfig.scripts.json",
    fullScriptPath,
    ...process.argv.slice(3),
  ],
  {
    stdio: "inherit",
  },
);

tsNodeProcess.on("close", (code) => {
  process.exit(code);
});
