'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.get('/', () => ({ greeting: 'Hello world in JSON' }));

Route.group(() => {
  Route.get('', 'ThreadController.index');
  Route.post('', 'ThreadController.store').middleware('auth').validator('StoreThread');
  Route.get(':id', 'ThreadController.show');
  Route.put(':id', 'ThreadController.update').middleware('auth', 'modifyThreadPolicy').validator('StoreThread');
  Route.delete(':id', 'ThreadController.destroy').middleware('auth', 'modifyThreadPolicy');
}).prefix('threads');
