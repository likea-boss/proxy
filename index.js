// 1 Массив проксей
// 2 Массив путей

/*
* Утилита для логирования всех действий с обьектом.
* Все действия и изменения выполняются, но при этом ведеться лог этих изменений.
* Расширение для хрома и мозиллы
* */

/*
    Формат истории
 */

const action_types = {
    CONSTRUCT: Symbol("CONSTRUCT"),
    APPLY: Symbol("APPLY"),
    DEFINE_PROPERTY: Symbol("DEFINE_PROPERTY"),
    GET_OWN_PROPERTY_DESCRIPTOR: Symbol("GET_OWN_PROPERTY_DESCRIPTOR"),
    PREVENT_EXTENSIONS: Symbol("PREVENT_EXTENSIONS"),
    IS_EXTENSIBLE: Symbol("IS_EXTENSIBLE"),
    SET_PROTOTYPE_OF: Symbol("SET_PROTOTYPE_OF"),
    GET_PROTOTYPE_OF: Symbol("GET_PROTOTYPE_OF"),
    HAS: Symbol("HAS"),
    GET: Symbol("GET"),
    SET: Symbol("SET"),
    DELETE_PROPERTY: Symbol("DELETE_PROPERTY"),
    OWN_KEYS: Symbol("OWN_KEYS")
};

// const example = [
//     {
//         type: CONSTRUCT,
//         args: [...]
//     },
//     {
//         type: APPLY,
//         thisArg: thisArg,
//         args: [...],
//         result: result
//     },
//     {
//         type: DEFINE_PROPERTY,
//         key: key,
//         descriptor: descriptor
//     },
//     {
//         type: GET_OWN_PROPERTY_DESCRIPTOR,
//         key: key,
//         result: result
//     },
//     {
//         type: PREVENT_EXTENSIONS
//     },
//     {
//         type: IS_EXTENSIBLE
//     },
//     {
//         type: SET_PROTOTYPE_OF,
//         proto: proto,
//         prevProto: prevProto
//     },
//     {
//         type: GET_PROTOTYPE_OF,
//         proto: proto
//     },
//     {
//         type: HAS,
//         key: key
//     },
//     {
//         type: GET,
//         key: key,
//         value: value
//     },
//     {
//         type: SET,
//         key: key,
//         value: value,
//         prevValue: prevValue
//     },
//     {
//         type: DELETE_PROPERTY,
//         deletedValue: deletedValue
//     },
//     {
//         ownKeys: OWN_KEYS,
//         ownKeys: keys
//     }
//
// ];

const PROXY_GET_HISTORY = Symbol("PROXY_GET_HISTORY");
const PROXY_REVOKE = Symbol("PROXY_REVOKE");

function getPathSaver(target) {
    let revoke = null;
    const history = [];

    const proxyHandler = {

        // for functions only
        construct(fakeTarget, args) {
            console.trace("new called", args);
            return Reflect.construct();
        },

        apply(fakeTarget, thisArg, args) {

            if (args.length === 1) {

                switch (args[0]) {
                    case PROXY_GET_HISTORY:
                        return history;

                        // FIXME Is that needed?
                    case PROXY_REVOKE:
                        throw new Error("Not Implemented");
                }
            }

            console.trace("apply called", thisArg, args);

            if ("apply" in target && typeof target.apply === "function")
                return target.apply(thisArg, args);
            else
                console.log("target is not a function");

        },

        // for functions only
        defineProperty(fakeTarget, key, descriptor) {
            console.trace("defineProperty called", key, descriptor);
            return Reflect.defineProperty(target, key, descriptor);
        },
        getOwnPropertyDescriptor(fakeTarget, key) {
            console.trace("getOwnPropertyDescriptor called", key);
            return Reflect.getOwnPropertyDescriptor(target, key);
        },
        preventExtensions(fakeTarget) {
            console.trace("preventExtensions called");
            return Reflect.preventExtensions(target);
        },
        isExtensible(fakeTarget) {
            console.trace("isExtensible called");
            return Reflect.isExtensible(target);
        },

        setPrototypeOf(fakeTarget, proto) {
            console.trace("setPrototypeOf called", proto);
            return Reflect.setPrototypeOf(target, proto);
        },
        getPrototypeOf(fakeTarget) {
            cosnole.trace("getPrototypeOf called");
            return Reflect.getPrototypeOf(target);
        },

        has(fakeTarget, key) {
            console.trace("has called");
            return key in target;
        },
        get(fakeTarget, key, receiver) {
            history.push({
                type: action_types.GET,
                key: key,
                value: target[key]
            });

            console.trace("get called", key);
            return target[key];
        },
        set(fakeTarget, key, value, receiver) {
            history.push({
                type: action_types.SET,
                key: key,
                prevValue: target[key],
                value
            });

            console.trace("set called", key, value);
            target[key] = value;
        },
        deleteProperty(fakeTarget, key) {
            history.push({
                type: action_types.DELETE_PROPERTY,
                deletedValue: target[key]
            });

            console.trace("deleteProperty called", key);
            delete target[key];
        },
        ownKeys(fakeTarget) {
            history.push({
                type: action_types.OWN_KEYS,
                ownKeys: Reflect.ownKeys(target)
            });

            console.trace("ownKeys called");
            return Reflect.ownKeys(target);
        }
    };

    let proxy = Proxy.revocable(() => {}, proxyHandler);
    revoke = proxy.revoke;

    return proxy.proxy;
}

const x = getPathSaver({ x: 12, y: 42, t: 76 });
x.x
x.o
x.t
x.qwe = 123;

console.log(x(PROXY_GET_HISTORY));
