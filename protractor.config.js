exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['./e2e-tests/*-spec.js'],
  // framework: 'mocha',
  mochaOpts: {
    reporter: "spec",
    slow: 3000,
    timeout: 4000
  }
}