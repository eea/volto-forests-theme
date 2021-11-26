import React from 'react';
import { Container } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { Logo, Navigation, Breadcrumbs } from '@plone/volto/components';
import HeaderImage from '@eeacms/volto-forests-theme/components/theme/Header/HeaderImage';
import HomepageSlider from '@eeacms/volto-forests-theme/components/theme/Header/HomepageSlider';
import MobileSearchWidget from '@eeacms/volto-forests-theme/components/theme/MobileSearchWidget/MobileSearchWidget';
import Sticky from 'react-stickynode';
import HeaderBackground from './header-bg.png';
import axios from 'axios';
import {
  getBasePath,
  getNavigationByParent,
} from '@eeacms/volto-forests-theme/components/manage/Blocks/NavigationBlock/helpers';

const Header = (props) => {
  const {
    inheritLeadingData,
    parentData,
    leadNavigation,
    bigLeading,
    leadImageCaption,
  } = props.extraData;
  const [isHomepage, setIsHomePage] = React.useState(
    props.actualPathName === '/',
  );
  const [inheritedImage, setInheritedImage] = React.useState('');
  const [leadCaptionText, setLeadCaptionText] = React.useState('');
  const [navigationItems, setNavigationItems] = React.useState('');

  const getParentData = (url) => {
    axios
      .get(url, {
        headers: {
          accept: 'application/json',
        },
      })
      .then((response) => {
        const parentImage =
          response.data && response.data.image && response.data.image.download
            ? response.data.image.download
            : '';

        const parentLeadCaption =
          response.data &&
          response.data.lead_image_caption &&
          response.data.lead_image_caption.data
            ? response.data.lead_image_caption.data
            : '';

        const parentData =
          response.data && props.navItems && response.data['@id']
            ? getNavigationByParent(
                props.navItems,
                getBasePath(response.data['@id']),
              )
            : '';
        if (inheritLeadingData) {
          setInheritedImage(parentImage);
          setLeadCaptionText(parentLeadCaption);
        }
        if (leadNavigation) {
          setNavigationItems(parentData.items);
        }
      })
      .catch((error) => {
        return error;
      });
  };

  React.useEffect(() => {
    if (props.actualPathName) {
      setIsHomePage(props.actualPathName === '/');
    }
  }, [props.actualPathName, props.frontPageSlides]);

  React.useEffect(() => {
    if (inheritLeadingData || leadNavigation) {
      const parentUrl = parentData['@id'];
      getParentData(parentUrl);
      if (!inheritLeadingData) {
        setLeadCaptionText(leadImageCaption.data);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.extraData, props.navItems]);

  const defaultHeaderImage = props.defaultHeaderImage;
  let headerImageUrl = defaultHeaderImage?.image || defaultHeaderImage;
  const pathName = props.pathname;
  const hideSearch = ['/header', '/head', '/footer'].includes(pathName);

  return (
    <div className="header-wrapper" role="banner">
      <Sticky enabled={true} top={0}>
        <Container>
          <div className="header">
            <div className="logo-nav-wrapper space-between">
              <div className="logo">
                <Logo />
              </div>
              {!hideSearch ? (
                <div className="nav-actions-mobile large screen hidden">
                  <div className="search-widget">
                    <MobileSearchWidget pathname={props.pathname} />
                  </div>
                </div>
              ) : null}
              <Navigation
                navigation={props.navigationItems}
                pathname={props.pathname}
              />
            </div>
          </div>
        </Container>
      </Sticky>
      <Container>
        <div className={`header-bg ${isHomepage ? 'homepage' : 'contentpage'}`}>
          <img src={HeaderBackground} alt="" />
        </div>

        {isHomepage ? (
          <HomepageSlider items={props.frontpage_slides} />
        ) : (
          <div style={{ position: 'relative' }}>
            <Breadcrumbs pathname={props.pathname} />

            <HeaderImage
              bigImage={bigLeading}
              leadNavigation={leadNavigation}
              navigationItems={navigationItems}
              metadata={
                inheritLeadingData || leadImageCaption ? leadCaptionText : ''
              }
              url={inheritLeadingData ? inheritedImage : headerImageUrl}
            />
          </div>
        )}
      </Container>
    </div>
  );
};
export default connect((state) => ({
  token: state.userSession.token,
  navItems: state.navigation?.items,
}))(Header);
