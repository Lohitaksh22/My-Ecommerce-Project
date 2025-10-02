const Account = require('../models/Account');
const jwt = require('jsonwebtoken');


const registerAccount = async (req, res) => {
  try {
    const { username, email, password, admin } = req.body;

    if (!username || !email || !password || !admin) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    const existingAccount = await Account.findOne({ email });
    if (existingAccount) return res.status(409).json({ msg: 'Email already in use' });

    const account = await Account.create({ username, email, password, roles: admin});

    res.status(201).json({
      msg: 'Account created successfully',
      account: {
        id: account._id,
        username: account.username,
        email: account.email,
        roles: admin
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


const loginAccount = async (req, res) => {
  try {
    const {username, email, password } = req.body;
    if (!username|| !email || !password) return res.status(401).json({ msg: "Invalid credentials" });

    const foundAccount = await Account.findOne({ email, username }).select("+password");
    if (!foundAccount) return res.status(401).json({ msg: "Not a valid user" });

    const correctPassword = await foundAccount.comparePassword(password);
    if (!correctPassword) return res.status(401).json({ msg: "Incorrect Password" });


     foundAccount.lastLogin = new Date()
     await foundAccount.save()
     
    const accessToken = jwt.sign(
      { id: foundAccount._id,  role: foundAccount.roles , username: foundAccount.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );


    const refreshToken = jwt.sign(
      { id: foundAccount._id,  role: foundAccount.roles , username: foundAccount.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    foundAccount.refreshToken = refreshToken;
    await foundAccount.save();


    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });


    console.log(foundAccount);

    res.status(202).json({ accessToken, username: foundAccount.username, lastLogin: foundAccount.lastLogin,  roles: foundAccount.roles });

  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err });
  }
};


const logoutAccount = async (req, res) => {
  try {
    const cookie = req.cookies;
    if (!cookie?.jwt) return res.sendStatus(204);

    const foundAccount = await Account.findOne({ refreshToken: cookie.jwt });
    if (!foundAccount) return res.sendStatus(204);

    foundAccount.refreshToken = '';
    await foundAccount.save();

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: false });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};


const refreshAccount = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;


    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      console.error("JWT verification error:", err.message);
      return res.sendStatus(403);
    }

    const user = await Account.findById(decoded.id);
    if (!user) return res.sendStatus(403);

    const accessToken = jwt.sign(
      { id: user._id, username: user.username, role: user.roles },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken });
  } catch (err) {
    console.error("Refresh token error:", err.message);
    res.sendStatus(403);
  }
};

const getSpecificAccount = async (req, res) => {
  try {
    const ID = req.user.id;
    const foundAccount = await Account.findById(ID)
    if (!foundAccount) return res.status(404).json({ msg: "Account not found" });

    res.status(200).json({
      msg: "Found Account",
      username: foundAccount.username,
      password: foundAccount.password,
      email: foundAccount.email,
      lastLogin: foundAccount.lastLogin
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(404);
  }
};


const updateAccount = async (req, res) => {
  try {
    const ID = req.user.id
    const foundAccount = await Account.findById(ID)
    if (!foundAccount) return res.status(404).json({ msg: "Account not found" });

    const { newUsername, newEmail, newPassword } = req.body;
    if (!newUsername && !newEmail && !newPassword)
      return res.status(400).json({ msg: "Fill out at least one field" });

    if (newUsername) foundAccount.username = newUsername;
    if (newEmail) foundAccount.email = newEmail;
    if (newPassword) foundAccount.password = newPassword;

    await foundAccount.save();

    res.status(200).json({
      msg: "Account Updated",
      newUsername: foundAccount.username,
      newEmail: foundAccount.email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
};


const deleteAccount = async (req, res) => {
  try {
    const ID = req.user.id
    const foundAccount = await Account.findById(ID)
    if (!foundAccount) return res.status(404).json({ msg: "User not found" });

    await foundAccount.deleteOne();

    res.status(200).json({ msg: `${username} has been deleted` });
  } catch (err) {
    res.sendStatus(500);
  }
}

const passwordCheck = async (req, res) => {
  try {
    const ID = req.user?.id
    const foundAccount = await Account.findById(ID).select("+password")
    if (!foundAccount) return res.status(404).json({ msg: "User not found" });

    const password = req.body.password
    if (!password) return res.status(404).json({ msg: "Incorrect Password" });
    const isMatch = await foundAccount.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ msg: "Incorrect Password" })
    }

    res.status(200).json({ msg: "Password Correct" })

  } catch (err) {
    res.sendStatus(500)
  }
}

module.exports = {
  registerAccount,
  loginAccount,
  logoutAccount,
  refreshAccount,
  getSpecificAccount,
  updateAccount,
  deleteAccount,
  passwordCheck
};
