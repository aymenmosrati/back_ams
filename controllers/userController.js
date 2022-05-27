const db = require("../models");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const Users = require("../models/Users");
require("dotenv").config();
const nodemailer = require("nodemailer");


const SchemaValidation = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  telephone: Joi.number().min(11111111).max(99999999).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  adress: Joi.string().required(),
  mobile: Joi.number().min(11111111).max(99999999),
  contact: Joi.string(),
  web: Joi.string(),
});

const mailer = async (username, email, password) => {
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "africa.service.m@gmail.com",
      pass: "africams",
    },
  });
  let info = await transporter.sendMail({
    to: `${email}`,
    subject: "Hello ✔ Your Adress and password in platforme Africa MS ",
    text: "Hello world?",
    html: `<b> Acount of Entrepris : </b> ${username} <br/> <b>Your adress : </b>${email}<br/> <b>Your Password : </b>${password}`,
  });
  return info;
}

// Register for entreprise
exports.register_entreprise = (
  username,
  telephone,
  email,
  password,
  adress,
  mobile,
  contact,
  web
) => {
  return new Promise((resolve, reject) => {
    let validation = SchemaValidation.validate({
      username,
      telephone,
      email,
      password,
      adress,
    });
    if (validation.error) {
      reject(validation.error.details[0].message);
    } else {
      db.Users.count({ where: { email: email } }).then((doc) => {
        if (doc != 0) {
          reject("This email is used");
        } else {
          bcrypt.hash(password, 10).then((hashedPassord) => {
            db.Users.create({
              username: username,
              telephone: telephone,
              email: email,
              password: hashedPassord,
              adress: adress,
              role: "entreprise",
            })
              .then((response) => {
                if (response) {
                  db.Entreprise.create({
                    mobile: mobile,
                    contact: contact,
                    web: web,
                    UserId: response.id,
                  }).then((user) => {
                    mailer(username, email, password)
                    // console.log("aa :" ,username,email ,password)
                    //  resolve({ user: response, contact: user }),
                  });
                } else {
                  reject("error for insertion");
                }
              })
              .catch((err) => reject(err));
          });
        }
      });
    }
  });
};

// Register for consultant
exports.register_consultant = (
  username,
  telephone,
  email,
  password,
  adress
) => {
  return new Promise((resolve, reject) => {
    let validation = SchemaValidation.validate({
      username,
      telephone,
      email,
      password,
      adress,
    });
    if (validation.error) {
      reject(validation.error.details[0].message);
    } else {
      db.Users.count({ where: { email: email } }).then((doc) => {
        if (doc != 0) {
          reject("This email is used");
        } else {
          bcrypt.hash(password, 10).then((hashedPassord) => {
            db.Users.create({
              username: username,
              telephone: telephone,
              email: email,
              password: hashedPassord,
              adress: adress,
              role: "consultant",
            })
              .then((response) => {
                if (response) {
                  db.Consultant.create({
                    disponibilité: true,
                    UserId: response.id,
                  }).then((user) =>
                    resolve({ user: response, disponibilité: user })
                  );
                } else {
                  reject("error for insertion");
                }
              })
              .catch((err) => reject(err));
          });
        }
      });
    }
  });
};

const PrivateKey = process.env.PRIVATE_KEY;

exports.login = (email, password) => {
  return new Promise((resolve, reject) => {
    db.Users.findOne({ where: { email: email } }).then((user) => {
      if (!user) {
        reject("invalid email");
      } else {
        bcrypt.compare(password, user.password).then((same) => {
          if (same) {
            let token = jwt.sign(
              { id: user.id, username: user.email, role: user.role },
              PrivateKey,
              {
                expiresIn: "24h",
              }
            );
            const id = user.id;
            const role = user.role;
            switch (role) {
              case "consultant":
                db.Consultant.findOne({ where: { UserId: id } }).then(
                  (consultant) => {
                    user = { ...user.dataValues, subInfo: consultant };
                    resolve({ user, token });
                  }
                );
              case "entreprise":
                db.Entreprise.findOne({ where: { UserId: id } }).then(
                  (entreprise) => {
                    user = { ...user.dataValues, subInfo: entreprise };
                    resolve({ user, token });
                  }
                );
              case "admin":
                db.Admin.findOne({ where: { UserId: id } }).then((admin) => {
                  user = { ...user.dataValues, subInfo: admin };
                  resolve({ user, token });
                });
            }
          } else {
            reject("invalid password");
          }
        });
      }
    });
  });
};

// login admin or consultant or entreprise
// const PrivateKey = "eijnekv,evkznjzkveffznzivnz,feizivnafjafnmjf"
// exports.login = (email, password) => {
//     return new Promise((resolve, reject) => {
//         db.Users.findOne({ where: { email: email } }).then(user => {
//             if (!user) {
//                 reject("invalid email and password")
//             } else {
//                 bcrypt.compare(password, user.password).then(same => {
//                     if (same) {
//                         let token = jwt.sign({ id: user.id, username: user.id, role: "userrole" }, PrivateKey, {
//                             expiresIn: "24h"
//                         })
//                         resolve(token)
//                     } else {
//                         reject("invalid email and password")
//                     }
//                 })
//             }
//         })
//     })
// }
// get user by id
exports.getbyId_consultant = (id) => {
  return new Promise((resolve, reject) => {
    db.Consultant.findOne({ where: { id: id } }).then((consultant) => {
      if (!consultant) {
        reject("aucun consultant");
      } else {
        // resolve(user);
        db.Users.findOne({
          where: { id: consultant.UserId, role: "consultant" },
        }).then((user) => {
          if (!user) {
            reject("aucun user");
          } else {
            resolve(user);
          }
        });
      }
    });
  });
};

exports.getbyId_entreprise = (id) => {
  return new Promise((resolve, reject) => {
    db.Users.findOne({ where: { id: id, role: "entreprise" } }).then((user) => {
      db.Entreprise.findOne({ where: { UserId: id } }).then((user_c) => {
        if (!user_c) {
          reject("aucun user");
        } else {
          user = { ...user.dataValues, subInfo: user_c };
          resolve(user);
        }
      });
    });
  });
};

// get All users
exports.getAll_users = () => {
  return new Promise((resolve, reject) => {
    db.Users.findAll().then((users) => {
      if (!users) {
        reject("aucun users");
      } else {
        resolve(users);
      }
    });
  });
};

// get All consultant
exports.getAll_consultant = () => {
  return new Promise((resolve, reject) => {
    db.Users.findAll({ where: { role: "consultant" } }).then((users) => {
      if (!users) {
        reject("aucun users");
      } else {
        resolve(users);
      }
    });
  });
};

// get All entreprise
exports.getAll_entreprise = () => {
  return new Promise((resolve, reject) => {
    db.Users.findAll({ where: { role: "entreprise" } }).then((users) => {
      // console.log(users);
      if (!users) {
        reject("aucun users");
      } else {
        resolve(users);
      }
    });
  });
};

// update user
exports.update_user = (id, username, telephone, email, password, adress) => {
  return new Promise((resolve, reject) => {
    let valide = SchemaValidation.validate({
      username,
      telephone,
      email,
      password,
      adress,
    });
    if (valide.error) {
      reject(valide.error.details[0].message);
    }
    db.Users.count({ where: { email: email } }).then((doc) => {
      if (doc == 0) {
        bcrypt.hash(password, 10).then((hashedPassord) => {
          db.Users.update(
            {
              username: username,
              telephone: telephone,
              email: email,
              password: hashedPassord,
              adress: adress,
            },
            { where: { id: id } }
          )
            .then((response) => {
              if (!response) {
                reject("error for update");
              } else {
                resolve("update success");
              }
            })
            .catch((err) => reject(err));
        });
      } else if (doc != 0) {
        db.Users.findOne({ where: { id: id } }).then((user) => {
          if (user.email == email) {
            bcrypt.hash(password, 10).then((hashedPassord) => {
              db.Users.update(
                {
                  username: username,
                  telephone: telephone,
                  email: email,
                  password: hashedPassord,
                  adress: adress,
                },
                { where: { id: id } }
              )
                .then((response) => {
                  if (!response) {
                    reject("error for update");
                  } else {
                    resolve("update success");
                  }
                })
                .catch((err) => reject(err));
            });
          } else {
            reject("This email is used");
          }
        });
      }
    });
  });
};

// delete user
exports.delete_user = (id) => {
  return new Promise((resolve, reject) => {
    db.Users.destroy({ where: { id: id } }).then((user) => {
      if (!user) {
        reject("erorr for delete thes is user");
      } else {
        resolve({ Success: true, message: "user is delete by Success" });
      }
    });
  });
};

// count  All consultant
exports.countAll_consultant = () => {
  return new Promise((resolve, reject) => {
    db.Users.count({ where: { role: "consultant" } }).then((Nbr_C) => {
      if (!Nbr_C) {
        reject("aucun consultant");
      } else {
        resolve(Nbr_C);
      }
    });
  });
};
// count  All entreprise
exports.countAll_entreprise = () => {
  return new Promise((resolve, reject) => {
    db.Users.count({ where: { role: "entreprise" } }).then((Nbr_E) => {
      if (!Nbr_E) {
        reject("aucun entreprise");
      } else {
        resolve(Nbr_E);
      }
    });
  });
};
// count  All norme
exports.countAll_norme = () => {
  return new Promise((resolve, reject) => {
    db.Normes.count().then((Nbr_N) => {
      if (!Nbr_N) {
        reject("aucun norme");
      } else {
        resolve(Nbr_N);
      }
    });
  });
};
// count  All project
exports.countAll_project = () => {
  return new Promise((resolve, reject) => {
    db.Projet.count().then((Nbr_P) => {
      if (!Nbr_P) {
        reject("aucun project");
      } else {
        resolve(Nbr_P);
      }
    });
  });
};

/// ---------------------------------> new function get all projects -*------->
const getUserId = async (id) => {
  const variable = await db.Users.findOne({ where: { id: id } }).then(
    (result) => {
      return result;
    }
  );
  return variable;
};

exports.getAllCon = async (req, res, next) => {
  try {
    const users = await db.Consultant.findAll().then((result) => {
      return result;
    });

    let listId = [];
    let index = 0;
    users.forEach(async (element) => {
      listId.push(await getUserId(element.UserId));
      if (index == users.length - 1) {
        res.status(200).send({ users, listId });
      }
      index++;
    });
  } catch (error) { }
};

exports.getAllEntreprise = async (req, res, next) => {
  try {
    const users = await db.Entreprise.findAll().then((result) => {
      return result;
    });

    let listId = [];
    let index = 0;
    users.forEach(async (element) => {
      listId.push(await getUserId(element.UserId));
      if (index == users.length - 1) {
        res.status(200).send({ users, listId });
      }
      index++;
    });
  } catch (error) { }
};

// const getConsultantId = async (_id) => {
//   const userId = await db.Consultant.findOne({ where: { UserId: _id } }).then(
//     (result) => {
//       return result.id;
//     }
//   );

//   return userId;
// };

// exports.getAllC = async (req, res, next) => {
//   try {
//     const users = await db.Users.findAll({
//       where: { role: "consultant" },
//     }).then((result) => {
//       return result;
//     });

//     let listId = [];
//     let index = 0;

//     // users.forEach(async (element) => {
//     //     console.log(element.id);
//     //     listId.push(await consultantId(element.id));
//     // });

//     listId.push(getConsultantId(users[0].id));

//     res.json({ users, listId });
//   } catch (error) {}
// };

exports.decodeToken = async (req, res, next) => {
  try {
    const PrivateKey = process.env.PRIVATE_KEY;
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, PrivateKey, (error, decoded) => {
      if (decoded) {
        res.status(200).send(decoded);
      }
      if (error) {
        res.status(401).send({ Message: "error while decoding token ! token invalid" });
      }
    });
  } catch (error) {
    res.status(400).send({ Message: "make sure that you are singed in ! " });
  }
};
