// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: '../app'
    },
    // Add this map config in addition to any baseUrl or
    // paths config you may already have in the project.
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['app/main']);