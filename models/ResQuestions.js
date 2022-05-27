module.exports = (sequelize, Datatype) => {

    const ResQuestions=sequelize.define("ResQuestions",{
        id_question:{
          type:Datatype.STRING,
          allowNull:false,
        },
        evaluation:{
            type:Datatype.STRING,
            allowNull:true
        },
        observation:{
            type:Datatype.STRING,
            allowNull:true
        },
        note:{
            type:Datatype.STRING,
            allowNull:true
        },
        
    })
    ResQuestions.associate=models=>{
        ResQuestions.belongsTo(models.Projet,{
            onDelete:"cascade"
        }),
        ResQuestions.belongsTo(models.Chapitres,{
            onDelete:"cascade"
        })
        
    }
    return ResQuestions 
}  
