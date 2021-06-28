const parcelValidation = {
    createParcelValidation: (req, res, next) => {
      req.check('pickupLocation', 'enter your pickup location').notEmpty();
      req.check('presentLocation', 'enter your present location').notEmpty();
      req.check('deliveryLocation', 'enter your delivery location').notEmpty().optional();
      req.check('presentLocation').isLength({ min: 2, max: 20 }).withMessage('content should be between 2 - 20 characters');
      req.check('receiverPhone', 'enter receiver\'s phone number').notEmpty();
      req.check('receiverEmail').isEmail().withMessage('provide a valid email').notEmpty();
      req.check('description', 'a brief description of parcel is required').notEmpty();
      req.check('description').isLength({ min: 20, max: 200 }).withMessage('content description should be between 20 - 200 characters');
      req.check('weight', 'fill in appropriate weight measure').notEmpty();
  
      const errors = req.validationErrors();
      if (errors) {
        const firstError = errors.map((err) => err.msg)[0];
        return res.status(422).json({ error: firstError });
      }
      next();
    },
    editParcelValidation: (req, res, next) => {
      req.check('pickupLocation', 'enter your pickup location').notEmpty().optional();
      req.check('deliveryLocation', 'enter your delivery location').notEmpty().optional();
      req.check('pickupLocation').isLength({ min: 3, max: 100 }).withMessage('content description should be between 3 - 100 characters').optional();
      req.check('presentLocation', 'enter your present location').notEmpty().optional();
      req.check('presentLocation').isLength({ min: 2, max: 20 }).withMessage('content should be between 3 - 20 characters').optional();
      req.check('receiverPhone', 'enter receiver\'s phone number').notEmpty().optional();
      req.check('receiverEmail', 'enter receiver\'s email').notEmpty().isEmail().optional();
      req.check('description', 'a brief description of parcel is required').notEmpty().optional();
      req.check('description').isLength({ min: 20, max: 200 }).withMessage('content description should be between 20 - 200 characters').optional();
      req.check('weight', 'fill in appropriate weight measure').notEmpty().optional();
  
      const errors = req.validationErrors();
      if (errors) {
        const firstError = errors.map((err) => err.msg)[0];
        return res.status(422).json({ error: firstError });
      }
      next();
    },
    parcelLocationValidation: (req, res, next) => {
      req.check('pickupLocation', 'enter your pickup location').notEmpty().optional();
      req.check('deliveryLocation', 'enter your delivery location').notEmpty().optional();
      req.check('pickupLocation').isLength({ min: 3, max: 100 }).withMessage('content description should be between 3 - 100 characters').optional();
      req.check('presentLocation', 'enter your present location').notEmpty().optional();
      req.check('presentLocation').isLength({ min: 2, max: 20 }).withMessage('content should be between 3 - 20 characters').optional();
      req.check('receiverPhone', 'enter receiver\'s phone number').notEmpty().optional();
      req.check('receiverEmail', 'enter receiver\'s email').notEmpty().isEmail().optional();
      req.check('description', 'a brief description of parcel is required').notEmpty().optional();
      req.check('description').isLength({ min: 20, max: 200 }).withMessage('content description should be between 20 - 200 characters').optional();
      req.check('weight', 'fill in appropriate weight measure').notEmpty().optional();
      const errors = req.validationErrors();
      if (errors) {
        const firstError = errors.map((err) => err.msg)[0];
        return res.status(422).json({ error: firstError });
      }
      next();
    },
  
  
    parceDestinationlValidation: (req, res, next) => {
      req.check('deliveryLocation', 'enter your delivery location').notEmpty().optional();
      const errors = req.validationErrors();
      if (errors) {
        const firstError = errors.map((err) => err.msg)[0];
        return res.status(422).json({ error: firstError });
      }
      next();
    },
  };
  
  export default parcelValidation;
  