const { defineConfig } = require('cypress')

module.exports = defineConfig({
  viewportWidth: 1280,
  defaultCommandTimeout: 8888,
  reporter: 'junit',
  video: true,
  reporterOptions: {
    mochaFile: 'cypress/reports/cypress-[hash].xml',
    jenkinsMode: true,
    toConsole: true,
  },
  chromeWebSecurity: false,
  retries: {
    runMode: 8,
    openMode: 0,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3000',
  },
})
