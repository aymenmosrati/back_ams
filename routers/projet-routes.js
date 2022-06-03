const express = require("express");
const route = express.Router();
const projet_Controller = require("../controllers/projetController");
const res_Controller = require("../controllers/resController");

route.post("/ajoute_projet", (req, res, next) => {
  projet_Controller
    .ajoute_projet(
      req.body.date_deb,
      req.body.date_fin,
      req.body.ConsultantId,
      req.body.EntrepriseId,
      req.body.NormeId,
      req.body.name_entreprise
    )
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(400).json(err));
});

route.get("/getbyId_projet/:id", (req, res, next) => {
  projet_Controller
    .getbyId_projet(req.params.id)
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(400).json({ err: err }));
});

// modifie resulta de projet
route.patch("/update_res", (req, res, next) => {
  const payload = {
    table_objet: req.body.table_objet,
    // [{
    // id: req.body.id,
    // evaluation:req.body.evaluation ,
    // observation:req.body.observation,
    // note: req.body.note
    // }]
    // req.body.id, req.body.evaluation, req.body.observation, req.body.note
  };
  res_Controller
    .update_res(payload.table_objet)
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(400).json(err));
});

// get les resulta des question d'un projet
route.get("/res_chap/:id", (req, res, next) => {
  const table_objet_id = req.body.table_objet_id;
  res_Controller
    .res_chap(table_objet_id, req.params.id)
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(400).json({ err: err }));
});

route.get("/getPC/:id", projet_Controller.getProjectByIdC);

route.get("/getPE/:id", projet_Controller.getProjectByIdE);

route.get("/getAllProjects", projet_Controller.getAllProjects);

route.delete("/deleteProject/:id", projet_Controller.deleteProject);

route.patch("/updateResult",res_Controller.updateResById);
// ----------------------------> result routes <-----------------------------------------
route.post("/getChapitreResult", res_Controller.getChapitreResult);
route.post("/getChapitreResults", res_Controller.getChapitreResults);

route.get("/getResultsByProject/:id", res_Controller.getResultById);
module.exports = route;
