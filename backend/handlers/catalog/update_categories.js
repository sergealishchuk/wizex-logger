
const _ = require("lodash");
const { v4 } = require('uuid');
const { Op } = require("sequelize");
const { Users, Categories, sequelize } = require('../../models');
const {
  handleSequelizeErrors,
  createErrorMessage,
  parseForm,
  fileService,
} = require('../../utils');
const { storage: { remoteDirPath } } = require('../../config/config');
const { set_leafs_to_categories } = require('./controllers');

module.exports = async (req, res, tokenPayload) => {
  const UserID = tokenPayload.id;
  const user = await Users.findOne({ where: { id: UserID } });
  if (!user) {
    res.status(400).json(
      { error: createErrorMessage("User does not exist!") }
    );
    return;
  }

  const { params: { parentId } } = req;
  let catList;
  let nextCategoryList;
  let result;
  try {

    catList = await sequelize.transaction(async (transaction) => {

      const parseResult = await parseForm(req);

      const { fields, files } = parseResult;

      const fileList = [];

      const pathesByIndex = {};

      _.forOwn(files, (value, key) => {
        const { filepath, mimetype } = value;
        const remotePath = `categories/${v4()}.${mimetype.match(/\/(.*)$/)[1]}`;
        const index = Number(key.match(/^(\d+)\[/)[1]);

        pathesByIndex[index] = remotePath;
        fields[index].path = remotePath;

        fileList.push([
          filepath,
          `${remoteDirPath}${remotePath}`,
        ]);
      });

      const length = fileList.length;
      await fileService.putFiles(fileList);

      const existingIdsArr = _.filter(fields, (field) => !_.isUndefined(field.originalId))
        .map(item => Number(item.originalId));

      const toDelete = await Categories.findAll({
        where: {
          id: {
            [Op.notIn]: [...existingIdsArr],
          },
          parentid: parentId,
        }
      });

      // TODO: Need to check out children in category!!!!

      const deleteIds = _.map(toDelete, item => item.id);
      Categories.destroy({
        where: {
          id: {
            [Op.in]: deleteIds,
          }
        }
      });

      const ajustFields = _(fields)
        .filter((item) => !_.includes(deleteIds, Number(item.originalId)))
        .map((item, index) => ({
          id: Number(item.originalId),
          name: item.name,
          nameen: item.nameen,
          path: item.path,
          parentid: Number(item.parentid),
          index: Number(index) + 1,
          leaf: item.leaf,
        }))
        .value();

      _.each(ajustFields, async (item) => {
        if (item.id === null || _.isNaN(item.id) || item.mode === 'add_mode') {
          // add
          await Categories.create(
            {
              ..._.omit(item, ['id']),
              transaction,
            }
          );
        } else {
          // update
          await Categories.update(
            {
              ..._.omit(item, ['id']),
            },
            {
              where: { id: item.id },
              transaction,
            }
          );
        }
      });

      return ajustFields;
    });


    result = await sequelize.transaction(async (transaction) => {
      const CategoriesData = await Categories.findAll({
        order: [['id', 'ASC']],
        attributes: ['id', 'parentid', 'index', 'leaf'],
        where: {},
        raw: true,
      });

      const nextCategoryList = set_leafs_to_categories({
        categoryList: CategoriesData,
      });

      for (let i = 0; i < nextCategoryList.length; ++i) {
        const { id, parentid, index } = nextCategoryList[i];
        await Categories.update(
          {
            parentid,
            index,
          },
          {
            where: { id },
            transaction,
          }
        );
      }
      return nextCategoryList;
    });


    res.status(200).json({ ok: true, catList, result });
  } catch (e) {
    console.log('ERROR::', e);
    res.status(400).json(
      { error: createErrorMessage("Error update categories") }
    );
  }
};
