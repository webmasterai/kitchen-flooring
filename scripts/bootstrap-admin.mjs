#!/usr/bin/env node
import { randomBytes, pbkdf2Sync } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import readline from "node:readline";

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 100_000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function parseArgs() {
  const args = {};
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith("--email=")) args.email = arg.split("=")[1].trim();
    if (arg.startsWith("--password=")) args.password = arg.split("=")[1].trim();
    if (arg.startsWith("--name=")) args.name = arg.split("=")[1].trim();
  }
  return args;
}

function promptHidden(query) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const stdin = process.stdin;
    process.stdout.write(query);

    let password = "";
    if (stdin.isTTY) {
      stdin.setRawMode(true);
      stdin.resume();
      stdin.setEncoding("utf8");

      const onData = (ch) => {
        const c = ch.toString("utf8");
        if (c === "\n" || c === "\r" || c === "\u0004") {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.removeListener("data", onData);
          process.stdout.write("\n");
          rl.close();
          resolve(password);
        } else if (c === "\u0003") {
          // Ctrl+C
          process.stdout.write("\n");
          process.exit(130);
        } else if (c === "\u0008" || c === "\u007f") {
          // Backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write("\b \b");
          }
        } else {
          password += c;
          process.stdout.write("*");
        }
      };

      stdin.on("data", onData);
    } else {
      rl.question("", (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    }
  });
}

function promptText(query, defaultValue = "") {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const promptLabel = defaultValue ? `${query} [${defaultValue}]: ` : `${query}: `;
    rl.question(promptLabel, (ans) => {
      rl.close();
      resolve(ans.trim() || defaultValue);
    });
  });
}

async function main() {
  const args = parseArgs();
  let email =
    args.email ||
    process.env.BOOTSTRAP_ADMIN_EMAIL ||
    process.env.ADMIN_INITIAL_EMAIL ||
    "";
  let name =
    args.name ||
    process.env.BOOTSTRAP_ADMIN_NAME ||
    process.env.ADMIN_INITIAL_NAME ||
    "";
  let password =
    args.password ||
    process.env.BOOTSTRAP_ADMIN_PASSWORD ||
    process.env.ADMIN_INITIAL_PASSWORD ||
    "";

  if (!email && process.stdin.isTTY) {
    email = await promptText("Enter Admin Email", "admin@kitchenflooringdepot.com");
  }
  if (!name && process.stdin.isTTY) {
    name = await promptText("Enter Admin Full Name", "CMS Administrator");
  }
  if (!password && process.stdin.isTTY) {
    password = await promptHidden("Enter Admin Password: ");
    const confirm = await promptHidden("Confirm Admin Password: ");
    if (password !== confirm) {
      console.error("\n[Error] Passwords do not match. Aborting.");
      process.exit(1);
    }
  }

  if (!email) {
    console.error("[Error] Admin email is required (use --email=... or BOOTSTRAP_ADMIN_EMAIL env var)");
    process.exit(1);
  }
  if (!password || password.length < 8) {
    console.error("[Error] Admin password must be at least 8 characters long");
    process.exit(1);
  }
  if (!name) {
    name = "CMS Administrator";
  }

  const usersFile = path.join(process.cwd(), "data", "users.json");
  mkdirSync(path.dirname(usersFile), { recursive: true });

  let users = [];
  if (existsSync(usersFile)) {
    try {
      users = JSON.parse(readFileSync(usersFile, "utf8"));
      if (!Array.isArray(users)) users = [];
    } catch {
      users = [];
    }
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingIdx = users.findIndex(
    (u) => u.email && u.email.toLowerCase().trim() === normalizedEmail
  );

  const passwordHash = hashPassword(password);
  const now = new Date().toISOString();

  if (existingIdx >= 0) {
    users[existingIdx].passwordHash = passwordHash;
    users[existingIdx].name = name;
    users[existingIdx].role = "Owner";
    users[existingIdx].active = true;
    users[existingIdx].updatedAt = now;
    console.log(`[CMS Bootstrap] Existing user '${normalizedEmail}' updated successfully with Owner role.`);
  } else {
    users.push({
      id: `owner-${Date.now()}`,
      name,
      email: normalizedEmail,
      passwordHash,
      role: "Owner",
      active: true,
      createdAt: now,
    });
    console.log(`[CMS Bootstrap] New Owner user '${normalizedEmail}' successfully created.`);
  }

  writeFileSync(usersFile, JSON.stringify(users, null, 2), { encoding: "utf8", mode: 0o600 });
  console.log(`[CMS Bootstrap] Saved user record to ${usersFile}. Credentials ready for login.`);
}

main().catch((err) => {
  console.error("[CMS Bootstrap Error]:", err.message);
  process.exit(1);
});
