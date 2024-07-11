import Observer from '~/utils/observer';

export default async (params) => {
  return await Observer.asyncSend('OpenConfirmDialog', params);
};
