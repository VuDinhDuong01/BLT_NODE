/* eslint-disable prettier/prettier */
//eslint-disable-next-line no-undef
module.exports = {
  apps: [{
    name: "web",
    script: "dist/index.js",
    watch:'.',
    env: {
      NODE_ENV: "development"
    },
    env_production: {
      NODE_ENV: "production"
    }
  }]
}