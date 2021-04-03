'use strict';

const Factory = use('Factory');
const { test, trait } = use('Test/Suite')('Thread');
const Thread = use('App/Models/Thread');

trait('Auth/Client');
trait('Test/ApiClient');
trait('DatabaseTransactions');

test('authorized user can create threads', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const attributes = {
    title: 'test title',
    body: 'body',
  };
  const response = await client.post('/threads').loginVia(user).send(attributes).end();

  response.assertStatus(200);

  const thread = await Thread.firstOrFail();
  response.assertJSON({ thread: thread.toJSON() });
  response.assertJSONSubset({ thread: { ...attributes, user_id: user.id } });
});

test('authorized user can delete threads', async ({ assert, client }) => {
  const user = await Factory.model('App/Models/User').create();
  const thread = await Factory.model('App/Models/Thread').create();

  const response = await client.delete(`threads/${thread.id}`).loginVia(user).send().end();
  assert.equal(await Thread.getCount(), 0);
  response.assertStatus(204);
});

test('unauthenticated user cannot create threads', async ({ client }) => {
  const response = await client.post('/threads').send({
    title: 'test thread',
    body: 'this a body',
  }).end();

  response.assertStatus(401);
});

test('unauthenticated user cannot delete threads', async ({ client }) => {
  const thread = await Factory.model('App/Models/Thread').create();
  const response = await client.delete(thread.url()).send().end();
  response.assertStatus(401);
});
