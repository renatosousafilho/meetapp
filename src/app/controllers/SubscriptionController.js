import SubscriptionValidations from '../validations/SubscriptionValidations';
import Meetup from '../models/Meetup';
import User from '../models/User';
import Subscription from '../models/Subscription';

import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';

class SubscriptionController {
  async index(req, res) {
    const subscriptions = await Subscription.findAll({
      where: {
        user_id: req.userId,
      },

      attributes: ['id', 'created_at'],
      include: [
        { model: Meetup, as: 'meetup', attributes: ['name', 'location', 'start_at'] },
      ],
      order: [
        [{ model: Meetup, as: 'meetup' }, 'start_at'],
      ],
    });

    res.json(subscriptions);
  }

  async store(req, res) {
    SubscriptionValidations.setError(null);
    await SubscriptionValidations.validateStore(req, res);

    if (SubscriptionValidations.getError()) {
      return SubscriptionValidations.sendError(res);
    }

    const meetup = await Meetup.findByPk(req.body.meetup_id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
        },
      ],
    });

    await SubscriptionValidations.checkCanSubscribe(req, meetup);

    if (SubscriptionValidations.getError()) {
      return SubscriptionValidations.sendError(res);
    }

    const { userId: user_id } = req;
    const { meetup_id } = req.body;

    const subscription = await Subscription.create({
      user_id,
      meetup_id,
    });

    const user = await User.findByPk(req.userId);

    await Queue.add(SubscriptionMail.key, {
      subscription,
      meetup,
      user,
    });

    res.json(subscription);
  }
}

export default new SubscriptionController();
