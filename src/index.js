/*
    1. Парсить информацию из стектрейса. +++++
    2. В разных рантаймах стектрейсы разные (нужно будет это доделать)

    1. Написать тесты

    FIXME ПРОБЛЕМЫ
    1. Spread оператор все портит.
 */

/*
* Утилита для логирования всех действий с обьектом.
* Все действия и изменения выполняются, но при этом ведеться лог этих изменений.
* */

const {
    PROXY_GET_HISTORY,
    action_types
} = require("./constants");
const {
    getStackTrace
} = require("./stackTraceParser");

//
//
//
//   HISTORY HOLDER
//
//
//

const HISTORY_STORE = {};

function getUniqueID() { // FIXME find better way
    return Date.now();
}

//
//
//
//
//
//
//

const proxyHandler = {
    construct(history, target, args) {
        const result = Reflect.construct(target, args);

        history.push({
            type: action_types.CONSTRUCT,
            args,
            result,
            stack: getStackTrace()
        });

        return result;
    },
    apply(history, target, thisArg, args) {

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
    defineProperty(history, target, key, descriptor) {
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
    getOwnPropertyDescriptor(history, target, key) {
        const descriptor = Reflect.getOwnPropertyDescriptor(target, key);

        history.push({
            type: action_types.GET_OWN_PROPERTY_DESCRIPTOR,
            key,
            descriptor,
            stack: getStackTrace()
        });

        return descriptor;
    },
    preventExtensions(history, target) {
        const result = Reflect.preventExtensions(target);

        history.push({
            type: action_types.PREVENT_EXTENSIONS,
            result,
            stack: getStackTrace()
        });

        return result;
    },
    isExtensible(history, target) {

        history.push({
            type: action_types.IS_EXTENSIBLE,
            isExtensible: Reflect.isExtensible(target),
            stack: getStackTrace()
        });

        return Reflect.isExtensible(target);
    },
    setPrototypeOf(history, target, proto) {
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
    getPrototypeOf(history, target) {
        const proto = Reflect.getPrototypeOf(target);

        history.push({
            type: action_types.GET_PROTOTYPE_OF,
            proto,
            stack: getStackTrace()
        });

        return proto;
    },
    has(history, target, key) {

        history.push({
            type: action_types.HAS,
            key,
            result: key in target,
            stack: getStackTrace()
        });

        return key in target;
    },
    get(history, target, key, receiver) {
        history.push({
            type: action_types.GET,
            key: key,
            value: target[key],
            stack: getStackTrace()
        });

        return target[key];
    },
    set(history, target, key, value, receiver) {
        history.push({
            type: action_types.SET,
            key: key,
            prevValue: target[key],
            value,
            stack: getStackTrace()
        });

        target[key] = value;
    },
    deleteProperty(history, target, key) {
        history.push({
            type: action_types.DELETE_PROPERTY,
            deletedValue: target[key],
            stack: getStackTrace()
        });

        delete target[key];
    },
    ownKeys(history, target) {
        history.push({
            type: action_types.OWN_KEYS,
            ownKeys: Reflect.ownKeys(target),
            stack: getStackTrace()
        });

        return Reflect.ownKeys(target);
    }
};

function getObjectLogger(target) {
    const id = getUniqueID();
    HISTORY_STORE[id] = [];
    const bindedProxyHandler = {};
    for (let key in proxyHandler)
        bindedProxyHandler[key] = proxyHandler[key].bind(null, HISTORY_STORE[id]);

    return new Proxy(target, bindedProxyHandler);
}

module.exports = {
    getObjectLogger,
    getStackTrace,
    PROXY_GET_HISTORY,
    action_types
};

const x = getObjectLogger({});
x.x;
x.y = 123;
delete x.t;

console.log(HISTORY_STORE);
