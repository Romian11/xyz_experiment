const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const hbs = require("hbs");
const path = require("path");
const app = express();
const fs = require("fs");
const port = process.env.PORT || 3000;
const { URL } = require("url");
const querystring = require("querystring");

const partial_path = path.join(__dirname, "./views/partials");
app.use(express.static("./public"));
hbs.registerPartials(partial_path);
app.set("view engine", hbs);

app.set("views", "./views");

app.set("views", path.join(__dirname, "./views"));

const exphbs = require("express-handlebars");
const { url } = require("inspector");
// const { hasClass } = require("cheerio/lib/api/attributes");
app.set("view engine", "hbs");

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
};


app.get("/", (req, res) => {
  const url = `https://www.flipkart.com/search`;
  axios
    .get(url, {header:headers})
    .then((response) => {
      if (response.status === 200) {
        const $ = cheerio.load(response.data);

        const products = [];
        $("div[data-id]")
          .map((index, element) => {
            const title1 = $(element).find('div[class*="_4rR01T"]').text();
            const title2 = $(element).find(".IRpwTa").text();
            const title3 = $(element).find(".s1Q9rs").text();

            const isValidTitle1 = title1 && title1.trim() !== "";
            const isValidTitle2 = title2 && title2.trim() !== "";

            const productTitle = isValidTitle1
              ? title1
              : isValidTitle2
              ? title2
              : title3;
            const title = productTitle;

            const price = $(element).find('div[class*="_30jeq3"]').text();
            const image = $(element).find("img[src]").attr("src");
            const rating = $(element).find('div[class*="_3LWZlK"]').text();
            const halflink = $(element).find("a._1fQZEK").attr("href");
            const halflink2 = $(element).find("a.s1Q9rs").attr("href");
            const halflink3 = $(element).find("a._2UzuFa").attr("href");
            const halflink4 = $(element)
              .find('div[class*="_4rR01T"]')
              .attr("href");
            const isValidLink = halflink && halflink.trim() !== "";
            const isValidLink2 = halflink2 && halflink2.trim() !== "";
            const isValidLink3 = halflink3 && halflink3.trim() !== "";
            const productLink = isValidLink
              ? halflink
              : isValidLink2
              ? halflink2
              : isValidLink3
              ? halflink3
              : halflink4;
            const link = "https://www.flipkart.com" + productLink;

            products.push({ title, price, image, rating, link });
          })
          .get();

        res.render("index.hbs", { products });
      } else {
        res.status(response.status).send("Request failed");
      }
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
