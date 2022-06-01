const db = require("../models");
const Joi = require("joi");
const nodemailer = require("nodemailer");

const SchemaValidation = Joi.object({
  date_deb: Joi.date().required(),
  date_fin: Joi.date().required(),
  ConsultantId: Joi.number().required(),
  EntrepriseId: Joi.number().required(),
  NormeId: Joi.number().required(),
});
const User = process.env.USER;
const Pass = process.env.PASS;


// const mailer = async (consultant, name_entreprise) => {
//   let testAccount = await nodemailer.createTestAccount();
//   let transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//       user: `${User}`, // generated ethereal user
//       pass: `${Pass}`,
//     },
//   });
//   // const entreprise = await db.Entreprise.findOne({ where: { id: response.EntrepriseId } }).then((res) => {
//   //   db.Users.findOne({ where: { id: res.UserId } }).then((name) => {
//   //     // console.log("identreprise : ", response.EntrepriseId);
//   //     // console.log("username", name.username);
//   //     return name.username
//   //   })
//   // });

//   let info = await transporter.sendMail({
//     to: `${consultant}`,
//     subject: "Hello ✔",
//     text: "Hello world?",
//     html: `<b>Hello world?</b><br/> <b>Your Entreprise : ${name_entreprise}</b>`,
//   });
//   return info
// } 

exports.ajoute_projet = (
  date_deb,
  date_fin,
  ConsultantId,
  EntrepriseId,
  NormeId,
  name_entreprise
) => {
  return new Promise((resolve, reject) => {
    let validation = SchemaValidation.validate({
      date_deb,
      date_fin,
      ConsultantId,
      EntrepriseId,
      NormeId,
    });
    if (validation.error) {
      reject(validation.error.details[0].message);
    } else {
      db.Projet.create({
        date_deb: date_deb,
        date_fin: date_fin,
        ConsultantId: ConsultantId,
        EntrepriseId: EntrepriseId,
        NormeId: NormeId,
      })
        .then((response) => {
          db.sequelize
            .query(
              `insert into resquestions(id_question) select id from questions where ArticleId in (select a.id from (articles a ,chapitres c, normes n) where a.ChapitreId=c.id and n.id=${response.NormeId} and c.NormeId=n.id)`
            )
            .then((res_q) => {
              if (!res_q) {
                resolve("erreur");
              } else {
                db.ResQuestions.findAll({ where: { ProjetId: null } }).then(
                  async (aj_prj_q) => {
                    if (!aj_prj_q) {
                      resolve("erreur d'ajoute");
                    } else {
                      await db.sequelize
                        .query(
                          ` UPDATE resquestions SET ProjetId=${response.id} where ProjetId IS NULL `
                        )
                        .then((aj_y_n) => {

                        });
                      await aj_prj_q.map(async (item) => {
                        await db.sequelize
                          .query(
                            `update db_ams.resquestions set ChapitreId = (select id from db_ams.chapitres where id = (select ChapitreId from db_ams.articles where id = (select ArticleId from db_ams.questions where id = ${item.id_question}))) where ProjetId = ${response.id} and id_question = ${item.id_question}`
                          )
                          .then((reschap) => {
                            resolve(item.id_question);
                          });
                      });
                      await db.Consultant.findOne({ where: { id: response.ConsultantId } }).then((res) => {
                        db.Users.findOne({ where: { id: res.UserId } }).then((email) => {
                          db.Normes.findOne({ where: { id: NormeId } }).then((norme) => {
                          let transporter = nodemailer.createTransport({
                            host: "smtp.gmail.com",
                            port: 587,
                            secure: false,
                            auth: {
                              user: `${User}`, // generated ethereal user
                              pass: `${Pass}`,
                            },
                          });
                          let info = transporter.sendMail({
                            to: `${email.email}`,
                            subject: "Hello ✔",
                            text: "Hello world?",
                            html: `<p>Hello Mr ${email.username}, we know that you are the supervisor of the project according to the Norme <b>${norme.norme}</b> of the company <b>${name_entreprise}</b>,
                            the duration of the project between <b>${date_deb} ==> ${date_fin}</b> </p>
                              <br/> <a href="http://localhost:3001/authenticationForm">click this if you view your Project<a>`,
                          });
                          return info;
                        })
                      })
                    })
                    }
                  }
                );
              }
            });
        }).catch((err) => reject(err));
    }
  });
};

// Register for projet
// exports.ajoute_projet = (
//   date_deb,
//   date_fin,
//   ConsultantId,
//   EntrepriseId,
//   NormeId
// ) => {
//   return new Promise((resolve, reject) => {
//     let validation = SchemaValidation.validate({
//       date_deb,
//       date_fin,
//       ConsultantId,
//       EntrepriseId,
//       NormeId,
//     });
//     if (validation.error) {
//       reject(validation.error.details[0].message);
//     } else {
//       db.Projet.create({
//         date_deb: date_deb,
//         date_fin: date_fin,
//         ConsultantId: ConsultantId,
//         EntrepriseId: EntrepriseId,
//         NormeId: NormeId,
//       })
//         .then((response) => {
//           db.sequelize
//             .query(
//               `insert into resquestions(id_question) select id from questions where ArticleId in (select a.id from (articles a ,chapitres c, normes n) where a.ChapitreId=c.id and n.id=${response.NormeId} and c.NormeId=n.id)`
//             )
//             .then((res_q) => {
//               if (!res_q) {
//                 resolve("erreur");
//               } else {
//                 db.ResQuestions.findAll({ where: { ProjetId: null } }).then(
//                   (aj_prj_q) => {
//                     if (!aj_prj_q) {
//                       resolve("erreur d'ajoute");
//                     } else {
//                       db.sequelize
//                         .query(
//                           ` UPDATE resquestions SET ProjetId=${response.id} where ProjetId IS NULL `
//                         )
//                         .then((aj_y_n) => {
//                           // const m = "hamza.benaicha46@gmail.com";
//                           // mailer(m);
//                           // mailer(response.ConsultantId);
//                           console.log("requte 1 ");
//                         });
//                       aj_prj_q.map((item) => {
//                         db.sequelize
//                           .query(
//                             `update db_ams.resquestions set ChapitreId = (select id from db_ams.chapitres where id = (select ChapitreId from db_ams.articles where id = (select ArticleId from db_ams.questions where id = ${item.id_question}))) where ProjetId = ${response.id} and id_question = ${item.id_question}`
//                           )
//                           .then((reschap) => {
//                             console.log("requte 2 ");
//                           });
//                       });
//                     }
//                   }
//                 );
//               }
//             });

//         })
//         .catch((err) => reject(err));
//     }
//   });
// };

exports.getbyId_projet = (id) => {
  return new Promise((resolve, reject) => {
    db.Projet.findOne({ where: { id: id } }).then((projet) => {
      if (!projet) {
        reject("aucun projet");
      } else {
        db.Normes.findOne({ where: { id: projet.NormeId } }).then((norme) => {
          if (!norme) {
            reject("aucun Normes");
          } else {
            db.Chapitres.findAll({ where: { NormeId: projet.NormeId } }).then(
              (chapitre) => {
                if (!chapitre) {
                  reject("aucun chapitre");
                } else {
                  db.sequelize
                    .query(
                      `select * from articles where ChapitreId in (select c.id from (chapitres c ,normes n) where n.id=${projet.NormeId} and c.NormeId=n.id)`
                    )
                    .then((article) => {
                      if (!article) {
                        reject("aucun article");
                      } else {
                        db.sequelize
                          .query(
                            `select * from questions where ArticleId in (select a.id from (articles a ,chapitres c, normes n) where a.ChapitreId=c.id and n.id=${projet.NormeId} and c.NormeId=n.id)`
                          )
                          .then((question) => {
                            if (!question) {
                              reject("aucun question");
                            } else {
                              const questions = question[0];
                              const articles = article[0];
                              resolve({ norme, chapitre, articles, questions });
                            }
                          });
                      }
                    });
                }
              }
            );
          }
        });
      }
    });
  });
};

//----------------------------------------><------------------------------------------------

const oneEntre = async (_id) => {
  const userId = await db.Entreprise.findOne({ where: { id: _id } }).then(
    (result) => {
      return result.UserId;
    }
  );
  const variable = await db.Users.findOne({ where: { id: userId } }).then(
    (res) => {
      return res?.username;
    }
  );
  return variable;
};

//----------------------------------------><------------------------------------------------

const oneConsultant = async (_id) => {
  const userId = await db.Consultant.findOne({ where: { id: _id } }).then(
    (result) => {
      return result.UserId;
    }
  );
  const variable = await db.Users.findOne({ where: { id: userId } }).then(
    (res) => {
      return res?.username;
    }
  );
  return variable;
};

//----------------------------------------><------------------------------------------------

const oneNorme = async (id) => {
  const variable = await db.Normes.findOne({ where: { id: id } }).then(
    (result) => {
      return result.norme;
    }
  );
  return variable;
};

//----------------------------------------><------------------------------------------------

//get project by consultant id
//return
// 3 arrays
// all projects for that id
// all entreprises name for each project
exports.getProjectByIdC = async (req, res, next) => {
  try {
    let EntrepriseNames = [];
    let Normes = [];
    const projects = await db.Projet.findAll({
      where: { ConsultantId: req.params.id },
    }).then((result) => {
      if (result.length == 0) {
        const projects = [];
        res.send({ projects, EntrepriseNames, Normes });
      } else {
        return result;
      }
    });
    let index = 0;

    projects.forEach(async (element) => {
      EntrepriseNames.push(await oneEntre(element.EntrepriseId));
      Normes.push(await oneNorme(element.NormeId));
      if (index == projects.length - 1) {
        res.send({ projects, EntrepriseNames, Normes });
      }
      index++;
    });
  } catch (error) {
    console.log();
  }
};

//----------------------------------------><------------------------------------------------

// get project by entreprise id
exports.getProjectByIdE = async (req, res, next) => {
  try {
    let consultantsName = [];
    let Normes = [];
    const projects = await db.Projet.findAll({
      where: { EntrepriseId: req.params.id },
    }).then((result) => {
      if (result.length == 0) {
        const projects = []
        res.send({ projects, consultantsName, Normes });
      } else {
        return result;
      }
    });

    let index = 0;
    projects.forEach(async (element) => {
      consultantsName.push(await oneConsultant(element.ConsultantId));
      Normes.push(await oneNorme(element.NormeId));
      if (index == projects.length - 1) {
        res.send({ projects, consultantsName, Normes });
      }
      index++;
    });
  } catch (error) { }
};

//----------------------------------------><------------------------------------------------

// get all project from data base
exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await db.Projet.findAll().then((result) => {
      return result;
    });
    let normes = [];
    let cNames = [];
    let eNames = [];
    let index = 0;
    projects.forEach(async (element) => {
      normes.push(await oneNorme(element.NormeId));
      cNames.push(await oneConsultant(element.ConsultantId));
      eNames.push(await oneEntre(element.EntrepriseId));
      if (index == projects.length - 1) {
        res.send({ projects, cNames, eNames, normes });
      }
      index++;
    });
  } catch (error) {
    res.json({ message: error });
  }
};

//----------------------------------------><------------------------------------------------

// delete project By Id

exports.deleteProject = async (req, res, next) => {
  try {
    await db.Projet.destroy({ where: { id: req.params.id } }).then((result) => {
      if (result == 0) {
        res.json({ message: "no data deleted", isSuccess: false });
      }
      if (result == 1) {
        res
          .status(200)
          .send({ message: "deleted successfully", isSuccess: true });
      }
    });
  } catch (error) {
    // res.json({ message: " error from catch delete Project" });
  }
};