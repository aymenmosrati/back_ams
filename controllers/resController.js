const db = require("../models");
const Joi = require("joi");
const sequelize = require("sequelize");

// Conforme :100 % , Acceptable :66%, Aaméliorer :33%, Non-conforme :0%, Exclus (NA) :NA
exports.update_res = (table_objet) => {
  return new Promise((resolve, reject) => {
    table_objet.map((item) => {
      // console.log(item.id);
      if (item.evaluation == "Conforme") {
        db.sequelize
          .query(
            `UPDATE resquestions SET evaluation="${item.evaluation}",observation="${item.observation}", note="100" where id=${item.id} `
          )
          .then((res) => {
            resolve(res);
          });
      } else if (item.evaluation == "Acceptable") {
        db.sequelize
          .query(
            `UPDATE resquestions SET evaluation="${item.evaluation}",observation="${item.observation}", note="66" where id=${item.id} `
          )
          .then((res) => {
            resolve(res);
          });
      } else if (item.evaluation == "Aaméliorer") {
        db.sequelize
          .query(
            `UPDATE resquestions SET evaluation="${item.evaluation}",observation="${item.observation}", note="33" where id=${item.id} `
          )
          .then((res) => {
            resolve(res);
          });
      } else if (item.evaluation == "Non-conforme") {
        db.sequelize
          .query(
            `UPDATE resquestions SET evaluation="${item.evaluation}",observation="${item.observation}", note="0" where id=${item.id} `
          )
          .then((res) => {
            resolve(res);
          });
      } else {
        db.sequelize
          .query(
            `UPDATE resquestions SET evaluation="Exclus(NA)",observation="${item.observation}", note="NA" where id=${item.id} `
          )
          .then((res) => {
            resolve(res);
          });
      }
    });
  });
};

exports.res_chap = (table_objet_id, id) => {
  return new Promise((resolve, reject) => {
    // db.ResQuestions.findAll({ where: { ProjetId: id } }).then((projet) => {

    //      resolve(projet)
    //     // projet.map((item) => {
    //     //     resolve(item)

    //     // })

    // });
    table_objet_id.map((item) => {
      db.sequelize
        .query(
          `select avg( note ) from resquestions where ProjetId=${id} and ChapitreId=${item.id} and note =! "NA" `
        )
        .then((projet) => {
          //         //  resolve(projet[0].id)
          //         // var res=0;
          //         // projet[0].map((item) => {

          //         //  projet[0].map((item) => {
          //         //     // var res=0;
          //         //       table_objet_id.map((tab_id) => {
          //         //           if(item.id==tab_id.id){
          //         //             res += item.note;
          console.log(projet);
          //         //           }
        });
      // table_objet_id.map((item) => {
      //     console.log(item.id)
    });

    //     // });
    // })
  });
};


/*
#TODO: this functions needs some modifcations 
-*/
exports.getResultById = async (req,res,next) => {
    try {
        const results = await db.ResQuestions.findAll({
          where: { ProjetId: req.params.id },
        }).then((result)=>{return result})
        res.send(results);    
    } catch (error) {
        res.status(400).send({message : " error occurred during get results process"})
    }

};



// exports.updateResById = async (req, res, next) => {
//   try {
//     const id = req.body.id;
//     const observation = req.body.observation;
//     const evaluation = req.body.evaluation;
//     let note = "";
//     if (!id) {
//       res.status(400).send({ Message: "missing id !" });
//       return;
//     }
//     // if (!observation) {
//     //   res.status(400).send({ Message: "missing observation !" });
//     //   return;
//     // }
//     // if (!evaluation) {
//     //   res.status(400).send({ Message: "missing evaluation !" });
//     //   return;
//     // }
//     switch (evaluation) {
//       case "Conforme":
//         note = "100";
//         break;
//       case "Acceptable":
//         note = "66";
//         break;
//       case "Aaméliorer":
//         note = "33";
//         break;
//       case "Non-conforme":
//         note = "0";
//         break;
//       case "Exclus(NA)":
//         note = "NA";
//         break;

//       default:
//         note="";
//         break;
//     }
//     if(note ==""){
//       res.status(400).send({Message :"note setting error !" })
//       return;
//     };

//     const update = await db.ResQuestions.update(
//       {
//         observation: observation,
//         evaluation: evaluation,
//         note: note,
//       },
//       {
//         where: { id: id },
//       }
//     );
//     if (update == 0) {
//       res.status(400).send({ Message: "nothing updated ! " });
//     } else {
//       res.status(400).send({ Message: "update successfully" });
//     }
//   } catch (error) {
//     res
//       .status(400)
//       .send({ message: "error appear while updating the result !" });
//   }
// };




exports.updateResById = async (req, res, next) => {
  try {
    const id = req.body.id;
    const observation = req.body.observation;
    const evaluation = req.body.evaluation;
    let note = "";
    let update = 0;
    if (evaluation =="") {
      update = await db.ResQuestions.update(
        { observation: observation },
        { where: { id: id } }
      );
    } else {
      switch (evaluation) {
        case "Conforme":
          note = "100";
          break;
        case "Acceptable":
          note = "66";
          break;
        case "Aaméliorer":
          note = "33";
          break;
        case "Non-conforme":
          note = "0";
          break;
        case "Exclus(NA)":
          note = "NA";
          break;
  
        default:
          note = "";
          break;
      }
      if (note == "") {
        res.status(400).send({ Message: "note setting error !" });
        return;
      }

      update = await db.ResQuestions.update(
        {
          observation: observation,
          evaluation: evaluation,
          note: note,
        },
        {
          where: { id: id },
        }
      );
    }
    if (update == 0) {
      res.status(400).send({ Message: "nothing updated ! " });
    } else {
      res.status(200).send({ Message: "update successfully" });
    }
  } catch (error) {
    res
      .status(400)
      .send({ message: "error appear while updating the result !" });
  }
};