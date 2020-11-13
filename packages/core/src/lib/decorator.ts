import "reflect-metadata";

const PATH_METADATA = "path";
const METHOD_METADATA = "method";

export const isConstructor = (fn: string) => fn === "constructor";
export const isFunction = (fn: unknown): boolean => typeof fn === "function";

const mapMethod = (method: string) => (path: string): MethodDecorator => (
  target,
  key,
  descriptor
) => {
  Reflect.defineMetadata(
    METHOD_METADATA,
    method,
    descriptor.value as Record<string, unknown>
  );
  Reflect.defineMetadata(
    PATH_METADATA,
    path,
    descriptor.value as Record<string, unknown>
  );
};

export const Controller = (path: string): ClassDecorator => (instance) => {
  Reflect.defineMetadata(PATH_METADATA, path, instance);
};

export const mapRoute = (instance: any) => {
  const prototype = Object.getPrototypeOf(instance);

  const methodNames = Object.getOwnPropertyNames(prototype);
  return methodNames
    .filter(
      (methodName) =>
        !isConstructor(methodName) && isFunction(prototype[methodName])
    )
    .map((methodName) => {
      const fn = prototype[methodName];
      const route = Reflect.getMetadata(PATH_METADATA, fn);
      const method = Reflect.getMetadata(METHOD_METADATA, fn);
      return {
        route,
        method,
        fn,
        methodName,
      };
    });
};

export const Get = mapMethod("get");
export const Post = mapMethod("post");
