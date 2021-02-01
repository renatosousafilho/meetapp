import Avatar from '../models/Avatar';

class FileController {
  async store(req, res) {
    console.log("here!");

    const { originalname: name, filename: path } = req.file;

    const avatar = await Avatar.create({
      name,
      path,
    });

    res.json(avatar);
  }
}

export default new FileController();
