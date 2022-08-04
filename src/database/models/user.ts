import {
    InferAttributes,
    InferCreationAttributes,
    Model,
    CreationOptional,
    DataTypes,
    Sequelize,
    Association,
    HasManyGetAssociationsMixin
} from 'sequelize';

import dotenv from 'dotenv';
import Property from './property';
import Media from './media';

dotenv.config();

const databaseUrl: string = (process.env.DATABASE_URL as string);

const sequelize = new Sequelize(databaseUrl, {
    dialectOptions: {
        ssl: process.env.NODE_ENV == 'production' && {
            require: true,
            rejectUnauthorized: false
        }
    }
});
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare first_name: String;
    declare last_name: String;
    declare email: String;
    declare phone: String;
    declare token: CreationOptional<number>
    declare email_verified_at: CreationOptional<Date>;
    declare zipcode: CreationOptional<number>
    declare address: CreationOptional<string>
    declare city: CreationOptional<string>
    declare state: CreationOptional<string>
    declare country: CreationOptional<string>
    declare password: String;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;

    declare getProperties: HasManyGetAssociationsMixin<Property>;

    declare static associations: {
        properties: Association<User, Property>;
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email_verified_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: DataTypes.NUMBER,
        allowNull: true
    },
    zipcode: {
        type: DataTypes.NUMBER,
        allowNull: true
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true
      },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, {
    sequelize,
    modelName: 'User',

    scopes: {

    },
    hooks: {
        afterCreate: (record: any) => {
            delete record.dataValues.password;
        },
        afterUpdate: (record: any) => {
            delete record.dataValues.password;
        }
    }
});

User.hasMany(Property, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
    as: 'properties',
    foreignKey: {
        allowNull: false,
        name: "userId"
    },
    sourceKey: 'id'
});

User.hasMany(Media, {
    foreignKey: 'mediaable_id',
    constraints: false,
    scope: {
        mediaable_type: 'User'
    },
    as: 'Media'
});

Media.belongsTo(User, {
    foreignKey: 'mediaable_id',
    constraints: false
});

export default User;