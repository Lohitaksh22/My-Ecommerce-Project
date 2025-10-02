const verifyAdmin = (req, res, next) => {

  if (req.user.role !== "Admin") {
    return res.status(403).json({ msg: "Unauthorized: Admins only" })
  }
  next()
}

module.exports = verifyAdmin
