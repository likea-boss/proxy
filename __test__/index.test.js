const { getPathSaver, parseStackTrace, PROXY_GET_HISTORY } = require("../src/index");

const exampleData = {
    valid: `Error
                at xt (/home/sysadmin/react/proxied-staff/index.js:296:12)
                at y (/home/sysadmin/react/proxied-staff/index.js:300:12)
                at Object.<anonymous> (/home/sysadmin/react/proxied-staff/index.js:303:13)
                at Module._compile (internal/modules/cjs/loader.js:688:30)
                at Object.Module._extensions..js (internal/modules/cjs/loader.js:699:10)
                at Module.load (internal/modules/cjs/loader.js:598:32)
                at tryModuleLoad (internal/modules/cjs/loader.js:537:12)
                at Function.Module._load (internal/modules/cjs/loader.js:529:3)
                at Function.Module.runMain (internal/modules/cjs/loader.js:741:12)
                at startup (internal/bootstrap/node.js:285:19)`,
    invalid: `Error
                Error
                Error
                Error`
};

describe("tests for parseStackTrace", () => {
    test("pass valid stack trace to function", () => {
        const result = parseStackTrace(exampleData.valid);

        expect(result.length).toBe(10);
        expect(result[0]).toEqual({
            functionName: "xt",
            functionLocation: "/home/sysadmin/react/proxied-staff/index.js",
            line: 296,
            row: 12
        });
        expect(result[1]).toEqual({
            functionName: "y",
            functionLocation: "/home/sysadmin/react/proxied-staff/index.js",
            line: 300,
            row: 12
        });
        expect(result[2]).toEqual({
            functionName: "Object.<anonymous>",
            functionLocation: "/home/sysadmin/react/proxied-staff/index.js",
            line: 303,
            row: 13
        });
        expect(result[3]).toEqual({
            functionName: "Module._compile",
            functionLocation: "internal/modules/cjs/loader.js",
            line: 688,
            row: 30
        });
        expect(result[4]).toEqual({
            functionName: "Object.Module._extensions..js",
            functionLocation: "internal/modules/cjs/loader.js",
            line: 699,
            row: 10
        });
        expect(result[5]).toEqual({
            functionName: "Module.load",
            functionLocation: "internal/modules/cjs/loader.js",
            line: 598,
            row: 32
        });
        expect(result[6]).toEqual({
            functionName: "tryModuleLoad",
            functionLocation: "internal/modules/cjs/loader.js",
            line: 537,
            row: 12
        });
        expect(result[7]).toEqual({
            functionName: "Function.Module._load",
            functionLocation: "internal/modules/cjs/loader.js",
            line: 529,
            row: 3
        });
        expect(result[8]).toEqual({
            functionName: "Function.Module.runMain",
            functionLocation: "internal/modules/cjs/loader.js",
            line: 741,
            row: 12
        });
        expect(result[9]).toEqual({
            functionName: "startup",
            functionLocation: "internal/bootstrap/node.js",
            line: 285,
            row: 19
        });
    });

    test("pass invalid stack trace to function", () => {
        const result = parseStackTrace(exampleData.invalid);
        expect(result).toEqual([]);
    });

    test("run function without arguments", () => {
        expect(() => parseStackTrace()).toThrow();
    });

    test("run function with invalid arguments", () => {
        expect(() => parseStackTrace([123, 456, 789])).toThrow();
    });
});
