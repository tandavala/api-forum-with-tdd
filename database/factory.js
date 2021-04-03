'use strict';

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');

Factory.blueprint('App/Models/Thread', (faker) => ({
  title: faker.word(),
  body: faker.paragraph(),
}));

Factory.blueprint('App/Models/User', (faker) => ({
  username: faker.username(),
  email: faker.email(),
  password: '123456',
}));
