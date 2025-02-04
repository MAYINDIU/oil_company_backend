const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(process.cwd(), ".env") });

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database: process.env.DATABASE,
  bcrypt_salt_rounds: process.env.BCRYPT_ROUNDS,
  jwt: {
    accessTokenKey: process.env.JWT_ACCESS_TOKEN_SECRET_KEY,
    refreshTokenKey: process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  },
};

