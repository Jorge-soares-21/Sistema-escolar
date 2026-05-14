const db = require("../config/db");

// Criar recados
exports.criarRecado = async (req, res) => {
    const {titulo, mensagem} = req.body;

    try {
        const resultado = await db.query(`INSERT INTO recado (titulo, mensagem) VALUES ($1, $2) RETURNING *`, [titulo, mensagem]);

        res.json(resultado.rows[0]);
        
    } catch (erro) {
        res.status(500).json({ erro: erro.message});
    }
};

// Listar Recados e indicar quais já foram lidos pelo aluno.
exports.listarRecados = async (req, res) => {
    const id_aluno = req.usuario.id;

    try {
        const resultado = await db.query(`
            SELECT 
                r.*,
                CASE 
                WHEN rl.id IS NOT NULL THEN true
                ELSE false
                END AS lido
                FROM recado r
                LEFT JOIN recado_lido rl 
                ON r.id = rl.id_recado 
                AND rl.id_aluno = $1
                ORDER BY r.data_criacao DESC`, [id_aluno]);

        res.json(resultado.rows);

    } catch (erro) {
        res.status(500).json({ erro: erro.message});
    }
};

// Marcar recado como lido
exports.marcarComoLido = async (req, res) => {
    const id_recado = req.params.id;
    const id_aluno = req.usuario.id;

    try {
        await db.query(`INSERT INTO recado_lido (id_recado, id_aluno) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [id_recado, id_aluno]);

        res.json({ message: "Recado marcado como lido"});
    } catch (erro) {
        res.status(500).json({ erro: erro.message});
    }
};

// Excluir recado
exports.excluirRecado = async (req, res) => {
    const id = req.params.id;

    try {
        await db.query(`DELETE FROM recado WHERE id = $1`, [id]);

        res.json({ message: "Recado excluido com sucesso"});
    } catch (erro) {
        res.status(500).json({ erro: erro.message});
    }
}
