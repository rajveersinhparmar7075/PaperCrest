const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./models/users");
const auth = require("./middleware/auth");
const adminAuth = require("./middleware/adminAuth");

const jwtSecret = process.env.ACCESS_TOKEN_SECRET;
//@route    Post api/auth/login
//@desc     Authenticate user & get token
//@access   Public
router.post("/login", (req, res) => {
  const username = req.body.username;
  const userpassword = req.body.password;
  const user = { username: username };
  User.findOne({ username: username }).then((user) => {
    if (!user) {
      return res.status(404).json({ username: "User not found" });
    }
    bcrypt.compare(userpassword, user.password).then((isMatch) => {
      if (isMatch) {
        jwt.sign(
          { id: user.id },
          jwtSecret,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res.status(400).json({ password: "Password incorrect" });
      }
    });
  });
});
//@route    Post api/auth/signup
//@desc     signup New User
//@access   Public
router.post("/signup", async (req, res) => {
  const username = req.body.username;
  const userpassword = await bcrypt.hash(req.body.password, 10);
  const rollno = req.body.rollno;
  const phone = req.body.phone;
  const fullname = req.body.fullname;
  User.findOne({ username: username }).then((user) => {
    if (user) {
      return res.status(400).json({ username: "User already exists" });
    } else {
      const newUser = new User({
        username: username,
        password: userpassword,
        rollno: rollno,
        phone: phone,
        fullname: fullname,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              jwt.sign(
                { id: user.id },
                jwtSecret,
                { expiresIn: 3600 },
                (err, token) => {
                  res.json({
                    success: true,
                    token: "Bearer " + token,
                  });
                }
              );
            })
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

//route    GET api/user/:id
//desc     Get user by id
//@access  Public
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.send(user);
  } catch (err) {
    res.send(err);
  }
});

//route    PUT api/user/:id
//desc     Update user by id
//@access  Private
router.put("/user/:id", auth, async (req, res) => {
  try {
    const userBody = {
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, 10),
      rollno: req.body.rollno,
      phone: req.body.phone,
      fullname: req.body.fullname,
    };
    const user = await User.findByIdAndUpdate(req.params.id, userBody, {
      new: true,
      runValidators: true,
    });
    res.send(user);
  } catch (err) {
    res.send(err);
  }
});

//route    GET api/user/all
//desc     Get all Users
//@access  Private only admin can access
router.get("/all", adminAuth, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.send(users);
  } catch (err) {
    res.send(err);
  }
});

//route    DELETE api/user/:id
//desc     DELETE user by id
//@access  Private only admin can access
router.delete("/user/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.send(user);
  } catch (err) {
    res.send(err);
  }
});

//@route    Post api/auth/addAdmin
//@desc     add New Admin User
//@access   Private only admin can access
router.post("/addAdmin", adminAuth, async (req, res) => {
  const username = req.body.username;
  const userpassword = await bcrypt.hash(req.body.password, 10);
  const rollno = req.body.rollno;
  const phone = req.body.phone;
  const fullname = req.body.fullname;
  User.findOne({ username: username }).then((user) => {
    if (user) {
      return res.status(400).json({ username: "User already exists" });
    } else {
      const newUser = new User({
        username: username,
        password: userpassword,
        rollno: rollno,
        phone: phone,
        fullname: fullname,
        isAdmin: true,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              jwt.sign(
                { id: user.id },
                jwtSecret,
                { expiresIn: 3600 },
                (err, token) => {
                  res.json({
                    success: true,
                    token: "Bearer " + token,
                  });
                }
              );
            })
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

module.exports = router;
