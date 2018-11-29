function getStackTrace() {
    return parseStackTrace(new Error().stack);
}

function parseStackTrace(stackTrace) {
    if (typeof stackTrace !== "string")
        throw new Error("Wrong type of argument. Should be a string");

    const parsedStackTrace = [];

    stackTrace.split("\n").forEach(value => {
        const result = /at ([a-zA-Z._<>]+) \((.+):(\d+):(\d+)\)/gm.exec(value); // for nodejs only FIXME need more tests with different stack traces

        if(result) {
            parsedStackTrace.push({
                functionName: result[1],
                functionLocation: result[2],
                line: +result[3],
                row: +result[4]
            });
        }
    });

    return parsedStackTrace;
}

module.exports = {
    getStackTrace,
    parseStackTrace
};