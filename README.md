# 📚 Express Book Reviews API

A comprehensive RESTful API for managing book reviews built with Node.js and Express.js. This application demonstrates modern backend development practices including JWT authentication, session management, and both synchronous and asynchronous programming patterns.

## 🌟 Features

### 📖 Book Management

- Browse a curated collection of classic literature
- Search books by ISBN, author, or title
- View detailed book information and reviews
- Access a preloaded database of 10 renowned books

### 👤 User Authentication

- Secure user registration and login system
- JWT-based authentication with session management
- Protected routes for authenticated users only
- User-specific review management

### ⭐ Review System

- Add personal book reviews (authenticated users)
- Modify your existing reviews
- Delete your own reviews
- View all reviews for any book
- User attribution for all reviews

### 🚀 Modern Async Patterns

- **Promise Callbacks**: Traditional `.then()/.catch()` implementations
- **Async-Await**: Modern async/await with try-catch error handling
- **Axios Integration**: HTTP client for external API simulation
- **Multiple Endpoints**: Both sync and async versions of core functionality

## 🛠 Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JSON Web Tokens (JWT)
- **Session Management**: express-session
- **HTTP Client**: Axios
- **Development**: Nodemon for auto-restart

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd expressBookReviews/final_project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Access the API**
   - Server runs on: `http://localhost:5000`
   - API is ready for testing with Postman or curl

## 📚 API Documentation

### Public Endpoints (No Authentication Required)

#### Books

- `GET /` - Get all books
- `GET /isbn/:isbn` - Get book by ISBN
- `GET /author/:author` - Get books by author
- `GET /title/:title` - Get books by title
- `GET /review/:isbn` - Get reviews for a book

#### Async Versions (Demonstrating Modern Patterns)

- `GET /async-promise` - Get all books (Promise callbacks)
- `GET /async-await` - Get all books (async-await)
- `GET /async-axios` - Get all books (Axios)
- `GET /isbn-promise/:isbn` - Get book by ISBN (Promise)
- `GET /isbn-async/:isbn` - Get book by ISBN (async-await)
- `GET /isbn-axios/:isbn` - Get book by ISBN (Axios)
- `GET /author-promise/:author` - Get books by author (Promise)
- `GET /author-async/:author` - Get books by author (async-await)
- `GET /author-axios/:author` - Get books by author (Axios)
- `GET /title-promise/:title` - Get books by title (Promise)
- `GET /title-async/:title` - Get books by title (async-await)
- `GET /title-axios/:title` - Get books by title (Axios)

#### User Management

- `POST /register` - Register a new user

### Protected Endpoints (Authentication Required)

#### Authentication

- `POST /customer/login` - User login (returns JWT token)

#### Reviews (Requires Authentication)

- `PUT /customer/auth/review/:isbn?review=text` - Add/modify review
- `DELETE /customer/auth/review/:isbn` - Delete your review

## 🔧 Usage Examples

### Register a New User

```bash
curl -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"username": "bookworm", "password": "securepass123"}'
```

### Login

```bash
curl -X POST http://localhost:5000/customer/login \
  -H "Content-Type: application/json" \
  -d '{"username": "bookworm", "password": "securepass123"}'
```

### Get All Books

```bash
curl http://localhost:5000/
```

### Search by Author

```bash
curl http://localhost:5000/author/Jane%20Austen
```

### Add a Review (Authenticated)

```bash
curl -X PUT "http://localhost:5000/customer/auth/review/1?review=Amazing%20classic!" \
  -H "Cookie: connect.sid=your-session-cookie"
```

## 📖 Sample Books Database

The application comes preloaded with 10 classic books:

1. **Things Fall Apart** - Chinua Achebe
2. **Fairy tales** - Hans Christian Andersen
3. **The Divine Comedy** - Dante Alighieri
4. **The Epic Of Gilgamesh** - Unknown
5. **The Book Of Job** - Unknown
6. **One Thousand and One Nights** - Unknown
7. **Njál's Saga** - Unknown
8. **Pride and Prejudice** - Jane Austen
9. **Le Père Goriot** - Honoré de Balzac
10. **Molloy, Malone Dies, The Unnamable, the trilogy** - Samuel Beckett

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Session Management**: Server-side session handling
- **User Isolation**: Users can only modify their own reviews
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses without data leakage

## 🎯 Learning Objectives

This project demonstrates:

- **RESTful API Design**: Proper HTTP methods and status codes
- **Authentication & Authorization**: JWT and session-based security
- **Async Programming**: Multiple async patterns and best practices
- **Error Handling**: Comprehensive error management
- **Code Organization**: Clean separation of concerns
- **Modern JavaScript**: ES6+ features and patterns

## 🙏 Acknowledgments

- Built as part of backend development learning curriculum fro IBM
- Inspired by classic literature and modern web development practices
- Demonstrates real-world API development patterns

---

**Thanks for reading the document! 📚**