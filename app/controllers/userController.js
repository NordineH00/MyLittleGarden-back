/* eslint-disable consistent-return */
// on récupére bcrypt pour encrypter les mots de passe
const bcrypt = require('bcrypt');
// on récupére le module jsonwebtoken pour générer un token à chaque connexion et lui
// donner une durée de vie pour sécuriser la transmission d'infos entre back et front et
// bloquer certaines routes si le token est invalide
const jwt = require('jsonwebtoken');
const userDataMapper = require('../models/user');
const parcelDatamapper = require('../models/parcel');
const userHasPlantDatamapper = require('../models/user_has_plant');
// on récupére le schéma de joi pour la validation des infos transmis par l'utilisateur
const schemaRegister = require('../validation/register.schema');

const userController = {

  // méthode inutilisé
  loginUser(req, res) {
    try {
      res.send('loginUserPost');
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },
  // méthode utilisé à des fins de tests pour récupérer l'intégralité des utilisateurs du site
  async getAllUsers(_, res) {
    const users = await userDataMapper.findAll();
    return res.json(users);
  },

  // méthode pour connecter un utilisateur enregistré au site
  async loginUserConnection(req, res) {
    try {
      // on cherche les infos de l'utilisateur via son nom dans la bdd
      const user = await userDataMapper.findByUserName(req.body.user_name);

      if (!user) {
        return res.status(401).json({ message: 'This account does not exist' });
      }
      // on compare le mot de passe qu'il a entré avec le mot de passe en BDD
      const validPassword = await bcrypt.compare(req.body.password, user.password);

      if (!validPassword) {
        return res.status(401).json({ message: 'Bad password' });
      }
      // on créé un token avec jwt et avec les infos de l'utilisateur connecté
      const token = jwt.sign({
        id: user.id,
        user_name: user.user_name,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_DURING });
      // on envoie le token au front-end
      res.json({ access_token: token });
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  // méthode inutilisé
  async registeredUser(req, res) {
    try {
      res.send('loginUserPost');
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  // méthode pour enregistrer un utilisateur en bdd
  async registerUserPost(req, res) {
    try {
      // on récupére dans un objet les infos envoyés par le front
      const dataUser = {
        user_name: req.body.user_name,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        confirm_password: req.body.confirm_password,
      };
      // méthode pour check si les informations sont valides d'après la configuration de joi
      await schemaRegister.validateAsync(dataUser);
      // On hash le password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      // On insére les donnéees de l'utilisateur depuis les formulaires
      const dataUserWithHashedPassword = {
        user_name: dataUser.user_name,
        firstname: dataUser.firstname,
        lastname: dataUser.lastname,
        email: dataUser.email,
        password: hashedPassword,
      };
      // on cherche en BDD via le "user_name" de l'utilisateur
      // si il existe déjà (identificant unique)
      const userByUsername = await userDataMapper.findByUserName(dataUser.user_name);

      if (userByUsername) {
        return res.status(401).json({ message: `This username ${dataUser.user_name} already exists` });
      }
      // on cherche en BDD via l'adresse "email" de l'utilisateur via son adresse mail si un compte
      // a déjà été créé avec ce mail
      const userByEmail = await userDataMapper.findByEmail(dataUser.email);

      if (userByEmail) {
        return res.status(401).json({ message: `An account with this email ${dataUser.email} already exists` });
      }
      // on stocke le nouvel utilisateur avec son password hashé
      await userDataMapper.insert(dataUserWithHashedPassword);
      const userName = req.body.user_name;
      // on cherche l'id de l'utilisateur via son "user_name"
      const UserId = await userDataMapper.findByUserNameGetId(userName);
      // on lui créé une parcelle
      const createParcel = await parcelDatamapper.createParcel(userName, UserId);
      // on récupére l'"id" de la parcelle créée
      const parcelId = await parcelDatamapper.getParcelId(createParcel);
      // On insére dans la table liée "user_has_crop" l'id de l'utilisateur
      // et l'id de sa parcelle pour les lier
      await userHasPlantDatamapper.insert(UserId, parcelId);

      res.json(dataUserWithHashedPassword);
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  // méthode pour récupérer les données de l'utilisateur pour les afficher sur sa page de profil
  async getUserProfil(req, res, next) {
    try {
      const userId = parseInt(req.params.user, 10);
      if (Number.isNaN(userId)) {
        return next();
      }

      const user = await userDataMapper.findByPK(userId);
      if (!user) {
        return res.status(401).json({ message: 'This user does not exists' });
      }
      // on renvoie les infos de l'utilisateur au front
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  // méthode pour mettre à jour le profil de l'utilisateur
  async patchUserProfil(req, res) {
    try {
      const user = await userDataMapper.findByPK(req.params.userid);
      if (!user) {
        return res.status(401).json({ message: 'This user does not exists' });
      }

      const dataUser = {
        user_name: req.body.user_name,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        new_password: req.body.new_password,
      };

      await schemaRegister.validateAsync(dataUser);
      const validPassword = await bcrypt.compare(req.body.password, user.password);

      if (!validPassword) {
        return res.status(401).json({ message: 'Bad password' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.new_password, salt);

      const dataUserWithHashedPassword = {
        user_name: req.body.user_name,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPassword,
      };

      if (user.user_name !== dataUser.user_name) {
        const userByUsername = await userDataMapper.findByUserName(dataUser.user_name);

        if (userByUsername) {
          return res.status(401).json({ message: `This username ${dataUser.user_name} already exists` });
        }
      }

      if (user.email !== dataUser.email) {
        const userByEmail = await userDataMapper.findByEmail(dataUser.email);

        if (userByEmail) {
          return res.status(401).json({ message: `An account with this email ${dataUser.email} already exists` });
        }
      }

      // on envoie les nouvelles infos de l'utilisateur pour mettre à jour
      // la table "user" dans la BDD
      const savedUser = await userDataMapper.update(req.params.userid, dataUserWithHashedPassword);
      return res.json(savedUser);
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  // méthode pour supprimer un utilisateur de la BDD
  async deleteUser(req, res, next) {
    try {
      const userId = parseInt(req.params.user, 10);
      if (Number.isNaN(userId)) {
        return next();
      }
      const user = await userDataMapper.findByPK(userId);
      if (!user) {
        return res.status(401).json({ message: 'This user does not exists' });
      }
      // on supprime les infos sur "user_has_crop"
      await userDataMapper.deleteDataForUserInTableUserHasCrop(userId);
      // on supprime les infos sur "favorite_crop"
      await userDataMapper.deleteDataForUserInTableFavoriteCrop(userId);
      // on supprime les infos sur "user"
      await userDataMapper.delete(userId);
      return res.status(204).json();
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  // méthode pas encore implémenté
  forgotPassword(req, res) {
    try {
      console.log('test');
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },
};

module.exports = userController;
