const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Servindo ao front-end
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

// Permite receber JSON nas requisições
app.use(express.json());

// importando as rotas.
const alunoRoutes = require("./routes/alunosRoutes");
const professorRoutes = require("./routes/professorRoutes");
const disciplinasRoutes = require("./routes/disciplinasRoutes");
const matriculaRoutes = require("./routes/matriculaRoutes");
const notaRoutes = require("./routes/notaRoutes");
const adminRoutes = require('./routes/adminRoutes');
const recadosRoutes = require("./routes/recadoRoutes");

app.use("/alunos", alunoRoutes);
app.use("/professores", professorRoutes);
app.use("/disciplinas", disciplinasRoutes);
app.use("/matriculas", matriculaRoutes);
app.use("/notas", notaRoutes);
app.use("/admin",adminRoutes);
app.use("/recados", recadosRoutes);

app.get("/", (req, res) => {
    res.send("API Sistema Escolar Funcionando");
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
});