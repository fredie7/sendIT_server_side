import User from '../models/User';

const userController = {
  getUserProfile: async (req, res) => {
    try {
      const foundUser = await User.getById(req.params.userId);
      if (!foundUser) {
        return res.status(404).json({ error: 'user not found' });
      }
      return res.status(200).json(foundUser);
    } catch (error) {
      return res.status(500).json({ error: 'internal server error' });
    }    
  },
};

export default userController;
