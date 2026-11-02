
const express = require('express');

const app = express();

app.use(express.json());

// Store books
let books = [];

// POST: Add a new book
app.post('/books', (req, res) => {
    const { id, title, author, category, quantity, available } = req.body || {};

    if (
        id === undefined || id === null ||
        !title || !author || !category ||
        quantity === undefined || available === undefined
    ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
        return res.status(400).json({
            message: "Quantity must be a non-negative integer"
        });
    }

    if (
        !Number.isInteger(available) ||
        available < 0 ||
        available > quantity
    ) {
        return res.status(400).json({
            message: "Available must be between 0 and quantity"
        });
    }

    const existingBook = books.find(book => book.id === id);

    if (existingBook) {
        return res.status(409).json({
            message: "Book ID already exists"
        });
    }

    const newBook = {
        id,
        title,
        author,
        category,
        quantity,
        available
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully!",
        book: newBook
    });
});

// GET: Retrieve all books
app.get('/books', (req, res) => {
    res.status(200).json({
        message: "Books retrieved successfully",
        books: books
    });
});

// GET: Retrieve a book by ID
app.get('/books/:id', (req, res) => {
    const id = Number(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json({
        message: "Book retrieved successfully",
        book: book
    });
});


// PUT: Update an existing book
app.put('/books/:id', (req, res) => {

    const id = Number(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, category, quantity, available } = req.body || {};

    if (!title || !author || !category ||
        quantity === undefined || available === undefined) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (!Number.isInteger(quantity) || quantity < 0) {
        return res.status(400).json({
            message: "Quantity must be a non-negative integer"
        });
    }

    if (!Number.isInteger(available) ||
        available < 0 || available > quantity) {
        return res.status(400).json({
            message: "Available must be between 0 and quantity"
        });
    }

    book.title = title;
    book.author = author;
    book.category = category;
    book.quantity = quantity;
    book.available = available;

    res.status(200).json({
        message: "Book updated successfully",
        book: book
    });
});

 // DELETE: Find and delete a specific book
app.delete('/books/:id', (req, res) => {

    const id = Number(req.params.id);

    const bookIndex = books.findIndex(book => book.id === id);

    if (bookIndex === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const book = books[bookIndex];

    if (book.available < book.quantity) {
        return res.status(400).json({
            message: "Book cannot be deleted because some copies are issued"
        });
    }

    books.splice(bookIndex, 1);

    res.status(200).json({
        message: "Book deleted successfully",
        book: book
    });
});

// GET: Search books by title
app.get('/search', (req, res) => {

    const title = req.query.title;

    if (!title) {
        return res.status(400).json({
            message: "Please provide a book title to search"
        });
    }

    const searchResults = books.filter(book =>
        book.title.toLowerCase().includes(title.toLowerCase())
    );

    if (searchResults.length === 0) {
        return res.status(404).json({
            message: "No books found matching the title"
        });
    }

    res.status(200).json({
        message: "Books found successfully",
        books: searchResults
    });
});


// POST: Issue a book
app.post('/api/book/:id/issue', (req, res) => {

    const id = Number(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (book.available <= 0) {
        return res.status(400).json({
            message: "No copies available to issue"
        });
    }

    book.available--;

    res.status(200).json({
        message: "Book issued successfully",
        book: book
    });
});


// POST: Return a book
app.post('/api/book/:id/return', (req, res) => {

    const id = Number(req.params.id);

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    if (book.available >= book.quantity) {
        return res.status(400).json({
            message: "All copies are already available"
        });
    }

    book.available++;

    res.status(200).json({
        message: "Book returned successfully",
        book: book
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
