const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // Check if the username is non-empty
  return username.trim() !== "";
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // Find the user with the matching username in the users array
  const user = users.find((user) => user.username === username);

  // If a user with the matching username is found, check if the password matches
  if (user && user.password === password) {
    return true; // Username and password match
  }

  return false; // Username and password do not match or user not found
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  // Retrieve login data from request body
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  // Check if the username is valid
  if (!isValid(username)) {
    return res.status(400).json({ error: "Invalid username" });
  }

  // Check if the username and password match the records
  if (authenticatedUser(username, password)) {
    // Store the user information in the session
    req.session.user = { username };

    // Send a success response
    res.status(200).json({ message: "Login successful" });
  } else {
    return res.status(401).json({ error: "Invalid credentials" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Check if the user is logged in and has a valid session
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "User not logged in" });
  }

  // Retrieve review data from request body
  const { review } = req.body;
  const username = req.session.user.username;

  // Retrieve ISBN from URL parameter
  const isbn = req.params.isbn;

  // Check if review data is provided
  if (!review) {
    return res.status(400).json({ error: "Review data is required" });
  }

  // Find the book in the `books` object based on the ISBN
  const book = books[isbn];

  // Check if the book exists
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  // Initialize the reviews object if it doesn't exist
  if (!book.reviews) {
    book.reviews = {};
  }

  // Check if the user has already reviewed the book
  if (book.reviews[username]) {
    // Modify the existing review by the same user
    book.reviews[username] = review;
    return res.status(200).json({ message: "Review modified successfully" });
  }

  // Add a new review by a different user
  const uniqueId = Object.keys(book.reviews).length + 1;
  book.reviews[username] = review;

  return res.status(200).json({ message: "Review added successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Check if the user is logged in and has a valid session
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "User not logged in" });
  }

  // Retrieve the username from the session
  const username = req.session.user.username;

  // Retrieve the ISBN from the URL parameter
  const isbn = req.params.isbn;

  // Find the book in the `books` object based on the ISBN
  const book = books[isbn];

  // Check if the book exists
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  // Check if the user has a review for the book
  if (!book.reviews || !book.reviews[username]) {
    return res.status(404).json({ error: "Review not found" });
  }

  // Delete the user's review for the book
  delete book.reviews[username];

  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
