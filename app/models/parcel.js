const client = require('../config/db');

module.exports = {
  // méthode pour trouver toutes les parcelles en BDD non utlisé pour
  // le moment pour l'administration plus tard
  async findAllParcels() {
    const result = await client.query(
      `SELECT "user".user_name, parcel.*
        FROM user_has_crop 
        JOIN "parcel" ON "user_has_crop".parcel_id = "parcel".id
        JOIN "user" ON "user_has_crop".user_id = "user".id `,
    );
    return result.rows;
  },
  // méthode pour trouver la parcelle de l'utilisateur via son id
  async findParcelByUserId(userId) {
    const result = await client.query(`SELECT parcel.*
             FROM user_has_crop 
             JOIN "parcel" ON "user_has_crop".parcel_id = "parcel".id
             JOIN "user" ON "user_has_crop".user_id = "user".id
             WHERE "user"."id" = $1`, [userId]);
    return result.rows[0];
  },
  // méthode inutilisé servant à des fins de tests
  async findByPk(parcelId) {
    const result = await client.query('SELECT * FROM "user" WHERE id = $1', [parcelId]);

    return result.rows[0];
  },
  // méthode pour retourner les infos de la parcelle de l'utilisateur
  async getUserParcel(parcelId) {
    const result = await client.query('SELECT * FROM "parcel" WHERE id = $1', [parcelId]);

    return result.rows[0];
  },
  // méthode pour créer une parcelle à l'utilisateur utilisé à la création de l'utilisateur
  async createParcel(userName, UserId) {
    // eslint-disable-next-line no-useless-concat
    const parcelName = `${userName} ` + 'Parcel';
    const preparedQuery = {
      text: `
            INSERT INTO "parcel"
            (
                "id",
                "name",
                "width",
                "height"
            )
            VALUES ($1, $2, $3, $4);
        `,
      values: [
        UserId.id,
        parcelName,
        // on défini la hauteur et la largueur de la parcelle affiché en front
        8,
        5,
      ],
    };
    await client.query(preparedQuery);
    // return parcelName to get Id of the parcel don't touch
    return parcelName;
  },

  async getParcelId(parcelName) {
    const preparedQuery = {
      text: `
                SELECT "id" FROM "parcel" 
                WHERE "name" = $1;`,
      values: [parcelName],
    };
    const result = await client.query(preparedQuery);
    return result.rows[0];
  },

  async delete(id) {
    const result = await client.query('DELETE FROM parcel WHERE id = $1', [id]);
    return !!result.rowCount;
  },

  async insert(data) {
    const preparedQuery = {
      text: `
                INSERT INTO "parcel"
                (
                    "name",
                    "width",
                    "height"
                )
                VALUES ($1, $2, $3);
            `,
      values: [
        data.name,
        data.width,
        data.height,
      ],
    };
    const result = await client.query(preparedQuery);
    return result.rowCount;
  },

  async findAllCropsInParcel(userId) {
    const result = await client.query(`SELECT parcel.name, crop.*, position_x, position_y, parcel_id
             FROM user_has_crop 
             JOIN "parcel" ON "user_has_crop".parcel_id = "parcel".id
             JOIN "crop" ON "user_has_crop".crop_id = "crop".id
             JOIN "user" ON "user_has_crop".user_id = "user".id
             WHERE "user"."id" = $1`, [userId]);
    return result.rows;
  },

  async modifyName(parcelId, parcelName) {
    const result = await client.query(`
            UPDATE "parcel"
            SET name = $1
            WHERE id = $2
            `, [parcelName, parcelId]);
    return result.rows[0];
  },
};
