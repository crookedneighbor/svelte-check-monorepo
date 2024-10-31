interface MyType {
    foo: string;
}

interface OtherType {
    foo: string;
    bar: string;
}

function someOtherFunction(arg: OtherType) {
    return arg.foo;
}

export function someFunction(arg: MyType) {
    return someOtherFunction(arg);
}