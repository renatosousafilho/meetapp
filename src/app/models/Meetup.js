import Sequelize, { Model } from 'sequelize';

class Meetup extends Model {
    static init(sequelize) {
        super.init(
            {
                location: Sequelize.STRING,
                start_at: Sequelize.DATE,
                banner_name: Sequelize.STRING,
                banner_path: Sequelize.STRING,
            },{
                sequelize
            }            
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.User, { foreignKey: 'user_id' })
    }
}

export default Meetup;