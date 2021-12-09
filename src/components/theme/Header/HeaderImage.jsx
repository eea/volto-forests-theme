import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Placeholder } from 'semantic-ui-react';
import { flattenToAppURL } from '@plone/volto/helpers';
import HeaderNavigation from './HeaderNavigation';
import { connect } from 'react-redux';

function HeaderImage(props) {
  const isBig = props.bigImage ? props.bigImage : false;
  const headerDimension = isBig ? 600 : 280;
  const [contentCount, setContentCount] = React.useState(0);

  const hasMetadata = props.metadata && props.metadata !== '<p><br/></p>'; //this is the DefaultEditor empty text

  const imageContent =
    typeof window !== 'undefined' && window.document
      ? window.document.getElementsByClassName('header-image-content')
      : '';
  const ccount =
    imageContent && imageContent[0] ? imageContent[0].childElementCount : 0;

  const pathName = props.pathname;
  const hideHeaderContent = ['/header', '/head', '/footer'].includes(pathName);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setContentCount(ccount);
    }
  }, [ccount]);

  return props.url ? (
    <div className={`header-image-wrapper ${isBig ? 'header-image-big' : ''}`}>
      <LazyLoadImage
        className="header-image"
        // alt={image.alt}
        height={headerDimension}
        effect="blur"
        style={{ backgroundImage: `url(${flattenToAppURL(props.url)})` }}
        width={'100%'}
        visibleByDefault={true}
        placeholder={
          <Placeholder>
            <Placeholder.Image rectangular />
          </Placeholder>
        }
      />
      <div className="header-image-overlay" />
      {!hideHeaderContent && (
        <React.Fragment>
          {props.content && contentCount === 0 ? (
            <div className="header-image-content">
              <h1>{props.content.title}</h1>
              <p>{props.content.description}</p>
            </div>
          ) : (
            <div className="header-image-content" />
          )}
        </React.Fragment>
      )}
      {hasMetadata && (
        <div
          className="header-meta-data"
          dangerouslySetInnerHTML={{ __html: props.metadata }}
        />
      )}
      {props.navigationItems && props.leadNavigation && (
        <HeaderNavigation items={props.navigationItems} />
      )}
    </div>
  ) : (
    <Placeholder className="header-image">
      <Placeholder.Image rectangular />
      <div className="header-image-content" />
    </Placeholder>
  );
}

export default connect((state) => ({
  content: state.content.data,
}))(HeaderImage);
