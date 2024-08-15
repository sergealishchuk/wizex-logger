import { Mutex } from 'async-mutex';
import * as jwt from 'jsonwebtoken';

const tokenMutex = new Mutex();

export const isSSR = typeof window === 'undefined';

let tokens = isSSR ? {} : JSON.parse(localStorage.getItem('tokens'));

export const dummyFetch = async (url, options) => {
  switch (url) {
    case 'getUserProfile':
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('options:', options);
          resolve('data ok!');
        }, 3000);
      })
    case 'refreshSession':
      return new Promise((resolve, reject) => {
        const { refreshToken } = options;
        if (!refreshToken) {
          reject(new Error('no refresh token'))
        }
        // check refreshToken
        // we desided that token is ok
        
        const token = jwt.sign(
          {
            id: 1,
          },
          'JWT_SECRET_KEY',
          { expiresIn: 20000 }
        );
        resolve(token);
      });
    default:
      break;
  }
};


// Must be run inside a tokenMutex
async function refreshSession() {
  if (!tokens) throw new Error("Can't check session if we're not logged in");

  return new Promise((resolve, reject) => {
    auth0Lock.checkSession({}, (error, authResult) => {
      if (error) reject(error);
      else {
        resolve(authResult.accessToken);
        updateTokensAfterAuth(authResult);
      }
    })
  });
}

// Must be run inside a tokenMutex
function setTokens(newTokens) {
  tokens = newTokens;
  localStorage.setItem('tokens', JSON.stringify(newTokens));
}

function updateTokensAfterAuth({ accessToken, expiresIn }) {
  return tokenMutex.runExclusive(() =>
    setTokens({
      accessToken,
      accessTokenExpiry: Date.now() + (expiresIn * 1000)
    })
  )
}

export const refreshToken = async () => {
  console.log('refresh token');
};

export const getToken = async () => {
  return tokenMutex.runExclusive(() => {
    if (!tokens) return;

    const timeUntilExpiry = tokens.accessTokenExpiry.valueOf() - Date.now();

    // If the token is expired or close (10 mins), refresh it
    let refreshPromise = timeUntilExpiry < 1000 * 60 * 10 ?
      refreshSession() : null;

    if (timeUntilExpiry > 1000 * 5) {
      // If the token is good for now, use it, even if we've
      // also triggered a refresh in the background
      return tokens.accessToken;
    } else {
      // If the token isn't usable, wait for the refresh
      return refreshPromise;
    }
  });
};

export const getUserProfile = async () => {
  const token = await getToken();
  if (!token) return '';

  const result = await dummyFetch('getUserProfile', { token });

  return result;
};
