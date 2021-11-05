/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import useWindowSize from '../../../helpers/useWindowSize';
import downIcon from '@plone/volto/icons/down-key.svg';
import closeIcon from '@plone/volto/icons/clear.svg';
import { Icon } from '@plone/volto/components';
import { connect } from 'react-redux';

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
  );
};

const HeaderNavigation = ({ items, pageWidth }) => {
  const [activeItem, setActiveItem] = React.useState('');
  const [isMobile, setIsMobile] = React.useState(false);
  const history = useHistory();

  React.useEffect(() => {
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

  return (
    <React.Fragment>
      {isMobile ? (
        <MobileNav activeItem={activeItem} items={items} />
      ) : (
        <div className="header-navigation-lead">
          {items.length > 0 &&
            items.map((item, index) => (
              <Link key={index} to={item.url}>
                <p
                  className={`lead-navigation-item ${
                    activeItem.title === item.title ? 'active-lead-nav' : ''
                  }`}
                >
                  {item.title}
                </p>
              </Link>
            ))}
        </div>
      )}
    </React.Fragment>
  );
};

export default connect((state) => ({
  pageWidth: state.screen.page.width,
}))(HeaderNavigation);
