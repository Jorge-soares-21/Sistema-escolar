const db = require("../config/db");
const jwt = require("jsonwebtoken");

// Login admin
exports.loginAdmin = async (req, res) => {
    const {login, senha} = req.body;

    try {
        const resultado = await db.query("SELECT * FROM administrador WHERE login = $1  AND senha = $2", [login, senha]);

        if (resultado.rows.length === 0) {
            return res.status(401).json({ message: "Login inválido"});
        }

        const admin = resultado.rows[0];

        const token = jwt.sign({ id: admin.id, tipo: "admin"}, "segredo", {expiresIn: "1h"});

        delete admin.senha;

        res.json({ token, usuario: admin });
    } catch (erro) {
        res.status(500).json({erro: erro.message});
    }
};