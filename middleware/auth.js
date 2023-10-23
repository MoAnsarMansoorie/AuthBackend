const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
  console.log(req.cookies);
  const token = req.cookies;

  // what if token is not there
  if (!token) {
    return res.status(403).send("Not allowed to access || token");
  }

  // verify token
  try {
    const decode = jwt.verify(token, "123456");
    console.log(decode);
    req.user = decode; //custom req

    // extract id from token and query to db || in the mega project
    //
  } catch (err) {
    console.log(err);
    res.status(401).send("Token is invalid")
  }

  return next()
};

module.exports = auth
