const express = require('express');
const router = express.Router();
const bookData = require('../data/books.json');
const { check, validationResult } = require('express-validator'); 

router.get('/', (req, res) => {
    res.status(200).json(bookData);
});

router.post('/', [
    check('name', 'Book name is required').not().isEmpty(),
    check('author', 'Book author is required').not().isEmpty()
] ,(req,res) => {

});

module.exports = router;