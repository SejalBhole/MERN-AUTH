// function that will find the token from the cookie and from that tkeon it will find the userid

import jwt from "jsonwebtoken";



const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized. Login Again' });
    }

    try {
        //decoding token
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            req.body.userId = tokenDecode.id;        //userid is added to the request body
        } else {
            return res.json({ success: false, message: 'Not Authorized. Login Again' });
        }
        next();       // will call our controller function

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export default userAuth;