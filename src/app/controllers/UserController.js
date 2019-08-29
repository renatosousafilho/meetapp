import * as Yup from 'yup';

import User from '../models/User';
import Avatar from '../models/Avatar';

import UserValidations from '../validations/UserValidations';

class UserController {
    async store(req, res) {
        // validar body params
        await UserValidations.validateStore(req, res);

        if (UserValidations.getError()) {
            return UserValidations.sendError(res);
        }

        await UserValidations.checkUserExists(req.body.email);

        if (UserValidations.getError()) {
            return UserValidations.sendError(res);
        }

        await UserValidations.checkAvatarExists(req.body.avatar_id);

        if (UserValidations.getError()) {
            return UserValidations.sendError(res);
        }

        const { id , name, email, avatar_id } = await User.create(req.body);
        
        // retornar daddos do usuário
        return res.json({
            id,
            name,
            email,
            avatar_id
        })
    }

    async update(req, res) {
        UserValidations.setError(null);

        await UserValidations.validateUpdate(req, res);

        if (UserValidations.getError()) {
            return UserValidations.sendError(res);
        }
 
        const user = await User.findByPk(req.userId);

        const { email, oldPassword } = req.body;

        if (email && email !== user.email) {
            await UserValidations.checkUserExists(email);

            if (UserValidations.getError()) {
                return UserValidations.sendError(res);
            }
        }

        await UserValidations.checkOldPassword(oldPassword, user);

        if (UserValidations.getError()) {
            return UserValidations.sendError(res);
        }

        await UserValidations.checkNewPassword(oldPassword, req.body.password);

        if (UserValidations.getError()) {
            return UserValidations.sendError(res);
        }

        await UserValidations.checkAvatarExists(req.body.avatar_id);

        if (UserValidations.getError()) {
            return UserValidations.sendError(res);
        }
        
        const { id, name } = await user.update(req.body);

        return res.json({
            id, 
            name,
            email,
        });
    }
}

export default new UserController();