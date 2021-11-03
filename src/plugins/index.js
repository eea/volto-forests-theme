// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer');

module.exports = function myRazzlePlugin(config, env, webpack, options) {
  const { dev } = env;

  const webpackConfig = !dev
    ? {
        ...config,
        plugins: [
          ...config.plugins,
          // new BundleAnalyzerPlugin.BundleAnalyzerPlugin({
          //   analyzerMode: 'static',
          //   generateStatsFile: true,
          //   statsFilename: stats,
          //   reportFilename: report,
          //   openAnalyzer: false,
          // }),
        ],
      }
    : {};

  return webpackConfig;
};
