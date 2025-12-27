import { Context } from "hono";
import { Env } from "./env.type";

export type APICreateRequestContext<T, P extends string = "/"> = Context<
  {
    Bindings: Env;
  },
  P,
  {
    in: { json: T };
    out: { json: any };
  }
>;

export type APIUpdateRequestContext<T, P extends string = "/:id"> = Context<
  {
    Bindings: Env;
  },
  P,
  {
    in: { json: T; param: { id: string } };
    out: { json: any };
  }
>;
