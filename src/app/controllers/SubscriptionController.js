import SubscriptionValidations from '../validations/SubscriptionValidations';
import Meetup from '../models/Meetup';
import User from '../models/User';
import Subscription from '../models/Subscription';
import Mail from '../../lib/Mail';

class SubscriptionController {
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
        }                
    ]
    });
    
    await SubscriptionValidations.checkCanSubscribe(req, meetup);

    if (SubscriptionValidations.getError()) {
      return SubscriptionValidations.sendError(res);
    }
    
    const { userId: user_id } = req;
    const { meetup_id } = req.body;

    const subscription = await Subscription.create({
      user_id,
      meetup_id      
    });

    console.log(meetup.user);
    
    await Mail.sendMail({
      to: `${meetup.user.name} <${meetup.user.email}>`,
      subject: 'Inscrição realizada',
      text: `Nova inscrição no meetup do dia ${meetup.start_at}`
    })

    res.json(subscription)
  }
}

export default new SubscriptionController();