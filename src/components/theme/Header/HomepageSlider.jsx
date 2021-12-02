import React, { Component } from 'react';
import PropTypes from 'prop-types';

import 'react-image-gallery/styles/css/image-gallery.css';

import ImageGallery from 'react-image-gallery';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Placeholder, Dimmer, Loader } from 'semantic-ui-react';
import { getBasePath } from '@eeacms/volto-forests-theme/helpers';

class HomepageSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slides: [],
    };
    this.getSlides = this.getSlides.bind(this);
  }

  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        url: PropTypes.string,
        description: PropTypes.string,
      }),
    ),
  };

  renderThumbnail = (item) => {
    return (
      <div className="slider-thumbnail" key={getBasePath(item.original)}>
        {/* <img src={item.original} /> */}
        <div
          className="thumbnail-img"
          style={{ backgroundImage: `url(${getBasePath(item.original)})` }}
        />
        <div className="slide-title">{item.title}</div>
      </div>
    );
  };

  renderSlide = (item) => {
    return (
      <div className="slider-slide">
        {item.original ? (
          <LazyLoadImage
            className="slide-img"
            height={601}
            effect="blur"
            style={{ backgroundImage: `url(${getBasePath(item.original)})` }}
            width={'100%'}
            visibleByDefault={true}
            placeholder={
              <Placeholder>
                <Placeholder.Image rectangular />
              </Placeholder>
            }
          />
        ) : (
          <Placeholder>
            <Placeholder.Image rectangular />
          </Placeholder>
        )}

        <div className="slide-overlay" />
        <div className="slide-body">
          <div className="slide-title">{item.title || ''}</div>
          <div className="slide-description">{item.description || ''}</div>
        </div>
      </div>
    );
  };

  createDescription(children) {
    const items = children.map((child) => (
      <div className="slider-child">
        <img
          alt="descriptive icon"
          src={`data:image/svg+xml;utf8,${child.icon}`}
        />
        <span>{child.text}</span> <br></br>
        <a href={child.link}> {child.linkText}</a>
      </div>
    ));
    return <div className="slider-text">{items}</div>;
  }

  getSlides(items) {
    const slidesArr = items ? items : this.props.items.slides;
    const slidesUrl =
      (slidesArr &&
        slidesArr.map((item, index) => {
          return {
            original: item.image,
            thumbnail: item.image,
            title: item.title,
            description: this.createDescription(item.children || []),
          };
        })) ||
      [];
    return slidesUrl;
  }

  render() {
    const slides = this.getSlides(this.props.items.slides);
    const icon = this.props.items.extra?.icon;
    const text = this.props.items.extra?.text;
    const link = this.props.items.extra?.link;
    const linkText = this.props.items.extra?.linkText;

    const hasHeaderData = this.props.items.extra ? true : false;

    return hasHeaderData ? (
      <div>
        <div className="slider-wrapper">
          <ImageGallery
            items={slides}
            icon={icon}
            text={text}
            link={link}
            linkText={linkText}
            showThumbnails={false}
            showNav={false}
            showBullets={true}
            disableThumbnailScroll={false}
            showFullscreenButton={false}
            showPlayButton={false}
            autoPlay={true}
            renderItem={this.renderSlide}
            renderThumbInner={this.renderThumbnail}
            slideDuration={450}
            slideInterval={5000}
          />
        </div>
        <div className="extra-header">
          <img alt="descriptive icon" src={`data:image/svg+xml;utf8,${icon}`} />
          <div>
            <span>{text}</span>
            <br></br>
            <a href={link}>{linkText}</a>
          </div>
        </div>
      </div>
    ) : (
      <div className="loader">
        <Dimmer active inverted>
          <Loader />
        </Dimmer>
      </div>
    );
  }
}

export default HomepageSlider;
