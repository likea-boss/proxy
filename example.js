const { action_types } = require("./constants");

/*
    Формат истории
 */

const historyExample = [
    {
        type: action_types.CONSTRUCT,
        args: [...],
        result: result,
        stack: stack
    },
    {
        type: action_types.APPLY,
        thisArg: thisArg,
        args: [...],
        result: result,
        stack: stack
    },
    {
        type: action_types.DEFINE_PROPERTY,
        key: key,
        descriptor: descriptor,
        result: result,
        stack: stack
    },
    {
        type: action_types.GET_OWN_PROPERTY_DESCRIPTOR,
        key: key,
        descriptor: descriptor,
        stack: stack
    },
    {
        type: action_types.PREVENT_EXTENSIONS,
        result: result,
        stack: stack
    },
    {
        type: action_types.IS_EXTENSIBLE,
        isExtensible: isExtensible,
        stack: stack
    },
    {
        type: action_types.SET_PROTOTYPE_OF,
        proto: proto,
        prevProto: prevProto,
        result: result,
        stack: stack
    },
    {
        type: action_types.GET_PROTOTYPE_OF,
        proto: proto,
        stack: stack
    },
    {
        type: action_types.HAS,
        key: key,
        result: result,
        stack: stack
    },
    {
        type: action_types.GET,
        key: key,
        value: value,
        stack: stack
    },
    {
        type: action_types.SET,
        key: key,
        value: value,
        prevValue: prevValue,
        stack: stack
    },
    {
        type: action_types.DELETE_PROPERTY,
        deletedValue: deletedValue,
        stack: stack
    },
    {
        type: action_types.OWN_KEYS,
        ownKeys: keys,
        stack: stack
    }
];

/*
    Формат распарсеного стектрейса
 */
/*

`Error
    at xt (/home/sysadmin/react/proxied-staff/index.js:296:12)
    at y (/home/sysadmin/react/proxied-staff/index.js:300:12)
    at Object.<anonymous> (/home/sysadmin/react/proxied-staff/index.js:303:13)
    at Module._compile (internal/modules/cjs/loader.js:688:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)
    at Module.load (internal/modules/cjs/loader.js:598:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:537:12)
    at Function.Module._load (internal/modules/cjs/loader.js:529:3)
    at Function.Module.runMain (internal/modules/cjs/loader.js:741:12)
    at startup (internal/bootstrap/node.js:285:19)`
*/

const stackTraceExample = [
    {
        functionName: "xt",
        functionLocation: "/home/sysadmin/react/proxied-staff/index.js",
        line: 296,
        row: 12
    },
    {
        functionName: "y",
        functionLocation: "/home/sysadmin/react/proxied-staff/index.js",
        line:300,
        row:12
    }
];