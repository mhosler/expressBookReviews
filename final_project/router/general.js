const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  // Retrieve user registration data from request body
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  // Check if username already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(409).json({ error: "Username already exists" });
  }

  // Create a new user object
  const user = {
    username,
    password
  };

  // Save the user data to the array
  users.push(user);

  // Send a success response
  res.status(200).json({ message: "Registration successful" });
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
/*public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));

  //return res.status(300).json({message: "Yet to be implemented"});
});*/

public_users.get('/', async (req, res) => {
    try {
      // Simulating an asynchronous operation with setTimeout
      await delay(1000); // Simulating a delay of 1 second
  
      const books = await getBookList();
      res.send(books);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch book list' });
    }
  });
  
  // Function to delay execution
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Function to retrieve the book list
  function getBookList() {
    return new Promise((resolve, reject) => {
      // Simulating an asynchronous operation
      setTimeout(() => {
        resolve(books);
      }, 100); // Simulating a delay of 1 second
    });
  }
  
// Get book details based on ISBN
/*public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn])
  //return res.status(300).json({message: "Yet to be implemented"});
 });*/

 // Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
  
    try {
      // Simulating an asynchronous operation with setTimeout
      await delay(1000); // Simulating a delay of 1 second
  
      const bookDetails = await getBookDetails(isbn);
      if (bookDetails) {
        res.json(bookDetails);
      } else {
        res.status(404).json({ error: 'Book not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch book details' });
    }
  });
  
  // Function to delay execution
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Function to retrieve book details based on ISBN
  function getBookDetails(isbn) {
    return new Promise((resolve, reject) => {
      // Simulating an asynchronous operation
      setTimeout(() => {
        const book = books[isbn];
        resolve(book);
      }, 100); // Simulating a delay of 1 second
    });
  }
  
// Get book details based on author
/*public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  const matchingBooks = [];

  // Iterate over the books object to find matching books
  for (const bookId in books) {
    if (books.hasOwnProperty(bookId) && books[bookId].author === author) {
      matchingBooks.push(books[bookId]);
    }
  }

  // Send the matching books as the response
  res.json(matchingBooks);
  //return res.status(300).json({message: "Yet to be implemented"});
});*/

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
  
    try {
      // Simulating an asynchronous operation with setTimeout
      await delay(1000); // Simulating a delay of 1 second
  
      const matchingBooks = getBooksByAuthor(author);
      if (matchingBooks.length > 0) {
        res.json(matchingBooks);
      } else {
        res.status(404).json({ error: 'No books found for the author' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch book details' });
    }
  });
  
  // Function to delay execution
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // Function to retrieve matching books based on author
  function getBooksByAuthor(author) {
    const matchingBooks = Object.values(books).filter(book => book.author === author);
    return matchingBooks;
  }
// Get all books based on title
/*public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  const matchingBooks = [];

  // Iterate over the books object to find matching books
  for (const bookId in books) {
    if (books.hasOwnProperty(bookId) && books[bookId].title === title) {
      matchingBooks.push(books[bookId]);
    }
  }

  // Send the matching books as the response
  res.json(matchingBooks);
});*/

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
  
    try {
      const matchingBooks = await findBooksByTitle(title);
  
      if (matchingBooks.length > 0) {
        res.json(matchingBooks);
      } else {
        res.status(404).json({ error: 'No books found with the title' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch book details' });
    }
  });
  
  // Function to find books based on title using async-await
  function findBooksByTitle(title) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const matchingBooks = [];
  
        for (const bookId in books) {
          if (books.hasOwnProperty(bookId) && books[bookId].title === title) {
            matchingBooks.push(books[bookId]);
          }
        }
  
        resolve(matchingBooks);
      }, 100); // Simulating a delay of 1 second
    });
  }

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
  
    // Search for the book with the matching ISBN
    const book = books[isbn];
    
    // Check if the book is found
    if (book) {
      const reviews = book.reviews;
      res.json(reviews);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
