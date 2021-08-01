import { tt } from '@/testing/index';
import type { Equals, Expect } from '@/testing/index';

import TargetClass, { BaseClass } from './inheritance_helpers.stubs';

describe('Inheritance helpers', () => {

    it('mixes methods', () => {
        const instance = new TargetClass;

        instance.id = 1;
        instance.specificId = 2;
        instance.name = '3';
        instance.age = 4;

        expect(instance.getId()).toEqual('id: 1');
        expect(instance.getSpecificId()).toEqual('specific id: 2');
        expect(instance.getName()).toEqual('name: 3');
        expect(instance.getAge()).toEqual('age: 4');
    });

    it('works with instanceof', () => {
        const instance = new TargetClass;

        expect(instance).toBeInstanceOf(BaseClass);
        expect(instance).toBeInstanceOf(TargetClass);
    });

    it('uses default attribute values', () => {
        const instance = new TargetClass;

        expect(instance.getId()).toEqual('id: 23');
        expect(instance.getSpecificId()).toEqual('specific id: 32');
        expect(instance.getName()).toEqual('name: John');
        expect(instance.getAge()).toEqual('age: 42');
    });

    it('supports mixins inheritance', () => {
        const instance = new TargetClass;

        expect(instance.getSurname()).toEqual('surname: Doe');
    });

    it('supports inferring this for mixins', () => {
        const instance = new TargetClass;

        expect(instance.identifyWithName()).toEqual('identify: [23] John Doe');
        expect(instance.identifyWithAge()).toEqual('identify: [23] 42');
    });

    it('uses mixin methods within final class', () => {
        const instance = new TargetClass;

        expect(instance.describe()).toEqual('id: 23, specific id: 32, name: John, surname: Doe, age: 42');
    });

    it.todo('disallows using mixins for unsupported classes');

});

describe('Inheritance helpers types', () => {

    let instance: TargetClass;

    it('has proper types', tt<
        Expect<Equals<typeof instance.name, string>> |
        Expect<Equals<typeof instance.age, number>> |
        Expect<Equals<typeof instance.getName, () => string>> |
        Expect<Equals<typeof instance.getAge, () => string>> |
        true
    >());

});
