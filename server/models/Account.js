const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')


const accountSchema = new Schema({
  username: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    
  },

  password: {
    type: String,
    required: true,
    select: false
  },

  roles: {
    User: {
      type: [String],
      default: ["User"]
    }
  },

  refreshToken: {
    type: String
  },

  lastLogin: {
    type: Date,
    default: Date.now
  }


},
  { timestamps: true });


accountSchema.pre('save', async function (next) {

  if (!this.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (err) {
    next(err)
  }
});

accountSchema.methods.comparePassword = async function (pswrd) {
  return await bcrypt.compare(pswrd, this.password)
}



module.exports = mongoose.model('Account', accountSchema);