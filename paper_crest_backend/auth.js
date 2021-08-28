module.exports = function authToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const TOKEN = authHeader && authHeader.split(" ")[1];
  if (TOKEN == null) return res.sendStatus(401);

  jwt.verify(TOKEN, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
  // Bearer TOKEN
};
