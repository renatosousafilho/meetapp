import MeetupValidations from '../../validations/MeetupValidations';
import Meetup from '../../models/Meetup';
import User from '../../models/User';
import { parseISO, isBefore } from 'date-fns';

class MeetupController {
  async index(req, res) {
    const { page = 1 } = req.query;
    
    const meetups = await Meetup.findAll({ 
      where: { user_id: req.userId, canceled_at: null },
      order: ['start_at'],
      attributes: ['id', 'name', 'location', 'start_at', 'banner_url'],
      limit: 20,
      offset: (page-1)*20
    });
    
    res.json(meetups)
  }

  async store(req, res) {
    MeetupValidations.setError(null)

    await MeetupValidations.validateStore(req, res);

    if (MeetupValidations.getError()) {
      return MeetupValidations.sendError(res);
    }

    await MeetupValidations.checkStartAt(req.body.start_at);
    
    if (MeetupValidations.getError()) {
      return MeetupValidations.sendError(res);
    }

    const { name, location, start_at } = req.body;
    const { originalname: banner_name, filename: banner_path } = req.file;

    const meetup = await Meetup.create({
      name,
      location,
      start_at,
      banner_name,
      banner_path,
      user_id: req.userId
    })

    res.json(meetup) 
  }

  async update(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    MeetupValidations.setError(null);

    await MeetupValidations.validateOwnerAndDate(req, meetup);

    if (MeetupValidations.getError()) {
      return MeetupValidations.sendError(res);
    }

    await MeetupValidations.validateUpdate(req, res);

    if (MeetupValidations.getError()) {
      return MeetupValidations.sendError(res);
    }

    if (req.body.start_at) {
      await MeetupValidations.checkStartAt(req.body.start_at);
      
      if (MeetupValidations.getError()) {
        return MeetupValidations.sendError(res);
      }
    }
     
    const { name, location, start_at: start_at_string } = req.body;
    const { originalname: banner_name, filename: banner_path } = req.file;

    const start_at = start_at_string ? parseISO(start_at_string) : meetup.start_at;

    const meetupUpdated = await meetup.update({
      name,
      location,
      start_at,
      banner_name,
      banner_path
    })

    res.json(meetupUpdated);
  }

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email']
        }
      ]
    });

    if (meetup && meetup.user_id !== req.userId) {
      return res.status(401).json({errors: 'You have no permission to cancel this meetup'});
    }

    if (meetup && isBefore(meetup.start_at, new Date())) {
      return res.status(401).json({error: 'You can only cancel meetups before start date.'});
    }

    meetup.canceled_at = new Date();

    console.log(meetup.canceled_at)

    await meetup.save();

    // Enviar e-mails para usuários inscritos

    return res.json(meetup)
  }
}

export default new MeetupController();