const jwt = require("jsonwebtoken");

const PrivateKey = process.env.PRIVATE_KEY;

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    if (token) {
      jwt.verify(token, process.env.PRIVATE_KEY, (error, decoded) => {
        if (decoded) {
          next();
        } else {
          res.status(401).send({ message: "you don't have access" });
        }
      });
    } else {
      res.status(401).send({ error: " you dont have access" });
    }
  } catch (error) {
    console.log(error, ": lsmdjfkhgb;");
  }
};

const isAdmin = (req, res, next) => {
  try {
    // console.log("====================================");
    // console.log(req.headers.authorization.split(" ")[1]);
    // console.log("====================================");
    const token = req.headers.authorization.split(" ")[1];
    if (token != null) {
      jwt.verify(token, process.env.PRIVATE_KEY, (error, decoded) => {
        // console.log(decoded.role);
        if (decoded.role === "admin") {
          next();
        } else {
          res
            .status(401)
            .send({ message: "only admin have access to this route" });
        }
      });
    }
  } catch (error) {
    res.status(408).send({ message: "no token found" });
  }
};

const isConsultant = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    //console.log(token);
    if (token != null) {
      jwt.verify(token, process.env.PRIVATE_KEY, (error, decoded) => {
        if (decoded?.role === "consultant" || decoded?.role === "admin") {
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
      jwt.verify(token, process.env.PRIVATE_KEY, (error, decoded) => {
        if (decoded?.role === "entreprise" || decoded?.role === "admin") {
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
