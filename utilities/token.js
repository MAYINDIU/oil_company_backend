const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
  const payload = {
    email: user.email,
    emptype: user?.emptype,
  };

  const options = {
    expiresIn: "24h",
  };

  const token = jwt.sign(payload, process.env.SECRET_KEY, options);

  return token;
};