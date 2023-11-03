const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');

// Middleware para analisar o corpo da solicitação no formato JSON
app.use(express.json());

app.use(express.static(path.join(__dirname)));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'projeto'
});

connection.connect((error) => {
    if (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    } else {
        console.log('Conexão ao banco de dados estabelecida.');
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'consulta.html'));
});

app.post('/consultar', (req, res) => {
    const { cpfCnpj } = req.body;

    const query = 'SELECT * FROM encomendas WHERE remetente_cpf_cnpj = ?';
    connection.query(query, [cpfCnpj], (error, results) => {
        if (error) {
            console.error('Erro na consulta:', error);
            res.status(500).json({ error: 'Ocorreu um erro na consulta.' });
        } else {
            res.json(results); // Retorna os resultados como JSON
        }
    });
});

app.get('/admin', (req, res) => {
    if (req.query.key === 'admin') {
        res.sendFile(path.join(__dirname, 'admin.html'));
    } else {
        res.status(403).send('Acesso negado');
    }
});

app.post('/cadastrar-encomenda', (req, res) => {
    const {
        remetente_cpf_cnpj,
        numero_encomenda,
        data,
        nome,
        telefone,
        endereco,
        email,
        produto,
        quantidade,
        tipo,
        categoria,
        transporte,
        destinatario_cpf_cnpj,
        pagamento,
        seguro_adicional,
        valor_total,
        prazo_entrega
    } = req.body;

    const query = `
        INSERT INTO encomendas (remetente_cpf_cnpj, numero_encomenda, data, nome, telefone, endereco, email, produto, quantidade, tipo, categoria, transporte, destinatario_cpf_cnpj, pagamento, seguro_adicional, valor_total, prazo_entrega)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        remetente_cpf_cnpj,
        numero_encomenda,
        data,
        nome,
        telefone,
        endereco,
        email,
        produto,
        quantidade,
        tipo,
        categoria,
        transporte,
        destinatario_cpf_cnpj,
        pagamento,
        seguro_adicional,
        valor_total,
        prazo_entrega
    ];

    connection.query(query, values, (error, results) => {
        if (error) {
            console.error('Erro ao cadastrar encomenda:', error);
            res.status(500).json({ error: 'Ocorreu um erro no cadastro da encomenda.' });
        } else {
            res.status(200).json({ message: 'Encomenda cadastrada com sucesso.' });
        }
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor está ouvindo na porta ${port}`);
});
