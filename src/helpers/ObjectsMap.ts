/* eslint-disable @typescript-eslint/ban-types */
import { toString } from './object_helpers';

export type ObjectKeyExtractor<T> = (item: T) => string;

export default class ObjectsMap<Item extends object> {

    /* eslint-disable max-len */
    public static createFromArray<T extends object>(items: T[], keyExtractor?: ObjectKeyExtractor<T>): ObjectsMap<T>;
    public static createFromArray<T extends object, S extends keyof T>(items: T[], key: S): ObjectsMap<T>;
    /* eslint-enable max-len */

    public static createFromArray<T extends object, S extends keyof T>(
        items: T[],
        key?: S | ObjectKeyExtractor<T>,
    ): ObjectsMap<T> {
        const keyExtractor = typeof key === 'string'
            ? (item: T) => item[key]
            : key;

        const map = new ObjectsMap(keyExtractor as ObjectKeyExtractor<T>);

        items.forEach(item => map.add(item));

        return map;
    }

    private keysToItems: Map<string, Item>;
    private itemsToKeys: WeakMap<Item, string>;
    private getKey: (item: Item) => string;

    constructor(keyExtractor?: ObjectKeyExtractor<Item>) {
        this.keysToItems = new Map();
        this.itemsToKeys = new WeakMap;
        this.getKey = keyExtractor ?? (item => toString(item));
    }

    *[Symbol.iterator](): Iterator<[string, Item]> {
        yield* this.keysToItems;
    }

    public items(): IterableIterator<Item> {
        return this.keysToItems.values();
    }

    public keys(): IterableIterator<string> {
        return this.keysToItems.keys();
    }

    public entries(): IterableIterator<[string, Item]> {
        return this.keysToItems.entries();
    }

    public add(item: Item): void {
        const key = this.getKey(item);

        this.keysToItems.set(key, item);
        this.itemsToKeys.set(item, key);
    }

    public get(key: string): Item | undefined {
        return this.keysToItems.get(key);
    }

    public getKeys(): string[] {
        return [...this.keysToItems.keys()];
    }

    public getItems(): Item[] {
        return [...this.keysToItems.values()];
    }

    public hasKey(key: string): boolean {
        return this.keysToItems.has(key);
    }

    public hasItem(item: Item): boolean {
        return this.itemsToKeys.has(item);
    }

    public delete(item: Item): void {
        const key = this.itemsToKeys.get(item);

        if (!key)
            return;

        this.itemsToKeys.delete(item);
        this.keysToItems.delete(key);
    }

    public clear(): void {
        this.itemsToKeys = new WeakMap();
        this.keysToItems.clear();
    }

}