import MeetupValidations from '../validations/MeetupValidations';
import Meetup from '../models/Meetup'
import { parseISO } from 'date-fns';

class MeetupController {
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

    const { location, start_at } = req.body;
    const { originalname: banner_name, filename: banner_path } = req.file;

    const meetup = await Meetup.create({
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
     
    const { location, start_at: start_at_string } = req.body;
    const { originalname: banner_name, filename: banner_path } = req.file;

    const start_at = start_at_string ? parseISO(start_at_string) : meetup.start_at;

    const meetupUpdated = await meetup.update({
      location,
      start_at,
      banner_name,
      banner_path
    })

    res.json(meetupUpdated);
  }
}

export default new MeetupController();