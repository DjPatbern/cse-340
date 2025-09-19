const errorCont = {}

errorCont.triggerError = async function (req, res, next) {
  // Intentionally throw an error to exercise the error middleware.
  // This will bubble to the global error handler (next(err)) because routes are wrapped with handleErrors.
  throw new Error("Intentional 500 error for testing purposes")
}

module.exports = errorCont
