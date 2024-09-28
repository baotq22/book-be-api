const express = require('express')
const router = express.Router()
const fs = require("fs")
const crypto = require('crypto')
const {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const {
  createBookValidation,
  updateBookValidation,
  getBooksValidation,
} = require("../middlewares/validator");

router.get("/", getBooksValidation, getBooks);
router.post("/", createBookValidation, createBook);
router.put("/:bookId", updateBookValidation, updateBook);
router.delete("/:bookId", deleteBook);

module.exports = router