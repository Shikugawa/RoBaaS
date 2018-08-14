module.exports = {
  error: (req, res, message) => {
    res.json(JSON.stringify({
      status: false,
      code: req.statusCode,
      message: message
    }));
  }
}