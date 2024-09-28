const sendResponse = (res, statusCode, data, message) => {
  res.status(statusCode).json({
    status: statusCode >= 400 ? 'error' : 'success',
    message: message || '',
    data: data || null,
  });
};

module.exports = { sendResponse };