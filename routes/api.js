const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });
const BookController = require('../controllers/API/BookController');
const storeBookValidation = require('../validations/API/Book/StoreBookValidation');

router.get('/books', BookController.getAllbooks);
router.post('/books', upload.any(), storeBookValidation, BookController.storeBook);
router.post('/books/:id', upload.any(), storeBookValidation, BookController.updateBook);
router.delete('/books/:id', BookController.deleteBook);

module.exports = router;