const _ = require("lodash");
const { Users } = require('../../models');

module.exports = async (req, res, tokenPayload) => {
  const { id: UserID, session } = tokenPayload;
  const user = await Users.findOne({ where: { id: UserID }, raw: true });
  if (!user) {
    res.status(400).json(
      { error: createErrorMessage("User does not exist!") }
    );
    return;
  }

  try {
    const { id, currencyCodeBuyer, currencyCodeSeller, locale, roles } = user;

    return {
      ok: true,
      data: {
        id,
        currencyCodeBuyer,
        currencyCodeSeller,
        locale,
        roles,
      },
    }
  } catch (e) {
    console.log(e);
  }
};
