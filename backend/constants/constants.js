const ROLES = {
  USER: 'user',
  SELLER: 'seller',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin'
};

const ORDER_STATUS = {
  CREATED: "created",
  ACCEPTED: "accepted",
  SHIPPED: "shipped",
  RECEIVED: "received",
  COMPLETED: "completed",
  REOPENED: "reopened",
  CANCELED: "canceled",
};

const ORDER_STATUS_INDEX = {
  1: 'created',
  2: 'accepted',
  4: 'shipped',
  5: 'received',
};

const WHOAMI = {
  'BUYER': 'buyer',
  'SELLER': 'seller',
};

const ONLINE_DELAY_MS = 16000;

const STRUCTURE_TYPES = {
  CATALOG: 'catalog',
  ATTRIBUTES: 'attributes',
  ATTRIBUTE_VALUES: 'attribute_values',
};

const ARTICLES_SORT_VALUES = {
  CREATED_AT_ASC: 'createdAtAsc',
  CREATED_AT_DESC: 'createdAtDesc',
  UPDATED_AT_ASC: 'updatedAtAsc',
  UPDATED_AT_DESC: 'updatedAtDesc'
};

module.exports = {
  ROLES,
  ORDER_STATUS,
  ORDER_STATUS_INDEX,
  WHOAMI,
  ONLINE_DELAY_MS,
  STRUCTURE_TYPES,
  ARTICLES_SORT_VALUES,
};
