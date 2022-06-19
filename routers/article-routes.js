const express=require('express')
const route=express.Router()
const article_Controller=require('../controllers/articleController')
const {isAdmin,isAuthenticated} = require("../middleware/authenticated")
route.post('/ajoute_article',isAdmin,(req,res,next)=>{
    article_Controller.ajoute_articles(req.body.Articles, req.body.ChapitreId)
    .then(response=>res.status(200).json(response))
    .catch((err)=>res.status(400).json(err))
})

route.get('/getAll_article',isAuthenticated,(req,res,next)=>{
    article_Controller.getAll_articles()
    .then(response=>res.status(200).json(response))
    .catch((err)=>res.status(400).json({err:err}))
})

route.get('/getbyId_article/:id',isAuthenticated,(req,res,next)=>{
    article_Controller.getbyId_article(req.params.id)
    .then(response=>res.status(200).json(response))
    .catch((err)=>res.status(400).json({err:err}))
})

route.get('/getarticle_byIdchapitre/:id',isAuthenticated,(req,res,next)=>{
    article_Controller.getarticle_byIdchapitre(req.params.id)
    .then(response=>res.status(200).json(response))
    .catch((err)=>res.status(400).json({err:err}))
})

route.patch('/update_article/:id',isAdmin,(req,res,next)=>{
    article_Controller.update_article(req.params.id,req.body.Articles, req.body.ChapitreId)   
    .then(response=>res.status(200).json(response))
    .catch((err)=>res.status(400).json(err))
})

route.delete('/delete_article/:id',isAdmin,(req,res,next)=>{
    article_Controller.delete_article(req.params.id)
    .then(response=>res.status(200).json(response))
    .catch((err)=>res.status(400).json({err:err}))
})

module.exports=route 
