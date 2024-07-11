// Renamamed. Only for example
// In the feature need to control routing here

import { NextResponse, NextRequest } from 'next/server';
const { getCookie } = require('./src/utils');

export default async function middleware(request) {

  const { cookies } = request;

  if (request.nextUrl.pathname.startsWith('/shop')) {
    console.log('Request Headers:', request.headers);
    const token = getCookie('token', cookies);
    console.log('cookies token:', token);
    if (token) {
    }
  }

  return NextResponse.next();
}