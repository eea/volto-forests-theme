/**
 * View container.
 * @module components/theme/View/View
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Portal } from 'react-portal';
import { injectIntl } from 'react-intl';
import qs from 'query-string';
import config from '@plone/volto/registry';
import { Helmet } from '@plone/volto/helpers';

import { Comments, Tags, Toolbar } from '@plone/volto/components';
import { listActions, getContent } from '@plone/volto/actions';
import {
  BodyClass,
  getBaseUrl,
  getLayoutFieldname,
} from '@plone/volto/helpers';

/**
 * View container class.
 * @class View
 * @extends Component
 */
class View extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    actions: PropTypes.shape({
      object: PropTypes.arrayOf(PropTypes.object),
      object_buttons: PropTypes.arrayOf(PropTypes.object),
      user: PropTypes.arrayOf(PropTypes.object),
    }),
    listActions: PropTypes.func.isRequired,
    /**
     * Action to get the content
     */
    getContent: PropTypes.func.isRequired,
    /**
     * Pathname of the object
     */
    pathname: PropTypes.string.isRequired,
    location: PropTypes.shape({
      search: PropTypes.string,
      pathname: PropTypes.string,
    }).isRequired,
    /**
     * Version id of the object
     */
    versionId: PropTypes.string,
    /**
     * Content of the object
     */
    content: PropTypes.shape({
      /**
       * Layout of the object
       */
      layout: PropTypes.string,
      /**
       * Allow discussion of the object
       */
      allow_discussion: PropTypes.bool,
      /**
       * Title of the object
       */
      title: PropTypes.string,
      /**
       * Description of the object
       */
      description: PropTypes.string,
      /**
       * Type of the object
       */
      '@type': PropTypes.string,
      /**
       * Subjects of the object
       */
      subjects: PropTypes.arrayOf(PropTypes.string),
      is_folderish: PropTypes.bool,
    }),
    error: PropTypes.shape({
      /**
       * Error type
       */
      status: PropTypes.number,
    }),
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    actions: null,
    content: null,
    versionId: null,
    error: null,
  };

  state = {
    hasObjectButtons: null,
  };

  /**
   * Component will mount
   * @method componentWillMount
   * @returns {undefined}
   */
  componentWillMount() {
    this.props.listActions(getBaseUrl(this.props.pathname));
    this.props.getContent(
      getBaseUrl(this.props.pathname),
      this.props.versionId,
    );
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.pathname !== this.props.pathname) {
      this.props.listActions(getBaseUrl(nextProps.pathname));
      this.props.getContent(
        getBaseUrl(nextProps.pathname),
        this.props.versionId,
      );
    }

    if (nextProps.actions.object_buttons) {
      const objectButtons = nextProps.actions.object_buttons;
      this.setState({
        hasObjectButtons: !!objectButtons.length,
      });
    }
  }

  /**
   * Default fallback view
   * @method getViewDefault
   * @returns {string} Markup for component.
   */
  getViewDefault = () => config.views.defaultView;

  /**
   * Get view by content type
   * @method getViewByType
   * @returns {string} Markup for component.
   */
  getViewByType = () =>
    config.views.contentTypesViews[this.props.content['@type']] || null;

  /**
   * Get view by content layout property
   * @method getViewByLayout
   * @returns {string} Markup for component.
   */
  getViewByLayout = () =>
    config.views.layoutViews[
      this.props.content[getLayoutFieldname(this.props.content)]
    ] || null;

  /**
   * Cleans the component displayName (specially for connected components)
   * which have the Connect(componentDisplayName)
   * @method cleanViewName
   * @param  {string} dirtyDisplayName The displayName
   * @returns {string} Clean displayName (no Connect(...)).
   */
  cleanViewName = (dirtyDisplayName) =>
    dirtyDisplayName.replace('Connect(', '').replace(')', '').toLowerCase();

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    if (this.props.error) {
      let FoundView;
      if (this.props.error.status === undefined) {
        // For some reason, while development and if CORS is in place and the
        // requested resource is 404, it returns undefined as status, then the
        // next statement will fail
        FoundView = config.views.errorViews['404'];
      } else {
        FoundView = config.views.errorViews[this.props.error.status.toString()];
      }
      if (!FoundView) {
        FoundView = config.views.errorViews['404']; // default to 404
      }
      return (
        <div id="view">
          <FoundView />
        </div>
      );
    }
    if (!this.props.content) {
      return <span />;
    }
    return (
      <div id="view">
        {/* Body class if displayName in component is set */}
        <Helmet title={'FISE'} />
        <BodyClass className={''} />
        <div className="homepage-content"></div>

        {this.props.content.subjects &&
          this.props.content.subjects.length > 0 && (
            <Tags tags={this.props.content.subjects} />
          )}
        {/* Add opt-in social sharing if required, disabled by default */}
        {/* In the future this might be parameterized from the app config */}
        {/* <SocialSharing
          url={typeof window === 'undefined' ? '' : window.location.href}
          title={this.props.content.title}
          description={this.props.content.description || ''}
        /> */}
        {this.props.content.allow_discussion && (
          <Comments pathname={this.props.pathname} />
        )}

        <Portal node={__CLIENT__ && document.getElementById('toolbar')}>
          <Toolbar pathname={this.props.pathname} inner={<span />} />
        </Portal>
      </div>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state, props) => ({
      actions: state.actions.actions,
      token: state.userSession.token,
      content: state.content.data,
      error: state.content.get.error,
      pathname: props.location.pathname,
      versionId:
        qs.parse(props.location.search) &&
        qs.parse(props.location.search).version_id,
    }),
    {
      listActions,
      getContent,
    },
  ),
)(View);
