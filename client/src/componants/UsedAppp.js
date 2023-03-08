import React from 'react'
import Wallet from './Wallet'
import {DAppProvider, Rinkeby} from '@usedapp/core';

function UsedAppp() {
  const config = {
    networks:[Rinkeby],
    notifications:{
      expirationPeriod:1000,
      checkInterval:1000,
    }
  };
  return (
    <Wallet/>
  )
}

export default UsedAppp

/*

 */