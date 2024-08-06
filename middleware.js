// Renamamed. Only for example
// In the feature need to control routing here

import { NextResponse, NextRequest } from 'next/server';
const { getCookie } = require('./src/utils');

export default async function middleware(request) {
  return NextResponse.next();
}