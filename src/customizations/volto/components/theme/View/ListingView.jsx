import React, { Component } from "react";
import PropTypes from "prop-types";
import { Helmet } from "@plone/volto/helpers";
import { getLocalnavigation } from "@eeacms/volto-forests-theme/actions";
import { connect } from "react-redux";
import { compose } from "redux";
import { getBaseUrl } from "@plone/volto/helpers"; // , flattenToAppURL

import { Container, Image } from "semantic-ui-react"; // , Grid
import { map } from "lodash";

import config from "@plone/volto/registry";
import { asyncConnect } from "redux-connect";

import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  hasBlocksData,
} from "@plone/volto/helpers";
import { samePath } from "../../../../../helpers";
import { Dimmer, Loader } from "semantic-ui-react";

class ListingView extends Component {
  static propTypes = {
    localNavigation: PropTypes.any,
    getLocalnavigation: PropTypes.func.isRequired,
    pathname: PropTypes.any,
    content: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      text: PropTypes.shape({
        data: PropTypes.string,
      }),
      items: PropTypes.arrayOf(
        PropTypes.shape({
          "@id": PropTypes.string,
          "@type": PropTypes.string,
          description: PropTypes.string,
          review_state: PropTypes.string,
          title: PropTypes.string,
          url: PropTypes.string,
        })
      ),
    }).isRequired,
  };

  render() {
    const content = this.props.content;
    const blocksFieldname = getBlocksFieldname(content);
    const blocksLayoutFieldname = getBlocksLayoutFieldname(content);
    const localNavigation =
      (this.props.localNavigation &&
        this.props.localNavigation.items &&
        this.props.localNavigation.items.filter(
          (item) => item.title !== "Home"
        )) ||
      [];

    const currentUrl = this.props.content?.["@id"];
    const shouldRenderRoutes =
      typeof currentUrl !== "undefined" &&
      samePath(currentUrl, this.props.pathname)
        ? true
        : false;
    if (!shouldRenderRoutes)
      return (
        <Dimmer active inverted>
          <Loader size="massive" />
        </Dimmer>
      );

    let pageTemplate = hasBlocksData(content) ? (
      <div id="page-document">
        <Helmet title={content.title} />
        {map(content[blocksLayoutFieldname].items, (block) => {
          const Block =
            config.blocks.blocksConfig[
              content[blocksFieldname]?.[block]?.["@type"]
            ]?.["view"] || null;
          return Block !== null &&
            content[blocksFieldname][block]["@type"] !== "title" ? (
            <Block
              key={block}
              id={block}
              properties={content}
              data={content[blocksFieldname][block]}
            />
          ) : (
            ""
          );
        })}
      </div>
    ) : (
      <Container id="page-document">
        <Helmet title={content.title} />
        {content.image && (
          <Image
            className="document-image"
            src={content.image.scales.thumb.download}
            floated="right"
          />
        )}
        {content.remoteUrl && (
          <span>
            The link address is:
            <a href={content.remoteUrl}>{content.remoteUrl}</a>
          </span>
        )}
        {content.text && (
          <div
            dangerouslySetInnerHTML={{
              __html: content.text.data.replace(
                /a href="([^"]*\.[^"]*)"/g,
                `a href="${config.settings.apiPath}$1/download/file"`
              ),
            }}
          />
        )}
      </Container>
    );
    if (!localNavigation.length) {
      pageTemplate = hasBlocksData(content) ? (
        <div id="page-document">
          <Helmet title={content.title} />
          {map(content[blocksLayoutFieldname].items, (block) => {
            const Block =
              config.blocks.blocksConfig[
                content[blocksFieldname]?.[block]?.["@type"]
              ]?.["view"] || null;
            return Block !== null &&
              content[blocksFieldname][block]["@type"] !== "title" ? (
              <Block
                key={block}
                id={block}
                properties={content}
                data={content[blocksFieldname][block]}
              />
            ) : (
              ""
            );
          })}
        </div>
      ) : (
        <Container id="page-document">
          <Helmet title={content.title} />
          {content.description && (
            <p className="documentDescription">{content.description}</p>
          )}
          {content.image && (
            <Image
              className="document-image"
              src={content.image.scales.thumb.download}
              floated="right"
            />
          )}
          {content.remoteUrl && (
            <span>
              The link address is:
              <a href={content.remoteUrl}>{content.remoteUrl}</a>
            </span>
          )}
          {content.text && (
            <div
              dangerouslySetInnerHTML={{
                __html: content.text.data.replace(
                  /a href="([^"]*\.[^"]*)"/g,
                  `a href="${config.settings.apiPath}$1/download/file"`
                ),
              }}
            />
          )}
        </Container>
      );
    }
    return pageTemplate;
  }
}

export default compose(
  asyncConnect([
    {
      key: "localnavigation",
      promise: ({ location, store: { content, dispatch } }) =>
        __SERVER__ &&
        dispatch(getLocalnavigation(getBaseUrl(location.pathname))),
    },
  ]),
  connect(
    (state, props) => ({
      localNavigation: state.localnavigation.items,
      pathname: props.location.pathname,
      // localnavigation: state.localnavigation,
    }),
    { getLocalnavigation }
  )
)(ListingView);
