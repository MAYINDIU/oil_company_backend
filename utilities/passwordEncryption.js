const bcrypt = require("bcryptjs");
const config = require("../config");

exports.passwordHash = async (password) =>
  await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

exports.passwordVerify = async (givenPassword, savedPassword) => {
  console.log(givenPassword, savedPassword);
  return await bcrypt.compare(givenPassword, savedPassword);
};
