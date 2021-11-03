/**
 * Footer component.
 * @module components/theme/Footer/Footer
 */

import React from 'react';
import { Container, Segment, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import footerImage from './footer.png';
import ecLogo from './ec.png';
import eeaLogo from './eea.png';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Placeholder } from 'semantic-ui-react';
import climateAdaptLogo from './climateadapt.svg';
import landMonitoringLogo from './landmonitoringservice.png';
import biseLogo from './biselogo.png';
import wiseLogo from './WISE.png';
import ccsLogo from './climateChange.svg';
import { compose } from 'redux';
import { connect } from 'react-redux';
import config from '@plone/volto/registry';
import { setCurrentVersion } from '@eeacms/volto-forests-theme/actions';

/**
 * Component to display the footer.
 * @function Footer
 * @param {Object} intl Intl object
 * @returns {string} Markup of the component
 */
const Footer = ({
  intl,
  token,
  setCurrentVersion,
  currentVersion,
  navItems,
}) => {
  const { settings } = config;
  const dtf = new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const published_at = dtf.format(
    new Date(
      settings.frontendMeta?.published_at || currentVersion.published_at,
    ),
  );
  const version_url = settings.frontendMeta.version_url
    ? settings.frontendMeta.version_url
    : currentVersion.version_url;

  const version = settings.frontendMeta.version
    ? settings.frontendMeta.version
    : currentVersion.version;
  if (
    settings.frontendMeta.published_at &&
    settings.frontendMeta.version_url &&
    settings.frontendMeta.version
  ) {
    setCurrentVersion(settings.frontendMeta);
  }

  const aboutUsItems = navItems.filter((item) =>
    item.title?.toLowerCase().includes('about us'),
  );
  let aboutUsItem;
  if (aboutUsItems.length > 0) {
    aboutUsItem = aboutUsItems[0];
  }

  return (
    <Segment
      role="contentinfo"
      vertical
      padded
      // textAlign="center"
      className="footerWrapper"
    >
      <img className="footerImage" src={footerImage} alt="" />
      <Container>
        <div className="ui vertically divided grid">
          <div className="footerLinkBar">
            <ul className="unlist">
              <li>
                <Link className="item separated" to="/legal_notice">
                  <FormattedMessage
                    id="legal_notice"
                    defaultMessage="Legal notice"
                  />
                </Link>
              </li>
              <li>
                <Link className="item separated" to="/privacy_policy">
                  <FormattedMessage
                    id="privacy_policy"
                    defaultMessage="Privacy statement"
                  />
                </Link>
              </li>
              <li>
                <a
                  className="item separated"
                  href={`mailto:info@eea.europa.eu`}
                >
                  Contact us
                </a>
              </li>
              {aboutUsItem !== undefined && (
                <li>
                  <a className="item separated" href={aboutUsItem.url}>
                    {aboutUsItem.title}
                  </a>
                </li>
              )}
              <li>
                <a
                  className={`item ${token ? '' : 'separated'}`}
                  href={`https://status.eea.europa.eu/`}
                  target="blank"
                >
                  EEA Systems Status
                </a>
              </li>
              {!token && (
                <li>
                  <Link className="item " to="/login">
                    <FormattedMessage id="login" defaultMessage="Login" />
                  </Link>
                </li>
              )}
            </ul>
            <p className="release-info">
              Software version{' '}
              <a rel="noreferrer" target="_blank" href={version_url}>
                {version}
              </a>
              , last updated {published_at}
            </p>
          </div>
          <Grid.Row columns={3}>
            <Grid.Column mobile={12} tablet={3} computer={3}>
              <b>About</b>
              <p>
                FISE - Forest Information System for Europe is a forest
                knowledge base in support of the EU Forest Strategy.{' '}
              </p>
            </Grid.Column>

            <Grid.Column mobile={12} tablet={3} computer={3}>
              <b>Partners</b>
              <div className="footerLogoWrapper">
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://ec.europa.eu/"
                  title="European Commission"
                >
                  <LazyLoadImage
                    className="footerLogo"
                    // height={80}
                    effect="blur"
                    src={ecLogo}
                    alt="European Commission"
                    title="European Commission"
                    width={'100%'}
                    visibleByDefault={true}
                    placeholder={
                      <Placeholder>
                        <Placeholder.Image rectangular />
                      </Placeholder>
                    }
                  />
                </a>
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://www.eea.europa.eu/"
                  title="European Environment Agency"
                >
                  <LazyLoadImage
                    className="footerLogo"
                    // height={80}
                    effect="blur"
                    src={eeaLogo}
                    alt="European Environment Agency"
                    title="European Environment Agency"
                    width={'100%'}
                    visibleByDefault={true}
                    placeholder={
                      <Placeholder>
                        <Placeholder.Image rectangular />
                      </Placeholder>
                    }
                  />
                </a>
              </div>
            </Grid.Column>
            <Grid.Column mobile={12} tablet={6} computer={6}>
              <b>Other European Information Systems</b>
              <div className="footerLogoWrapper">
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://climate-adapt.eea.europa.eu/"
                  title="Climate Adapt"
                >
                  <LazyLoadImage
                    className="footerLogo"
                    // height={80}
                    effect="blur"
                    src={climateAdaptLogo}
                    alt="Climate Adapt"
                    title="Climate Adapt"
                    width={'100%'}
                    visibleByDefault={true}
                    placeholder={
                      <Placeholder>
                        <Placeholder.Image rectangular />
                      </Placeholder>
                    }
                  />
                </a>
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://biodiversity.europa.eu/"
                  title="Biodiversity Information Sistems for Europe"
                >
                  <LazyLoadImage
                    className="footerLogo"
                    // height={80}
                    effect="blur"
                    src={biseLogo}
                    alt="Biodiversity Information Sistems for Europe"
                    title="Biodiversity Information Sistems for Europe"
                    width={'100%'}
                    visibleByDefault={true}
                    placeholder={
                      <Placeholder>
                        <Placeholder.Image rectangular />
                      </Placeholder>
                    }
                  />
                </a>

                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://water.europa.eu/"
                  title="Water Information System for Europe"
                >
                  <LazyLoadImage
                    className="footerLogo"
                    // height={80}
                    effect="blur"
                    src={wiseLogo}
                    alt="Water Information System for Europe"
                    title="Water Information System for Europe"
                    width={'100%'}
                    visibleByDefault={true}
                    placeholder={
                      <Placeholder>
                        <Placeholder.Image rectangular />
                      </Placeholder>
                    }
                  />
                </a>

                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://land.copernicus.eu/"
                  title="Land Monitoring Service"
                >
                  <LazyLoadImage
                    className="footerLogo"
                    // height={80}
                    effect="blur"
                    src={landMonitoringLogo}
                    alt="Land Monitoring Service"
                    title="Land Monitoring Service"
                    width={'100%'}
                    visibleByDefault={true}
                    placeholder={
                      <Placeholder>
                        <Placeholder.Image rectangular />
                      </Placeholder>
                    }
                  />
                </a>
                <a
                  rel="noreferrer"
                  target="_blank"
                  href="https://climate.copernicus.eu/"
                  title="Climate Change Service"
                >
                  <LazyLoadImage
                    className="footerLogo"
                    // height={80}
                    effect="blur"
                    src={ccsLogo}
                    alt="Climate Change Service"
                    title="Climate Change Service"
                    width={'100%'}
                    visibleByDefault={true}
                    placeholder={
                      <Placeholder>
                        <Placeholder.Image rectangular />
                      </Placeholder>
                    }
                  />
                </a>
              </div>
            </Grid.Column>
          </Grid.Row>
        </div>
      </Container>
    </Segment>
  );
};
/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Footer.propTypes = {
  /**
   * i18n object
   */
};

export default compose(
  injectIntl,
  connect(
    (state) => ({
      token: state.userSession.token,
      currentVersion: state.current_version?.items,
      navItems: state.navigation.items,
    }),
    { setCurrentVersion },
  ),
)(Footer);
