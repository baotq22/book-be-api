const fs = require("fs");
const crypto = require("crypto");
const {sendResponse} = require("../utils/sendResponse");
const {createError} = require("../utils/catchError");

const getBooks = async (req, res, next) => {
  const allowedFilter = ["author", "country", "language", "title", "page", "limit"];
  try {
    let { page, limit, ...filterQuery } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const filterKeys = Object.keys(filterQuery);
    filterKeys.forEach((key) => {
      if (!allowedFilter.includes(key)) {
        throw createError(401, `Query ${key} is not allowed`);
      }
      if (!filterQuery[key]) delete filterQuery[key];
    });

    let offset = limit * (page - 1);

    let db = fs.readFileSync("db.json", "utf-8");
    db = JSON.parse(db);
    const { books } = db;
    let result = [];

    if (filterKeys.length) {
      filterKeys.forEach((condition) => {
        result = result.length
          ? result.filter((book) => book[condition] === filterQuery[condition])
          : books.filter((book) => book[condition] === filterQuery[condition]);
      });
    } else {
      result = books;
    }

    result = result.slice(offset, offset + limit);

    sendResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
};

const createBook = async (req, res, next) => {
  try {
    const { author, country, imageLink, language, pages, title, year } = req.body;

    const newBook = {
      author,
      country,
      imageLink,
      language,
      pages: parseInt(pages) || 1,
      title,
      year: parseInt(year) || 0,
      id: crypto.randomBytes(4).toString("hex"),
    };

    let db = fs.readFileSync("db.json", "utf-8");
    db = JSON.parse(db);
    const { books } = db;

    books.push(newBook);
    db.books = books;
    db = JSON.stringify(db);
    fs.writeFileSync("db.json", db);

    sendResponse(res, 201, newBook, 'Book created successfully');
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const allowUpdate = ["author", "country", "imageLink", "language", "pages", "title", "year"];
    const { bookId } = req.params;
    const updates = req.body;
    const updateKeys = Object.keys(updates);

    const notAllow = updateKeys.filter((el) => !allowUpdate.includes(el));
    if (notAllow.length) {
      throw createError(401, `Update field not allowed`);
    }

    let db = fs.readFileSync("db.json", "utf-8");
    db = JSON.parse(db);
    const { books } = db;
    const targetIndex = books.findIndex((book) => book.id === bookId);
    if (targetIndex < 0) {
      throw createError(404, `Book not found`);
    }

    const updatedBook = { ...db.books[targetIndex], ...updates };
    db.books[targetIndex] = updatedBook;
    db = JSON.stringify(db);
    fs.writeFileSync("db.json", db);

    sendResponse(res, 200, updatedBook, 'Book updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const { bookId } = req.params;

    let db = fs.readFileSync("db.json", "utf-8");
    db = JSON.parse(db);
    const { books } = db;
    const targetIndex = books.findIndex((book) => book.id === bookId);
    if (targetIndex < 0) {
      throw createError(404, `Book not found`);
    }

    db.books = books.filter((book) => book.id !== bookId);
    db = JSON.stringify(db);
    fs.writeFileSync("db.json", db);

    sendResponse(res, 204); // No content for successful delete
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
};
