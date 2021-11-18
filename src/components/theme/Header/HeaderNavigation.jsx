/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import downIcon from '@plone/volto/icons/down-key.svg';
import closeIcon from '@plone/volto/icons/clear.svg';
import { Icon } from '@plone/volto/components';
import { connect } from 'react-redux';

import circleLeft from '@plone/volto/icons/circle-left.svg';
import circleRight from '@plone/volto/icons/circle-right.svg';

const Card = ({ children, itemId }) => {
  return (
    <div
      role="button"
      style={{
        border: '1px solid',
        display: 'inline-block',
        margin: '0 10px',
        width: '160px',
        userSelect: 'none',
      }}
      tabIndex={0}
      className="card"
    >
      {children}
    </div>
  );
};

const MobileNav = ({ items, activeItem }) => {
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    setExpanded(false);
  }, [activeItem]);

  return (
    <div className="lead-mobile-nav">
      {expanded ? (
        <div className="nav-items-container">
          {items &&
            items.length > 0 &&
            items.map((item, i) => (
              <Card>
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
              </Card>
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
  );
};

function onWheel(apiObj, ev) {
  const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

  if (isThouchpad) {
    ev.stopPropagation();
    return;
  }

  if (ev.deltaY < 0) {
    apiObj.scrollNext();
  } else if (ev.deltaY > 0) {
    apiObj.scrollPrev();
  }
}

const HeaderNavigation = ({ items, pageWidth }) => {
  const [activeItem, setActiveItem] = React.useState('');
  const [isMobile, setIsMobile] = React.useState(false);
  const [itemsIncrement, setItemsIncrement] = React.useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(5);

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
  }, [itemsIncrement]);

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
    }
    if (pageWidth && pageWidth > 768) {
      setIsMobile(false);
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
        <div className="header-navigation-lead">
          {displayedItems.length > 0 &&
            displayedItems.map((item, index) => (
              <Link
                style={{ width: `${100 / itemsPerPage}%` }}
                className={`lead-navigation-item ${
                  activeItem.title === item.title ? 'active-lead-nav' : ''
                }`}
                key={index}
                to={item.url}
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
      )}
    </React.Fragment>
  );
};

export default connect((state) => ({
  pageWidth: state.screen.page.width,
}))(HeaderNavigation);
