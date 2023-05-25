const ResponseFormatter = require("../../helpers/ResponseFormatter");
const BookService = require("../../services/Book/BookService");

const BookController = class {
  constructor() {
    this.bookService = new BookService();
  }

  getAllbooks = async (req, res) => {
    try {
      const books = await this.bookService.getAllBooks();
      return ResponseFormatter.success(res, books, "Get all books success");
    } catch (error) {
      return ResponseFormatter.error(res, error, "Get all books failed", 400);
    }
  }

  getBookById = async (req, res) => {
    try {
      const { id } = req.params;
      const book = await this.bookService.findBookById(id);
      if (!book) {
        return ResponseFormatter.error(res, null, "Book not found", 404);
      }
      return ResponseFormatter.success(res, book, "Get book by id success");
    } catch (error) {
      return ResponseFormatter.error(res, error, "Get book by id failed", 400);
    }
  }

  storeBook = async (req, res) => {
    try {
      const payload = req.body;
      const book = await this.bookService.storeBook(payload);
      return ResponseFormatter.success(res, book, "Book stored successfully");
    } catch (error) {
      return ResponseFormatter.error(res, error, "Book stored failed", 400);
    }
  }

	updateBook = async (req, res) => {
		try {
			const { id } = req.params;
			const payload = req.body;
      const findBook = await this.bookService.findBookById(id);
      if (!findBook) {
        return ResponseFormatter.error(res, null, "Book not found", 404);
      }
      const book = await this.bookService.updateBook(id, payload);
      return ResponseFormatter.success(res, book, "Book updated successfully");
		} catch (error) {
      return ResponseFormatter.error(res, error, "Book updated failed", 400);
		}
	}

  deleteBook = async (req, res) => {
    try {
      const { id } = req.params;
      const findBook = await this.bookService.findBookById(id);
      if (!findBook) {
        return ResponseFormatter.error(res, null, "Book not found", 404);
      }
      const book = await this.bookService.deleteBook(id);
      return ResponseFormatter.success(res, book, "Book deleted successfully");
    } catch (error) {
      return ResponseFormatter.error(res, error, "Book deleted failed", 400);
    }
  }
};

module.exports = new BookController();
