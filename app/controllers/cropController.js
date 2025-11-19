/* eslint-disable consistent-return */
const cropDataMapper = require('../models/crop');
const favoritecropDataMapper = require('../models/favorite_crop');
const userDataMapper = require('../models/user');

const cropController = {

  // méthode pour afficher toute les infos de tous les plants qui sont en BDD
  async getAllCrops(_, res) {
    const crops = await cropDataMapper.findAll();
    return res.json(crops);
  },

  // méthode pas utilisé pour le moment mais dans une version amélioré du site
  // méthode pour rechercher (en BDD, par son identifiant via la route dynamique)
  // et afficher un plant
  async getOneCrop(req, res, next) {
    try {
      const cropId = parseInt(req.params.id, 10);
      if (Number.isNaN(cropId)) {
        return next();
      }

      const crop = await cropDataMapper.findByPk(cropId);
      if (!crop) {
        return res.status(401).json({ message: 'This crop does not exists' });
      }
      return res.json(crop);
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  // méthode pas utilisé pour le moment mais dans une version amélioré du site
  // méthode pour ajouter un plant en BDD via le site
  async AddOneCrop(req, res) {
    try {
      // On récupére les donnéees d'un plant via le formulaire envoyé depuis le site
      const dataCrop = {
        name: req.body.name,
        crop_img: req.body.crop_img,
        description: req.body.description,
      };
      // On envoie les données pour l'enregistrer en BDD
      await cropDataMapper.insert(dataCrop);
      res.json(dataCrop);
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  // méthode pas utilisé pour le moment mais dans une version amélioré du site
  // méthode utilisé pour supprimer un plant en BDD via le site
  async deleteCrop(req, res, next) {
    try {
      const cropId = parseInt(req.params.id, 10);
      if (Number.isNaN(cropId)) {
        return next();
      }
      // Trouver le plant en BDD via son id
      const crop = await cropDataMapper.findByPk(cropId);
      // si le plant n'existe pas une erreur est envoyée
      if (!crop) {
        return res.status(401).json({ message: 'This crop does not exists' });
      }
      // Supprimer les infos du plant retourné depuis la BDD
      await cropDataMapper.delete(cropId);

      return res.status(204).json();
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  // méthode pour ajouter un crop de la liste des plants dans la liste des favoris
  async AddCropInFavoriteList(req, res, next) {
    try {
      // Récupération de l'id via la route dynamique
      const cropId = parseInt(req.params.cropid, 10);
      if (Number.isNaN(cropId)) {
        return next();
      }
      // Trouver les infos du plant en BDD via son id
      const crop = await cropDataMapper.findByPk(cropId);
      if (!crop) {
        return res.status(401).json({ message: 'This crop does not exists' });
      }

      // Récupération de l'id de l'utilisateur via la route dynamique
      const userid = parseInt(req.params.userid, 10);
      // Si l'info envoyé par la route dynamique n'est pas un nombre cela
      // cause une erreur et n'exécute pas le reste de la méthode
      if (Number.isNaN(userid)) {
        return next();
      }
      // Trouver les infos de l'utilisateur via son id
      const user = await userDataMapper.findByPK(userid);
      if (!user) {
        return res.status(401).json({ message: 'This user does not exists' });
      }
      // Regarder si le plant est déjà en favori sinon on l'insére
      const checkCropExist = await favoritecropDataMapper.checkIfFavoriteCropExist(cropId, userid);
      console.log(checkCropExist);
      if (checkCropExist) {
        console.log('Le légume est déjà en favori');
      } else {
        await favoritecropDataMapper.insertIntoFavoriteList(cropId, userid);
      }
      res.send('crop ajouté au favoris');
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  // méthode pour récupérer depuis la BDD la liste des plants favoris
  async GetFavoriteListForUser(req, res, next) {
    try {
      const userId = parseInt(req.params.userid, 10);
      if (Number.isNaN(userId)) {
        return next();
      }
      // On cherche l'utilisateur correspondant via son id
      const user = await userDataMapper.findByPK(userId);
      if (!user) {
        return res.status(401).json({ message: 'This user does not exists' });
      }
      // On cherche et retourne la liste complête de ses plants
      const favoriteList = await favoritecropDataMapper.findAllCropsFavorite(userId);
      favoriteList.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      res.json(favoriteList);
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  // méthode pour supprimer un plant des favoris
  async DeleteCropInFavoriteList(req, res, next) {
    try {
      const cropId = parseInt(req.params.cropid, 10);
      if (Number.isNaN(cropId)) {
        return next();
      }

      const userid = parseInt(req.params.userid, 10);
      if (Number.isNaN(userid)) {
        return next();
      }
      // On cherche l'utilisateur en BDD via son id
      const user = await userDataMapper.findByPK(userid);
      if (!user) {
        return res.status(401).json({ message: 'This user does not exists' });
      }
      // On supprime le plant des favoris de l'utilisateur
      await favoritecropDataMapper.deleteIntoFavoriteList(cropId, userid);

      return res.status(204).json();
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

};

module.exports = cropController;
