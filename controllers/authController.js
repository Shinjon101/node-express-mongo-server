const User = require("../model/User");

const jwt = require("jsonwebtoken");
require("dotenv").config();
const path = require("path");

const bcrypt = require("bcrypt");
const fsPromises = require("fs").promises;

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res
      .status(400)
      .json({ "message": "Username and Password required" });
  }
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser)
    return res.sendStatus(401).json({ "message": "unauthorized" });

  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    //JWT

    const accessToken = jwt.sign(
      { "username": foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    const refreshToken = jwt.sign(
      { "username": foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const otherUsers = usersDB.users.filter(
      (person) => person.username != foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };
    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      //sameSite: "None",
      //secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};
module.exports = { handleLogin };
