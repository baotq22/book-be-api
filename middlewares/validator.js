const { body, query, param } = require('express-validator');

const createBookValidation = [
  body('author').notEmpty().withMessage('Author is required'),
  body('country').notEmpty().withMessage('Country is required'),
  body('imageLink').notEmpty().withMessage('Image link is required'),
  body('language').notEmpty().withMessage('Language is required'),
  body('pages').isInt({ min: 1 }).withMessage('Pages must be a positive integer'),
  body('title').notEmpty().withMessage('Title is required'),
  body('year').isInt().withMessage('Year must be an integer'),
];

const updateBookValidation = [
  param('bookId').notEmpty().withMessage('Book ID is required'),
  body('author').optional().notEmpty().withMessage('Author is required if provided'),
  body('country').optional().notEmpty().withMessage('Country is required if provided'),
  body('imageLink').optional().notEmpty().withMessage('Image link is required if provided'),
  body('language').optional().notEmpty().withMessage('Language is required if provided'),
  body('pages').optional().isInt({ min: 1 }).withMessage('Pages must be a positive integer'),
  body('title').optional().notEmpty().withMessage('Title is required if provided'),
  body('year').optional().isInt().withMessage('Year must be an integer'),
];

const getBooksValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
];

module.exports = {
  createBookValidation,
  updateBookValidation,
  getBooksValidation,
};
