export type ClassInstance<Class> = Class extends { new(...args: any[]): infer T } ? T : never;
export type Closure<Args extends ClosureArgs = ClosureArgs, Result = unknown> = (...args: Args) => Result;
export type ClosureArgs = any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
export type ClosureResult = any; // eslint-disable-line @typescript-eslint/no-explicit-any
export type Falsy = null | undefined | false | 0;
export type GetClosureArgs<T extends Closure> = T extends (...args: infer Args) => ClosureResult ? Args : never;
export type GetClosureResult<T extends Closure> = T extends (...args: any[]) => infer Result ? Result : never;
export type GetObjectMethods<T> = {
    [K in keyof T]: T[K] extends (...args: ClosureArgs) => ClosureResult ? K : never;
}[keyof T];
export type GetOptionalKeys<T> = { [K in keyof T]-?: Record<string, never> extends Pick<T, K> ? K : never }[keyof T];
export type GetRequiredKeys<T> = { [K in keyof T]-?: T extends Record<K, T[K]> ? K : never }[keyof T];
export type KeyOf<Object, Values> = { [k in keyof Object]: Object[k] extends Values ? k : never; }[keyof Object];
export type ObjectValues<T> = T[keyof T];
export type Pretty<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;
export type VoidClosure<T> = T extends (...args: infer A) => ClosureResult ? (...args: A) => void : never;

// Workaround for https://github.com/typescript-eslint/typescript-eslint/issues/3573
export type Use<T> = {}; // eslint-disable-line @typescript-eslint/no-unused-vars
