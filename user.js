const mongoose = require('mongoose');

// Mongoose Schema for users collection in studentDB
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const UserModel = mongoose.model('User', userSchema);

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  async register() {
    // Check if username already exists
    const existing = await UserModel.findOne({ username: this.username });
    if (existing) {
      throw new Error('Username already exists');
    }

    // Save new user (plain password as per task requirements)
    const newUser = new UserModel({
      username: this.username,
      password: this.password
    });

    await newUser.save();
    return { message: 'User registered successfully' };
  }

  async login() {
    // Find user in MongoDB
    const user = await UserModel.findOne({ username: this.username });
    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Compare password
    if (user.password !== this.password) {
      throw new Error('Invalid username or password');
    }

    return { message: 'Login successful', username: user.username };
  }
}

module.exports = { User, UserModel };