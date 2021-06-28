import db from '../db';

class Parcel {
  async create(data) {
    const createParcel = `INSERT INTO parcels (
        "pickupLocation",
        "deliveryLocation", 
        "presentLocation", 
        "receiverPhone",
        "receiverEmail", 
        "description", 
        "weight", 
        "createdBy",
        "createdAt", 
        "updatedAt",
        "status"
      )
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    returning *`;
    const values = [
      data.pickupLocation,
      data.deliveryLocation,
      data.presentLocation,
      data.receiverPhone,
      data.receiverEmail,
      data.description,
      data.weight,
      data.createdBy,
      new Date(),
      new Date(),
      data.status,
    ];

    const { rows } = await db.query(createParcel, values);
    return rows[0];
  }

  async getById(id) {
    const text = 'SELECT * FROM parcels WHERE id = $1';
    const { rows } = await db.query(text, [id]);
    return rows[0];
  }

  async getByField(field, value) {
    const text = `SELECT * FROM parcels WHERE "${field}" = $1`;
    const { rows } = await db.query(text, [value]);
    return rows[0];
  }

  async getManyByField(field, value) {
    const text = `SELECT * FROM parcels WHERE "${field}" = $1`;
    const { rows } = await db.query(text, [value]);
    return rows;
  }

  async getAllUserParcels() {
    const text = 'SELECT * FROM parcels';
    const { rows } = await db.query(text);
    return rows;
  }

  async getAllParcels() {
    const text = 'SELECT * FROM parcels';
    const { rows } = await db.query(text);
    return rows;
  }

  async cancelOrder(field, id) {
    const text = 'UPDATE parcels SET "status" = $1 WHERE id = $2 RETURNING *';
    const { rows } = await db.query(text, [field, id]);
    return rows[0];
  }

  async update(data, id) {
    const fields = Object.keys(data);
    let setString = '';
    const placeHolders = [id];
    fields.forEach((fieldName, index) => {
      const placeHolderNumber = index + 2;
      setString = `${setString}, "${fieldName}" = $${placeHolderNumber}`;
      placeHolders.push(data[fieldName]);
    });
    setString = setString.slice(2);
    const date = new Date().toUTCString();
    setString = `${setString}, "updatedAt" = '${date}'`;
    const text = `UPDATE parcels SET ${setString} WHERE id = $1 RETURNING *`;
    const { rows } = await db.query(text, placeHolders);
    return rows[0];
  }
}

export default new Parcel();
