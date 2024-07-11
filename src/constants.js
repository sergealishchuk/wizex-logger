export const EDIT_MODE = 'edit_mode';
export const ADD_MODE = 'add_mode';
export const VIEW_MODE = 'view_mode';
export const DELETE_MODE = 'delete_mode';

export const UI_VARIABLES = {
  DESCRIPTION_COLLAPSE: 'vars.ui_variables.description_collapse',
  IMAGES_WIZARD_COLLAPSE: 'vars.ui_variables.images_wizard_collapse',
  ATTRIBUTES_COLLAPSE: 'vars.ui_variables.attributes_collapse',
  SEO_COLLAPSE: 'vars.ui_variables.seo_collapse'
};

export const EFFECT_STYLES = [
  {
    id: 'effect-move-bottom-top',
    name: 'effect-move-bottom-top',
  },
  {
    id: 'effect-move-left-right',
    name: 'effect-move-left-right',
  },
  {
    id: 'effect-move-top-bottom',
    name: 'effect-move-top-bottom',
  },
  {
    id: 'effect-move-right-left',
    name: 'effect-move-right-left',
  }, {
    id: 'effect-opacity',
    name: 'effect-opacity',
  }
];

export const DIALOG_ACTIONS = {
  SAVE: 'save',
  CANCEL: 'cancel',
  LEAVE_AND_DISCARD: 'leave_and_discard',
  CONFIRM: 'confirm',
};

export const Entities = {
  IMAGES_WIZARD: 'ImagesWizard',
  CKEDITOR: 'CKEditor',
};

export const requireAuthRoutes = [
  '/orders',
  '/profile',
  '/admin',
  '/wishlist',
  '/my_orders',
];

export const ORDER_POLLING_INTERVAL = 120000;
export const CUSTOMER_ORDERS_POLLING_INTERVAL = 120000;
export const GLOBAL_POLLING_INTERVAL = 60000;
export const ONLINE_USERS_POLLING_INTERVAL = 8000;

export const PAYMENT_STATUS = {
  UNDERPAYMENT: "underpayment",
  OVERPAYMENT: "overpayment",
  PAID_COMPLETELY: "paid_completely",
  NOT_PAID: "not_paid",
};

export const ORDER_STATUS = {
  CREATED: "created",
  ACCEPTED: "accepted",
  SHIPPED: "shipped",
  RECEIVED: "received",
  COMPLETED: "completed",
  REOPENED: "reopened",
  CANCELED: "canceled",
};

export const WHOAMI = {
  'BUYER': 'buyer',
  'SELLER': 'seller',
};

export const CHAT_MARKERS = {
  SHIPPED: 1,
  REOPENED: 2,
  CANCELED: 3,
};

export const ROLES = {
  USER: 'user',
  SELLER: 'seller',
  ADMIN: 'admin',
};

export const ARTICLES_SORT_VALUES = {
  CREATED_AT_ASC: 'createdAtAsc',
  CREATED_AT_DESC: 'createdAtDesc',
  UPDATED_AT_ASC: 'updatedAtAsc',
  UPDATED_AT_DESC: 'updatedAtDesc'
};

