export default class PromisedValue<T = unknown> implements Promise<T> {

    private promise: Promise<T>;
    private _value?: T;
    private _resolve!: (result: T) => void;
    private _reject!: (error?: Error) => void;

    [Symbol.toStringTag]: string;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    public get value(): T | null {
        return this._value || null;
    }

    public isResolved(): this is { value: T } {
        return '_value' in this;
    }

    public then<TResult1 = T, TResult2 = never>(
        onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
        onRejected?: ((reason: Error) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): Promise<TResult1 | TResult2> {
        return this.promise.then(onFulfilled, onRejected);
    }

    public catch<TResult = never>(
        onRejected?: ((reason: Error) => TResult | PromiseLike<TResult>) | undefined | null,
    ): Promise<T | TResult> {
        return this.promise.catch(onRejected);
    }

    public finally(onFinally?: (() => void) | null): Promise<T> {
        return this.promise.finally(onFinally);
    }

    public resolve(value: T): void {
        this._value = value;
        this._resolve(value);
    }

    public reject(reason?: Error): void {
        this._reject(reason);
    }

}