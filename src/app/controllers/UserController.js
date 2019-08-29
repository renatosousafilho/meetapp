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
        // validar body params
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string().min(6).when('oldPassword', (oldPassword, field) =>
                oldPassword ? field.required("password is required") : field
            ),
            passwordConfirmation: Yup.string().min(6).when('password', (password, field) =>
                password ? field.required("password confirmation is required").oneOf([password], "Password confirmation does not match") : field
            )
        });

        schema.validate(req.body).catch(err => res.status(400).json({ error: err.errors }))

        // recebendo id do middleware
        const user = await User.findByPk(req.userId);

        const { email, oldPassword } = req.body;

        // checar se já exist um usuário com e-mail enviado (caso seja nescessário alterar e-mail)
        if (email && email !== user.email) {
           // validar se usuário existe
            const userExists = await User.findOne({where: { email: req.body.email} });

            if (userExists) {
                res.status(401).json({ error: 'User already exists'});
            } 
        }

        // checar se a senha antiga é válida
        if (oldPassword && !(await user.checkPassword(oldPassword))) {
            return res.status(401).json({ error: 'Password does not match'});
        }

        // atualizar
        const { id, name, email: emailUpdated } = await user.update(req.body);

        return res.json({
            id, 
            name,
            emailUpdated,
        });
    }
}

export default new UserController();