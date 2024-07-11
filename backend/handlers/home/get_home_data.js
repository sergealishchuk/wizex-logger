const _ = require("lodash");
const { Carousel, Goods, ExchangeRates, HomeBlocks } = require('../../models');

const getGoods = async (Entity, limit) => {

  let goods = await Entity.findAll({
    where: {
      status: 1,
      locked: false,
    },
    limit,
    order: [['createdAt', 'DESC']]
  });

  return _.map(goods, item => {
    const { id, categoryId, name, path, currencyCode, price, rating } = item;
    return {
      productId: id,
      categoryId,
      name,
      path: path[0],
      currencyCode,
      price,
      rating,
    };
  });
};

module.exports = async (parameters, res) => {

  try {
    const CarouselData = await Carousel.findAll({
      order: [['index', 'ASC']],
      attributes: ['id', 'index', 'path', 'htmlcontent', 'htmlcontenten', 'withhtml', 'active', 'effect']
    });

    const ArrivalsData = await getGoods(Goods, 12);

    const currencies = await ExchangeRates.findAll({
      attributes: ['currencyCode', 'digitalCode', 'rate', 'symbol'],
    });

    const categories = await HomeBlocks.findAll({
      where: {
        sectionid: 1,
      },
      raw: true,
    });

    return {
      ok: true,
      data: {
        carousel: CarouselData,
        arrivals: ArrivalsData,
        currencies,
        categories,
      },
    };
  } catch (error) {
    console.log(error);
    res.status(400)
      .json({ error: { errors: [{ message: "Home data has broken!" }] } });
  }
};
