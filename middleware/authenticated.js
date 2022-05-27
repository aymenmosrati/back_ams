const jwt = require("jsonwebtoken");

const PrivateKey = process.env.PRIVATE_KEY;

const isAuthenticated = (req, res, next) => {
  try {
  const token = req.headers.authorization.split(" ")[1];
  //console.log(token );
  if (token) {
    jwt.verify(token, process.env.PRIVATE_KEY_JWT, (error, decoded) => {
      next();
    });
  } else {
    res.status(401).send({ error: " you dont have access" });
  }
  } catch (error) {
   console.log(error,": lsmdjfkhgb;"); 
  }
};

const isAdmin = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //console.log(token);
    if (token != null) {
      jwt.verify(token, process.env.PRIVATE_KEY_JWT, (error, decoded) => {
        if (decoded?.role == "admin") {
          next();
        } else {
          res.status(401).send({ message: "only admin have access to this route" });
        }
      });
    }
  } catch (error) {
    res.status(401).send({ message: "no token found" });
  }
};

const isConsultant = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //console.log(token);
    if (token != null) {
      jwt.verify(token, process.env.PRIVATE_KEY_JWT, (error, decoded) => {
        if (decoded?.role == "consultant") {
          next();
        } else {
          res
            .status(401)
            .send({ message: "only consultant have access to this route" });
        }
      });
    }
  } catch (error) {
    res.status(401).send({ message: "no token found" });
  }
};

const isEntreprise = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //console.log(token);
    if (token != null) {
      jwt.verify(token, process.env.PRIVATE_KEY_JWT, (error, decoded) => {
        if (decoded?.role == "entreprise") {
          next();
        } else {
          res
            .status(401)
            .send({ message: "only entreprise have access to this route" });
        }
      });
    }
  } catch (error) {
    res.status(401).send({ message: "no token found" });
  }
};

module.exports = { isAuthenticated, isAdmin, isConsultant, isEntreprise };