import chaiHttp from 'chai-http';
import chai from 'chai';
import app from '../app';

chai.use(chaiHttp);
chai.should();

describe('POST /api/v1/parcels', () => {
  const user = {
    id: null,
    token: null,
    email: 'felix@test.com',
    password: 'jayjay1',
    name: 'felix',
  };
  const signupData = {
    name: user.name,
    email: user.email,
    password: user.password,
  };
  const signinData = {
    name: user.name,
    email: user.email,
    password: user.password,
  };

  before(async () => {
    let res = await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(signupData);
    user.id = res.body.id;

    res = await chai.request(app)
      .post('/api/v1/auth/signin')
      .send(signinData);
    user.token = res.body.token;
  });

  it('should provide a statusCode of 201', (done) => {
    const order = {
      pickupLocation: 'ikeja',
      deliveryLocation: 'maryland',
      presentLocation: 'ogba',
      receiverPhone: '08076323278',
      receiverEmail: 'felix@gmail.com',
      description: 'felix dummy desc desc',
      weight: 10,
    };
    chai.request(app)
      .post('/api/v1/parcels')
      .set('authorization', user.token)
      .send(order)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('createdBy');
        res.body.createdBy.should.eql(user.id);
        res.body.should.have.property('pickupLocation');
        res.body.should.have.property('deliveryLocation');
        res.body.should.have.property('presentLocation');
        res.body.should.have.property('receiverPhone');
        res.body.should.have.property('receiverEmail');
        res.body.should.have.property('description');
        res.body.should.have.property('weight');
        done();
      });
  });

  it('should fail if any enteries aren\'t provided', (done) => {
    const order = {
      pickupLocation: 'ikeja',
      deliveryLocation: 'maryland',
      presentLocation: 'ogba',
      receiverPhone: '08076323278',
      receiverEmail: 'felix@gmail.com',
      description: 'felix dummy desc desc',
      weight: 10,
    };

    const errorMessages = {
      pickupLocation: 'enter your pickup location',
      deliveryLocation: 'enter your delivery location',
      presentLocation: 'enter your present location',
      receiverPhone: 'enter receiver\'s phone number',
      receiverEmail: 'provide a valid email',
      description: 'a brief description of parcel is required',
      weight: 'fill in appropriate weight measure',
    };

    const requestFields = Object.keys(order);
    requestFields.forEach((field, index) => {
      chai.request(app)
        .post('/api/v1/parcels')
        .set('authorization', user.token)
        .send({
          ...order,
          [field]: '',
        })
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.have.property('error').eql(errorMessages[field]);
          if (index === requestFields.length - 1) {
            done();
          }
        });
    });
  });

  it('checks that receiver\'s email contain an @ symbol', (done) => {
    const order = {
      pickupLocation: 'ikeja',
      deliveryLocation: 'maryland',
      presentLocation: 'ogba',
      receiverPhone: '08076323278',
      receiverEmail: 'receivermail.com',
      description: 'felix dummy desc desc',
      weight: 10,
    };
    chai.request(app)
      .post('/api/v1/parcels')
      .set('authorization', user.token)
      .send(order)
      .end((err, res) => {
        res.should.have.status(422);
        res.body.should.be.a('object');
        res.body.should.have.property('error').eql('provide a valid email');
        done();
      });
  });
});

describe('PUT /api/v1/parcels/:parcelId', () => {
  const user = {
    id: null,
    token: null,
    email: 'felix2@test.com',
    password: 'jayjay1',
    name: 'felix',
  };
  const parcelData = {
    pickupLocation: 'ikeja',
    deliveryLocation: 'maryland',
    presentLocation: 'ogba',
    receiverPhone: '08076543245',
    receiverEmail: 'john@gmail.com',
    description: 'john dummy desc desc',
    weight: 12,
  };
  const signupData = {
    name: user.name,
    email: user.email,
    password: user.password,
  };
  const signinData = {
    email: user.email,
    password: user.password,
  };

  before(async () => {
    let res = await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(signupData);
    user.id = res.body.id;

    res = await chai.request(app)
      .post('/api/v1/auth/signin')
      .send(signinData);
    user.token = res.body.token;

    res = await chai.request(app)
      .post('/api/v1/parcels')
      .set('authorization', user.token)
      .send(parcelData);
    parcelData.id = res.body.id;
  });

  it('shoud update a parcel when valid input is provided', (done) => {
    const parcelUpdateData = {
      pickupLocation: 'ketu',
      deliveryLocation: 'mile2',
      presentLocation: 'ogba',
    };
    chai.request(app)
      .put(`/api/v1/parcels/${parcelData.id}`)
      .set('authorization', user.token)
      .send(parcelUpdateData)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('createdBy');
        res.body.createdBy.should.eql(user.id);
        res.body.should.have.property('pickupLocation');
        res.body.should.have.property('deliveryLocation');
        res.body.should.have.property('presentLocation');
        res.body.should.have.property('receiverPhone');
        res.body.should.have.property('receiverEmail');
        res.body.should.have.property('description');
        res.body.should.have.property('weight');
        // to ensure the updates occured for the specific properties
        res.body.pickupLocation.should.eql(parcelUpdateData.pickupLocation);
        res.body.deliveryLocation.should.eql(parcelUpdateData.deliveryLocation);
        res.body.presentLocation.should.eql(parcelUpdateData.presentLocation);
        // to ensure no other properties where tampered.
        res.body.weight.should.eql(parcelData.weight);
        res.body.description.should.eql(parcelData.description);
        res.body.receiverEmail.should.eql(parcelData.receiverEmail);
        res.body.receiverPhone.should.eql(parcelData.receiverPhone);
        done();
      });
  });

  it('fails when pickupLocation violates minimum number of characters', (done) => {
    const parcelLocationData = {
      pickupLocation: 'k',
    };
    chai.request(app)
      .put(`/api/v1/parcels/${parcelData.id}`)
      .set('authorization', user.token)
      .send(parcelLocationData)
      .end((err, res) => {
        res.should.have.status(422);
        res.body.should.be.a('object');
        res.body.should.have.property('error');
        res.body.error.should.eql('content description should be between 3 - 100 characters');
        done();
      });
  });

  it('fails when no entries are provided', (done) => {
    const parcelOrder = {
      pickupLocation: 'ikeja',
      deliveryLocation: 'maryland',
      presentLocation: 'ogba',
      receiverPhone: '08076543245',
      receiverEmail: 'john@gmail.com',
      description: 'john dummy desc desc',
      weight: 12,
    };

    const errorMessages = {
      pickupLocation: 'enter your pickup location',
      deliveryLocation: 'enter your delivery location',
      presentLocation: 'enter your present location',
      receiverPhone: 'enter receiver\'s phone number',
      receiverEmail: 'enter receiver\'s email',
      description: 'a brief description of parcel is required',
      weight: 'fill in appropriate weight measure',
    };

    const parcelOrderFields = Object.keys(parcelOrder);
    parcelOrderFields.forEach((field, index) => {
      chai.request(app)
        .put(`/api/v1/parcels/${parcelData.id}`)
        .set('authorization', user.token)
        .send({
          ...parcelOrder,
          [field]: '',
        })
        .end((err, res) => {
          res.should.have.status(422);
          res.body.should.have.property('error').eql(errorMessages[field]);
          if (index === parcelOrderFields.length - 1) {
            done();
          }
        });
    });
  });
});

describe('PUT /api/parcels/parcelId/changeParcelLocation', () => {
  const user = {
    id: null,
    token: null,
    name: 'felix',
    email: 'felix@email.com',
    password: 'felix123',
  };
  const parcelData = {
    pickupLocation: 'ikeja',
    deliveryLocation: 'maryland',
    presentLocation: 'ogba',
    receiverPhone: '08076543245',
    receiverEmail: 'john@gmail.com',
    description: 'john dummy desc desc',
    weight: 12,
  };
  const signUpData = {
    name: user.name,
    email: user.email,
    password: user.password,
  };
  const signInData = {
    email: user.email,
    password: user.password,
  };
  before(async () => {
    let res = await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(signUpData);
    user.id = res.body.id;

    res = await chai.request(app)
      .post('/api/v1/auth/signin')
      .send(signInData);
    user.token = res.body.token;

    res = await chai.request(app)
      .post('/api/v1/parcels')
      .set('authorization', user.token)
      .send(parcelData);
    parcelData.id = res.body.id;
    parcelData.createdBy = res.body.createdBy;
  });

  it('must change parcel location', (done) => {
    const changeParcelLocation = {
      presentLocation: 'adamawa',
    };
    chai.request(app)
      .put(`/api/v1/parcels/${parcelData.id}/changeLocation`)
      .set('authorization', user.token)
      .send(changeParcelLocation)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('createdBy');
        res.body.createdBy.should.eql(user.id);
        res.body.should.have.property('presentLocation');
        res.body.should.have.property('pickupLocation');
        res.body.should.have.property('deliveryLocation');
        res.body.should.have.property('receiverPhone');
        res.body.should.have.property('receiverEmail');
        res.body.should.have.property('description');
        res.body.should.have.property('weight');
        res.body.presentLocation.should.eql(changeParcelLocation.presentLocation);
        res.body.pickupLocation.should.eql(parcelData.pickupLocation);
        res.body.deliveryLocation.should.eql(parcelData.deliveryLocation);
        res.body.receiverPhone.should.eql(parcelData.receiverPhone);
        res.body.receiverEmail.should.eql(parcelData.receiverEmail);
        res.body.description.should.eql(parcelData.description);
        res.body.weight.should.eql(parcelData.weight);
        done();
      });
  });

  it('fails when a wrong or non-existent parcelId is used in the request', (done) => {
    chai.request(app)
      .get('/api/v1/parcels/878dd/destination')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it('fails when no delivery location is provided', (done) => {
    const changeDestination = {
      deliveryLocation: '',
    };
    chai.request(app)
      .put(`/api/v1/parcels/${parcelData.id}/destination`)
      .send(changeDestination)
      .end((err, res) => {
        res.should.have.status(403);
        done();
      });
  });
});

describe('GET /api/v1/parcels', () => {
  const user = {
    id: null,
    token: null,
    email: 'felix3@test.com',
    password: 'jayjay1',
    name: 'felix',
  };
  const parcelData = {
    pickupLocation: 'ikeja',
    deliveryLocation: 'maryland',
    presentLocation: 'ogba',
    receiverPhone: '08076543245',
    receiverEmail: 'john@gmail.com',
    description: 'john dummy desc desc',
    weight: 12,
  };
  const signupData = {
    name: user.name,
    email: user.email,
    password: user.password,
  };
  const signinData = {
    email: user.email,
    password: user.password,
  };

  before(async () => {
    let res = await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(signupData);
    user.id = res.body.id;

    res = await chai.request(app)
      .post('/api/v1/auth/signin')
      .send(signinData);
    user.token = res.body.token;

    res = await chai.request(app)
      .post('/api/v1/parcels')
      .set('authorization', user.token)
      .send(parcelData);
    parcelData.id = res.body.id;
    parcelData.createdBy = res.body.createdBy;
  });

  it('should return all parcels', (done) => {
    chai.request(app)
      .get('/api/v1/parcels')
      .set('authorization', user.token)
      .end((err, res) => {
        res.should.have.status(200);
        (res.body.length > 1).should.eql(true);
        done();
      });
  });
});

describe('GET /api/v1/parcels/:parcelId', () => {
  const user = {
    id: null,
    token: null,
    email: 'felix2@test.com',
    password: 'jayjay1',
    name: 'felix',
  };
  const parcelData = {
    pickupLocation: 'ikeja',
    deliveryLocation: 'maryland',
    presentLocation: 'ogba',
    receiverPhone: '08076543245',
    receiverEmail: 'john@gmail.com',
    description: 'john dummy desc desc',
    weight: 12,
  };
  const signupData = {
    name: user.name,
    email: user.email,
    password: user.password,
  };
  const signinData = {
    email: user.email,
    password: user.password,
  };

  before(async () => {
    let res = await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(signupData);
    user.id = res.body.id;

    res = await chai.request(app)
      .post('/api/v1/auth/signin')
      .send(signinData);
    user.token = res.body.token;

    res = await chai.request(app)
      .post('/api/v1/parcels')
      .set('authorization', user.token)
      .send(parcelData);
    parcelData.id = res.body.id;
    parcelData.createdBy = res.body.createdBy;
  });

  it('should return one parcel', (done) => {
    chai.request(app)
      .get(`/api/v1/parcels/${parcelData.id}`)
      .set('authorization', user.token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.id.should.eql(parcelData.id);
        res.body.createdBy.should.eql(parcelData.createdBy);
        res.body.pickupLocation.should.eql(parcelData.pickupLocation);
        res.body.deliveryLocation.should.eql(parcelData.deliveryLocation);
        res.body.presentLocation.should.eql(parcelData.presentLocation);
        res.body.receiverPhone.should.eql(parcelData.receiverPhone);
        res.body.receiverEmail.should.eql(parcelData.receiverEmail);
        res.body.description.should.eql(parcelData.description);
        res.body.weight.should.eql(parcelData.weight);
        done();
      });
  });
  it('fails when a wrong or missing parcel id is supplied in the request', (done) => {
    chai.request(app)
      .get('/api/v1/parcels/9fea225f-5198-4b8f-ba6c-24987994a43e')
      .set('authorization', user.token)
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it('fails when non uuid parcel id is supplied in the request', (done) => {
    chai.request(app)
      .get('/api/v1/parcels/890fh90')
      .set('authorization', user.token)
      .end((err, res) => {
        res.should.have.status(500);
        done();
      });
  });
});

describe('PUT /api/V1/parcels/parcelId/destination', () => {
  const user = {
    id: null,
    token: null,
    email: 'felix@email.com',
    password: 'felix123',
  };

  const signUpData = {
    name: user.name,
    email: user.email,
    password: user.password,
  };

  const signInData = {
    email: user.email,
    password: user.password,
  };

  const parcelData = {
    pickupLocation: 'ikeja',
    deliveryLocation: 'maryland',
    presentLocation: 'ogba',
    receiverPhone: '08076543245',
    receiverEmail: 'john@gmail.com',
    description: 'john dummy desc desc',
    weight: 12,
  };

  before(async () => {
    let res = await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(signUpData);
    user.id = res.body.id;

    res = await chai.request(app)
      .post('/api/v1/auth/signin')
      .send(signInData);
    user.token = res.body.token;

    res = await chai.request(app)
      .post('/api/v1/parcels')
      .set('authorization', user.token)
      .send(parcelData);
    parcelData.id = res.body.id;
    parcelData.createdBy = res.body.createdBy;
  });

  it('changes the parcel delivery destination', (done) => {
    const changeParcelDestination = {
      deliveryLocation: 'leventis',
    };
    chai.request(app)
      .put(`/api/v1/parcels/${parcelData.id}/destination`)
      .set('authorization', user.token)
      .send(changeParcelDestination)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.a('object');
        res.body.should.have.property('id');
        res.body.id.should.eql(parcelData.id);
        res.body.should.have.property('createdBy');
        res.body.createdBy.should.eql(parcelData.createdBy);
        res.body.should.have.property('pickupLocation');
        res.body.should.have.property('deliveryLocation');
        res.body.should.have.property('presentLocation');
        res.body.should.have.property('receiverPhone');
        res.body.should.have.property('receiverEmail');
        res.body.should.have.property('description');
        res.body.should.have.property('weight');
        res.body.deliveryLocation.should.eql(changeParcelDestination.deliveryLocation);
        res.body.pickupLocation.should.eql(parcelData.pickupLocation);
        res.body.presentLocation.should.eql(parcelData.presentLocation);
        res.body.receiverPhone.should.eql(parcelData.receiverPhone);
        res.body.receiverEmail.should.eql(parcelData.receiverEmail);
        res.body.description.should.eql(parcelData.description);
        res.body.weight.should.eql(parcelData.weight);
        done();
      });
  });

  it('fails when no delivery location is provided', (done) => {
    const changeDestination = {
      deliveryLocation: '',
    };
    chai.request(app)
      .put(`/api/v1/parcels/${parcelData.id}/destination`)
      .send(changeDestination)
      .end((err, res) => {
        res.should.have.status(403);
        done();
      });
  });

  it('fails when a wrong or non-existent parcelId is used in the request', (done) => {
    chai.request(app)
      .get('/api/v1/parcels/878dd/destination')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
});
