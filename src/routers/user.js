import express from 'express';
import userController from '../controllers/user';
import parcelController from '../controllers/parcel';
import verifyToken from '../middlewares/auth';

const router = express.Router();

const { getUserProfile } = userController;
const { getUserParcels } = parcelController;

router.get('/users/:userId', verifyToken, getUserProfile);
router.get('/users/:userId/parcels', verifyToken, getUserParcels);

module.exports = router;
