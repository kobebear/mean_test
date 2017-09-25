var express = require('express');
var router = express.Router();
var index=require("../controllers/index.controller");

/* GET home page. */
router.get('/',index.render);

module.exports = router;
