exports.seed = async function (knex) {
  await knex('users').insert([
    {
      username: 'Larry',
      password: 'password',
      department: 'Sales'
    },
    {
      username: 'Moe',
      password: 'password',
      department: 'Marketing'
    },
    {
      username: 'Curly',
      password: 'password',
      department: 'Security'
    }
  ]);
};
