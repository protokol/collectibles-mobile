const getCssLoaders = (config) => {
  const loaderFilter = (rule) =>
    rule.loader && rule.loader.includes('/css-loader');

  let loaders = config.module.rules.find((rule) => Array.isArray(rule.oneOf))
    .oneOf;

  loaders = loaders.reduce((ldrs, rule) => ldrs.concat(rule.use || []), []);

  return loaders.filter(loaderFilter);
};

module.exports = (config) => {
  // Fix url('/images/....') being processed by css-loader 4 =/  
  for (const loader of getCssLoaders(config)) {
    loader.options.url = (url) => url.startsWith('.');
  }
  return config;
};
