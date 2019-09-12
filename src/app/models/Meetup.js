import Sequelize, { Model } from 'sequelize';

class Meetup extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                location: Sequelize.STRING,
                start_at: Sequelize.DATE,
                canceled_at: Sequelize.DATE,
                banner_name: Sequelize.STRING,
                banner_path: Sequelize.STRING,
                banner_url: {
                    type: Sequelize.VIRTUAL(Sequelize.STRING, 'banner_path'),
                    get() {
                        return `http://localhost:4000/files/${this.banner_path}`;
                    }
                }
            },{
                sequelize
            }            
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
    }
}

export default Meetup;