'use strict';

const Thread = use('App/Models/Thread');
const fetch = require('node-fetch');

class ThreadController {
  async index({ response }) {
    const threads = await Thread.all();
    return response.status(200).json({ threads });
  }

  async store({ request, response, auth }) {
    const thread = await auth.user.threads().create(request.only(['title', 'body']));

    return response.json({ thread });
  }

  async show({ params, response }) {
    const thread = await Thread.findOrFail(params.id);
    return response.status(200).json({ thread });
  }

  async destroy({ params, response }) {
    const thread = await Thread.findOrFail(params.id);

    await thread.delete();

    return response.status(204).json({ message: 'thread delete' });
  }

  async update({
    request, params, response,
  }) {
    const thread = await Thread.findOrFail(params.id);

    thread.merge(request.only(['title', 'body']));
    await thread.save();
    return response.json({ thread });
  }
}

module.exports = ThreadController;
