const Account = require('../models/Account')
const jwt = require('jsonwebtoken')


const registerAccount = async (req, res) => {
  try {
    const { username, email, password } = req.body;


    if (!username || !email || !password) {
      return res.status(400).json({ msg: 'All fields are required' });
    }


    const existingAccount = await Account.findOne({ email });
    if (existingAccount) {
      return res.status(409).json({ msg: 'Email already in use' });
    }


    const account = await Account.create({ username, email, password });


    res.status(201).json({
      msg: 'Account created successfully',
      account: {
        id: account._id,
        username: account.username,
        email: account.email
      }
    });

  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}

const loginAccount = async (req, res) => {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) return res.status(401).json({ msg: "Invalid credentials" })

    const foundAccount = await Account.findOne({ email })
    if (!foundAccount) return res.status(401).json({ msg: "Not a valid user" })

    const correctPassword = await foundAccount.comparePassword(password)
    if (!correctPassword) return res.status(401).json({ msg: "Incorrect Password" })
    else {
      const accessToken = jwt.sign(
        { "username": foundAccount.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      )
      const refreshToken = jwt.sign(
        { "username": foundAccount.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
      )

      foundAccount.lastLogin = new Date()
      foundAccount.refreshToken = refreshToken;
      await foundAccount.save();

      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000
      });

      res.status(202).json({
        msg: "Succesfully Logged In",
        foundAccount: {
          username: foundAccount.username,
          accessToken: accessToken,
          lastLogin: foundAccount.lastLogin
        }
      })

    }

  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err });
  }
}

const logoutAccount = async (req, res) => {
  try {
    const cookie = req.cookies;
    if (!cookie?.jwt) return res.sendStatus(204)
    const foundAccount = await Account.findOne({ refreshToken: cookie.jwt })
    if (!foundAccount) return res.sendStatus(204)

    foundAccount.refreshToken = '';
    await foundAccount.save();

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.status(204).json({ msg: "Successfully logged-out" })
  }
  catch (err) {
    res.status(500).json({ msg: "Server error" })
  }

}


const refreshAccount = async (req, res) => {
  try {
    const cookie = req.cookies
    if (!cookie?.jwt) return res.status(401).json({ msg: "User Timeout" })
    const foundAccount = await Account.findOne({ refreshToken: cookie.jwt })
    if (!foundAccount) return res.status(403).json({ msg: "Unauthorized" })
    const refreshToken = cookie.jwt

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err || foundAccount.username !== decoded.username) {
        return res.status(403).json({ msg: "Unauthorized" });
      }


      const accessToken = jwt.sign(
        { username: foundAccount.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      return res.status(200).json({ accessToken });
    });



  } catch (err) {
    res.status(500).json({ msg: "Server error" })
  }
}


const getSpecificAccount = async (req, res) => {
  try {
    const email = req.user.email;

    const foundAccount = await Account.findOne({ email });
    if (!foundAccount) return res.status(404).json({ msg: "Account not found" });

    res.status(201).json({
      msg: "Found Account",
      username: foundAccount.username,
      email: foundAccount.email,
      lastlogin: foundAccount.lastLogin
    })

  } catch (err) {
    console.err(err);
    res.sendStatus(404)
  }

}

const updateAccount = async (req, res) => {
  try {
    const email = req.user.email
    const foundAccount = await Account.findOne({ email });
    if (!foundAccount) return res.status(404).json({ msg: "Account not found" });

    const { newUsername, newEmail, newPassword } = req.body
    if (newUsername) foundAccount.username = newUsername;
    if (newEmail) foundAccount.email = newEmail;
    if (newPassword) foundAccount.password = newPassword; 

    if (!newUsername || !newEmail || !newPassword) return res.status(400).json({ msg: "Fill out atleast one credential" })

    await foundAccount.save()

    res.status(200).json({
      msg: "Account Updated",
      newUsername: foundAccount.username,
      newEmail: foundAccount.email
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: "Server Error" })
  }
}

const deleteAccount = async (req, res) => {
  try {
    const { username, email } = req.user
    if (!username || !email) return res.status(400).json({ msg: "Invalid" })

    const foundAccount = await Account.findOne({ username, email })
    if (!foundAccount) return res.status(404).json({ msg: "User not found" })

    await foundAccount.deleteOne()

    res.status(200).json({msg: `${username} has been deleted`})    



  } catch (err) {
    res.sendStatus(500)
  }
}


module.exports = { registerAccount, loginAccount, logoutAccount, refreshAccount, getSpecificAccount, updateAccount, deleteAccount }
