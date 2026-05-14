const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const isAdmin = require("../middlewares/isAdmin");

const disciplinaController = require("../controllers/disciplinarContrellers");

router.get("/", disciplinaController.listarDisciplinas);
router.post("/", auth, isAdmin, disciplinaController.criarDisciplina);

module.exports = router;