const db = require("../config/db");

// Criar matricula (ligar aluno com disciplina)

exports.criarMatricula = async (req, res) => {
    const {id_aluno, id_disciplina} = req.body;

    try {
        // Bloquear duplicidade de matricula.
        const existe = await db.query("SELECT * FROM matricula WHERE id_aluno = $1 AND id_disciplina = $2", [id_aluno, id_disciplina]);

        if (existe.rows.length > 0) {
            return res.status(400).json({ message: "Aluno já está matriculado nessa disciplina." });
        };

        const resultado = await db.query("INSERT INTO matricula (id_aluno, id_disciplina) VALUES ($1, $2) RETURNING *", [id_aluno, id_disciplina]);

        res.json(resultado.rows[0]);
    } catch (erro) {
        res.status(500).json({ erro: erro.message});
    }
};

// Listar matricula com dados completos.

exports.listarMatriculas = async (req, res) => {
    try {
        const resultado = await db.query(`SELECT 
  a.id,
  a.nome,
  CASE 
    WHEN m.id IS NOT NULL THEN true
    ELSE false
  END AS matriculado
FROM aluno a
LEFT JOIN matricula m ON a.id = m.id_aluno;`);

            res.json(resultado.rows);
    } catch (erro) {
        res.status(500).json({ erro: erro.message});
    }
};

// Listar matriculas do professor.
exports.listarMatriculasProfessor = async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT 
        m.id,
        a.nome AS aluno,
        d.nome AS disciplina
      FROM matricula m
      JOIN aluno a ON m.id_aluno = a.id
      JOIN disciplina d ON m.id_disciplina = d.id
    `);

    res.json(resultado.rows);

  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};