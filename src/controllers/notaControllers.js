const db = require("../config/db");

// Lançar notas
exports.criarNota = async (req, res) => {
    const {id_matricula, valor_nota, valor_trabalho} = req.body;

    try {
        const resultado = await db.query(`INSERT INTO nota (id_matricula, valor_nota, valor_trabalho) VALUES ($1, $2, $3) RETURNING *`, [id_matricula, valor_nota, valor_trabalho]);

        res.json(resultado.rows[0]);
    } catch (erro) {
        res.status(500).json({erro: erro.message});
    }
};

// Listar notas
exports.listarNotas = async (req, res) => {
    try {
        const resultado = await db.query(`SELECT 
            n.id,
            a.nome AS aluno,
            d.nome AS disciplina,
            n.valor_nota,
            n.valor_trabalho,
            ROUND((n.valor_nota + n.valor_trabalho) / 2, 2) AS media,
            CASE 
            WHEN (n.valor_nota + n.valor_trabalho) / 2 >= 6 THEN 'Aprovado'
            ELSE 'Reprovado'
            END AS situacao
            FROM nota n
            JOIN matricula m ON n.id_matricula = m.id
            JOIN aluno a ON m.id_aluno = a.id
            JOIN disciplina d ON m.id_disciplina = d.id`);

            res.json(resultado.rows);
    } catch (erro) {
        res.status(500).json({ erro: erro.message});
    }
};

// Buscar notas por alunos.
exports.buscarNotasPorAluno = async (req, res) => {
    const {id} = req.params;
    try {
        const resultado = await db.query(`SELECT 
            d.nome AS disciplina,
            n.valor_nota,
            n.valor_trabalho,
            (n.valor_nota + n.valor_trabalho) / 2 AS media,
            CASE 
            WHEN (n.valor_nota + n.valor_trabalho) / 2 >= 6 THEN 'Aprovado'
            ELSE 'Reprovado'
            END AS situacao
            FROM nota n
            JOIN matricula m ON n.id_matricula = m.id
            JOIN disciplina d ON m.id_disciplina = d.id
            WHERE m.id_aluno = $1`, [id]);

        res.json(resultado.rows);
    } catch (erro) {
        res.status(500).json({ erro: erro.message});
    }
};

// Listar notas para professor.
exports.listarNotasParaProfessor = async (req, res) => {
    try {
        const resultado = await db.query(`SELECT 
            n.id,
            a.nome AS aluno,
            d.nome AS disciplina,
            n.valor_nota,
            n.valor_trabalho,
            ROUND((n.valor_nota + n.valor_trabalho) / 2, 2) AS media
        FROM nota n
        JOIN matricula m ON n.id_matricula = m.id
        JOIN aluno a ON m.id_aluno = a.id
        JOIN disciplina d ON m.id_disciplina = d.id
        ORDER BY a.nome
        `);

        res.json(resultado.rows);
    } catch (erro) {
        res.status(500).json({ erro: erro.message});
    }
};

// Atualizar nota
exports.atualizarNota = async (req, res) => {
    const {id} = req.params;
    const {valor_nota, valor_trabalho} = req.body;

    try {
        await db.query(`UPDATE nota SET valor_nota = $1, valor_trabalho = $2 WHERE id = $3`, [valor_nota, valor_trabalho, id]);

        res.json({ mensagem: "Nota atualizada com sucesso!"});
    } catch (erro) {
        res.status(500).json({ erro: erro.message});
    }
};