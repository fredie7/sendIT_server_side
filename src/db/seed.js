import dotenv from 'dotenv';
import User from '../models/User';
import Parcel from '../models/Parcel';
import hashPassword from '../services/hash';

dotenv.config();

const seedDatabase = async () => {
  const users = [
    {
      name: 'fred',
      email: 'fred@gmail.com',
      password: hashPassword('fredpassword1'),
      isAdmin: true,
    },
    {
      name: 'tarik',
      email: 'tarik@gmail.com',
      password: hashPassword('tarikpassword1'),
      isAdmin: false,
    },
    {
      name: 'jizael',
      email: 'jizael@gmail.com',
      password: hashPassword('jizaelpassword1'),
      isAdmin: false,
    },
  ];

  const seedUsers = users.map(async (userData) => {
    const newUser = await User.create(userData);
    return newUser;
  });
  const insertedUsers = await Promise.all(seedUsers);
  console.log(insertedUsers);

  const parcels = [
    {
      createdBy: insertedUsers[0].id,
      pickupLocation: 'ikeja',
      deliveryLocation: 'maryland',
      presentLocation: 'ogba',
      receiverPhone: '08076543245',
      receiverEmail: 'john@gmail.com',
      description: 'john dummy desc desc',
      weight: '12',
      status: 'delivered',
    },
    {
      createdBy: insertedUsers[0].id,
      pickupLocation: 'abuja',
      deliveryLocation: 'fct',
      presentLocation: 'agege',
      receiverPhone: '08038374245',
      receiverEmail: 'susan@gmail.com',
      description: 'susan dummy desc desc',
      weight: '16',
      status: 'pending',
    },
    {
      createdBy: insertedUsers[0].id,
      pickupLocation: 'delta',
      deliveryLocation: 'asaba',
      presentLocation: 'yaba',
      receiverPhone: '08092647589',
      receiverEmail: 'peter@gmail.com',
      description: 'peter dummy desc desc',
      weight: '12',
      status: 'pending',
    },
  ];

  const seedParcels = parcels.map(async (parcelData) => {
    const newParcel = await Parcel.create(parcelData);
    return newParcel;
  });
  const insertedParcels = await Promise.all(seedParcels);
  console.log(insertedParcels);
};
export default seedDatabase;
