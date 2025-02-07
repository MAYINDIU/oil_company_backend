const ApiError = require("../../errors/APIError");
const userModel = require("./Users.model.js");
const db = require("../../config/db.js");
const sendResponse = require("../../utilities/sendResponse");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  passwordHash,
  passwordVerify,
} = require("../../utilities/passwordEncryption");
const config = require("../../config/db.js");
const catchAsync = require("../../utilities/catchAsync");
const { JWT_SECRET } = process.env;

function getAllUsers(req, res) {
  userModel.getAllUsers((err, users) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Fetched all users successfully",
        data: users,
      });
    }
  });
}

const register = async (req, res) => {
  try {
    const body = req.body;

    const { password } = body;
    const saltRounds = config.bcrypt_salt_rounds;
    const hashPassword = await bcrypt.hash(password, Number(saltRounds));

    const saveData = { ...body, password: hashPassword };

    // Save the user data to the database
    userModel.createUser(saveData, (err, result) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({
          success: true,
          message: "User registered successfully",
          userId: result.insertId,
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { ...data } = req.body;
  // console.log(id, data);
  userModel.updateUser(id, data, (err, user) => {
    if (err) {
      // console.log(err);
      throw new ApiError(500, err.message);
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User updated successfully",
        data: user,
      });
    }
  });
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;
  userModel.getUserById(id, (err, user) => {
    if (err) {
      throw new ApiError(500, err.message);
    } else {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User fetched successfully",
        data: user,
      });
    }
  });
};

const login = (req, res) => {
  const { email, password } = req.body; // Use 'email' instead of 'employee_id'

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  userModel.getUserByEmail(email, (error, user) => {
    if (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (!result) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // Generate JWT Token
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

      // Update last login time
      db.query(
        `UPDATE users SET last_login = NOW() WHERE id = ?`,
        [user.id],
        (updateErr) => {
          if (updateErr) {
            console.error("Error updating last login time:", updateErr);
          }
        }
      );

      return res.status(200).json({ message: "Login successful", token, user });
    });
  });
};

const userCheckPassword = catchAsync(async (req, res) => {
  const { ...data } = req.body;
  const { id } = req.params;
  const { password } = data;

  userModel.getUserById(id, async (err, user) => {
    if (err) throw new ApiError(500, err.message);
    else {
      if (user) {
        const passwordHashCheck = await passwordVerify(
          password,
          user?.password
        );
        if (!passwordHashCheck) {
          return sendResponse(res, {
            statusCode: 406,
            success: false,
            message: "Invalid Password",
          });
        }
      }
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Password matched Successfully",
      });
    }
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { ...data } = req.body;
  const hashPassword = await passwordHash(data?.password);
  // console.log(hashPassword);
  userModel
    .changePassword(id, hashPassword)
    .then((result) => {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: `Password changed successfully`,
        data: result,
      });
    })
    .catch((err) => {
      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: err.message,
      });
    });
});

module.exports = {
  getAllUsers,
  getSingleUser,
  register,
  updateUser,
  userCheckPassword,
  changePassword,
  login,
};
