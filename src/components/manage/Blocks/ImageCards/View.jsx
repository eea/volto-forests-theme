import React from 'react';
import cx from 'classnames';
import config from '@plone/volto/registry';
import DefaultImageSVG from '@plone/volto/components/manage/Blocks/Listing/default-image.svg';
import { Card, Message } from 'semantic-ui-react';
import { serializeNodes } from 'volto-slate/editor/render';
import { compose } from 'redux';
import { flattenToAppURL } from '@plone/volto/helpers';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import './styles.less';

const alignmentTypes = {
  left: 'left',
  right: 'right',
  center: 'centered',
  full: 'left',
};

export const getScaleUrl = (url, size) =>
  (url || '').includes(config.settings.apiPath)
    ? `${flattenToAppURL(url.replace('/api', ''))}/@@images/image/${size}`
    : `${url.replace('/api', '')}/@@images/image/${size}`;

const Cards = (props) => {
  const { data, editable, history } = props;
  const {
    align,
    cards,
    image_scale,
    gridSize = 'one',
    theme = 'default',
  } = data;

  const makeImage = (item) => {
    const { attachedimage } = item;
    return (
      <img
        className="cards-tile-image"
        src={
          attachedimage
            ? getScaleUrl(
                flattenToAppURL(attachedimage),
                image_scale || 'preview',
              )
            : DefaultImageSVG
        }
        alt={item.title}
      />
    );
  };

  const makeTextBody = (item) => (
    <>
      <h3 className="tile-listing-title">
        {item.title ? item.title : item.id}
      </h3>
      {item.text && (
        <p className="tile-listing-description">{serializeNodes(item.text)}</p>
      )}
    </>
  );

  const handleNavigate = (link) => {
    history.push(flattenToAppURL(link));
  };

  return cards && cards.length > 0 ? (
    <div className={cx('ui fluid cards', gridSize)}>
      {cards.map((item) => (
        <Card
          onClick={() => handleNavigate(item.link)}
          key={item['@id']}
          className={cx(
            'navigation-card',
            alignmentTypes[align] || 'left',
            theme,
          )}
        >
          {makeImage(item)}
          {makeTextBody(item)}
        </Card>
      ))}
    </div>
  ) : (
    <>{editable ? <Message>No image cards</Message> : ''}</>
  );
};

Cards.schema = () => ({
  title: 'Image Card',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['title', 'text', 'attachedimage', 'link'],
    },
  ],

  properties: {
    title: {
      type: 'string',
      title: 'Title',
    },
    text: {
      widget: 'slate_richtext',
      title: 'Text',
    },
    link: {
      widget: 'url',
      title: 'Link',
    },
    attachedimage: {
      widget: 'attachedimage',
      title: 'Image',
    },
  },

  required: ['attachedimage'],
});

Cards.schemaExtender = (schema) => {
  return {
    ...schema,
    fieldsets: [
      ...schema.fieldsets,
      {
        id: 'cards_grid',
        title: 'Cards grid',
        fields: ['gridSize', 'theme'],
      },
    ],
    properties: {
      ...schema.properties,
      gridSize: {
        title: 'Grid Size',
        choices: [
          ['one', 'One'],
          ['two', 'Two'],
          ['three', 'Three'],
          ['four', 'Four'],
        ],
        factory: 'Choice',
        type: 'string',
      },
      theme: {
        title: 'Theme',
        choices: [
          ['default', 'Default'],
          ['primary', 'Primary'],
          ['secondary', 'Secondary'],
          ['tertiary', 'Tertiary'],
        ],
      },
    },
  };
};

export default compose(withRouter, injectIntl)(Cards);
