const _ = require("lodash");
const { Op } = require("sequelize");
const { Categories } = require('../../models');


module.exports = async (parameters, res) => {

  try {
    const CatalogData = await Categories.findAll({
      order: [['index', 'ASC']],
      attributes: ['id', 'parentid', 'index', 'name', 'nameen', 'path'],
      where: {
        parentid: {
          [Op.ne]: null,
          [Op.eq]: 1,
        },
      },
    });

    // needs to investigate why parentid has string type instead of number

    return {
      ok: true,
      data: {
        catalog: CatalogData.map(item => ({ // quite strange transformation ???
          ...item.dataValues,
          parentid: Number(item.dataValues.parentid)
        })),
      },
    };
  } catch (error) {
    console.error(error);
    res.status(400)
      .json({ error: { errors: [{ message: "Data errors!" }] } });
  }
};
