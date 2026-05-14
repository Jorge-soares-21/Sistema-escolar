const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

const matriculaController = require("../controllers/matricularControllers");

router.get("/", matriculaController.listarMatriculas);
router.post("/", auth, isAdmin, matriculaController.criarMatricula);
router.get("/professor", auth, matriculaController.listarMatriculasProfessor);

module.exports = router;






