import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import SubscriptionValidations from '../validations/SubscriptionValidations';
import Meetup from '../models/Meetup';
import User from '../models/User';
import Subscription from '../models/Subscription';
import Mail from '../../lib/Mail';

class SubscriptionController {
  async index(req, res) {
    const subscriptions = await Subscription.findAll({
      where: {
        user_id: req.userId
      },
      
      attributes: ['id', 'created_at'],
      include: [
        { model: Meetup, as: 'meetup', attributes: ['name', 'location', 'start_at'] }
      ],
      order: [ 
        [ { model: Meetup, as: 'meetup' }, 'start_at' ]
      ],
    })

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

    const user = await User.findByPk(req.userId);

    const formattedSubscriptionDate = format(subscription.created_at, "'dia' dd 'de' MMMM', às' H:mm'h'", {
      locale: pt
    });
    
    const formattedMeetupDate = format(meetup.start_at, "'dia' dd 'de' MMMM', às' H:mm'h'", {
      locale: pt
    });

    await Mail.sendMail({
      to: `${meetup.user.name} <${meetup.user.email}>`,
      subject: 'Inscrição realizada',
      template: 'subscription',
      context: {
        owner: meetup.user.name,
        user: user.name,
        meetup: `${formattedMeetupDate} - ${meetup.location}`,
        date: formattedSubscriptionDate,
      }
    })

    res.json(subscription)
  }
}

export default new SubscriptionController();