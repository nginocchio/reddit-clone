import { expect, server, BASE_URL } from './setup';
import { genHash, findUserById } from '../src/controllers';
import { sign, verify } from 'jsonwebtoken';

describe('Generate password hash', () => {
  const password = 'hello';
  it('hash the password', (done) => {
    const hash = genHash(password);
    expect(hash).to.equal(genHash('hello'));
    done();
  });
});

describe('Retrieve one user', () => {
  it('Should return one user', async () => {
    let res = await findUserById(1);
    expect(res).to.have.property('id');
    expect(res).to.have.property('username');
    expect(res).to.have.property('password');
    expect(res.id).to.equal(1);
  });
});

describe('Register user test', () => {
  const data = { username: 'someuser', password: 'pwd1' };
  it('create a user within the database', (done) => {
    server
      .post(`${BASE_URL}/register`)
      .send(data)
      .expect(201)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.user).to.have.property('id');
        expect(res.body.user).to.have.property('username');
        expect(res.body.user).to.have.property('password');
        expect(res.body).to.have.property('token');
        done();
      });
  });

  it('Reject user that already exists', (done) => {
    server
      .post(`${BASE_URL}/register`)
      .send(data)
      .expect(400)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal('Username already exists');
        done();
      });
  });
});

describe('Log in user test', () => {
  const data = { username: 'someuser', password: 'pwd1' };
  it(`should log in with username ${data.username}`, (done) => {
    server
      .post(`${BASE_URL}/login`)
      .send(data)
      .expect(200)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.user).to.have.property('id');
        expect(res.body.user).to.have.property('username');
        expect(res.body.user).to.have.property('password');
        expect(res.body).to.have.property('token');
        done();
      });
  });
  const invalidUser = { username: 'bdafklnbvna', password: 'ooga' };
  it(`should reject user that doesn't exist`, (done) => {
    server
      .post(`${BASE_URL}/login`)
      .send(invalidUser)
      .expect(401)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.message).to.equal('Invalid credentials');
        done();
      });
  });
});

describe('Create a jsonwebtoken', () => {
  const secret = 'cats';
  const id = 123;

  it('create a jsonwebtoken with payload 123', (done) => {
    const token = sign({ id: id }, secret);
    const decoded = verify(token, secret);
    expect(decoded.id).to.equal(123);
    done();
  });
});
