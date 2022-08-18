const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");


var userSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    unique: true
  },
  isVarified:{
    type:Boolean,
    default:false
  },
  role: {
    type: Number,    //insta-fit admin-0
    default: 5      //gym admin-1  //branch admin-2 // branch programmer 3 // branch Instractor 4 // Member 5
  },
  pannelAccessId: {
    type: String,
    default: undefined
  },
  encry_password: {
    type: String,
    trim: true,
  },
  salt: String,
}, { timestamps: true });


userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  autheticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },

  securePassword: function (plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  }
};


module.exports = mongoose.model("User", userSchema);