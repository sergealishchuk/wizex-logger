const _ = require('lodash');
const md5 = require('md5');
const { handleSequelizeErrors, createErrorMessage } = require('../../utils');
const { Users, Goods, ProfileChangesLog, sequelize } = require('../../models');
const { ROLES } = require('../../constants');

const allows = [
  'roles',
  'locked',
];

module.exports = async (parameters, res, tokenPayload) => {
  let { body = {} } = parameters;
  const { id } = tokenPayload;

  const { userId, ...bodyUpdate } = body;
  const bodyKeys = _.keys(bodyUpdate);

  const user = await Users.findOne({ where: { id }, raw: true, });
  if (!user) {
    res.status(400).json({ error: createErrorMessage('User does not exist!') });
    return;
  }

  const { roles: adminRoles } = user;
  if (!adminRoles.includes(ROLES.ADMIN)) {
    res.status(400).json(
      {
        error: createErrorMessage("No permisions"),
        ERROR_CODE: "NO_PERMISSIONS"
      }
    );
    return;
  }

  const checkArr = _.filter(bodyKeys, item => _.indexOf(allows, item) > -1);

  if (checkArr.length !== bodyKeys.length) {
    res.status(400).json(createErrorMessage('Bad parameters!'));
    return;
  }

  const userUpdate = await Users.findOne({ where: { id: userId }, raw: true, });
  if (!userUpdate) {
    res.status(400).json({ error: createErrorMessage('User for update does not exist!') });
    return;
  }

  const keys = Object.keys(bodyUpdate);
  const currentValues = JSON.stringify(_.pick(userUpdate, keys));

  try {
    const result = await sequelize.transaction(async (t) => {
      await Users.update(
        bodyUpdate,
        {
          where: {
            id: userId,
          }
        });


      if (!_.isUndefined(bodyUpdate.locked)) {
        if (bodyUpdate.locked === true || bodyUpdate.locked === false) {
          await Goods.update({
            locked: bodyUpdate.locked,
          },
            {
              where: {
                UserId: userId,
              }
            })
        }
      }

      await ProfileChangesLog.create({
        userId,
        authorId: user.id,
        comment: '[change_user_status_by_admin]',
        was: currentValues,
        is: JSON.stringify(bodyUpdate),
      })

      return {
        updated: true,
        SUCCESS_CODE: "SUCCESS_UPDATED_USER_STATUS"
      };
    });

    return {
      ok: true,
      ...result,
    }
  } catch (e) {
    res.status(400).json(
      {
        error: createErrorMessage("Error update User Status"),
        ERROR_CODE: "ERROR_UPDATE_USER_STATUS"
      }
    );
  }
};
