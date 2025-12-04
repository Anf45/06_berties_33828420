const express = require("express");
const router = express.Router();

const db = global.db;

router.get("/books", function (req, res, next) {
  const searchRaw  = req.query.search;
  const minRaw     = req.query.minprice;
  const maxRaw     = req.query.max_price;   
  const sortRaw    = req.query.sort;

  let sqlquery   = "SELECT * FROM books";
  const params   = [];
  const whereClauses = [];

  if (searchRaw) {
    const keyword = req.sanitize ? req.sanitize(searchRaw) : searchRaw;
    whereClauses.push("name LIKE ?");
    params.push("%" + keyword + "%");
  }

  if (minRaw) {
    const minPrice = parseFloat(minRaw);
    if (!isNaN(minPrice)) {
      whereClauses.push("price >= ?");
      params.push(minPrice);
    }
  }

  if (maxRaw) {
    const maxPrice = parseFloat(maxRaw);
    if (!isNaN(maxPrice)) {
      whereClauses.push("price <= ?");
      params.push(maxPrice);
    }
  }

  if (whereClauses.length > 0) {
    sqlquery += " WHERE " + whereClauses.join(" AND ");
  }

  if (sortRaw === "name") {
    sqlquery += " ORDER BY name";
  } else if (sortRaw === "price") {
    sqlquery += " ORDER BY price";
  }

  db.query(sqlquery, params, (err, result) => {
    if (err) {
      res.json(err);
      return next(err);
    } else {
      res.json(result);
    }
  });
});

module.exports = router;
