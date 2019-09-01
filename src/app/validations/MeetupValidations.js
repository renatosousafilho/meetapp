import * as Yup from 'yup';
import { parseISO, isBefore } from 'date-fns';
import Validations from './Validations';
import Meetup from '../models/Meetup';
import { isPast } from 'date-fns';

class MeetupValidations extends Validations {
  async validateStore(req, res) {
    this.setError(null);
  
    const schema = Yup.object().shape({
      location: Yup.string().required('location is required'),
      start_at: Yup.date().required('start_at is required')
    });

    await this.isValid(schema, req.body);
  }

  checkStartAt(start_at) {
    if (isBefore(parseISO(start_at), new Date())) {
      this.setError({errors: 'Date cannot be in past'});
    }
  }

  async validateOwnerAndDate(req, meetup) {
    if (!meetup) {
      this.setError({errors: 'This meetup dont exists'});  
    }

    if (meetup && meetup.user_id !== req.userId) {
      this.setError({errors: 'This meetup doesn`t belongs to signed user'}); 
    }

    if (meetup && isPast(meetup.start_at)) {
      this.setError({errors: 'This meetup already happened!'});  
    }
  }

  async validateUpdate(req, res) {
    this.setError(null);
  
    const schema = Yup.object().shape({
      location: Yup.string(),
      start_at: Yup.date()
    }); 
  }


}

export default new MeetupValidations();