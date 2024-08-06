const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3001',
    env: {
      // set any environment variables here
      apiUrl: 'http://localhost:3000',  // backend server
    },
  },
});
