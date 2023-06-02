const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });
const BookController = require('../controllers/API/BookController');
const AuthController = require('../controllers/API/AuthController');
const storeBookValidation = require('../validations/API/Book/StoreBookValidation');
const passport = require('passport');
require('../config/passport-api')(passport);

router.post('/login', upload.any(), AuthController.login);
router.post('/signup', upload.any(), AuthController.signUp);
//secure route
router.get(
    '/profile',
    passport.authenticate('jwt', { session: false }),
    AuthController.profile
);

router.get('/books', BookController.getAllbooks);
router.get('/books/:id', BookController.getBookById);
router.post('/books', upload.any(), storeBookValidation, BookController.storeBook);
router.post('/books/:id', upload.any(), storeBookValidation, BookController.updateBook);
router.delete('/books/:id', BookController.deleteBook);

module.exports = router;