const client = require('../config/db');

module.exports = {

  async findAll() {
    const result = await client.query('SELECT * FROM "user"');
    return result.rows;
  },

  async findByPK(id) {
    const result = await client.query('SELECT * FROM "user" WHERE "id" = $1', [id]);
    return result.rows[0];
  },

  async findByUserName(username) {
    const preparedQuery = {
      text: `
                SELECT * FROM "user" 
                WHERE "user_name" = $1;`,
      values: [username],
    };
    const result = await client.query(preparedQuery);
    return result.rows[0];
  },

  async findByUserNameGetId(username) {
    const preparedQuery = {
      text: `
            SELECT "id" FROM "user"
            WHERE "user_name" = $1;`,
      values: [username],
    };
    const result = await client.query(preparedQuery);
    return result.rows[0];
  },

  async findByEmail(email) {
    const preparedQuery = {
      text: `
                SELECT * FROM "user" 
                WHERE email = $1;`,
      values: [email],
    };
    const result = await client.query(preparedQuery);
    return result.rows[0];
  },

  async delete(id) {
    const result = await client.query('DELETE FROM "user" WHERE id = $1', [id]);
    return !!result.rowCount;
  },

  async insert(data) {
    const preparedQuery = {
      text: `
                INSERT INTO "user"
                (
                    "user_name",
                    "firstname",
                    "lastname",
                    "email",
                    "password"
                )
                VALUES ($1, $2, $3, $4, $5);
            `,
      values: [
        data.user_name,
        data.firstname,
        data.lastname,
        data.email,
        data.password,
      ],
    };
    const result = await client.query(preparedQuery);
    console.log('insert userdatamapper passed');
    return result.rowCount;
  },

  async update(id, data) {
    const fields = Object.keys(data).map((prop, index) => `"${prop}" = $${index + 1}`);
    const values = Object.values(data);
    const savedUser = await client.query(
      `
                UPDATE "user" SET
                    ${fields}
                WHERE id = $${fields.length + 1}
                RETURNING *
            `,
      [...values, id],
    );

    return savedUser.rows[0];
  },

  async deleteDataForUserInTableUserHasCrop(id) {
    const result = await client.query('DELETE FROM "user_has_crop" WHERE user_id = $1', [id]);
    return !!result.rowCount;
  },

  async deleteDataForUserInTableFavoriteCrop(id) {
    const result = await client.query('DELETE FROM "favorite_crop" WHERE user_id = $1', [id]);
    return !!result.rowCount;
  },

};
