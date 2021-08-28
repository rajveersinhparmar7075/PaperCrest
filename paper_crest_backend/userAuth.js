const express = require("express");

const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("./connect");

const addNewUser = (userdata) => {
  var sql = `INSERT INTO users (username, password,fullname,rollno,phone) VALUES ('${userdata.username}', '${userdata.password}','${userdata.fullname}','${userdata.rollno}','${userdata.phone}')`;
  db.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      throw err;
    }
    console.log("Result: " + result);
    return result;
  });
};

//@route    Post api/auth/login
//@desc     Authenticate user & get token
//@access   Public
router.post("/login", (req, res) => {
  const isValidUser = (users, username) => {
    validuser = false;
    users.forEach((e) => {
      let data2 = {
        id: e.id,
        username: e.username,
        password: e.password,
        fullname: e.fullname,
        rollno: e.rollno,
        phone: e.phone,
      };
      console.log(data2.username == username);
      if (data2.username == username) {
        validuser = data2;
      }
    });

    return validuser;
  };
  const username = req.body.username;
  const userpassword = req.body.password;
  const user = { username: username };
  db.query("SELECT * FROM users", async function (err, result) {
    if (err) {
      console.error(err);
      throw err;
    } else {
      const valid = isValidUser(result, username);

      console.log(valid.password);
      if (valid) {
        const isMatch = await bcrypt.compare(userpassword, valid.password);
        if (isMatch) {
          const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
          res.json({ accessToken });
        } else {
          res.json({ return: "Incorrect password" });
        }
      } else {
        res.json({ return: "user not exist" });
      }
    }
  });
});
// add new user

router.post("/signup", async (req, res) => {
  const username = req.body.username;
  const userpassword = await bcrypt.hash(req.body.password, 10);
  const rollno = req.body.rollno;
  const phone = req.body.phone;
  const fullname = req.body.fullname;

  const user = {
    username: username,
    password: userpassword,
    rollno: rollno,
    phone: phone,
    fullname: fullname,
  };
  const usertoken = { username: username };
  console.log(user);
  addNewUser(user);

  const accessToken = jwt.sign(usertoken, process.env.ACCESS_TOKEN_SECRET);
  res.json({ accessToken });
});

module.exports = router;
