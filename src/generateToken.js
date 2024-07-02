const { generateToken } = require('./utils/token');

const userId = 1;
const email = 'joao@example.com';
const role = 'admin'; 

const token = generateToken(userId, email, role);
console.log(token);