import { fail } from '@/helpers/error_helpers';
import { mock } from '@/testing/mocking';
import type { ClassInstance } from '@/types/helpers';
import type { Constructor } from '@/types/classes';
import type { Obj } from '@/helpers/object_helpers';

export type FacadeMethods<TInstance, TMockClass extends Constructor> = {
    instance: TInstance | null;
    mockClass: TMockClass | null;
    setInstance(instance: TInstance): void;
    setMockClass: (mockClass: TMockClass) => void;
    requireInstance(): TInstance;
    mock: <T extends ClassInstance<TMockClass>>(mockInstance?: T | Obj | object) => T;
};

export type Facade<TInstance, TMockClass extends Constructor> = TInstance & FacadeMethods<TInstance, TMockClass>;

export function facade<TInstance extends object>(
    instance?: TInstance | null
): Facade<TInstance, Constructor<TInstance>>;
export function facade<TInstance extends object, TMockClass extends Constructor>(
    instance: TInstance | null,
    mockClass: TMockClass | null,
): Facade<TInstance, TMockClass>;
export function facade<TInstance extends object, TMockClass extends Constructor>(
    instance: TInstance | null = null,
    mockClass: TMockClass | null = null,
): Facade<TInstance, TMockClass> {
    const facade: FacadeMethods<TInstance, TMockClass> = {
        instance,
        mockClass,
        setInstance: instance => facade.instance = instance,
        setMockClass: mockClass => facade.mockClass = mockClass,
        requireInstance: () => facade.instance ?? fail('Facade not initialized'),
        mock<T extends ClassInstance<TMockClass>>(mockInstance?: T | Obj | object) {
            const instance = mock(mockInstance ?? (facade.mockClass ? new facade.mockClass() : {}));

            facade.instance = instance as TInstance;

            return instance as T;
        },
    };

    return new Proxy(facade, {
        get: (_, property, receiver) => {
            const t = property !== 'constructor' && property in facade ? facade : facade.requireInstance();

            return Reflect.get(t, property, receiver);
        },
        set: (_, property, receiver) => Reflect.set(facade.requireInstance(), property, receiver),
    }) as unknown as Facade<TInstance, TMockClass>;
}
