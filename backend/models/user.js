'use strict';
const md5 = require("md5");
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      const { Users, Goods, Orders, Favorites } = models;
      // define association here
      this.hasMany(Favorites, { foreignKey: 'userId', as: 'favotites' });
      Users.hasMany(Goods);
      Users.hasMany(Orders, {
        foreignKey: {
          name: 'userId',
        }
      });
    }
  };

  Users.init({
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 25],
          msg: 'First Name string length has to be between 2 and 25',
        }
      }
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 25],
          msg: 'Last Name string length has to be between 2 and 25',
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'email adress has to be unique!'
      },
      validate: {
        isEmail: true,
      }
    },
    contactemail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^(?=.*[0-9])(?=.*[a-zA-Z])(?!.* ).{6,32}$/,
          msg: 'Password must contain at least one digit from 1 to 9, at least one letter, no space, and it must be 6-32 characters long.',
        },
      }
    },
    locale: {
      type: DataTypes.STRING(2),
      allowNull: true,
      defaultValue: 'en',
    },
    country: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    emailconfirmid: DataTypes.STRING,
    passwordrecoverid: DataTypes.STRING,
    passwordrecovertime: DataTypes.BIGINT,
    emailconfirmed: DataTypes.BOOLEAN,
    trialwasused: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    allownotifications: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    roles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: ['user'],
    },
    locked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'Users',
    hooks: {
      beforeCreate: (user) => {
        user.password = md5(user.password);
      }
    }
  });
  return Users;
};
