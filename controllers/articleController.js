const db = require("../models");
const Joi = require("joi");
const res = require("express/lib/response");

const SchemaValidation = Joi.object({
  Articles: Joi.string().min(3).required(),
  ChapitreId: Joi.number().required(),
});
// Register for articles
exports.ajoute_articles = (Articles, ChapitreId) => {
  return new Promise((resolve, reject) => {
    let validation = SchemaValidation.validate({ Articles, ChapitreId });
    if (validation.error) {
      reject(validation.error.details[0].message);
    }

    db.Articles.create({
      Articles: Articles,
      ChapitreId: ChapitreId,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((err) => reject(err));
  });
};

// get article by id
exports.getbyId_article = (id) => {
  return new Promise((resolve, reject) => {
    db.Articles.findOne({ where: { id: id } }).then((article) => {
      if (!article) {
        reject("Aucun Article");
      } else {
        resolve(article);
      }
    });
  });
};

// get article by id chapitre
exports.getarticle_byIdchapitre = (id) => {
  return new Promise((resolve, reject) => {
    db.Articles.findAll({ where: { ChapitreId: id } }).then((article) => {
      if (!article) {
        reject("Aucun Article");
      } else {
        resolve(article);
      }
    });
  });
};

// get All articles
exports.getAll_articles = () => {
  return new Promise((resolve, reject) => {
    db.Articles.findAll().then((articles) => {
      if (!articles) {
        reject("Aucun article");
      } else {
        resolve(articles);
      }
    });
  });
};

// update Article
exports.update_article = (id, Articles, ChapitreId) => {
  return new Promise((resolve, reject) => {
    let valide = SchemaValidation.validate({ Articles, ChapitreId });
    if (valide.error) {
      reject(valide.error.details[0].message);
    }
    db.Articles.count({ where: { Articles: Articles } }).then((doc) => {
      if (doc == 0) {
        db.Articles.update(
          {
            Articles: Articles,
            ChapitreId: ChapitreId,
          },
          { where: { id: id } }
        )
          .then((response) => {
            if (!response) {
              reject("Cannot update");
            } else {
              resolve("Updated successfully");
            }
          })
          .catch((err) => reject(err));
      } else if (doc != 0) {
        db.Articles.findOne({ where: { id: id } }).then((res) => {
          if (res.Articles == Articles) {
            db.Articles.update(
              {
                Articles: Articles,
                ChapitreId: ChapitreId,
              },
              { where: { id: id } }
            )
              .then((response) => {
                if (!response) {
                  reject("cannot update");
                } else {
                  resolve("update successfully");
                }
              })
              .catch((err) => reject(err));
          } else {
            reject("this article exists");
          }
        });
      }
    });
  });
};

// delete Article
exports.delete_article = (id) => {
  return new Promise((resolve, reject) => {
    db.Articles.destroy({ where: { id: id } }).then((article) => {
      if (!article) {
        reject("no data deleted");
      } else {
        resolve({ Success: true, message: "article is delete by Success" });
      }
    });
  });
};
