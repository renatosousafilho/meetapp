import MeetupValidations from '../validations/MeetupValidations';
import Meetup from '../models/Meetup';
import User from '../models/User';

import { Op } from 'sequelize';
import { parseISO, startOfDay, endOfDay } from 'date-fns';

class MeetupController {
  async index(req, res) {
    const { page = 1, date } = req.query;

    if (!date) { 
      return res.status(401).json({error: 'Invalid date'});
    }

    const parseDate = parseISO(date);

    const meetups = await Meetup.findAll({ 
      where: {
        canceled_at: null,
        start_at: {
          [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)]
        }
      },
      order: ['start_at'],
      attributes: ['id', 'name', 'location', 'start_at', 'banner_url'],
      include: [
        {
            model: User,
            as: 'user',
            attributes: ['name', 'email'],
        }                
      ],
      limit: 10,
      offset: (page-1)*10
    });
    
    res.json(meetups)
  }
}

export default new MeetupController();