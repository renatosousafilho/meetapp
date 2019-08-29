import * as Yup from 'yup';
import Validations from './Validations';
import User from '../models/User';
import Avatar from '../models/Avatar';

class UserValidations extends Validations {
  async validateStore(req, res) {
    this.setError(null);
  
    const schema = Yup.object().shape({
      name: Yup.string().required('name is required'),
      email: Yup.string().email("email is not valid").required('email is required'),
      password: Yup.string().required("password is required").min(6, "Password field must contain at least 6 characters"),
      avatar_id: Yup.number("Deve ser um número"),
    });

    await this.isValid(schema, req.body);
  }


  async checkUserExists(email) {
    this.setError(null);
  
    const userExists = await User.findOne({where: { email } });

    if (userExists) {
      this.setError({errors: 'User already exists'});
    }
  }

  async checkAvatarExists(avatar_id) {
    this.setError(null);

    const avatarExists = await Avatar.findByPk(avatar_id);
    
    if (!avatarExists) {
      this.setError({errors: 'Avatar does not exists'})
    }
  }
}

export default new UserValidations();