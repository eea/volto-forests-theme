/**
 * Root reducer.
 * @module reducers/root
 */

import defaultReducers from '@plone/volto/reducers';
import frontpage_slides from '@eeacms/volto-forests-theme/reducers/frontpage_slides';
import folder_header from '@eeacms/volto-forests-theme/reducers/folder_header';
import folder_tabs from '@eeacms/volto-forests-theme/reducers/folder_tabs';
import default_header_image from '@eeacms/volto-forests-theme/reducers/default_header_image';
import parent_folder_data from '@eeacms/volto-forests-theme/reducers/parent_folder_data';
import localnavigation from '@eeacms/volto-forests-theme/reducers/localnavigation';
import navSiteMap from '@eeacms/volto-forests-theme/reducers/sitemap';
import current_version from '@eeacms/volto-forests-theme/reducers/current_version';

/**
 * Root reducer.
 * @function
 * @param {Object} state Current state.
 * @param {Object} action Action to be handled.
 * @returns {Object} New state.
 */
const reducers = {
  ...defaultReducers,
  frontpage_slides,
  folder_header,
  default_header_image,
  folder_tabs,
  parent_folder_data,
  localnavigation,
  navSiteMap,
  current_version,
};

export default reducers;
