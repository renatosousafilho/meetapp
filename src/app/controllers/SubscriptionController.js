import SubscriptionValidations from '../validations/SubscriptionValidations';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';

class SubscriptionController {
  async store(req, res) {
    SubscriptionValidations.setError(null);
    await SubscriptionValidations.validateStore(req, res);

    if (SubscriptionValidations.getError()) {
      return SubscriptionValidations.sendError(res);
    }

    const meetup = await Meetup.findByPk(req.body.meetup_id);
    await SubscriptionValidations.checkCanSubscribe(req, meetup);

    if (SubscriptionValidations.getError()) {
      return SubscriptionValidations.sendError(res);
    }
    
    const { userId: user_id } = req;
    const { meetup_id } = req.body;

    const subscription = await Subscription.create({
      user_id,
      meetup_id      
    })

    res.json(subscription)
  }
}

export default new SubscriptionController();