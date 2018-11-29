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

const PROXY_GET_HISTORY = Symbol("PROXY_GET_HISTORY");

module.exports = {
    PROXY_GET_HISTORY,
    action_types
};
