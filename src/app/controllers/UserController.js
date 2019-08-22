import * as Yup from 'yup';

import User from '../models/User';

class UserController {
    async store(req, res) {
        // validar body params
        const schema = Yup.object({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(401).json({ error: 'Fields invalids' });
        }

        // validar se usuário existe
        const userExists = await User.findOne({where: { email: req.body.email} });

        if (userExists) {
            res.status(401).json({ error: 'User already exists'});
        }

        // criar usuário
        const { id , name, email } = await User.create(req.body);

        // retornar daddos do usuário
        return res.json({
            id,
            name,
            email
        })
    }

    async update(req, res) {
        // validar body params
        const schema = Yup.object({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string().min(6).when('oldPassword', (oldPassword, field) =>
                oldPassword ? field.required() : field
            ),
            passwordConfirmation: Yup.string().min(6).when('password', (password, field) =>
                password ? field.required().oneOf([password]) : field
            )
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(401).json({ error: 'Fields invalids' });
        }

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