const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const notaController = require("../controllers/notaControllers");

router.get("/", notaController.listarNotas);
router.post("/", notaController.criarNota);
router.get("/aluno/:id", auth, notaController.buscarNotasPorAluno);
router.get("/professor", auth, notaController.listarNotasParaProfessor);
router.put("/:id", auth, notaController.atualizarNota);

module.exports = router;

