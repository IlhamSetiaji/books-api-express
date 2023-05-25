const BookRepository = require("../../repositories/Book/BookRepository");

const BookService = class {
    constructor() {
        this.bookRepository = new BookRepository();
    }
    
    getAllBooks = async () => {
        const books = await this.bookRepository.getAllBooks();
        return books;
    }

    storeBook = async (data) => {
        const book = await this.bookRepository.storeBook(data);
        return book;
    }

    findBookById = async (id) => {
        const book = await this.bookRepository.findBookById(id);
        return book;
    }

    updateBook = async (id, data) => {
        const book = await this.bookRepository.updateBook(id, data);
        return book;
    }

    deleteBook = async (id) => {
        const book = await this.bookRepository.deleteBook(id);
        return book;
    }
}

module.exports = BookService;