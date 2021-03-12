require('module-alias/register');

import chai from 'chai';
// tslint:disable-next-line: import-name
import spies from 'chai-spies';
chai.use(spies);
import chaiHttp from 'chai-http';
import { Application } from 'express';
import { respositoryContext, testAppContext } from '../../mocks/app-context';

import { App } from '../../../src/server';

chai.use(chaiHttp);
const expect = chai.expect;
let expressApp: Application;

before(async () => {
  await respositoryContext.store.connect();
  const app = new App(testAppContext);
  app.initializeMiddlewares();
  app.initializeControllers();
  app.initializeErrorHandling();
  expressApp = app.expressApp;
});

describe('POST /todos', () => {
  it('should create a new todo when todo is not empty', async () => {
    const res = await chai.request(expressApp).post('/todos').send({
      title: 'Automate test case title',
    });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('id');
    expect(res.body).to.have.property('title');
    expect(res.body.title).to.equal('Automate test case title');

  });
  it('should return a validation error if title is empty', async () => {
    const res = await chai.request(expressApp).post('/todos').send({
      title: '',
    });

    expect(res).to.have.status(400);
    expect(res.body.failures).to.have.deep.members([
            { field: 'title', message: 'Please provide a title.' },
    ]);
  });

});

describe('delete /todo/:id', () => {
  it('should return 204 if id is valid', async () => {
    const resCreate = await chai.request(expressApp).post('/todos').send({
      title: 'This todo will get deleted',
    });
    const res = await chai.request(expressApp).delete(`/todos/${resCreate.body.id}`);

    expect(res).to.have.status(204);
  });

  it('should return 404 if id is empty', async () => {
    const res = await chai.request(expressApp).delete('/todos/');

    expect(res).to.have.status(404);
  });

  it('should return 404 if todo not present', async () => {
    const resCreate = await chai.request(expressApp).post('/todos').send({
      title: 'This todo will not get deleted',
    });

    const resDelete = await chai.request(expressApp).delete(`/todos/${resCreate.body.id}`);

    const resDeleteAgain = await chai.request(expressApp).delete(`/todos/${resCreate.body.id}`);

    expect(resDeleteAgain).to.have.status(404);
  });

});

describe('PUT /todos/:id', () => {

  it('should return 204 if todoitem is present', async () => {
    const resCreate = await chai.request(expressApp).post('/todos').send({
      title: 'This title will update',
    });

    const resUpdate = await chai.request(expressApp).put(`/todos/${resCreate.body.id}`).send({
      title: 'New title',
    });
    expect(resUpdate).to.have.status(200);
    expect(resUpdate.body.title).to.equal('New title');
  });

  it('should return a validation error 400 if title is not present.', async () => {
    const resCreate = await chai.request(expressApp).post('/todos').send({
      title: 'This Title will not update',
    });

    const res = await chai.request(expressApp).put(`/todos/${resCreate.body.id}`).send({
      title: '',
    });
    expect(res).to.have.status(400);
    expect(res.body.failures).to.have.deep.members([
        { field: 'title', message: 'Please provide a title.' },
    ]);
  });

  it('should return 404 if id is not present in url', async () => {
    const res = await chai.request(expressApp).put('/todos/');
    expect(res).to.have.status(404);
  });

  it('should return 404 if todo id not present in db', async () => {
    const resCreate = await chai.request(expressApp).post('/todos').send({
      title: 'Try to update title',
    });

    await chai.request(expressApp).delete(`/todos/${resCreate.body.id}`);
    const resUpdated = await chai.request(expressApp).put(`/todos/${resCreate.body.id}`).send({
      title: 'New title',
    });
    expect(resUpdated).to.have.status(404);
  });
});

describe('get /todo/:id', () => {
  it('should return 200 if id is valid', async () => {
    const resCreate = await chai.request(expressApp).post('/todos').send({
      title: 'Todo created to fetch',
    });
    const res = await chai.request(expressApp).get(`/todos/${resCreate.body.id}`);

    expect(res).to.have.status(200);
  });

  it('should return 404 if todo not present', async () => {
    const resCreate = await chai.request(expressApp).post('/todos').send({
      title: 'This todo will not get deleted',
    });

    const resDelete = await chai.request(expressApp).delete(`/todos/${resCreate.body.id}`);

    expect(resDelete).to.have.status(204);

    const resFetch = await chai.request(expressApp).get(`/todos/${resCreate.body.id}`);

    expect(resFetch).to.have.status(404);
  });

});
