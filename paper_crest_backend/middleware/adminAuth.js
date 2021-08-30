const jwt = require("jsonwebtoken");
const jwtSecret = process.env.ACCESS_TOKEN_SECRET;

module.exports = async function (req, res, next) {
  //Get token from header
  const authHeader = req.headers["authorization"];
  const TOKEN = authHeader && authHeader.split(" ")[1];
  //Check if no token
  if (!TOKEN) {
    return res.status(401).json({
      msg: "No token, authorization denied",
    });
  }
  try {
    const decoded = jwt.verify(TOKEN, jwtSecret);
    console.log(decoded);
    const admin = await User.findOne({
      _id: decoded.id,
    });

    if (admin.isAdmin === false)
      return res.status(401).json({
        msg: "Not authorized to access this functionality",
      });

    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      msg: "Token is not valid",
    });
  }
};
