console.log = function(line) {
    print(line);
};
jasmine.getEnv().addReporter(new jasmine.ConsoleReporter());
jasmine.getEnv().execute();
