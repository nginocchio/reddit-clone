import Model from '../models/model';
const usersModel = new Model('users');
const { scryptSync, randomBytes } = require('crypto');
import { sign } from 'jsonwebtoken';

const salt = randomBytes(16).toString('hex');
export const genHash = (password) =>
  scryptSync(password, salt, 32).toString('hex');

export const validatePassword = (testPwd, validPwd) =>
  genHash(testPwd) === validPwd;

export const findUserById = async (id) => {
  try {
    let user = await usersModel.one(id);
    return user;
  } catch (err) {
    throw err;
  }
};

export const findUserByName = async (name) => {
  const query = `SELECT * FROM "users" WHERE username=$1`;
  try {
    let data = await usersModel.executeQuery(query, [name]);
    let user = data.rows ? data.rows[0] : null;
    return user;
  } catch (err) {
    throw err;
  }
};

export const issueToken = (id) => {
  return sign({ sub: id }, 'secret');
};

export const logInUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await findUserByName(username);
  // Invalid username or password
  if (!user || !validatePassword(password, user.password)) {
    res.status(401).json({ message: 'Invalid credentials' });
  }

  // Successful login
  const token = issueToken(user.id);
  res.status(200).json({
    user: user,
    token: token,
  });
};

export const registerUser = async (req, res) => {
  const { username, password } = req.body;
  const user = await findUserByName(username);
  if (user) {
    res.status(400).json({ message: 'Username already exists' });
  }
  const columns = `username, password`;
  const hashedPass = genHash(password);
  const values = `'${username}', '${hashedPass}'`;
  const data = await usersModel.insertWithReturn(columns, values);
  const newUser = data.rows[0];
  const token = issueToken(newUser.id);
  res.status(201).json({ user: newUser, token: token });
};
