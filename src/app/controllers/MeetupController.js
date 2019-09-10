import MeetupValidations from '../validations/MeetupValidations';
import Meetup from '../models/Meetup';
import User from '../models/User';
import { parseISO } from 'date-fns';

class MeetupController {
  async index(req, res) {
    const { page = 1 } = req.query;
    
    const meetups = await Meetup.findAll({ 
      order: ['start_at'],
      attributes: ['id', 'location', 'start_at', 'banner_url'],
      include: [
        {
            model: User,
            as: 'user',
            attributes: ['name', 'email'],
        }                
      ],
      limit: 20,
      offset: (page-1)*20
    });
    
    res.json(meetups)
  }
}

export default new MeetupController();