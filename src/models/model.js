import { pool } from './pool';

class Model {
  constructor(table) {
    this.pool = pool;
    this.table = table;
    this.pool.on(
      'error',
      (err, client) => `Error, ${err}, on idle client${client}`
    );
  }

  async executeQuery(queryText, queryValues) {
    if (queryValues) {
      return this.pool.query(queryText, queryValues);
    }
    return this.pool.query(queryText);
  }

  async one(id) {
    try {
      let result = await this.pool.query(
        `SELECT * FROM "${this.table}" WHERE id = $1`,
        [id]
      );
      let value = result.rows ? result.rows[0] : null;
      return value;
    } catch (err) {
      throw err;
    }
  }

  async insertWithReturn(columns, values) {
    const query = `
          INSERT INTO ${this.table}(${columns})
          VALUES (${values})
          RETURNING id, ${columns}
      `;
    return this.pool.query(query);
  }
}

export default Model;
