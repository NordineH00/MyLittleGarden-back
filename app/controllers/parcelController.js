/* eslint-disable no-await-in-loop */
/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
const parcelDatamapper = require('../models/parcel');
const userDataMapper = require('../models/user');
const cropDataMapper = require('../models/crop');
const userHasCropDataMapper = require('../models/user_has_plant');

const parcelController = {

  async getAllParcels(_, res) {
    const parcels = await parcelDatamapper.findAllParcels();
    return res.json(parcels);
  },

  // get request on page parcel
  async getUserParcel(req, res, next) {
    try {
      const userId = Number(req.params.user, 10);

      if (Number.isNaN(userId)) {
        return next();
      }

      const user = await userDataMapper.findByPK(userId);
      if (!user) {
        return res.status(401).json({ message: 'This user does not exists' });
      }

      const userHasCrop = await parcelDatamapper.findAllCropsInParcel(userId);
      console.log(userHasCrop);

      res.json(userHasCrop);
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  // patch request on page parcel
  async patchUserParcel(req, res) {
    try {
      const userHasCrops = req.body;
      console.log(userHasCrops);
      // console.log(JSON.stringify(obj1) === JSON.stringify(obj2))
      for (const crop of userHasCrops) {
        const userHasCropsReadingDB = await userHasCropDataMapper.findByInfo(crop);
        console.log('userhascropsreadingdb', JSON.stringify(userHasCropsReadingDB));
        console.log('crop', JSON.stringify(crop));
        if (JSON.stringify(userHasCropsReadingDB) === JSON.stringify(crop)) {
          console.log('déjà présent en bdd');
        } else {
          // const userHasCropTable = await userHasCropDataMapper.update(crop);
          await userHasCropDataMapper.insertSavedParcel(crop);
        }
      }
      res.send('Parcel bien sauvegardé');
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  // delete request on delete parcel
  async deleteParcel(req, res) {
    try {
      const userId = Number(req.params.user, 10);
      await userHasCropDataMapper.findByPk(userId);
      await userHasCropDataMapper.delete(userId);
      console.log('All crops from parcel have been removed');
      res.send('deleteParcel');
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  async AddCropInParcel(req, res, next) {
    try {
      const cropId = parseInt(req.params.cropid, 10);
      if (Number.isNaN(cropId)) {
        return next();
      }
      const crop = await cropDataMapper.findByPk(cropId);
      if (!crop) {
        return res.status(401).json({ message: 'This crop does not exists' });
      }

      const userid = parseInt(req.params.userid, 10);
      if (Number.isNaN(userid)) {
        return next();
      }
      const user = await userDataMapper.findByPK(userid);
      if (!user) {
        return res.status(401).json({ message: 'This user does not exists' });
      }

      const parcel = await parcelDatamapper.findParcelByUserId(userid);
      if (!parcel) {
        return res.status(401).json({ message: 'This parcel does not exists' });
      }

      const dataCrop = {
        user_id: user.id,
        crop_id: crop.id,
        parcel_id: parcel.id,
        position_x: req.body.position_x,
        position_y: req.body.position_y,
      };

      const filledBox = await userHasCropDataMapper.findPositionInParcel(dataCrop);

      if (filledBox) {
        return res.status(401).json({ message: 'This position is taken' });
      }

      // insertIntoParcel
      await userHasCropDataMapper.insertCropInParcel(dataCrop);

      res.send(`crop ${cropId} ajouté dans la parcelle de ${user.user_name}`);
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

  async DeleteCropInParcel(req, res, next) {
    try {
      const cropId = parseInt(req.params.cropid, 10);
      if (Number.isNaN(cropId)) {
        return next();
      }
      const crop = await cropDataMapper.findByPk(cropId);
      if (!crop) {
        return res.status(401).json({ message: 'This crop does not exists' });
      }

      const userid = parseInt(req.params.userid, 10);
      if (Number.isNaN(userid)) {
        return next();
      }
      const user = await userDataMapper.findByPK(userid);
      if (!user) {
        return res.status(401).json({ message: 'This user does not exists' });
      }

      const parcel = await parcelDatamapper.findParcelByUserId(userid);
      if (!parcel) {
        return res.status(401).json({ message: 'This parcel does not exists' });
      }

      const dataCrop = {
        user_id: user.id,
        crop_id: crop.id,
        parcel_id: parcel.id,
        position_x: req.body.position_x,
        position_y: req.body.position_y,
      };

      const cropInParceExist = await userHasCropDataMapper.findOneCropInParcel(dataCrop);

      if (!cropInParceExist) {
        return res.status(401).json({ message: `${crop.name} inexistante dans cette position  !` });
      }

      await userHasCropDataMapper.deleteCropIntoParcel(dataCrop);

      res.send(` ${crop.name} en position_x${dataCrop.position_x}, position_y ${dataCrop.position_y} supprimé de la parcelle à ${user.user_name}`);
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  },

};

module.exports = parcelController;
