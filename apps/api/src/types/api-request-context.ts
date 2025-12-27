import { Context } from "hono";
import { Env } from "./env.type";

export type APIRequestContext<T, P extends string = "/"> = Context<
  {
    Bindings: Env;
  },
  P,
  {
    in: { json: T };
    out: { json: any };
  }
>;
