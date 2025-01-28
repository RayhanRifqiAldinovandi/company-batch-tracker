// import csrf from "edge-csrf";
// import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";

// const csrfProtect = csrf();

// export async function middleware(request) {
//   const response = NextResponse.next();
//   // csrf validation
//   const csrfError = await csrfProtect(request, response);
//   // if an error occurs, then token is not valid
//   if (csrfError) {
//     return new NextResponse("invalid csrf token", { status: 403 });
//   }
//   return response;
// }
