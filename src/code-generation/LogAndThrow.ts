import { Logger, ILogObject } from "tslog";

export const logAndThrow = (logger: (...args: unknown[]) => ILogObject, msg: string) : void => {
    logger(msg);
    throw msg;
}