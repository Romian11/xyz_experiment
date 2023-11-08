const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const hbs = require("hbs");
const path = require("path");
const app = express();


const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36",
  };

app.get("/compare", async (req, res) => {
    const input = "sSAMSUNG Galaxy S23 Ultra 5G (Phantom Black, 256 GB)";
  
    try {
      const [amazonResponse, flipkartResponse] = await Promise.all([
        axios.get(`https://www.amazon.in/s?k=${input}`, { headers: headers }),
        axios.get(`https://www.flipkart.com/search?q=${input}`, { headers: headers }),
      ]);
  
      const amazonProducts = parseAmazonProducts(amazonResponse.data);
      const flipkartProducts = parseFlipkartProducts(flipkartResponse.data);
      for (let i = 0; i < amazonProducts.length; i++) {
      const amazonProduct = amazonProducts[i];
      const flipkartProduct = flipkartProducts[i];
        
      const comparedProduct = {
        amazon_title: amazonProduct.amazon_title,
        flipkart_title: flipkartProduct.Flipkart_title,
        amazonPrice: amazonProduct.amazon_price ,   
        flipkart_Price: amazonProduct.flipkart_price    
      };
      console.log(comparedProduct)
    }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching data' });
    }
  });
  
  function parseAmazonProducts(html) {
    const $ = cheerio.load(html);
  
    const products = [];
  
    $('.s-result-item').each((index, element) => {
      const amazon_title = $(element).find('h2 span').text().trim();
      const amazon_price = $(element).find('.a-price-whole').first().text().trim();
      const url = $(element).find('a.a-link-normal').attr('href');
  
      products.push({
        amazon_title,
        amazon_price
        // url
      });
    });
//    console.log(products);
    return products;
  }
  function parseFlipkartProducts(html) {
    const $ = cheerio.load(html);
  
   
  
    const products =[]
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
      const Flipkart_title = productTitle;

      const flipkart_price = $(element).find('div[class*="_30jeq3"]').text();
      const flipkart_image = $(element).find("img[src]").attr("src");
      const flipkart_rating = $(element).find('div[class*="_3LWZlK"]').text();
      const halflink = $(element).find("a._1fQZEK").attr("href");

      const flipkart_link = "https://www.flipkart.com" + halflink;

      products.push({
        Flipkart_title,
        flipkart_price,
        flipkart_image ,
        flipkart_link,
        flipkart_rating
      });
    });
    // console.log(products);
    return products;
  }
    
  app.listen(3000);