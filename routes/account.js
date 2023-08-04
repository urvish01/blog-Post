const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const accountsModel = require('../db/accountsModel.js')
const mySequelize = require('../db/mySequelize.js');
const { Op, QueryTypes } = require('sequelize');
const config = require('../config.js');


let user = {};

// User signup
user.signUp = async(req, res) => {
  const { username, email, password } = req.body;

  if (!(email && password && username )) {
    res.status(400).send("All input is required");
  }
    
  //check if user already exist
  const accountExist = await accountsModel.findOne({
      where: {
        [Op.or]: [
          { username: username },
          { email: email },
        ],
      },
  });

  //return no need to create new account
  if(accountExist){
      return res.status(409).json({ 
          error: 'account allready existe please login',
          userName: accountExist.username,
          email: accountExist.email 
      });
  }

  //create new account
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user details to the database using the create method
    let result = await accountsModel.create({ username, email, password: hashedPassword });
    
    const token = jwt.sign({userId: result.dataValues.id },config.jwt.secret , {expiresIn: config.jwt.TokenExpireTime });

    result.token = token;
    return res.status(201).json({ message: 'User signed up successfully', user: result });

  } catch (err) {
    return res.status(500).json({ error: 'Error while signing up' });
  }
};


// User login
user.login = async(req, res) => {
  const { email, password } = req.body;

  //email and password requires
  if (!(email && password )) {
    res.status(400).send("All input is required");
  }
  
  // Check if the user exists in the database
  const query = 'SELECT * FROM accounts WHERE email = ?';
  const result = await mySequelize.query(
    query, 
    {
      type: QueryTypes.SELECT,
      replacements: [ email ]
    }
  ).catch((err)=> {
    return res.status(500).json({ error: 'Error while fetching user', message: err.message });
  });

  if (result.length === 0) {
    return res.status(404).json({ error: 'User not found Please Create New Account' });
  }

  // Verify the password using bcrypt
  const hashedPassword = result[0].password;
  const isPasswordValid = await bcrypt.compare(password, hashedPassword);

  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid Password' });
  }
     
  //create jwt token
  const token = jwt.sign({ userId: result[0].id },config.jwt.secret , { expiresIn: config.jwt.TokenExpireTime });  
  return res.status(200).json({ message: 'Login successful', token });
};

// View Own Profile
user.myProfile =async (req, res) => {
  const { userId } = req.user;

  try {
    const query = " SELECT * FROM accounts  INNER JOIN posts ON posts.userId = accounts.id WHERE accounts.id = ? ";

    const result = await mySequelize.query(
      query, 
      {
        type: QueryTypes.SELECT,
        replacements: [ userId ]
      }
    ).catch((err)=> {
      return res.status(500).json({ error: 'Error while fetching user', message: err.message });
    });

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Error while fetching profile' });
  }
};

// View all profile
user.allProfiles = async(req, res) => {
  try {
    const query = " SELECT  id, username, email, createdAt FROM accounts ";

    const result = await mySequelize.query(
      query, 
      {
        type: QueryTypes.SELECT
      }
    ).catch((err)=> {
      return res.status(500).json({ error: 'Error while fetching user', message: err.message });
    });

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Error while fetching profile' });
  }

}
  

module.exports = user;