const { StatusCodes } = require("http-status-codes");

const errorMiddleware = (err, _req, res, _next) => {
  const { name, message } = err;
  switch (name) {
    case 'badRequest':
      res.status(StatusCodes.BAD_REQUEST).json({ message, code: StatusCodes.BAD_REQUEST })
      break;
    case 'NotFoundError':
      res.status(StatusCodes.NOT_FOUND).json({ message, code: StatusCodes.NOT_FOUND })
      break;
    case 'ConflictError':
      res.status(StatusCodes.CONFLICT).json({ message, code: StatusCodes.CONFLICT })
      break;
    case 'UnauthorizedError': 
      res.status(StatusCodes.UNAUTHORIZED).json({ message, code: StatusCodes.UNAUTHORIZED });
      break;
    default:
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message, code: StatusCodes.INTERNAL_SERVER_ERROR })
      break;
  }
}

module.exports = {
  errorMiddleware
};
