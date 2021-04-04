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
  const thread = await Factory.model('App/Models/Thread').create();
  const owner = await thread.user().first();
  const response = await client.delete(thread.url()).send().loginVia(owner).end();
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

test('thread can not be deleted by a user who did not create it', async ({ client }) => {
  const thread = await Factory.model('App/Models/Thread').create();
  const notOwner = await Factory.model('App/Models/User').create();
  const response = await client.delete(thread.url()).send().loginVia(notOwner).end();
  response.assertStatus(403);
});

test('authorized user can update title and body of thread', async ({ assert, client }) => {
  const thread = await Factory.model('App/Models/Thread').create();
  const owner = await thread.user().first();
  const attributes = { title: 'new title', body: 'new body' };
  const updatedThreadAttributes = { ...thread.toJSON(), ...attributes };

  const response = await client.put(thread.url()).loginVia(owner).send(attributes).end();
  await thread.reload();

  response.assertStatus(200);
  response.assertJSON({ thread: thread.toJSON() });
  assert.deepEqual(thread.toJSON(), updatedThreadAttributes);
});

test('unathenticated user cannot update threads', async ({ client }) => {
  const thread = await Factory.model('App/Models/Thread').create();
  const response = await client.put(thread.url()).send().end();
  response.assertStatus(401);
});

test('thread can not be update by a user who did not create it', async ({ client }) => {
  const thread = await Factory.model('App/Models/Thread').create();
  const notOwner = await Factory.model('App/Models/User').create();

  const response = await client.put(thread.url()).send().loginVia(notOwner).end();
  response.assertStatus(403);
});

test('can not create thread with no body', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  const response = await client.post('/threads').loginVia(user).send({ title: 'test title' }).end();

  response.assertStatus(400);
});

test('can not create a thread with no body or title', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create();
  let response = await client.post('/threads').loginVia(user).send({ title: 'teste title' }).end();

  response.assertStatus(400);

  response = await client.post('/threads').loginVia(user).send({ body: 'body now' }).end();

  response.assertStatus(400);
});

test('can not update thread with no body or title', async ({ client }) => {
  const thread = await Factory.model('App/Models/Thread').create();
  const owner = await thread.user().first();
  const put = () => client.put(thread.url()).header('accept', 'application/json').loginVia(owner);

  let response = await put().send({ title: 'test title' }).end();
  response.assertStatus(400);
  response.assertJSONSubset([{ message: 'required validation failed on body' }]);

  response = await put().send({ body: 'test body' }).end();
  response.assertStatus(400);
  response.assertJSONSubset([{ message: 'required validation failed on title' }]);
});
