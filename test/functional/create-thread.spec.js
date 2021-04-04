'use strict';

const Factory = use('Factory');
const { test, trait } = use('Test/Suite')('Create Thread');
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

test('can not create a thread with no body or title', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  let response = await client.post('/threads').loginVia(user).send({ title: 'teste title' }).end();

  response.assertStatus(400);

  response = await client.post('/threads').loginVia(user).send({ body: 'body now' }).end();

  response.assertStatus(400);
});
