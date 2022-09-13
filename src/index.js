import Forbidden from '@plone/volto/components/theme/Forbidden/Forbidden';
import Unauthorized from '@plone/volto/components/theme/Unauthorized/Unauthorized';

import installAppExtras from '@eeacms/volto-forests-theme/components/theme/AppExtras';

import { applyConfig as installFiseFrontend } from './localconfig';
import installDiscodataConnectorBlock from '@eeacms/volto-forests-theme/components/manage/Blocks/DiscodataConnectorBlock';
import installExpandableDataTable from './components/manage/Blocks/SimpleDataTable';
import installImageCards from './components/manage/Blocks/ImageCards';

import ObjectListInlineWidget from './components/manage/Widgets/ObjectListInlineWidget';
import reducers from '@eeacms/volto-forests-theme/reducers';

import './slate-styles.css';

export default function applyConfig(config) {
  // Add here your project's configuration here by modifying `config` accordingly
  config = [
    installAppExtras,
    installFiseFrontend,
    installDiscodataConnectorBlock,
    installExpandableDataTable,
    installImageCards,
  ].reduce((acc, apply) => apply(acc), config);

  config.settings = {
    ...config.settings,
    frontendMeta: {
      version: process.env.RAZZLE_FRONTEND_VERSION,
      version_url: process.env.RAZZLE_FRONTEND_VERSION_URL,
      published_at: process.env.RAZZLE_FRONTEND_PUBLISHED_AT,
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

  config.viewlets = config.viewlets || [];
  config.addonReducers = { ...config.addonReducers, ...reducers };

  // export const portlets = {
  //   ...config.portlets,
  // };

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

    //red series
    { cssClass: 'red-mistyrose-text', label: 'Red mistyrose text' },
    { cssClass: 'red-darksalmon-text', label: 'Red darksalmon text' },
    { cssClass: 'red-indian-text', label: 'Red indian text' },
    { cssClass: 'red-brown-text', label: 'Red brown text' },
    { cssClass: 'red-dark-text', label: 'Red dark text' },

    //orange set
    { cssClass: 'orange-mistyrose-text', label: 'Orange mistyrose text' },
    { cssClass: 'orange-pale-text', label: 'Orange pale text' },
    { cssClass: 'orange-gold-text', label: 'Orange gold text' },
    { cssClass: 'orange-text', label: 'Orange text' },
    { cssClass: 'orange-sienna-text', label: 'Orange sienna text' },
    { cssClass: 'orange-saddle-text', label: 'Orange saddle text' },

    //black set
    { cssClass: 'black-text', label: 'Black text' },
    { cssClass: 'black-dimgray-text', label: 'Black dimgray text' },
    { cssClass: 'black-gray-text', label: 'Black gray text' },
    { cssClass: 'black-silver-text', label: 'Black silver text' },
    { cssClass: 'black-gainsboro-text', label: 'Black gainsboro text' },

    { cssClass: 'blue-text', label: 'Blue text' },
    { cssClass: 'red-text', label: 'Red text' },
    { cssClass: 'yellow-text', label: 'Yellow text' },
    { cssClass: 'grey-text', label: 'Grey text' },

    // font-sizes
    { cssClass: 'x-large', label: 'x-large' },
    { cssClass: 'xx-large', label: 'xx-large' },
    { cssClass: 'xxx-large', label: 'xxx-large' },
  ];
  // config.settings.slate.styleMenu.blockStyles = [
  //   ...config.settings.slate.styleMenu.blockStyles,
  //   { cssClass: 'green-block-text', label: 'Green Text' },
  //   { cssClass: 'underline-block-text', label: 'Underline Text' },
  // ];

  return config;
}
