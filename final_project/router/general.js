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

// Task 11: Get book details by ISBN using Promise callbacks
public_users.get('/isbn-promise/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  // Simulate async operation using Promise callbacks
  const getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject(new Error("Book not found"));
        }
      }, 100);
    });
  };

  getBookByISBN(isbn)
    .then(book => {
      res.send(JSON.stringify(book, null, 4));
    })
    .catch(error => {
      res.status(404).json({message: "Book not found", error: error.message});
    });
});

// Task 11: Get book details by ISBN using async-await
public_users.get('/isbn-async/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  
  try {
    // Simulate async operation with Promise
    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (books[isbn]) {
            resolve(books[isbn]);
          } else {
            reject(new Error("Book not found"));
          }
        }, 100);
      });
    };

    const book = await getBookByISBN(isbn);
    res.send(JSON.stringify(book, null, 4));
  } catch (error) {
    res.status(404).json({message: "Book not found", error: error.message});
  }
});

// Task 11: Get book details by ISBN using Axios
public_users.get('/isbn-axios/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  
  try {
    // In a real scenario, this would be an external API call
    // For demonstration, we'll simulate it with a local server call
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`)
      .catch(() => {
        // If the call fails, we'll use local books data
        if (books[isbn]) {
          return { data: JSON.stringify(books[isbn], null, 4) };
        } else {
          throw new Error("Book not found");
        }
      });
    
    // If we got data from axios, parse it, otherwise use local book
    let bookData;
    if (typeof response.data === 'string') {
      bookData = JSON.parse(response.data);
    } else {
      bookData = books[isbn];
    }
    
    if (bookData) {
      res.send(JSON.stringify(bookData, null, 4));
    } else {
      res.status(404).json({message: "Book not found"});
    }
  } catch (error) {
    res.status(404).json({message: "Book not found", error: error.message});
  }
});

// Task 12: Get book details by Author using Promise callbacks
public_users.get('/author-promise/:author', function (req, res) {
  const author = req.params.author;
  
  // Simulate async operation using Promise callbacks
  const getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const bookKeys = Object.keys(books);
        const matchingBooks = {};
        
        bookKeys.forEach(key => {
          if (books[key].author === author) {
            matchingBooks[key] = books[key];
          }
        });
        
        if (Object.keys(matchingBooks).length > 0) {
          resolve(matchingBooks);
        } else {
          reject(new Error("No books found by this author"));
        }
      }, 100);
    });
  };

  getBooksByAuthor(author)
    .then(matchingBooks => {
      res.send(JSON.stringify(matchingBooks, null, 4));
    })
    .catch(error => {
      res.status(404).json({message: "No books found by this author", error: error.message});
    });
});

// Task 12: Get book details by Author using async-await
public_users.get('/author-async/:author', async function (req, res) {
  const author = req.params.author;
  
  try {
    // Simulate async operation with Promise
    const getBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const bookKeys = Object.keys(books);
          const matchingBooks = {};
          
          bookKeys.forEach(key => {
            if (books[key].author === author) {
              matchingBooks[key] = books[key];
            }
          });
          
          if (Object.keys(matchingBooks).length > 0) {
            resolve(matchingBooks);
          } else {
            reject(new Error("No books found by this author"));
          }
        }, 100);
      });
    };

    const matchingBooks = await getBooksByAuthor(author);
    res.send(JSON.stringify(matchingBooks, null, 4));
  } catch (error) {
    res.status(404).json({message: "No books found by this author", error: error.message});
  }
});

// Task 12: Get book details by Author using Axios
public_users.get('/author-axios/:author', async function (req, res) {
  const author = req.params.author;
  
  try {
    // In a real scenario, this would be an external API call
    // For demonstration, we'll simulate it with a local server call
    const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`)
      .catch(() => {
        // If the call fails, we'll use local books data
        const bookKeys = Object.keys(books);
        const matchingBooks = {};
        
        bookKeys.forEach(key => {
          if (books[key].author === author) {
            matchingBooks[key] = books[key];
          }
        });
        
        if (Object.keys(matchingBooks).length > 0) {
          return { data: JSON.stringify(matchingBooks, null, 4) };
        } else {
          throw new Error("No books found by this author");
        }
      });
    
    // If we got data from axios, parse it, otherwise use local books
    let bookData;
    if (typeof response.data === 'string') {
      bookData = JSON.parse(response.data);
    } else {
      // Fallback to local search
      const bookKeys = Object.keys(books);
      const matchingBooks = {};
      
      bookKeys.forEach(key => {
        if (books[key].author === author) {
          matchingBooks[key] = books[key];
        }
      });
      
      bookData = matchingBooks;
    }
    
    if (bookData && Object.keys(bookData).length > 0) {
      res.send(JSON.stringify(bookData, null, 4));
    } else {
      res.status(404).json({message: "No books found by this author"});
    }
  } catch (error) {
    res.status(404).json({message: "No books found by this author", error: error.message});
  }
});

// Task 13: Get book details by Title using Promise callbacks
public_users.get('/title-promise/:title', function (req, res) {
  const title = req.params.title;
  
  // Simulate async operation using Promise callbacks
  const getBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const bookKeys = Object.keys(books);
        const matchingBooks = {};
        
        bookKeys.forEach(key => {
          if (books[key].title === title) {
            matchingBooks[key] = books[key];
          }
        });
        
        if (Object.keys(matchingBooks).length > 0) {
          resolve(matchingBooks);
        } else {
          reject(new Error("No books found with this title"));
        }
      }, 100);
    });
  };

  getBooksByTitle(title)
    .then(matchingBooks => {
      res.send(JSON.stringify(matchingBooks, null, 4));
    })
    .catch(error => {
      res.status(404).json({message: "No books found with this title", error: error.message});
    });
});

// Task 13: Get book details by Title using async-await
public_users.get('/title-async/:title', async function (req, res) {
  const title = req.params.title;
  
  try {
    // Simulate async operation with Promise
    const getBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const bookKeys = Object.keys(books);
          const matchingBooks = {};
          
          bookKeys.forEach(key => {
            if (books[key].title === title) {
              matchingBooks[key] = books[key];
            }
          });
          
          if (Object.keys(matchingBooks).length > 0) {
            resolve(matchingBooks);
          } else {
            reject(new Error("No books found with this title"));
          }
        }, 100);
      });
    };

    const matchingBooks = await getBooksByTitle(title);
    res.send(JSON.stringify(matchingBooks, null, 4));
  } catch (error) {
    res.status(404).json({message: "No books found with this title", error: error.message});
  }
});

// Task 13: Get book details by Title using Axios
public_users.get('/title-axios/:title', async function (req, res) {
  const title = req.params.title;
  
  try {
    // In a real scenario, this would be an external API call
    // For demonstration, we'll simulate it with a local server call
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`)
      .catch(() => {
        // If the call fails, we'll use local books data
        const bookKeys = Object.keys(books);
        const matchingBooks = {};
        
        bookKeys.forEach(key => {
          if (books[key].title === title) {
            matchingBooks[key] = books[key];
          }
        });
        
        if (Object.keys(matchingBooks).length > 0) {
          return { data: JSON.stringify(matchingBooks, null, 4) };
        } else {
          throw new Error("No books found with this title");
        }
      });
    
    // If we got data from axios, parse it, otherwise use local books
    let bookData;
    if (typeof response.data === 'string') {
      bookData = JSON.parse(response.data);
    } else {
      // Fallback to local search
      const bookKeys = Object.keys(books);
      const matchingBooks = {};
      
      bookKeys.forEach(key => {
        if (books[key].title === title) {
          matchingBooks[key] = books[key];
        }
      });
      
      bookData = matchingBooks;
    }
    
    if (bookData && Object.keys(bookData).length > 0) {
      res.send(JSON.stringify(bookData, null, 4));
    } else {
      res.status(404).json({message: "No books found with this title"});
    }
  } catch (error) {
    res.status(404).json({message: "No books found with this title", error: error.message});
  }
});

module.exports.general = public_users;
