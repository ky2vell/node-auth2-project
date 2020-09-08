const db = require('../data/config');

function getUsers() {
  return db('users').select('id', 'username', 'department');
}

function findById(id) {
  return db('users').where({ id }).first();
}

function findUser(username) {
  return db('users')
    .select('id', 'username', 'password', 'department')
    .where(username);
}

function add(newUser) {
  return db('users')
    .insert(newUser)
    .then(id => findById(id[0]));
}

module.exports = { getUsers, findUser, add };
