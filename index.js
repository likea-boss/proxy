// 1 Массив проксей
// 2 Массив путей

/*
* Утилита для логирования всех действий с обьектом.
* Все действия и изменения выполняются, но при этом ведеться лог этих изменений.
* Расширение для хрома и мозиллы
* */

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

/*
    Формат истории
 */

// const example = [
//     {
//         type: CONSTRUCT,
//         args: [...],
//         result: result,
//         stack: stack
//     },
//     {
//         type: APPLY,
//         thisArg: thisArg,
//         args: [...],
//         result: result,
//         stack: stack
//     },
//     {
//         type: DEFINE_PROPERTY,
//         key: key,
//         descriptor: descriptor,
//         result: result,
//         stack: stack
//     },
//     {
//         type: GET_OWN_PROPERTY_DESCRIPTOR,
//         key: key,
//         descriptor: descriptor,
//         stack: stack
//     },
//     {
//         type: PREVENT_EXTENSIONS,
//         result: result,
//         stack: stack
//     },
//     {
//         type: IS_EXTENSIBLE,
//         isExtensible: isExtensible,
//         stack: stack
//     },
//     {
//         type: SET_PROTOTYPE_OF,
//         proto: proto,
//         prevProto: prevProto,
//         result: result,
//         stack: stack
//     },
//     {
//         type: GET_PROTOTYPE_OF,
//         proto: proto,
//         stack: stack
//     },
//     {
//         type: HAS,
//         key: key,
//         result: result,
//         stack: stack
//     },
//     {
//         type: GET,
//         key: key,
//         value: value,
//         stack: stack
//     },
//     {
//         type: SET,
//         key: key,
//         value: value,
//         prevValue: prevValue,
//         stack: stack
//     },
//     {
//         type: DELETE_PROPERTY,
//         deletedValue: deletedValue,
//         stack: stack
//     },
//     {
//         type: OWN_KEYS,
//         ownKeys: keys,
//         stack: stack
//     }
// ];

function getStackTrace() {
    return new Error().stack;
}

const PROXY_GET_HISTORY = Symbol("PROXY_GET_HISTORY");

function getPathSaver(target) {

    const history = [];
    const proxyHandler = {
        construct(fakeTarget, args) {
            const result = Reflect.construct(target, args);

            history.push({
                type: action_types.CONSTRUCT,
                args,
                result,
                stack: getStackTrace()
            });

            return result;
        },
        apply(fakeTarget, thisArg, args) {

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

const x = getPathSaver({ x: 12, y: 42, t: 76 });
x.x
x.o
x.t
x.qwe = 123;

console.log(x(PROXY_GET_HISTORY));

console.log(getStackTrace());
