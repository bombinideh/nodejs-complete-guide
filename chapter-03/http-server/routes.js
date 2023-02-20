const fs = require("fs");

const requestHandler = (req, res) => {
  const { method, url } = req;

  if (url === "/" && method === "GET") {
    res.write("<html>");
    res.write("<body>");
    res.write('<form method="post">');
    res.write('<input type="text" name="message" />');
    res.write('<button type="submit">Enviar</button>');
    res.write("</form>");
    res.write("</body>");
    res.write("</html>");
    res.end();
  } else if (url === "/" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      body.push(chunk);
    });
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      fs.writeFile("message.txt", message, (err) => {
        if (err) {
          console.error(err);
          res.statusCode = 500;
          res.end();
          return;
        }

        res.statusCode = 302;
        res.setHeader("Location", "/");
        res.end();
      });
    });
  }
};

module.exports = requestHandler;
