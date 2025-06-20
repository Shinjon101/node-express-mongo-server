/* const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};   MOCK LOCAL DATA BASE*/

const User = require("../model/User");

const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;

  if (!user || !pwd) {
    return res
      .status(400)
      .json({ "message": "Username and Password required" });
  }

  const duplicate = await User.findOne({ username: user }).exec();
  if (duplicate) return res.status(409);
  try {
    const hashedPwd = await bcrypt.hash(pwd, 10);

    const result = await User.create({
      "username": user,
      "password": hashedPwd,
    });
    console.log(result);
    res.status(201).json({ "message": `New user ${user} created` });
  } catch (err) {
    res.status(501).json({ "message": err.message });
  }
};

module.exports = { handleNewUser };
