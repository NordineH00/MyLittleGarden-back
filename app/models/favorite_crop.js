const client = require('../config/db');

module.exports = {
  // méthode pour afficher la liste des plants favoris de l'utilisateur
  async findAllCropsFavorite(userId) {
    // On récupére l'id du plant dans la table favorite crop, on récupére les donnéees
    // de ce plant dans la table crop et on récupére les données de la table user
    const result = await client.query(`SELECT favorite_crop.id, crop.*
             FROM favorite_crop 
             JOIN "crop" ON "favorite_crop".crop_id = "crop".id
             JOIN "user" ON "favorite_crop".user_id = "user".id
             WHERE "user"."id" = $1`, [userId]);
    return result.rows;
  },
  // méthode pour vérifier si le plant est déjà mis en favori
  async checkIfFavoriteCropExist(cropId, userId) {
    const checkIfFavCropExist = await client.query(
      'SELECT * FROM "favorite_crop" WHERE user_id = $1 AND crop_id = $2',
      [userId, cropId],
    );
    return checkIfFavCropExist.rows[0];
  },
  // méthode inutilisé pour le moment pour récupérer un plant de la table "crop" via son id
  async findByPk(cropId) {
    const result = await client.query('SELECT * FROM crop WHERE id = $1', [cropId]);

    return result.rows[0];
  },
  // méthode inutilisé pour le moment pour supprimer un plant de la table "crop" via son id
  async delete(id) {
    const result = await client.query('DELETE FROM crop WHERE id = $1', [id]);
    return !!result.rowCount;
  },
  // méthode pour insérer un plant dans la liste des plants favoris de l'utilisateur
  async insertIntoFavoriteList(cropid, userid) {
    const preparedQuery = {
      text: `
                INSERT INTO favorite_crop 
                (
                    "crop_id",
                    "user_id"
                )
                VALUES ($1, $2);
            `,
      values: [
        cropid,
        userid,
      ],
    };
    const result = await client.query(preparedQuery);
    return result.rowCount;
  },
  // méthode pour supprimer un plant de la liste favori de l'utilisateur
  async deleteIntoFavoriteList(cropid, userid) {
    const result = await client.query(
      `
            DELETE FROM "favorite_crop"
            WHERE "crop_id" = $1
            AND "user_id" = $2
        
        `,
      [
        cropid,
        userid,

      ],
    );
    return result.rowCount;
  },

};
