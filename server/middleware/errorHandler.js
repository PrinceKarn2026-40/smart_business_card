function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV === 'development') {
    console.error(`[${status}] ${message}`, err.stack);
  }

  res.status(status).json({ success: false, message });
}

function notFound(req, res, next) {
  const err = new Error(`Not found: ${req.originalUrl}`);
  err.status = 404;
  next(err);
}

module.exports = { errorHandler, notFound };
