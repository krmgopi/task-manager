// load mongoose
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// create a schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("password cannot contain 'password'");
      }
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    },
  },
  age: {
    type: Number,
    validate(value) {
      if (value < 0) {
        throw new Error("should not be an negative number");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// for jwt
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "thisisastring");

  // saving to db
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  // find user by email
  const user = await User.findOne({ email });

  // if no user is found
  if (!user) {
    throw new Error("unable to login");
  }

  // if user is found then compare password
  const isMatch = await bcrypt.compare(password, user.password);

  // if password not matches for that user then stop execution
  if (!isMatch) {
    throw new Error("unable to login");
  }
  return user;
};

// hash password using pre
userSchema.pre("save", async function (next) {
  const user = this;
  // console.log("just before saving");
  // do hashing here
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// data model for user
const User = mongoose.model("User", userSchema);

// export user model
module.exports = User;
