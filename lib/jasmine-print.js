jasmine.TrivialReporter = function(doc) {
};

jasmine.TrivialReporter.prototype.reportRunnerStarting = function(runner) {
    this.log('reportRunnerStarting. Version: ' + runner.env.versionString());

    var suites = runner.suites();
    for (var i = 0; i < suites.length; i++) {
        var suite = suites[i];
        this.log("Spec: " + suite.getFullName() + ". Description: " + suite.description);
    }

    this.startedAt = new Date();
};

jasmine.TrivialReporter.prototype.reportRunnerResults = function(runner) {
    this.log("reportRunnerResults");
    var results = runner.results();
    var specs = runner.specs();
    var specCount = 0;
    for (var i = 0; i < specs.length; i++) {
        if (this.specFilter(specs[i])) {
            specCount++;
        }
    }
    var message = "" + specCount + " spec" + (specCount == 1 ? "" : "s" ) + ", " + results.failedCount + " failure" + ((results.failedCount == 1) ? "" : "s");
    message += " in " + ((new Date().getTime() - this.startedAt.getTime()) / 1000) + "s";
    this.log(message);
    this.log("Finished at " + new Date().toString());
};

jasmine.TrivialReporter.prototype.reportSuiteResults = function(suite) {
    this.log("reportSuiteResults");
    var results = suite.results();
    var status = results.passed() ? 'passed' : 'failed';
    if (results.totalCount == 0) { // todo: change this to check results.skipped
        status = 'skipped';
    }
    this.log("Status: " + status);
};

jasmine.TrivialReporter.prototype.reportSpecStarting = function(spec) {
    this.log('>> Jasmine Running ' + spec.suite.description + ' ' + spec.description + '...');
};

jasmine.TrivialReporter.prototype.reportSpecResults = function(spec) {
    this.log("reportSpecResults");
    var results = spec.results();
    var status = results.passed() ? 'passed' : 'failed';
    if (results.skipped) {
        status = 'skipped';
    }
    this.log(spec.getFullName() + ". Status: " + status);

    var resultItems = results.getItems();
    for (var i = 0; i < resultItems.length; i++) {
        var result = resultItems[i];

        if (result.type == 'log') {
            this.log(result.toString());
        } else if (result.type == 'expect' && result.passed && !result.passed()) {
            this.log(result.message);

            if (result.trace.stack) {
                this.log(result.trace.stack);
            }
        }
    }
};

jasmine.TrivialReporter.prototype.log = function(line) {
    print(line);
};

jasmine.TrivialReporter.prototype.getLocation = function() {
    this.log("getLocation");
    return this.document.location;
};

jasmine.TrivialReporter.prototype.specFilter = function(spec) {
    this.log("specFilter");
    var paramMap = {};
    var params = this.getLocation().search.substring(1).split('&');
    for (var i = 0; i < params.length; i++) {
        var p = params[i].split('=');
        paramMap[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
    }

    if (!paramMap["spec"]) return true;
    return spec.getFullName().indexOf(paramMap["spec"]) == 0;
};
