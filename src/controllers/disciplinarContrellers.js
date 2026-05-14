const db = require("../config/db");

// Listar disciplinas.
exports.listarDisciplinas = async (req, res) => {
    try {
        const resultado = await db.query("SELECT * FROM disciplina");

        res.json(resultado.rows);
    } catch (erro) {
        res.status(500).json({ erro: erro.message});
    }
};

// Criar disciplinas.
exports.criarDisciplina = async (req, res) => {
    const { nome, carga_horaria} = req.body

    try {
        const resultado = await db.query("INSERT INTO disciplina (nome, carga_horaria) VALUES ($1, $2) RETURNING *", [nome, carga_horaria]);

        res.json(resultado.rows[0]);
    } catch (erro) {
        res.status(500).json({ erro: erro.message});
    }
};