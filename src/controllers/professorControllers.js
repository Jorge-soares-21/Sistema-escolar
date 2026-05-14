const db = require("../config/db");

const jwt = require("jsonwebtoken");

// Listar professor.
exports.listarProfessor = async (req, res) => {
    try {
        const resultado = await db.query("SELECT * FROM professor");
        res.json(resultado.rows);
    } catch (erro) {
        res.status(500).json({erro: erro.message});
    }
};

// Criar professor.
exports.criarProfessor = async (req, res) => {
    const {nome, endereco, data_nascimento, telefone, login, senha, cpf} = req.body;

    try {
        // Verificar se o CPF já existe.
        const professorExistente = await db.query("SELECT * FROM professor WHERE cpf = $1", [cpf]);

        if (professorExistente.rows.length > 0) {
            return res.status(400).json({ message: "CPF já cadastrado" });
        }

        const resultado = await db.query("INSERT INTO professor (nome, endereco, data_nascimento, telefone, login, senha, cpf) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [nome, endereco, data_nascimento, telefone, login, senha, cpf]);

        res.json(resultado.rows[0]);

    } catch (erro) {
        res.status(500).json({erro: erro.message});
    }
};

// Validar login do Professor.
exports.loginProfessor = async (req, res) => {
    const {login, senha} = req.body;

    try {
        const resultado = await db.query("SELECT * FROM professor WHERE login = $1 AND senha = $2", [login, senha]);

        if (resultado.rows.length === 0) {
            return res.status(401).json({ message: "Login ou senha invalidos"});
        };

        const professor = resultado.rows[0];

        const token = jwt.sign({id: professor.id, tipo: "professor"}, "segredo", {expiresIn: "1h"})

        delete professor.senha;

        res.json({ token, usuario: professor});
    } catch (erro) {
        res.status(500).json({erro: erro.message});
    }
};

// Deletar professor.
exports.deletarProfessor = async (req, res) => {
    const {id} = req.params;

    try {
        await db.query("DELETE FROM professor WHERE id = $1", [id]);

        res.json({message: "Professor deletado com sucesso"});
    } catch (erro) {
        res.status(500).json({erro: erro.message});
    }
};