import Parcel from '../models/Parcel';

const parcelController = {
  createParcel: async (req, res) => {
    try {
      const newParcel = await Parcel.create({ ...req.body, status: 'pending', createdBy: req.decoded.id });
      res.status(201).json(newParcel);
    } catch (error) {
      return res.status(500).json({ error: 'internal server error', stack: error });
    }
  },

  editParcel: async (req, res) => {
    try {
      const foundParcel = await Parcel.getById(req.params.parcelId);
      if (!foundParcel) {
        return res.status(404).json({ error: 'parcel not found' });
      }
      const updatedParcel = await Parcel.update(req.body, req.params.parcelId);
      return res.status(200).json(updatedParcel);
    } catch (error) {
      return res.status(500).json({ error: 'internal server error', stack: error });
    }
  },

  getOneParcel: async (req, res) => {
    try {
      const foundParcel = await Parcel.getById(req.params.parcelId);
      if (!foundParcel) {
        return res.status(404).json({ error: 'parcel not found' });
      }
      return res.status(200).json(foundParcel);
    } catch (error) {
      return res.status(500).json({ error: 'internal server error', stack: error });
    }
  },

  cancelParcelOrder: async (req, res) => {
    try {
      const foundParcel = await Parcel.getById(req.params.parcelId);
      if (!foundParcel) {
        return res.status(404).json({ error: 'parcel not found' });
      }
      if (foundParcel.status === 'delivered') {
        return res.status(401).json({ error: 'parcel has already been delivered' });
      }
      const updatedParcel = await Parcel.update({ status: 'cancelled' }, req.params.parcelId);
      return res.status(200).json(updatedParcel);
    } catch (error) {
      return res.status(500).json({ error: 'internal server error', status: error });
    }
  },

  changeParcelLocation: async (req, res) => {
    try {
      const foundParcel = await Parcel.getById(req.params.parcelId);
      if (!foundParcel) {
        return res.status(404).json({ error: 'parcel not found' });
      }
      if (foundParcel.status === 'delivered') {
        return res.status(401).json({ error: 'parcel has already been delivered' });
      }
      const updatedParcel = await Parcel.update(req.body, req.params.parcelId);
      return res.status(200).json(updatedParcel);
    } catch (error) {
      return res.status(500).json({ error: 'internal server error', stack: error });
    }
  },

  changeParcelDestination: async (req, res) => {
    try {
      const foundParcel = await Parcel.getById(req.params.parcelId);
      if (!foundParcel) {
        return res.status(404).json({ error: 'parcel not found' });
      }
      if (foundParcel.status === 'delivered') {
        return res.status(401).json({ error: 'parcel has already been delivered' });
      }
      const updatedParcel = await Parcel.update(req.body, req.params.parcelId);
      console.log('updatedParcel:', updatedParcel);
      return res.status(200).json(updatedParcel);
    } catch (error) {
      return res.status(500).json({ error: 'internal server error', stack: error });
    }
  },

  getUserParcels: async (req, res) => {
    try {
      const foundUserParcels = await Parcel.getByField('createdBy', req.decoded.id);
      console.log(foundUserParcels);
      if (!foundUserParcels) {
        return res.status(404).json({ error: 'no parcels found' });
      }
      return res.status(200).json(foundUserParcels);
    } catch (error) {
      return res.status(500).json({ error: 'internal server error', stack: error });
    }
  },

  getAllParcels: async (req, res) => {
    try {
      const parcels = await Parcel.getAllParcels();
      return res.status(200).json(parcels);
    } catch (error) {
      return res.status(500).json({ error: 'internal server error' });
    }
  },
  // getUserDeliveredParcels
  getDeliveredParcels: async (req, res) => {
    try {
      const parcels = await Parcel.getManyByField('status', 'delivered');
      // console.log(parcels)
      return res.status(200).json(parcels);
    } catch (error) {
      return res.status(500).json({ error: 'internal server error' });
    }
  },
  getPendingOrders: async (req, res) => {
    try {
      const parcels = await Parcel.getManyByField('status', 'pending');
      return res.status(200).json(parcels);
    } catch (error) {
      return res.status(500).json({ error: 'internal server error' });
    }
  },
  // All => admin
  getAllCanceledOrders: async (req, res) => {
    try {
      const parcels = await Parcel.getManyByField('status', 'cancelled');
      return res.status(200).json(parcels);
    } catch (error) {
      return res.status(500).json({ error: 'internal server error' });
    }
  },
};

export default parcelController;
