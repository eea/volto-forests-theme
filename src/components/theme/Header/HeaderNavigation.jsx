/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import downIcon from '@plone/volto/icons/down-key.svg';
import closeIcon from '@plone/volto/icons/clear.svg';
import { Icon } from '@plone/volto/components';
import { connect } from 'react-redux';
import Sticky from 'react-stickynode';

import circleLeft from '@plone/volto/icons/circle-left.svg';
import circleRight from '@plone/volto/icons/circle-right.svg';

const MobileNav = ({ items, activeItem }) => {
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    setExpanded(false);
  }, [activeItem]);

  return (
    <Sticky enabled={true} top={78} className="lead-mobile-nav">
      <div>
        {expanded ? (
          <div className="nav-items-container">
            {items &&
              items.length > 0 &&
              items.map((item, i) => (
                <Link key={i} to={item.url}>
                  <p
                    className={`lead-nav-item ${
                      activeItem.title === item.title ? 'active-mobile-nav' : ''
                    }`}
                  >
                    {item.title}
                    {item.url === activeItem.url && (
                      <Icon
                        className="lead-nav-icon"
                        name={closeIcon}
                        size="35px"
                        onClick={() => setExpanded(false)}
                      />
                    )}
                  </p>
                </Link>
              ))}
          </div>
        ) : (
          <div className="nav-items-container">
            <p
              onClick={() => setExpanded(true)}
              className="lead-nav-item active-mobile-nav"
            >
              {activeItem.title}
              <Icon
                className="lead-nav-icon"
                name={downIcon}
                size="35px"
                onClick={() => setExpanded(true)}
              />
            </p>
          </div>
        )}
      </div>
    </Sticky>
  );
};

const HeaderNavigation = ({ items, pageWidth }) => {
  const [activeItem, setActiveItem] = React.useState('');
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);
  const [itemsIncrement, setItemsIncrement] = React.useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(
    items && items.length < 4 ? items.length : 4,
  );

  const [displayedItems, setDisplayedItems] = React.useState([]);
  const history = useHistory();

  const noPrev = displayedItems && items && items[0] === displayedItems[0];
  const noNext =
    displayedItems &&
    items &&
    items[items.length - 1] === displayedItems[displayedItems.length - 1];

  React.useEffect(() => {
    //init items
    const first = itemsIncrement * 3;
    const last = first + itemsPerPage;
    const itemsInit = items.slice(first, last);
    setDisplayedItems(itemsInit);
  }, [itemsIncrement, itemsPerPage, items]);

  React.useEffect(() => {
    //init items
    const first = itemsIncrement * 3;
    const last = first + itemsPerPage;
    const itemsInit = items.slice(first, last);

    setDisplayedItems(itemsInit);

    const activeRouteDetected = items.filter(
      (item) => item.url === history.location.pathname,
    );
    if (activeRouteDetected && activeRouteDetected.length > 0) {
      setActiveItem(activeRouteDetected[0]);
    }
    if (pageWidth && pageWidth <= 768) {
      setIsMobile(true);
      setIsTablet(false);
    }
    if (pageWidth && pageWidth > 768) {
      setIsMobile(false);
    }
    if (pageWidth && pageWidth <= 1300 && pageWidth > 768) {
      setIsTablet(true);
    }
    if (pageWidth && pageWidth > 1300) {
      setIsTablet(false);
    }
    if (pageWidth && pageWidth > 1240) {
      if (items.length >= 6) {
        setItemsPerPage(6);
      }
      if (items.length < 6) {
        setItemsPerPage(items.length);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, pageWidth]);

  const handlePrev = () => {
    setItemsIncrement(itemsIncrement - 1);
  };

  const handleNext = () => {
    setItemsIncrement(itemsIncrement + 1);
  };

  return (
    <React.Fragment>
      {isMobile ? (
        <MobileNav activeItem={activeItem} items={items} />
      ) : (
        <Sticky
          enabled={true}
          top={isTablet ? 75 : 102}
          className="sticky-header-nav"
        >
          <div className="header-navigation-lead">
            {displayedItems.length > 0 &&
              displayedItems.map((item, index) => (
                <Link
                  style={{
                    width: `${
                      items.length < itemsPerPage
                        ? 100 / items.length - 1
                        : 100 / itemsPerPage - 1
                    }%`,
                  }}
                  className={`lead-navigation-item ${
                    activeItem.title === item.title ? 'active-lead-nav' : ''
                  }`}
                  key={index}
                  to={item.url}
                  title={item.title}
                >
                  {item.title}
                </Link>
              ))}
            {!noPrev && (
              <Icon
                className="navigation-prev"
                name={circleLeft}
                size="34px"
                onClick={handlePrev}
              />
            )}
            {!noNext && (
              <Icon
                className="navigation-next"
                name={circleRight}
                size="34px"
                onClick={handleNext}
              />
            )}
          </div>
        </Sticky>
      )}
    </React.Fragment>
  );
};

export default connect((state) => ({
  pageWidth: state.screen.page.width,
}))(HeaderNavigation);
