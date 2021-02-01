import * as Yup from 'yup';
import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';
import User from '../models/User';

class SessionsController {
  async store(req, res) {
    // validar  body params
    const schema = Yup.object().shape({
      email: Yup.string().required('email is required'),
      password: Yup.string().required('password is required').min(6, 'Password field must contain at least 6 characters'),
    });

    schema.validate(req.body).catch((err) => res.status(400).json({ error: err.errors }));

    // check user
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(401).json({ error: 'User not found' });
    }

    if (!(await user.checkPassword(password))) {
      res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionsController();
