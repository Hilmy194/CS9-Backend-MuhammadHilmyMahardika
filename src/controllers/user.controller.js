const userRepository = require("../repositories/user.repository");
const baseResponse = require("../utils/baseResponse.utils");
const bcrypt = require("bcrypt");
const { emailRegex, passwordRegex } = require("../utils/regex.util");

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body; // Ganti dari req.query ke req.body
  if (!name || !email || !password) {
    return baseResponse(res, false, 400, "Name, email, and password are required");
  }
  if (!emailRegex.test(email)) {
    return baseResponse(res, false, 400, "Invalid email format");
  }
  if (!passwordRegex.test(password)) {
    return baseResponse(res, false, 400, "Password must contain letters, numbers, and special characters, min 8 chars");
  }
  try {
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      return baseResponse(res, false, 400, "Email already used");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.createUser({ name, email, password: hashedPassword, balance: 0 });
    return baseResponse(res, true, 201, "User created", user);
  } catch (error) {
    return baseResponse(res, false, 500, "Error registering user", error);
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body; // Ganti dari req.query ke req.body
  if (!email || !password) {
    return baseResponse(res, false, 400, "Email and password are required");
  }
  try {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      return baseResponse(res, false, 401, "Invalid email or password");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return baseResponse(res, false, 401, "Invalid email or password");
    }
    return baseResponse(res, true, 200, "Login success", user);
  } catch (error) {
    return baseResponse(res, false, 500, "Error logging in", error);
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const user = await userRepository.getUserByEmail(req.params.email);
    if (!user) {
      return baseResponse(res, false, 404, "User not found");
    }
    return baseResponse(res, true, 200, "User found", user);
  } catch (error) {
    return baseResponse(res, false, 500, "Error retrieving user", error);
  }
};

exports.updateUser = async (req, res) => {
  const { id, name, email, password } = req.body;
  if (!id || !name || !email || !password) {
    return baseResponse(res, false, 400, "ID, name, email, and password are required");
  }
  if (!emailRegex.test(email)) {
    return baseResponse(res, false, 400, "Invalid email format");
  }
  if (!passwordRegex.test(password)) {
    return baseResponse(res, false, 400, "Password must contain letters, numbers, and special characters, min 8 chars");
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await userRepository.updateUser({ id, name, email, password: hashedPassword });
    if (!updatedUser) {
      return baseResponse(res, false, 404, "User not found");
    }
    return baseResponse(res, true, 200, "User updated", updatedUser);
  } catch (error) {
    return baseResponse(res, false, 500, "Error updating user", error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const result = await userRepository.deleteUser(req.params.id);
    if (!result || result.rowCount === 0) {
      return baseResponse(res, false, 404, "User not found");
    }
    return baseResponse(res, true, 200, "User deleted", result.payload);
  } catch (error) {
    return baseResponse(res, false, 500, "Error deleting user", error);
  }
};

exports.topUpUser = async (req, res) => {
  const { id, amount } = req.body; // Ganti dari req.query ke req.body juga jika dikirim via POST
  if (!id || amount == null) {
    return baseResponse(res, false, 400, "ID and amount are required");
  }
  if (amount <= 0) {
    return baseResponse(res, false, 400, "Amount must be greater than 0");
  }
  try {
    const updatedUser = await userRepository.topUpBalance(id, amount);
    if (!updatedUser) {
      return baseResponse(res, false, 404, "User not found");
    }
    return baseResponse(res, true, 200, "Top up successful", updatedUser);
  } catch (error) {
    return baseResponse(res, false, 500, "Error topping up", error);
  }
};
