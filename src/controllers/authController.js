const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const registerUser = catchAsync(async (req, res) => {
    const { fullName, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError("A user with this email already exists", 409);
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = await User.create({
        fullName,
        email,
        passwordHash,
        role,
    });
    const token = generateToken(user._id, user.role);
    res.status(201).json({
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        },
        token,
    });
});
 

const loginUser = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.isActive) {
        throw new AppError("Invalid credentials", 401);
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new AppError("Invalid credentials", 401);
    }
    const token = generateToken(user._id, user.role);
    res.status(200).json({
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        },
        token,
    });
});


module.exports = { registerUser, loginUser };