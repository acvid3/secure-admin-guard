const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/userModel');
const { mongoURI } = require('./config');

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(mongoURI);

    const username = 'superadmin';
    const password = 'superadminpassword';

    let user = await User.findOne({ username });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({
        username,
        password: hashedPassword,
        role: 'superadmin'
      });

      await user.save();
      console.log('Superadmin created');
    } else {
      console.log('Superadmin already exists');
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating superadmin:', error);
    mongoose.disconnect();
  }
};

createSuperAdmin();
