import Forbidden from '@plone/volto/components/theme/Forbidden/Forbidden';
import Unauthorized from '@plone/volto/components/theme/Unauthorized/Unauthorized';

import { installBlocks } from '@eeacms/volto-plotlycharts';
import { applyConfig as installFiseFrontend } from './localconfig';

import ObjectListInlineWidget from './components/manage/Widgets/ObjectListInlineWidget';
import reducers from '@eeacms/volto-forests-theme/reducers';
import {
  RAZZLE_FRONTEND_VERSION,
  RAZZLE_FRONTEND_VERSION_URL,
  RAZZLE_FRONTEND_PUBLISHED_AT,
} from './constants/runtime';

import './slate-styles.css';

export default function applyConfig(config) {
  // Add here your project's configuration here by modifying `config` accordingly
  config = [installBlocks, installFiseFrontend].reduce(
    (acc, apply) => apply(acc),
    config,
  );

  config.settings = {
    ...config.settings,
    frontendMeta: {
      version: process.env.RAZZLE_FRONTEND_VERSION || RAZZLE_FRONTEND_VERSION,
      version_url:
        process.env.RAZZLE_FRONTEND_VERSION_URL || RAZZLE_FRONTEND_VERSION_URL,
      published_at:
        process.env.RAZZLE_FRONTEND_PUBLISHED_AT ||
        RAZZLE_FRONTEND_PUBLISHED_AT,
    },
    timezone: 'CET',
    pathsWithFullobjects: ['/news', '/events'],
    pathsWithExtraParameters: {
      '/news': { b_start: 0, b_size: 100000, metadatafields: '_all' },
      '/events': { b_start: 0, b_size: 100000, metadatafields: '_all' },
      '/latest-news-events-on-forest': {
        include_items: 'False',
      },
    },
  };

  config.views = {
    ...config.views,
    errorViews: {
      ...config.views.errorViews,
      '403': Forbidden,
      '401': Unauthorized,
    },
  };

  config.widgets = {
    ...config.widgets,
    widget: {
      ...config.widgets.widget,
      object_list_inline: ObjectListInlineWidget,
    },
  };

  config.viewlets = [...(config.viewlets || [])];
  config.addonReducers = { ...config.addonReducers, ...reducers };

  // export const portlets = {
  //   ...config.portlets,
  // };

  config.editForms = {
    ...config.editForms,
  };

  config.settings.slate = config.settings.slate || {};
  config.settings.slate.styleMenu = config.settings.slate.styleMenu || {};
  config.settings.slate.styleMenu.inlineStyles = [
    ...(config.settings.slate.styleMenu?.inlineStyles || []),
    { cssClass: 'white-text', label: 'White text' },
    // blue series
    { cssClass: 'blue-powder-text', label: 'Blue powder text' },
    { cssClass: 'blue-lightsteel-text', label: 'Blue lightsteel text' },
    { cssClass: 'blue-cadet-text', label: 'Blue cadet text' },
    { cssClass: 'blue-teal-text', label: 'Blue teal text' },
    { cssClass: 'blue-darkslate-text', label: 'Blue darkslate text' },
    // green series
    {
      cssClass: 'green-blanchedalmond-text',
      label: 'Green blanchedalmond text',
    },
    { cssClass: 'green-tan-text', label: 'Green tan text' },
    { cssClass: 'green-olivedrab-text', label: 'Green olivedrab text' },
    { cssClass: 'light-green-text', label: 'Light green text' },
    { cssClass: 'green-forest-text', label: 'Green forest text' },
    { cssClass: 'green-darkslate-text', label: 'Green darkslate text' },

    // army series
    { cssClass: 'army-darkolivegreen-text', label: 'Army darkolivegreen text' },
    { cssClass: 'army-yellowgreen-text', label: 'Army yellowgreen text' },
    { cssClass: 'army-olivedrab-text', label: 'Army olivedrab text' },
    { cssClass: 'army-moccasin-text', label: 'Army moccasin text' },
    { cssClass: 'army-khaki-text', label: 'Army khaki text' },

    { cssClass: 'vivid-green-text', label: 'Vivid green text' },
    { cssClass: 'blue-text', label: 'Blue text' },
    { cssClass: 'red-text', label: 'Red text' },
    { cssClass: 'yellow-text', label: 'Yellow text' },
    { cssClass: 'grey-text', label: 'Grey text' },
  ];
  // config.settings.slate.styleMenu.blockStyles = [
  //   ...config.settings.slate.styleMenu.blockStyles,
  //   { cssClass: 'green-block-text', label: 'Green Text' },
  //   { cssClass: 'underline-block-text', label: 'Underline Text' },
  // ];

  return config;
}
