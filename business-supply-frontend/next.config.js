/** @type {import('next').NextConfig} */
const path = require("path");
const { loadEnvConfig } = require("@next/env");

const apiEnvPath = path.resolve(__dirname, "../api/");
loadEnvConfig(apiEnvPath, true);


const Dotenv = require("dotenv-webpack");

module.exports = {
  webpack(config, { isServer }) {
    // Specify the absolute path to your .env file located in the api/ folder
    config.plugins.push(
      new Dotenv({
        path: path.resolve(__dirname, "../api/.env"), // Adjust the path accordingly
      }),
    );

    return config;
  },
};
