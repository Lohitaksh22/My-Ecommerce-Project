const verifyAdmin = (req, res, next) => {
  if (!req.user.roles.includes("Admin")) {
    return res.status(403).json({ msg: "Unauthorized: Admins only" })
  }
  next()
}

module.exports = verifyAdmin
