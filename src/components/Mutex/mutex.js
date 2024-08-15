import { useState, useEffect } from "react";
import { Mutex } from "async-mutex";
import { SmallButton } from "../StyledComponents";
import { getUserProfile } from './authService';

// let token = {
//   accessToken: '123',
//   refreshToken: '456',
// };


export default () => {

  const handleStart = async () => {
    console.log('start');
    const userProfle = await getUserProfile();
    console.log('userProfile:', userProfle);
  }
  return (
    <dev style={{ display: 'block', borderBottom: '1px #ededed solid', padding: '16px', marginBottom: '40px' }}>
      <SmallButton btn="green" onClick={handleStart}>Start</SmallButton>
      <div>
        Hello, this is mutex module
      </div>

    </dev>
  )
}