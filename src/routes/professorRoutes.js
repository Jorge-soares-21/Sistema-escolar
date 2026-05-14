const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

const professorController = require("../controllers/professorControllers");

router.get("/", professorController.listarProfessor);
router.post("/", auth, isAdmin, professorController.criarProfessor);
router.post("/login", professorController.loginProfessor);
router.delete("/:id", auth, isAdmin, professorController.deletarProfessor);

module.exports = router; 