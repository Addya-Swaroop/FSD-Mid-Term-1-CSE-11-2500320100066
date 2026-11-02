
const express = require('express');

const app = express();

app.use(express.json());

let books = [];

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

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
