const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};


const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message    = err.message || "Internal Server Error";
  let errors     = null;

  if (err.name === "ValidationError") {
    statusCode = 422;
    message    = "Validation failed";
    errors     = Object.values(err.errors).map((e) => ({
      field:   e.path,
      message: e.message,
    }));
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate value for '${field}'`;
  }

  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    message    = `Invalid ID format: ${err.value}`;
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 413;
    message    = `File too large. Maximum allowed size is ${process.env.MAX_FILE_SIZE_MB || 5} MB`;
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    statusCode = 400;
    message    = "Unexpected file field in upload request";
  }

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    statusCode = 400;
    message    = "Malformed JSON in request body";
  }

  if (process.env.NODE_ENV === "development") {
    console.error(`[ERROR] ${statusCode} — ${message}`, err.stack || "");
  }

  const payload = { success: false, message };
  if (errors)                             payload.errors = errors;
  if (process.env.NODE_ENV === "development") payload.stack = err.stack;

  return res.status(statusCode).json(payload);
};

export { notFound, errorHandler };
