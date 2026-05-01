import { StatusCodes } from "http-status-codes";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Meeting } from "../models/meeting.model.js";

const getTokenFromRequest = (req) => {
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.slice(7);
    }
    return req.query.token || req.body.token || null;
};

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Please provide username and password" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User Not Found" });
        }

        let isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (isPasswordCorrect) {
            let token = crypto.randomBytes(20).toString("hex");
            user.token = token;
            await user.save();
            return res.status(StatusCodes.OK).json({ token, user: { name: user.name, username: user.username } });
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid Username or Password" });
        }

    } catch (e) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong: ${e}` });
    }
};

const register = async (req, res) => {
    const { name, username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(StatusCodes.CONFLICT).json({ message: "User already exists" }); // use CONFLICT (409)
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            username,
            password: hashedPassword
        });

        await newUser.save();

        res.status(StatusCodes.CREATED).json({ message: "User Registered" });

    } catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong: ${e}` });
    }
};

const getUserHistory = async (req, res) => {
    const token = getTokenFromRequest(req);

    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        }

        const meetings = await Meeting.find({ user_id: user.username });
        res.status(StatusCodes.OK).json(meetings);
    } catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong: ${e}` });
    }
};

const addToHistory = async (req, res) => {
    const token = getTokenFromRequest(req);
    const { meeting_code } = req.body;

    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
        }

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code
        });

        await newMeeting.save();

        res.status(StatusCodes.CREATED).json({ message: "Added code to history" });
    } catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong: ${e}` });
    }
};

const getMe = async (req, res) => {
    const token = getTokenFromRequest(req);
    try {
        const user = await User.findOne({ token }).select("name username");
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid token" });
        }
        res.status(StatusCodes.OK).json({ name: user.name, username: user.username });
    } catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong: ${e}` });
    }
};

export { login, register, getUserHistory, addToHistory, getMe };
