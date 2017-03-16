define(function (require) {
    // Load any app-specific modules
    // with a relative require call,
    // like:
    var helper = require('./helper');

    // Load library/vendor modules using
    // full IDs, like:
    //helper.loadSelect("encarregados");
    //helper.loadSelect("indiciados");
    helper.loadSelects();
});