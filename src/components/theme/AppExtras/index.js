import CopyPaste from './CopyPaste';

const applyConfig = (config) => {
  config.settings.appExtras = [
    ...(config.settings.appExtras || []),
    {
      match: '/**/edit',
      component: CopyPaste,
    },
  ];

  return config;
};

export default applyConfig;
