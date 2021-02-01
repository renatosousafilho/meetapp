import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { subscription, meetup, user } = data;

    const formattedSubscriptionDate = format(parseISO(subscription.created_at), '\'dia\' dd \'de\' MMMM\', às\' H:mm\'h\'', {
      locale: pt,
    });

    const formattedMeetupDate = format(parseISO(meetup.start_at), '\'dia\' dd \'de\' MMMM\', às\' H:mm\'h\'', {
      locale: pt,
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
      },
    });
  }
}

export default new SubscriptionMail();
