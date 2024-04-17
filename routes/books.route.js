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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, author } = req.body;
    bookData.push({
        name, 
        author, 
        id: Math.random()
    });
     
});

module.exports = router;