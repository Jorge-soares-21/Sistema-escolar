const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

const alunoController = require("../controllers/alunoControllers");

router.get("/", alunoController.listarAlunos);
router.post("/", auth, isAdmin, alunoController.criarAlunos);
router.post("/login", alunoController.loginAluno);
router.delete("/:id", auth, isAdmin, alunoController.deletarAluno);

module.exports = router;            