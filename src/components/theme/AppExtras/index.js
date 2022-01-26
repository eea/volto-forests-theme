import CopyPaste from './CopyPaste';

export default (config) => {
  config.settings.appExtras = [
    ...(config.settings.appExtras || []),
    {
      match: '/**/edit',
      component: CopyPaste,
    },
  ];

  return config;
};
