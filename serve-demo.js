const http = require("http");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
};

const server = http.createServer((request, response) => {
  const requestPath = decodeURIComponent((request.url || "/").split("?")[0]);
  const normalizedPath = path
    .normalize(requestPath)
    .replace(/^([.][.][\\/])+/, "");
  let filePath = path.join(
    root,
    normalizedPath === "/" ? "index.html" : normalizedPath.replace(/^[/\\]/, ""),
  );

  if (!filePath.startsWith(root)) {
    response.statusCode = 403;
    response.end("Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    if (!statError && stats.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    fs.readFile(filePath, (readError, fileBuffer) => {
      if (readError) {
        response.statusCode = 404;
        response.end("Not found");
        return;
      }

      response.setHeader(
        "Content-Type",
        mimeTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      );
      response.end(fileBuffer);
    });
  });
});

server.listen(port, "127.0.0.1", () => {
  process.stdout.write(`CRM demo server running on http://127.0.0.1:${port}\n`);
});
