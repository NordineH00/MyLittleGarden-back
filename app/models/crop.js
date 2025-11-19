const client = require('../config/db');

module.exports = {

  async findAll() {
    const result = await client.query('SELECT * FROM crop');
    return result.rows;
  },

  async findByPk(cropId) {
    const result = await client.query('SELECT * FROM crop WHERE id = $1', [cropId]);
    return result.rows[0];
  },

  async delete(id) {
    const result = await client.query('DELETE FROM crop WHERE id = $1', [id]);
    return !!result.rowCount;
  },

  async insert(data) {
    const preparedQuery = {
      text: `
                INSERT INTO "crop"
                (
                    "name",
                    "crop_img",
                    "description"
                )
                VALUES ($1, $2, $3);
            `,
      values: [
        data.name,
        data.crop_img,
        data.description,
      ],
    };
    const result = await client.query(preparedQuery);
    return result.rowCount;
  },
};
