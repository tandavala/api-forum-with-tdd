'use strict';

const { test, trait } = use('Test/Suite')('Thread');
const Thread = use('App/Models/Thread');

trait('Test/ApiClient');
trait('DatabaseTransactions');

test('can create threads', async ({ client }) => {
  const response = await client.post('/threads').send({
    title: 'test title',
    body: 'body',
  }).end();

  response.assertStatus(200);
  const thread = await Thread.firstOrFail();
  response.assertJSON({ thread: thread.toJSON() });
});

test('can delete threads', async ({ assert, client }) => {
  const thread = await Thread.create({
    title: 'test title',
    body: 'test body',
  });

  const response = await client.delete(`threads/${thread.id}`).send().end();
  assert.equal(await Thread.getCount(), 0);
  response.assertStatus(204);
});
