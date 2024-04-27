import { createServer } from "node:http";
import { createConnection } from "mysql";
import * as ejs from "ejs";
import { parse } from "node:querystring";
import { readFile } from "node:fs";

var con = createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "pos",
});

const server = createServer((req, res) => {
  console.log("req.url:", req.url);

  if (req.url === "/cp") {
    con.connect(function (err) {
      con.query("SELECT * FROM productos", function (err, result, fields) {
        if (err) throw err;
        console.log(result);
      });
    });
    ejs.renderFile("views/catalogoProductos.html", (err, str) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("An error occurred");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(str);
      }
    });
  } else if (req.url === "/cu") {
    ejs.renderFile("views/catalogoUsuarios.html", (err, str) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("An error occurred");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(str);
      }
    });
  } else if (req.url === "/cc") {
    ejs.renderFile("views/catalogoClientes.html", (err, str) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("An error occurred");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(str);
      }
    });
  } else if (req.url === "/login") {
    ejs.renderFile("views/index.html", (err, str) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("An error occurred");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(str);
      }
    });
  } else if (req.method === "POST" && req.url === "/submit") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const formData = parse(body);
      console.log("Usuario:", formData.usuario);
      console.log("Contraseña:", formData.contrasena);
      if (formData.usuario === "admin" && formData.contrasena === "1234") {
        readFile("views/menu.html", "utf8", (err, str) => {
          if (err) {
            console.error(err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("An error occurred");
          } else {
            console.log("Redireccionando a menu.html");
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(str);
          }
        });
      } else {
        console.log("Credenciales incorrectas, redireccionando a index.html");
        res.writeHead(302, { Location: "/" });
        res.end();
      }
    });
  } else {
    ejs.renderFile("views/index.html", (err, str) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("An error occurred");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(str);
      }
    });
  }
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Listening on 127.0.0.1:3000");
});
