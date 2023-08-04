const {  QueryTypes } = require('sequelize');
const postModel = require('../db/postModel')
const mySequelize = require('../db/mySequelize.js');

let post = {}

// Create a post
post.create = async(req, res) => {
  const { title, content } = req.body;
  const currentDate = Date.now();
  const userId = req.user.userId;

  // Save the post details to the database
  try{
    const result = await postModel.create({ title, content, userId, modifiedAt: currentDate });
    return res.status(201).json({ message: 'Post created successfully', result: result });

  } catch(err) {
    return res.status(500).json({ error: 'Error while creating post' });
  }

};

post.getPostById = async(req, res) => {
  const { userId } = req.user;

  const query = 'SELECT * FROM posts WHERE userId = ?';
  const result = await mySequelize.query(
    query, 
    {
      type: QueryTypes.SELECT,
      replacements: [ userId ]
    }
  ).catch((err)=> {
    return res.status(500).json({ error: 'Error while fetching Post By Id', message: err.message });
  });

  return res.status(200).json({myPost: result})
}

//Get All Post 
post.getAllPost = async(req, res) => {

  const query = 'SELECT * FROM posts ';
  const result = await mySequelize.query(
    query, 
    {
      type: QueryTypes.SELECT
    }
  ).catch((err)=> {
    return res.status(500).json({ error: 'Error while fetching Post By Id', message: err.message });
  });

  return res.status(200).json({myPost: result})
}

module.exports = post 