const { ROLES } = require("../../../constants");
const { Users, Articles, sequelize } = require('../../../models');
const {
  createErrorMessage,
} = require('../../../utils');

module.exports = async (req, res, tokenPayload) => {
  const UserID = tokenPayload.id;
  const user = await Users.findOne({
    where: { id: UserID },
    attributes: ['id', 'roles'],
    raw: true,
  });

  if (!user) {
    res.status(400).json(
      {
        error: createErrorMessage("User does not exist!"),
        ERROR_CODE: "USER_DOES_NOT_EXIST"
      }
    );
    return;
  }

  const { roles } = user;

  if (!roles.includes(ROLES.ADMIN)) {
    res.status(400).json(
      {
        error: createErrorMessage("No permisions"),
        ERROR_CODE: "NO_PERMISSIONS"
      }
    );
    return;
  }

  const { body = {} } = req;

  const { publish, articleId } = body;

  try {

    await sequelize.transaction(async (t) => {

      await Articles.update({
        published: publish ? 1 : 0,
        publishedAt: publish ? new Date() : null
      }, {
        transaction: t,
        where: {
          id: articleId,
        }
      });

    });

    return {
      ok: true,
    }
  } catch (e) {
    console.log('error', e);
    res.status(400).json(
      { error: createErrorMessage("Error change status article.") }
    );
  }
};
