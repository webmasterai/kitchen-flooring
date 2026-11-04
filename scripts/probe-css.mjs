import http from "http";
import fs from "fs";

const port = process.env.PORT || "3001";
const host = process.env.PROBE_HOST || "127.0.0.1";

function get(path) {
  return new Promise((resolve, reject) => {
    http
      .get({ hostname: host, port, path }, (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () =>
          resolve({
            status: res.statusCode,
            ct: res.headers["content-type"],
            body: Buffer.concat(chunks).toString("utf8"),
          }),
        );
      })
      .on("error", reject);
  });
}

const home = await get("/");
const title = (home.body.match(/<title>([^<]*)<\/title>/) || [])[1];
const cssLinks = [...new Set([...home.body.matchAll(/\/_next\/static\/[^"']+\.css/g)].map((m) => m[0]))];
console.log("url", `http://${host}:${port}/`);
console.log("home", home.status, "title:", title);
console.log("cssLinks", cssLinks);

for (const link of cssLinks) {
  const r = await get(link);
  console.log("\nGET", link, r.status, r.ct, "len", r.body.length);
  if (r.status !== 200) {
    console.log(r.body.slice(0, 400));
    process.exitCode = 1;
    continue;
  }
  const checks = {
    "bg-forest": r.body.includes("bg-forest") || r.body.includes("--color-forest") || r.body.includes("--forest"),
    "container-wide": r.body.includes("container-wide"),
    ".flex{": r.body.includes(".flex{"),
    ".h-4{": r.body.includes(".h-4{"),
    "Cormorant": r.body.includes("Cormorant"),
    "Plus Jakarta": r.body.includes("Plus Jakarta"),
  };
  console.log(checks);
  if (checks["Plus Jakarta"] || !checks["Cormorant"] || !checks["container-wide"]) {
    console.error("Unexpected CSS payload for Kitchen & Flooring Depot");
    process.exitCode = 1;
  }
}

const disk = ".next/static/chunks";
if (fs.existsSync(disk)) {
  console.log(
    "\ndisk css",
    fs.readdirSync(disk).filter((f) => f.endsWith(".css")),
  );
}
