const _ = require('lodash');
const { v4 } = require('uuid');
const { handleSequelizeErrors, createErrorMessage } = require('../utils');
const { User } = require('../models');
const { storage: { remoteDirPath } } = require('./../config/config');

const { getDirList, putFile, deleteFile } = require('../utils/ssh2');

module.exports = async (parameters, res, tokenPayload) => {
  const { body = {} } = parameters;
  const { id } = tokenPayload;
  const {
    firstname,
    lastname,
    country = '',
    skype = '',
    avatar,
  } = body;

  const user = await User.findOne({ where: { id } });

  const existingUserAvatarFile = user && user.avatar;
  const existingUserAvatarFileName = existingUserAvatarFile && existingUserAvatarFile.split('.')[0];

  let userAvatarFile;

  if (avatar && !_.isNull(avatar)) {
    const matches = avatar.match(/^data:image\/([A-Za-z]+);base64,(.*)$/);
    if (matches.length !== 3) {
      return {
        error: createErrorMessage('04 - Invalid input image string.'),
        status: 400,
      }
    }

    //userAvatarFile = `${existingUserAvatarFileName || v4()}.${matches[1]}`;
    userAvatarFile = `${v4()}.${matches[1]}`;

    try {
      await putFile(Buffer.from(matches[2], 'base64'), `${remoteDirPath}${userAvatarFile}`);
      if (!_.isNull(existingUserAvatarFile)/* && userAvatarFile !== existingUserAvatarFile*/) {
        deleteFile(`${remoteDirPath}${existingUserAvatarFile}`);
      }

    } catch (error) {
      return {
        error: createErrorMessage('03 - Problem with saving profile image.'),
        message: error.message,
        status: 400,
      }
    };
  } else if (_.isNull(avatar) && existingUserAvatarFile) {
    deleteFile(`${remoteDirPath}${existingUserAvatarFile}`);
  }

  let avatarValue;
  if (_.isUndefined(avatar)) {
    avatarValue = undefined;
  } else if (_.isNull(avatar)) {
    avatarValue = null;
  } else {
    avatarValue = userAvatarFile;
  }

  return User.update({
    firstname,
    lastname,
    country,
    skype,
    avatar: avatarValue,
  }, {
    where: {
      id,
    }
  })
    .then((rows) => {
      if (_.isArray(rows) && rows.length === 1) {
        return {
          result: 'Success',
        }
      } else {
        return {
          error: createErrorMessage('User does not exist!'),
          status: 400,
        };
      }
    })
    .catch((error) => {
      res.status(400).json(handleSequelizeErrors(error));
    });
};
