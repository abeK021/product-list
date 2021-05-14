const router = require('express').Router();
const faker = require('faker');
const { db } = require('../models/products');
const Product = require('../models/products');

router.get('/generate-fake-data', (req, res, next) => {
  for (let i = 0; i < 90; i++) {
    const product = new Product();

    product.category = faker.commerce.department();
    product.name = faker.commerce.productName();
    product.price = faker.commerce.price();
    product.image = 'https://via.placeholder.com/250?text=Product+Image';

    product.save((err) => {
      if (err) throw err;
    });
  }
  res.end();
});

// gets product by product id but need to figure out error handling
router.get('/products/:productId', async (req, res) => {
  const passedInId = req.params.productId;

  const dbQuery = await Product.find(
    { _id: passedInId },
    (err, product) => err || product
  );
  res.json(dbQuery);
});



// gets products pagination, the route will look like /products?page=3
router.get('/products', (req, res, next) => {
  const perPage = 9;

  // return the first page by default
  const page = req.query.page || 1;

  Product.find({})
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec((err, products) => {
      // Note that we're not sending `count` back at the moment, but in the future we might want to know how many are coming back so we can figure out the number of pages
      Product.count().exec((err, count) => {
        if (err) return next(err);

        res.send(products);
      });
    });
});

module.exports = router;
