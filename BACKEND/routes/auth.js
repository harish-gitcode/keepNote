const express = require('express');
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var fetchuser = require('../controller/fetchuser.js');

const userValidator = () => {
    return [
        body('email', 'Enter a valid email').isEmail(),
        body('name', 'Enter a valid name').isLength({ min: 3, max: 40 }),
        body('password', 'Enter password of minimum 8 characters').isLength({ min: 6 })
            .matches(/\d/).withMessage("password must contain a number")
    ]
}
const loginValidator = () => {
    return [
        body('email', 'Enter a valid email').isEmail(),
        body('password', ' password cannot be blank').exists(),
    ]
}

router.post('/user', userValidator(), async (req, res) => {
    let success = false;
    // If there are errors, return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    // Check if the user with this email exists already
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ success, error: "Email Taken" })
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)
        // Create new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })
        const data = {
            user: { id: user.id }
        }
        const authtoken = jwt.sign(data, process.env.JWT_SECRET);
        success = true;
        res.json({ success, authtoken })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("some error occured");
    }
})

router.post('/login', loginValidator(), async (req, res) => {
    let success = false;
    // If there are errors, return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            success = false;
            return res.status(400).json({ success, errors: "Please try to login with correct credentials" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success = false;
            return res.status(400).json({ success, errors: "Please try to login with correct credentials" });
        }

        const data = {
            user: { id: user.id }
        }
        const authtoken = jwt.sign(data, process.env.JWT_SECRET);
        success = true;
        res.json({ success, authtoken })
    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Internal Server Error");
    }
})


router.get('/user', fetchuser, async (req, res) => {
    try {
        userId = req.user.id
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message)
        return res.status(500).send("Internal Server Error");
    }
})

module.exports = router;