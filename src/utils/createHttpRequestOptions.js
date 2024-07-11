import { getCookie } from 'cookies-next';

module.exports = (props) => {
  const { req, res } = props;
  const token = getCookie('token', { req, res });

  const options = {};
  if (token) {
    options.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  return options;
};
