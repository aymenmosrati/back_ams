const express=require('express')
const route=express.Router()
const userController=require('../controllers/userController')

route.post('/register_entreprise',(req,res,next)=>{
    userController.register_entreprise(req.body.username,req.body.telephone,req.body.email,req.body.password,req.body.adress,req.body.mobile,req.body.contact,req.body.web)
    .then(response=>res.status(200).json(response))
    .catch((err)=>res.status(400).json(err))
})

route.post('/register_consultant',(req,res,next)=>{
    userController.register_consultant(req.body.username,req.body.telephone,req.body.email,req.body.password,req.body.adress)
    .then(response=>res.status(200).json(response))
    .catch((err)=>res.status(400).json(err))
})

route.post('/login',(req,res,next)=>{
    userController.login(req.body.email,req.body.password)
    .then(token=>res.status(200).json({token:token}))
    .catch((err)=>res.status(400).json({err:err}))
})

route.get('/getAll',(req,res,next)=>{
    userController.getAll_users()
    .then(users=>res.status(200).json(users))
    .catch((err)=>res.status(400).json({err:err}))
})

route.get('/getAll_consultant',(req,res,next)=>{
    userController.getAll_consultant()
    .then(users=>res.status(200).json(users))
    .catch((err)=>res.status(400).json({err:err}))
})

route.get('/getAll_entreprise',(req,res,next)=>{
    userController.getAll_entreprise()
    .then(users=>res.status(200).json(users))
    .catch((err)=>res.status(400).json({err:err}))
})

route.get('/getbyId_consultant/:id',(req,res,next)=>{
    userController.getbyId_consultant(req.params.id)
    .then(user=>res.status(200).json(user))
    .catch((err)=>res.status(400).json({err:err}))
})

route.get('/getbyId_entreprise/:id',(req,res,next)=>{
    userController.getbyId_entreprise(req.params.id)
    .then(user=>res.status(200).json(user))
    .catch((err)=>res.status(400).json({err:err}))
})

route.patch('/update_user/:id',(req,res,next)=>{
    userController.update_user(req.params.id,req.body.username,req.body.telephone,req.body.email,req.body.password,req.body.adress)
    .then(response=>res.status(200).json(response))
    .catch((err)=>res.status(400).json(err))
})

route.delete('/delete_user/:id',(req,res,next)=>{
    userController.delete_user(req.params.id)
    .then(user=>res.status(200).json(user))
    .catch((err)=>res.status(400).json({err: err}))
})

route.get("/countAll_consultant", (req, res, next) => {
  userController
    .countAll_consultant()
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(400).json({ err: err }));
});

route.get("/countAll_entreprise", (req, res, next) => {
  userController
    .countAll_entreprise()
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(400).json({ err: err }));
});

route.get("/countAll_norme", (req, res, next) => {
  userController
    .countAll_norme()
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(400).json({ err: err }));
});

route.get("/countAll_project", (req, res, next) => {
  userController
    .countAll_project()
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(400).json({ err: err }));
});


//-----------------> ... new function get route ... <---------------------
route.get("/getAllUserConsultant", userController.getAllCon);
route.get("/getAllUserEntreprise", userController.getAllEntreprise);


route.post("/decodeToken", userController.decodeToken);
module.exports=route