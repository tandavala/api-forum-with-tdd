'use strict';

const { test, trait, before } = use('Test/Suite')('Modify Thread Policy');

const Route = use('Route');
const Factory = use('Factory');

trait('Test/ApiClient');
trait('Auth/Client');
trait('DatabaseTransactions');

before(() => {
  const action = ({ response }) => response.json({ ok: true });
  Route.post('test/modify-thread-policy/:id', action).middleware(['auth', 'modifyThreadPolicy']);
});

test('non create of a thread can not modify it', async ({ client }) => {
  const thread = await Factory.model('App/Models/Thread').create();
  const notOwner = await Factory.model('App/Models/User').create();
  const response = await client.post(`test/modify-thread-policy/${thread.id}`).loginVia(notOwner).send().end();

  response.assertStatus(403);
});

test('creator of the thread can modify it', async ({ client }) => {
  const thread = await Factory.model('App/Models/Thread').create();
  const owner = await thread.user().first();

  const response = await client.post(`test/modify-thread-policy/${thread.id}`).loginVia(owner).send().end();

  response.assertStatus(200);
});
