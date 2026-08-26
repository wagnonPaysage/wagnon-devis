const http = require("http");
const fs = require("fs");
const { exec } = require("child_process");

http.createServer((req, res) => {

if (req.url === "/logo.jpg") {
    res.writeHead(200, { "Content-Type": "image/jpeg" });
    return res.end(fs.readFileSync("logo.jpg"));
  }
if (req.url === "/pdf/devis.pdf") {
  res.writeHead(200, { "Content-Type": "application/pdf" });
  return res.end(fs.readFileSync("pdf/devis.pdf"));
  }
if (req.url === "/generer") {
  exec("node index.js", () => {
    res.writeHead(302, { Location: "/pdf/devis.pdf" });
    res.end();
  });
  return;
}

  res.end(`
<html>
<head>
<meta charset="UTF-8">
<style>
body{
  font-family:Arial,sans-serif;
  background:#f5f5f5;
  display:flex;
  justify-content:center;
  align-items:center;
  height:100vh;
}
.box{
  background:white;
  padding:40px;
  border-radius:15px;
  box-shadow:0 8px 25px rgba(0,0,0,.15);
  text-align:center;
}
button{
  background:#2e7d32;
  color:white;
  border:none;
  padding:15px 35px;
  font-size:18px;
  border-radius:10px;
  cursor:pointer;
}
button:hover{
  background:#256628;
}
</style>
</head>
<body>
<div class="box">
  <h1>🌲 Wagnon Paysage</h1>
  <button onclick="window.location='/generer'">
  Générer le devis
</button>
</div>
</body>
</html>
  `);
}).listen(3000);

console.log("http://localhost:3000");
