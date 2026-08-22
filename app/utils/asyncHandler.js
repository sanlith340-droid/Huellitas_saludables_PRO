/**
 * utils/asyncHandler.js
 * ---------------------------------------------------------
 * Envuelve controllers async para que cualquier error (rechazo
 * de promesa) se pase automaticamente a next(err), y termine
 * en el middlewares/errorHandler.js central, sin necesidad de
 * try/catch repetido en cada controller.
 * ---------------------------------------------------------
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
