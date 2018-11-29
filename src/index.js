/*
    1. Парсить информацию из стектрейса. +++++
    2. В разных рантаймах стектрейсы разные (нужно будет это доделать)

    1. Написать тесты

    FIXME ПРОБЛЕМЫ
    1. Spread оператор все портит.
    2. Проксированый объект неполучается вызвать с оператором new (потому что он не является классом).
    3. Как в рантайме определить фушкция это или класс // FIXME Reflect.ownKeys(Class) -> ["length", "prototype", "name"], но Reflect.ownKeys(function) -> ["length", "name", "arguments", "caller", "prototype"]
 */

/*
* Утилита для логирования всех действий с обьектом.
* Все действия и изменения выполняются, но при этом ведеться лог этих изменений.
* Расширение для хрома и мозиллы
* */

const { PROXY_GET_HISTORY, action_types } = require("./constants");

function getStackTrace() {
    const stack = new Error().stack;

    return parseStackTrace(stack);
}

function parseStackTrace(stack) {
    if (typeof stack !== "string")
        throw new Error("Wrong type of argument. Should be a string");

    const parsedStack = [];

    stack.split("\n").forEach(value => {
        const result = /at ([a-zA-Z._<>]+) \((.+):(\d+):(\d+)\)/gm.exec(value); // for nodejs only FIXME need more tests with different stack traces

        if(result) {
            parsedStack.push({
                functionName: result[1],
                functionLocation: result[2],
                line: +result[3],
                row: +result[4]
            });
        }
    });

    return parsedStack;
}

function getPathSaver(target) {

    const history = [];
    const proxyHandler = {
        construct(fakeTarget, args) { // FIXME чекать является ли target конструктором (функция тоже не подходит)

            const result = Reflect.construct(target, args);

            history.push({
                type: action_types.CONSTRUCT,
                args,
                result,
                stack: getStackTrace()
            });

            return result;
        },
        apply(fakeTarget, thisArg, args) { // FIXME чекать является ли target функцией (конструктор тоже не подходит)

            if (args.length === 1 && args[0] === PROXY_GET_HISTORY) {
                return history;
            }

            if (typeof target === "function" && typeof target.apply === "function") {
                const result = target.apply(thisArg, args);

                history.push({
                    type: action_types.APPLY,
                    thisArg,
                    args,
                    result,
                    stack: getStackTrace()
                });

                return result;
            }
            else {
                console.log("target is not a function");
            }

        },
        defineProperty(fakeTarget, key, descriptor) {
            const result = Reflect.defineProperty(target, key, descriptor);

            history.push({
                type: action_types.DEFINE_PROPERTY,
                key,
                descriptor,
                result,
                stack: getStackTrace()
            });

            return result;
        },
        getOwnPropertyDescriptor(fakeTarget, key) {
            const descriptor = Reflect.getOwnPropertyDescriptor(target, key);

            history.push({
                type: action_types.GET_OWN_PROPERTY_DESCRIPTOR,
                key,
                descriptor,
                stack: getStackTrace()
            });

            return descriptor;
        },
        preventExtensions(fakeTarget) {
            const result = Reflect.preventExtensions(target);

            history.push({
                type: action_types.PREVENT_EXTENSIONS,
                result,
                stack: getStackTrace()
            });

            return result;
        },
        isExtensible(fakeTarget) {

            history.push({
                type: action_types.IS_EXTENSIBLE,
                isExtensible: Reflect.isExtensible(target),
                stack: getStackTrace()
            });

            return Reflect.isExtensible(target);
        },
        setPrototypeOf(fakeTarget, proto) {
            const prevProto = Reflect.getPrototypeOf(target); // FIXME need more research
            const result = Reflect.setPrototypeOf(target, proto);

            history.push({
                type: action_types.SET_PROTOTYPE_OF,
                proto,
                prevProto,
                result,
                stack: getStackTrace()
            });

            return result;
        },
        getPrototypeOf(fakeTarget) {
            const proto = Reflect.getPrototypeOf(target);

            history.push({
                type: action_types.GET_PROTOTYPE_OF,
                proto,
                stack: getStackTrace()
            });

            return proto;
        },
        has(fakeTarget, key) {

            history.push({
                type: action_types.HAS,
                key,
                result: key in target,
                stack: getStackTrace()
            });

            return key in target;
        },
        get(fakeTarget, key, receiver) {
            history.push({
                type: action_types.GET,
                key: key,
                value: target[key],
                stack: getStackTrace()
            });

            return target[key];
        },
        set(fakeTarget, key, value, receiver) {
            history.push({
                type: action_types.SET,
                key: key,
                prevValue: target[key],
                value,
                stack: getStackTrace()
            });

            target[key] = value;
        },
        deleteProperty(fakeTarget, key) {
            history.push({
                type: action_types.DELETE_PROPERTY,
                deletedValue: target[key],
                stack: getStackTrace()
            });

            delete target[key];
        },
        ownKeys(fakeTarget) {
            history.push({
                type: action_types.OWN_KEYS,
                ownKeys: Reflect.ownKeys(target),
                stack: getStackTrace()
            });

            return Reflect.ownKeys(target);
        }
    };

    return Proxy.revocable(() => {}, proxyHandler).proxy;
}

module.exports = {
    getPathSaver,
    getStackTrace,
    parseStackTrace,
    PROXY_GET_HISTORY,
    action_types
};