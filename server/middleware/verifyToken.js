const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
  let token = req.cookies?.jwt


  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) return res.status(401).json({ msg: "No token, not authorized" })

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(403).json({ msg: "Token invalid or expired" })
  }
}

module.exports = verifyToken
