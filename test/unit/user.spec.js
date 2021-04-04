'use strict';

const { test, trait } = use('Test/Suite')('User');

const Factory = use('Factory');

trait('DatabaseTransactions');

test('is moderator', async ({ assert }) => {
  const user = await Factory.model('App/Models/User').create({ type: 1 });

  assert.isTrue(user.isModerator());
});

test('check is a user not a moderator', async ({ assert }) => {
  const user = await Factory.model('App/Models/User').make();
  assert.isFalse(user.isModerator());
});
