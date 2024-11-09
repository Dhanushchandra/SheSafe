exports.verifyUser = async (req, res, next) => {
  if (req.id !== req.params.uid) {
    return res.status(401).send({
      auth: false,
      error: "You are not authorized to access this data.",
    });
  }
  next();
};
