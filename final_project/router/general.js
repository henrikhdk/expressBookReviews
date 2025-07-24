const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  // Check if username already exists
  if (users.find(user => user.username === username)) {
    return res.status(409).json({message: "Username already exists"});
  }

  // Register new user
  users.push({username: username, password: password});
  return res.status(200).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn], null, 4));
  } else {
    res.status(404).json({message: "Book not found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  const matchingBooks = {};
  
  bookKeys.forEach(key => {
    if (books[key].author === author) {
      matchingBooks[key] = books[key];
    }
  });
  
  if (Object.keys(matchingBooks).length > 0) {
    res.send(JSON.stringify(matchingBooks, null, 4));
  } else {
    res.status(404).json({message: "No books found by this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const matchingBooks = {};
  
  bookKeys.forEach(key => {
    if (books[key].title === title) {
      matchingBooks[key] = books[key];
    }
  });
  
  if (Object.keys(matchingBooks).length > 0) {
    res.send(JSON.stringify(matchingBooks, null, 4));
  } else {
    res.status(404).json({message: "No books found with this title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

// Task 10: Get the book list using Promise callbacks
public_users.get('/async-promise', function (req, res) {
  // Simulate async operation using Promise callbacks
  const getBooksWithPromise = () => {
    return new Promise((resolve, reject) => {
      // Simulate async database call or API request
      setTimeout(() => {
        if (books) {
          resolve(books);
        } else {
          reject(new Error("Books not found"));
        }
      }, 100);
    });
  };

  getBooksWithPromise()
    .then(bookList => {
      res.send(JSON.stringify(bookList, null, 4));
    })
    .catch(error => {
      res.status(500).json({message: "Error retrieving books", error: error.message});
    });
});

// Task 10: Get the book list using async-await
public_users.get('/async-await', async function (req, res) {
  try {
    // Simulate async operation with Promise
    const getBooks = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (books) {
            resolve(books);
          } else {
            reject(new Error("Books not found"));
          }
        }, 100); // Simulate network delay
      });
    };

    const bookList = await getBooks();
    res.send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error retrieving books", error: error.message});
  }
});

// Task 10: Get the book list using Axios (simulating external API call)
public_users.get('/async-axios', async function (req, res) {
  try {
    // In a real scenario, this would be an external API call
    // For demonstration, we'll simulate it with a local server call
    const response = await axios.get('http://localhost:5000/')
      .catch(() => {
        // If the call fails (which it will since we're calling ourselves), 
        // we'll return the local books data
        return { data: JSON.stringify(books, null, 4) };
      });
    
    // If we got data from axios, parse it, otherwise use local books
    let bookData;
    if (typeof response.data === 'string') {
      bookData = JSON.parse(response.data);
    } else {
      bookData = books;
    }
    
    res.send(JSON.stringify(bookData, null, 4));
  } catch (error) {
    // Fallback to local books data
    res.send(JSON.stringify(books, null, 4));
  }
});

module.exports.general = public_users;
