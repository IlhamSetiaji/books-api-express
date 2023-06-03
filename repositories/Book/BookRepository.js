const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const BookRepository = class {
    constructor() {
        this.book = prisma.book;
    }

    getAllBooks = async () => {
        const books = await this.book.findMany({
            include: {
                user: true,
            },
        });
        return books;
    }

    storeBook = async (data) => {
        const book = await this.book.create({
            data: {
                title: data.title,
                userId: data.userId,
                description: data.description,
                publisher: data.publisher,
                price: parseInt(data.price),
            },
        });
        return book;
    }

    findBookById = async (id) => {
        const book = await this.book.findUnique({
            where: {
                id: parseInt(id),
            },
        });
        return book;
    }

    updateBook = async (id, data) => {
        const book = await this.book.update({
            where: {
                id: parseInt(id),
            },
            data: {
                title: data.title,
                userId: data.userId,
                description: data.description,
                publisher: data.publisher,
                price: parseInt(data.price),
            },
        });
        return book;
    }

    deleteBook = async (id) => {
        const book = await this.book.delete({
            where: {
                id: parseInt(id),
            },
        });
        return book;
    }
}

module.exports = BookRepository;