// This file is for sharing TRPC query result types to avoid TS errors
// in components when the type isn't inferred correctly.

import { inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "../../../server/routers";

type RouterOutput = inferRouterOutputs<AppRouter>;

// The full user object, including the 'role' property from the DB schema
export type MeQueryResult = RouterOutput["auth"]["me"];
