/*
  Example:
  1.
  import { handleStringWithParams } from '~/utils';
  const suc = handleStringWithParams(
    'My actual price is ${price}',
    {
      price: '4.56',
    }
  );
*/
export default (str, params = {}) => {
  let result = str;
  const keys = Object.keys(params);
  if (keys.length > 0) {
    const regex = new RegExp('\\$\\{(' + keys.join('|') + ')\\}', 'g');
    result = str.replace(regex, (m, $1) => params[$1] || m);
  }

  return result;
};
