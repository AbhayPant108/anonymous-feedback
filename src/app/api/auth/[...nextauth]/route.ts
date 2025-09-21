import NextAuth from "next-auth";
import {handlers,signIn,signOut,auth} from './options'
export const {GET,POST} = handlers
export {signIn,signOut}