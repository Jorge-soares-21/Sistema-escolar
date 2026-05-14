const express = require("express");
const router = express.Router();

const recadoController = require(("../controllers/recadoController"));
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

// Criar recado
router.post("/", auth, isAdmin, recadoController.criarRecado);

// Listar recados
router.get("/", auth, recadoController.listarRecados);

// Marcar recado como lido
router.post("/:id/lido", auth, recadoController.marcarComoLido);

// Excluir recado
router.delete("/:id", auth, isAdmin, recadoController.excluirRecado);

module.exports = router;