const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',     // Endereço do servidor MySQL
  user: 'root',   // Nome de usuário do MySQL
  password: '123456', // Senha do MySQL
  database: 'projeto' // Nome do banco de dados
});

// Conectar ao banco de dados
connection.connect((error) => {
  if (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  } else {
    console.log('Conexão ao banco de dados estabelecida.');
  }
});

// Exporte a conexão para usá-la em outros módulos
module.exports = connection;
