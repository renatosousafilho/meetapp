import * as Yup from 'yup';

import User from '../models/User';

class UserController {
    async store(req, res) {
        // validar body params
        const schema = Yup.object({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
        })

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
}

export default new UserController();