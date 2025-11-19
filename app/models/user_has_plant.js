const client = require('../config/db');

module.exports = {

  async insert(userId, parcelId) {
    const preparedQuery = {
      text: `
                INSERT INTO "user_has_crop"
                (
                    "user_id",
                    "parcel_id",
                    "position_x",
                    "position_y"
                )
                VALUES ($1, $2, $3, $4);
            `,
      values: [
        userId.id,
        parcelId.id,
        -1,
        -1,
      ],
    };

    const result = await client.query(preparedQuery);
    console.log(result.rows[0]);
    return result.rows[0];
  },

  async insertSavedParcel(data) {
    const preparedQuery = {
      text: `
                INSERT INTO "user_has_crop"
                (
                    "user_id",
                    "crop_id",
                    "parcel_id",
                    "position_x",
                    "position_y"
                )
                VALUES ($1, $2, $3, $4, $5);
            `,
      values: [
        data.user_id,
        data.crop_id,
        data.parcel_id,
        data.position_x,
        data.position_y,
      ],
    };
    const result = await client.query(preparedQuery);
    return result.rows[0];
  },

  async findByInfo(data) {
    const preparedQuery = {
      text: `
                SELECT * 
                FROM "user_has_crop"
                WHERE "parcel_id" = $1 AND "position_x"= $2 AND "position_y" = $3
            `,
      values: [
        data.parcel_id, data.position_x, data.position_y,
      ],
    };
    const result = await client.query(preparedQuery);
    return result.rows[0];
  },

  async update(data) {
    const request = await client.query(
      `
                UPDATE "user_has_crop" SET
                    crop_id = $1
                WHERE parcel_id = $2 AND position_x = $3 AND position_y = $4 
                RETURNING *
            `,
      [data.crop_id, data.parcel_id, data.position_x, data.position_y],
    );
    return request.rows[0];
  },

  async findByPk(userId) {
    const result = await client.query(
      `
            SELECT * 
            FROM "user_has_crop"
            WHERE "user_id" = $1
            `,
      [
        userId,
      ],
    );
    return result.rows[0];
  },

  async delete(userId) {
    const result = await client.query(`UPDATE "user_has_crop" SET
        crop_id = null
    WHERE user_id = $1
    RETURNING *`, [userId]);
    console.log('All crops from parcel have been removed');
    return !!result.rowCount;
  },

  async findPositionInParcel(dataCrop) {
    const result = await client.query(
      `
        SELECT * 
        FROM "user_has_crop"
        WHERE "parcel_id" = $1
        AND "position_x" = $2
        AND "position_y" = $3
        `,
      [
        dataCrop.parcel_id,
        dataCrop.position_x,
        dataCrop.position_y,
      ],
    );
    return result.rows[0];
  },

  async findOneCropInParcel(dataCrop) {
    const result = await client.query(
      `
        SELECT * 
        FROM "user_has_crop"
        WHERE "user_id" = $1
        AND "crop_id" = $2
        AND "parcel_id" = $3
        AND "position_x" = $4
        AND "position_y" = $5
        `,
      [
        dataCrop.user_id,
        dataCrop.crop_id,
        dataCrop.parcel_id,
        dataCrop.position_x,
        dataCrop.position_y,
      ],
    );
    return result.rows[0];
  },

  async insertCropInParcel(dataCrop) {
    const preparedQuery = {
      text: `
                INSERT INTO "user_has_crop"
                (
                    "user_id",
                    "crop_id",
                    "parcel_id",
                    "position_x",
                    "position_y"
                )
                VALUES ($1, $2, $3, $4, $5);
            `,
      values: [
        dataCrop.user_id,
        dataCrop.crop_id,
        dataCrop.parcel_id,
        dataCrop.position_x,
        dataCrop.position_y,
      ],
    };
    const result = await client.query(preparedQuery);
    return result.rows[0];
  },

  async deleteCropIntoParcel(dataCrop) {
    const result = await client.query(
      `
        DELETE FROM "user_has_crop"
        WHERE "user_id" = $1
        AND "crop_id" = $2
        AND "parcel_id" = $3
        AND "position_x" = $4
        AND "position_y" = $5
        `,
      [
        dataCrop.user_id,
        dataCrop.crop_id,
        dataCrop.parcel_id,
        dataCrop.position_x,
        dataCrop.position_y,
      ],
    );
    return result.rowCount;
  },
};
