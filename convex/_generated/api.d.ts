/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.5.1.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as crons from "../crons";
import type * as init from "../init";
import type * as lucia from "../lucia";
import type * as messages from "../messages";
import type * as openai from "../openai";
import type * as users from "../users";
import type * as withAuth from "../withAuth";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  crons: typeof crons;
  init: typeof init;
  lucia: typeof lucia;
  messages: typeof messages;
  openai: typeof openai;
  users: typeof users;
  withAuth: typeof withAuth;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
