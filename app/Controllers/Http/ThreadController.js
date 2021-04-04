'use strict';

const Thread = use('App/Models/Thread');

class ThreadController {
  async store({ request, response, auth }) {
    const thread = await auth.user.threads().create(request.only(['title', 'body']));

    return response.json({ thread });
  }

  async destroy({ params, auth, response }) {
    const thread = await Thread.findOrFail(params.id);
    if (thread.user_id !== auth.user.id) {
      return response.forbidden();
    }
    await thread.delete();

    return response.status(204).json({ message: 'thread delete' });
  }

  async update({
    request, params, response, auth,
  }) {
    const thread = await Thread.findOrFail(params.id);

    if (thread.user_id !== auth.user.id) {
      return response.forbidden();
    }
    thread.merge(request.only(['title', 'body']));
    await thread.save();
    return response.json({ thread });
  }
}

module.exports = ThreadController;
