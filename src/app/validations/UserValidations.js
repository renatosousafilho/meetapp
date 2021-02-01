import * as Yup from 'yup';
import Validations from './Validations';
import User from '../models/User';
import Avatar from '../models/Avatar';

class UserValidations extends Validations {
  async validateStore(req, res) {
    this.setError(null);

    const schema = Yup.object().shape({
      name: Yup.string().required('name is required'),
      email: Yup.string().email('email is not valid').required('email is required'),
      password: Yup.string().required('password is required').min(6, 'Password field must contain at least 6 characters'),
      avatar_id: Yup.number('Deve ser um número'),
    });

    await this.isValid(schema, req.body);
  }

  async validateUpdate(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().min(6).when('oldPassword', (oldPassword, field) =>
        (oldPassword ? field.required('password is required') : field)),
      passwordConfirmation: Yup.string().min(6).when('password', (password, field) =>
        (password ? field.required('password confirmation is required').oneOf([password], 'Password confirmation does not match') : field)),
      avatar_id: Yup.number('Deve ser um número'),
    });

    await this.isValid(schema, req.body);
  }

  async checkUserExists(email) {
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      this.setError({ errors: 'User already exists' });
    }
  }

  async checkAvatarExists(avatar_id) {
    const avatarExists = await Avatar.findByPk(avatar_id);

    if (!avatarExists) {
      this.setError({ errors: 'Avatar does not exists' });
    }
  }

  async checkOldPassword(oldPassword, user) {
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      this.setError({ errors: 'Password does not match' });
    }
  }

  checkNewPassword(oldPassword, password) {
    if (oldPassword == password) {
      this.setError({ errors: 'New password cannot be equals old password' });
    }
  }
}

export default new UserValidations();
