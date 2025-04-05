const express = require("express")
let books = require("./booksdb.js")
let isValid = require("./auth_users.js").isValid
let users = require("./auth_users.js").users
const public_users = express.Router()

public_users.post("/register", (req, res) => {
  // Get the details from the request body
  const username = req.body.username
  const password = req.body.password

  // First check if the username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide username and password" })
  } else {
    // Check if the username already exists in your db
    if (isValid(username)) {
      // add new user to the users array
      users.push({ username: username, password: password })
      return res.send({ message: "Registration successful" })
    } else {
      return res.status(400).json({
        message: "This username is already taken. Please choose another.",
      })
    }
  }
})

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Get all the available books in the store
  try {
    return res.send(JSON.stringify(books, null, 4))
  } catch (e) {
    return res.status(500).json({ message: `Error fetching books: ${e}` })
  }
})

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  //Get a book by the ISBN number
  try {
    let isbnParam = req.params.isbn
    let isbn = Object.keys(books).find((isbn) => isbn === isbnParam)
    if (isbn) return res.send(JSON.stringify(books[isbn], null, 4))
    else return res.status(404).json({ message: "ISBN not found" })
  } catch (e) {
    return res.status(500).json({ message: `${e}` })
  }
})

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  //Get a book by the author name
  let author = req.params.author
  let authorBooks = Object.values(books).filter((book) =>
    book.author.toLowerCase().includes(author.toLowerCase())
  )
  // Check if any books were found for the author
  if (authorBooks.length > 0) {
    return res.send(JSON.stringify(authorBooks, null, 4))
  } else {
    return res.status(404).json({ message: "Author not found" })
  }
})

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  //Get a book by the book title
  let title = req.params.title
  let authorBooks = Object.values(books).filter((book) =>
    book.title.toLowerCase().includes(title.toLowerCase())
  )
  // Check if any books were found for the title
  if (authorBooks.length > 0) {
    return res.send(JSON.stringify(authorBooks, null, 4))
  } else {
    return res.status(404).json({ message: "Book not found" })
  }
})

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Get a book review by the isbn number
  let isbn = req.params.isbn
  let book = books[isbn]
  if (book) {
    return res.send(JSON.stringify(book.reviews, null, 4))
  } else {
    return res.status(404).json({ message: "ISBN not found" })
  }
})

module.exports.general = public_users
