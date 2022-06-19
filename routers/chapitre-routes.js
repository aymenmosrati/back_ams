const express=require('express')
const route=express.Router()
const chapitre_Controller=require('../controllers/chapitreController')
const { isAdmin, isAuthenticated } = require("../middleware/authenticated");

route.post('/ajoute_chapitres',isAdmin,(req,res,next)=>{
    chapitre_Controller.ajoute_chapitres(req.body.Chapitres,req.body.NormeId) 
    .then(response=>res.status(200).json(response))
    .catch((err)=>res.status(400).json(err))
})

route.get('/getAll_chapitre',isAuthenticated,(req,res,next)=>{
    chapitre_Controller.getAll_chapitres()
    .then(response=>res.status(200).json(response))
    .catch((err)=>res.status(400).json({err:err}))
})

route.get("/getbyId_chapitre/:id", isAuthenticated, (req, res, next) => {
  chapitre_Controller
    .getbyId_chapitre(req.params.id)
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(400).json({ err: err }));
});

route.get("/getchp_byidnorme/:id", isAuthenticated, (req, res, next) => {
  chapitre_Controller
    .getchp_byidnorme(req.params.id)
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(400).json({ err: err }));
});

route.patch('/update_chapitre/:id',isAdmin,(req,res,next)=>{
    chapitre_Controller.update_chapitre(req.params.id,req.body.Chapitres,req.body.NormeId)  
    .then(response=>res.status(200).json(response))
    .catch((err)=>res.status(400).json(err))
})

route.delete('/delete_chapitre/:id',isAdmin,(req,res,next)=>{
    chapitre_Controller.delete_chapitre(req.params.id)
    .then(response=>res.status(200).json(response))
    .catch((err)=>res.status(400).json({err:err}))
})

module.exports=route 