const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const path = require("path");
const bcrypt = require("bcrypt");
const fsPromises = require("fs").promises;

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    return res
      .status(400)
      .json({ "message": "Username and Password required" });
  }

  const duplicate = usersDB.users.find((person) => person.username == user);
  if (duplicate) return res.status(409);
  try {
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const newUser = { "username": user, "password": hashedPwd };
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    res.status(201).json({ "message": `New user ${user} created` });
    console.log(usersDB.users);
  } catch (err) {
    res.status(501).json({ "message": err.message });
  }
};

module.exports = { handleNewUser };
