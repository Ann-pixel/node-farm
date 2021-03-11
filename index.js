const fs = require("fs");
const http = require("http");
const url = require("url");
const slugify = require("slugify");
const replaceTemplate = require("./modules/replaceTemplate.js");
////-------FILES----///////
//---Synchronous
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);
// const textOut = ` This is what we know about the avocado : ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("the file has been written!");

//---Asynchronous
// logs 'reading file...' before the data
// const fs = require("fs");
// fs.readFile("./txt/input.txt", "utf-8", (err, data) => {
//   console.log(data);
// });
// console.log("reading file...");

//---Asynchronous and Call back HELL!
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   console.log(data1);
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("file has been written!");
//       });
//     });
//   });
// });
// console.log("reading files...");

//////----SERVER----////

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const parsedData = JSON.parse(data);
const slugs = parsedData.map((product) =>
  slugify(product.productName, { lower: true })
);
console.log(slugs);
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/" || pathname === "/overview") {
    //OVERVIEW--
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHTML = parsedData
      .map((obj) => replaceTemplate(tempCard, obj))
      .join("");
    const op = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHTML);
    res.end(op);
  } else if (pathname === "/product") {
    //PRODUCT--
    res.writeHead(200, { "Content-type": "text/html" });
    const product = parsedData[query.id];

    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  } else if (pathname === "/api") {
    //API--
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else {
    //NOT FOUND--
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>page could not be found!</h1>");
  }
});
server.listen(3000, "127.0.0.1", () => {
  console.log("server is up on 3000");
});
