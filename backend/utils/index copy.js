const handleSequelizeErrors = require('./handleSequelizeErrors');
const createErrorMessage = require('./createErrorMessage');
const parseForm = require('./parseForm');
const fileService = require('./fs');
const toCurrency = require('./toCurrency');
const els = require('./els');
const elsClient = require('./elsClient');
const getSubCategories = require('./getSubCategories');
const categoryHasParent = require('./categoryHasParent');
const convertImgToWebp = require('./convert_img_to_webp');
const elasticSearchClient = require('./elasticSearchClient');
const priceStr = require('./priceStr');
const getSystemVariables = require('./getSystemVariables');
const dates = require('./dates');
const socketConnector = require('./socketConnector');
const generateRandomString = require('./generateRandomString');
const translate = require('./translate');
const bankApi = require('./bank_api');
const bnkService = require('./bnk_service');

module.exports = {
	handleSequelizeErrors,
	createErrorMessage,
	parseForm,
	fileService,
	toCurrency,
	els,
	elsClient,
	getSubCategories,
	categoryHasParent,
	convertImgToWebp,
	elasticSearchClient,
	priceStr,
	getSystemVariables,
	dates,
	socketConnector,
	generateRandomString,
	translate,
	bankApi,
	bnkService,
};
