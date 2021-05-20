const fs = require('fs');
const http = require('http');
const { endianness } = require('os');
const url = require('url');
const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');
///////////////////FILES//////////////////
// Blocking, Synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is what i know about avacado ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File is written");

//Non-Blocking asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("Error!");
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("Your file has been written :) ");
//       });
//     });
//   });
// });
// console.log("Will read file!");

///////////////////SERVER//////////////////

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
//   console.log(productData);
const dataObject = JSON.parse(data);

const slugs = dataObject.map((el) => slugify(el.productName, { lower: true }));
// console.log(slugify("Fresh Avocados", { lower: true }));
console.log(slugs);
const server = http.createServer((req, res) => {
  // console.log(url.parse(req.url));
  const { query, pathname } = url.parse(req.url, true);
  // const pathName = req.url;
  // console.log(query);
  //Overview Page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'content-type': 'text/html' });

    const cardHtml = dataObject
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
    res.end(output);

    //Product Page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'content-type': 'text/html' });
    const product = dataObject[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //API
  } else if (pathname === '/api') {
    // fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (err, data) => {
    //   const productData = JSON.parse(data);
    //   //   console.log(productData);
    res.writeHead('200', { 'content-type': 'application/json' });
    res.end(data);
    // });

    //Not Found
  } else {
    res.writeHead('404', {
      'content-type': 'text/html',
      'my-own-header': 'Hello World',
    });
    res.end('<h1>Message from Server</h1>');
  }
  //   res.end("Message from Server");
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Server is Loading');
});
