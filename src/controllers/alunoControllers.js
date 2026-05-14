const db = require("../config/db");

const jwt = require("jsonwebtoken");


// Listar alunos
exports.listarAlunos = async (req, res) => {
    try {
        const resultado = await db.query("SELECT * FROM aluno");
        res.json(resultado.rows);
    } catch (erro) {
        res.status(500).json({ erro: erro.message});
    }
};

// Gerar matrícula simples (ano + id)
function gerarMatricula(id) {
    const ano = new Date().getFullYear();
    return `${ano}${id}`;
};

// Gerar uma senha temporária de 6 digitos
function gerarSenha() {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Criar aluno
exports.criarAlunos = async (req, res) => {
    const {nome, endereco, data_nascimento, telefone, cpf} = req.body;
    try {
        // Verificar se o CPF já existe.
        const alunoExistente = await db.query("SELECT * FROM aluno WHERE cpf = $1", [cpf]);
        
        if (alunoExistente.rows.length > 0) {
            return res.status(400).json({ message: "CPF já cadastrado" });
        }

        // Criar aluno simples sem matricula e senha.
        const resultado = await db.query("INSERT INTO aluno (nome, endereco, data_nascimento, telefone, cpf) VALUES ($1, $2, $3, $4, $5) RETURNING id", [nome, endereco, data_nascimento, telefone, cpf]);

        const id = resultado.rows[0].id

        // Gerar matrícula e senha
        const matricula = gerarMatricula(id);
        const senha = gerarSenha();

        // Atulizar aluno com aluno com matrícula e senha.
        const alunoFinal = await db.query("UPDATE aluno SET matricula = $1, senha = $2 WHERE id = $3 RETURNING *", [matricula, senha, id]);

        res.json(alunoFinal.rows[0]);
    } catch (erro) {
        res.status(500).json({ erro: erro.message});
    }
}

// login do aluno.
exports.loginAluno = async (req, res) => {
    const {matricula, senha} = req.body

    try {
         const resultado = await db.query("SELECT * FROM aluno WHERE matricula = $1 AND senha = $2", [matricula, senha]);

         if (resultado.rows.length === 0) {
            return res.status(401).json({ message: "Matrícula ou senha invalidos"});
         }

         const aluno = resultado.rows[0];
         
         const token = jwt.sign({id: aluno.id, tipo: "aluno"}, "segredo", {expiresIn: "1h"});

         delete aluno.senha;

         res.json({ token, usuario: aluno});
    } catch (erro) {
        res.status(500).json({ erro: erro.message});
    }
}

// Função para deletar um aluno.
exports.deletarAluno = async (req, res) => {
    const {id} = req.params;

    try {
        // Deleta notas relacionadas ao aluno.
        await db.query(`DELETE FROM nota WHERE id_matricula IN (SELECT id FROM matricula WHERE id_aluno = $1)`, [id]);

        // Deleta matrículas relacionadas ao aluno.
        await db.query(`DELETE FROM matricula WHERE id_aluno = $1`, [id]);

        // Deleta o aluno.
        await db.query(`DELETE FROM aluno WHERE id = $1`, [id]);

        res.json({ message: "Aluno excluído com sucesso" });
    } catch (erro) {
        res.status(500).json({ erro: erro.message});
    }
}