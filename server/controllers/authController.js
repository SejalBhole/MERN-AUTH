import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/usermodel.js";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'missing details' });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: true, message: "user already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days expiry date for cookie
        });

        //SENDING WELCOME EMIAL
        try {

            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: email ,
                subject: 'Welcome to Sams Code',
                text: `Welcome to Sam's website. Your account has been created with email id: ${email}`,
            };

            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
        } catch (emailError) {
            console.error('Error sending email:', emailError.message);
        }


        return res.json({ success: true });


    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};





export const login = async (req, res) => {        //for login name is not reuired
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: 'Email and Password are required' })
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found/Invalid Email' })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid Password' })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000                            //7days expiry date for cookie
        });

        return res.json({ success: true });

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}



export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 0
        });

        return res.json({ success: true, message: 'Logged Out' });

    } catch (error) {
        res.json({ success: false, message: "Logged Out" })
    }

}

//send verification otp to the users email
export const sendVerifyOtp = async (req, res) => {
    try {

        console.log("Request headers:", req.headers); // Debug headers
        console.log("Request body:", req.body);      // Debug request body

        const { userId } = req.body;

        if (!userId) {
            return res.json({ success: false, message: "User ID is required" });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "User already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000)); // Generate 6-digit OTP

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 1-day expiration
        await user.save();

        try {
            const mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: "Account Verification OTP",
                text: `Your verification code is: ${otp}`,
            };

            await transporter.sendMail(mailOptions);
            console.log("Email sent successfully");
        } catch (emailError) {
            console.error("Error sending email:", emailError.message);
            return res.json({ success: false, message: "Failed to send OTP email" });
        }

        return res.json({ success: true, message: "Verification OTP sent successfully" });
    } catch (error) {
        console.error("Error in sendVerifyOtp:", error.message);
        res.json({ success: false, message: error.message });
    }
};



export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.json({ success: false, message: "Missing details" });
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.verifyOtp !== otp) {
            return res.json({ success: false, message: "Invalid OTP" });
        }

        if (user.verifyOtpExpireAt && user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP expired" });
        }

        // Mark account as verified
        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = null;
        await user.save();

        return res.json({ success: true, message: "Email verified successfully" });
    } catch (error) {
        console.error("Error in verifyEmail:", error.message);
        return res.json({ success: false, message: error.message });
    }
};
