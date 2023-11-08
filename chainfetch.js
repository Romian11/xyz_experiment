const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const hbs = require("hbs");
const path = require("path");
const app = express();
const fs = require("fs");
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  // fetchDataFromAmazonAndFlipkart();
  res.render("fuck");
});

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
};

async function fetchDataFromAmazonAndFlipkart() {
  try {
    const [amazonResponse, flipkartResponse] = await axios.all([
      axios.get("https://www.amazon.in/s?k=APPLE iPhone 14 (Midnight, 128 GB)", { headers: headers }),
      axios.get("https://www.flipkart.com/search?q=APPLE iPhone 14 (Midnight, 128 GB)", {
        headers: headers,
      }),
    ]);

    const $1 = cheerio.load(amazonResponse.data);
    const $ = cheerio.load(flipkartResponse.data);

    const title1 = $('div[class*="_4rR01T"]').eq(0).text();
    const title2 = $(".IRpwTa").eq(0).text();
    const title3 = $(".s1Q9rs").eq(0).text();

    const isValidTitle1 = title1 && title1.trim() !== "";
    const isValidTitle2 = title2 && title2.trim() !== "";

    const productTitle = isValidTitle1
      ? title1
      : isValidTitle2
      ? title2
      : title3;
    const title = productTitle;

    const price = $('div[class*="_30jeq3"]').eq(0).text();
    const image = $("img[src]").eq(0).attr("src");
    const rating = $('div[class*="_3LWZlK"]').eq(0).text();
    const halflink = $("a._1fQZEK").eq(0).attr("href");

    const link = "https://www.flipkart.com" + halflink;
    console.log("flipkart price"+price);
    console.log("flipkart title"+title);
    console.log("flipkart rating"+rating);
    console.log("flipkart link"+link);

    
      const title4 = $1('.a-link-normal .a-text-normal').eq(0).text();
      const price1= $1('.a-price-whole').eq(0).text();
      const rating1 = $1('.a-icon-alt').eq(0).text();
      console.log("amazon price"+price1);
      console.log("amazon title"+title4);
      console.log("amazon rating"+rating1);
      // console.log(link);
       
      // products.push({
      //   title: title,
      //   price: price,
      //   rating: rating
      // });
      // products.shift();
      // console.log(products);
   
  } catch (error) {
    console.error(error);
  }
}

app.listen(port, () => {
  console.log("listening on port " + port);
});



// // // Usage:
// fetchDataFromAmazonAndFlipkart();
