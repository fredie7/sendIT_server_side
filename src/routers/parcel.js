import express from 'express';
import parcelController from '../controllers/parcel';
import verifyToken, { verifyAsAdmin, verifyAsOwner } from '../middlewares/auth';
import parcelValidation from '../middlewares/validations/parcelValidation';

const { 
  createParcelValidation,
  editParcelValidation,
  parceDestinationlValidation,
  parcelLocationValidation,
} = parcelValidation;
const {
  createParcel,
  editParcel,
  getOneParcel,
  cancelParcelOrder,
  changeParcelLocation,
  changeParcelDestination,
  getUserParcels,
  getDeliveredParcels,
  getPendingOrders,
  getAllParcels,
  getAllCanceledOrders,
} = parcelController;


const router = express.Router();

router.post('/parcels', verifyToken, createParcelValidation, createParcel);
router.put('/parcels/:parcelId', verifyToken, editParcelValidation, editParcel);
router.get('/parcels/:parcelId', verifyToken, getOneParcel);
router.put('/parcels/:parcelId/cancel', verifyToken, verifyAsOwner, cancelParcelOrder);
router.put('/parcels/:parcelId/changeLocation', verifyToken, parcelLocationValidation, changeParcelLocation);
router.put('/parcels/:parcelId/destination', verifyToken, verifyAsOwner, parceDestinationlValidation, changeParcelDestination);
// check the next route
router.get('/parcels', verifyToken, getAllParcels);
router.get('/parcels', verifyToken, getUserParcels);
router.get('/parcels/orders/delivered', verifyToken, getDeliveredParcels);
router.get('/parcels/orders/pending', verifyToken, getPendingOrders);
router.get('/parcels/orders/cancelled', verifyToken, getAllCanceledOrders);


module.exports = router;
