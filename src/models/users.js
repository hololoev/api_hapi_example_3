'use strict';

const Bcrypt = require('bcryptjs');
const bcryptRounds = 10;

module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set (val) {
        this.setDataValue('password', Bcrypt.hashSync(val, bcryptRounds));
      }
    }
  });

  users.prototype.verifyPassword = function (unencrypted) {
    return Bcrypt.compareSync(unencrypted, this.get('password'));
  };

  users.dummyData = [
    {
      id: 1,
      name: 'pupkin',
      email: 'pupkin@gmail.com',
      password: Bcrypt.hashSync('12345', bcryptRounds)
    }
  ];

  return users;
};