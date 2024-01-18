import React from 'react';

const makeChoices = (keys) => keys && keys.map((k) => [k, k]);

const getDataProvidersIds = (data_providers = [], child = {}) => {
  const ids = data_providers
    .map((data_provider) => data_provider.id)
    .filter((id) => id && id !== child.id);
  return makeChoices(ids);
};

const dataProviderSchemaExtender = (schema, child = {}, props) => {
  const data_providers = props.data.data_providers || [];
  return {
    ...schema,
    fieldsets: [
      {
        ...schema.fieldsets[0],
      },
      {
        id: 'properties',
        title: 'Properties',
        fields: [
          'measurmentUnit',
          'additionalText',
          'className',
          'animatedCounter',
        ],
      },
      ...(child.hasDiscodataConnector
        ? [
            {
              id: 'Discodata connector',
              title: 'Discodata connector',
              fields: [
                'path',
                'displayColumn',
                'textTemplate',
                'specifier',
                'data_query',
              ],
            },
          ]
        : []),
      ...(child.hasParent
        ? [
            {
              id: 'parent',
              title: 'Parent',
              fields: ['parent'],
            },
          ]
        : []),
    ],
    properties: {
      ...schema.properties,
      displayColumn: {
        ...schema.properties.displayColumn,
        choices: makeChoices(
          Object.keys(props.providers_data?.[child.title] || {}),
        ),
      },
      parent: {
        ...schema.properties.parent,
        choices: getDataProvidersIds(data_providers, child),
      },
    },
  };
};

const dataProviderSchema = {
  title: 'Data provider',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: [
        'title',
        'id',
        'hasDiscodataConnector',
        'hasParent',
        'wrapperClassName',
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      fields: [
        'path',
        'displayColumn',
        'textTemplate',
        'specifier',
        'measurmentUnit',
        'additionalText',
        'className',
        'parent',
        'wrapperClassName',
        'animatedCounter',
      ],
    },
  ],
  properties: {
    title: {
      type: 'text',
      title: 'Title',
    },
    id: {
      type: 'text',
      title: 'Id',
    },
    hasDiscodataConnector: {
      type: 'boolean',
      title: 'Has discodata connector',
    },
    hasParent: {
      type: 'boolean',
      title: 'Has parent',
    },
    path: {
      widget: 'object_by_path',
      title: 'Discodata connector',
    },
    displayColumn: {
      type: 'select',
      title: 'Display column',
      choices: [],
    },
    textTemplate: {
      title: 'Text template',
      widget: 'textarea',
      description: 'Add suffix/prefix to text. Use {} for value placeholder',
    },
    specifier: {
      title: 'Format',
      description: (
        <>
          See{' '}
          <a
            target="_blank"
            rel="noopener"
            href="https://github.com/d3/d3-format"
          >
            D3 format documentation
          </a>
        </>
      ),
    },
    measurmentUnit: {
      type: 'text',
      title: 'Measurment unit',
    },
    additionalText: {
      type: 'text',
      title: 'Additional text',
    },
    animatedCounter: {
      type: 'boolean',
      title: 'Animated Counter',
      description: 'Apply counter animation to a number',
    },

    className: {
      type: 'select',
      title: 'Class name',
      choices: [
        ['data', 'Data'],
        ['data-content', 'Data content'],
      ],
    },
    parent: {
      type: 'select',
      title: 'Parent',
      choices: [],
    },
    wrapperClassName: {
      type: 'select',
      title: 'Wrapper class name',
      choices: [
        ['data-wrapper brown', 'Brown wrapper'],
        ['data-wrapper green', 'Green wrapper'],
        ['data-wrapper blue', 'Blue wrapper'],
        ['data-wrapper purple', 'Purple wrapper'],
      ],
    },
    data_query: {
      title: 'Data query',
      widget: 'data_query',
    },
  },
  required: ['title', 'id'],
};

const SourceSchema = {
  title: 'Source',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['chart_source', 'chart_source_link'],
    },
  ],

  properties: {
    chart_source: {
      type: 'string',
      title: 'Source',
    },
    chart_source_link: {
      type: 'string',
      title: 'Link',
    },
  },

  required: ['source'],
};

export const getSchema = (props) => ({
  title: 'Discodata connector block',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['block_title'],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      fields: ['data_providers'],
    },
    {
      id: 'sources',
      title: 'Sources',
      fields: ['chartSources', 'download_button'],
    },
  ],
  properties: {
    block_title: {
      title: 'Title',
      widget: 'textarea',
    },
    download_button: {
      title: 'Download button',
      type: 'boolean',
      defaultValue: true,
    },
    chartSources: {
      widget: 'object_list',
      title: 'Sources',
      schema: SourceSchema,
    },
    data_providers: {
      title: 'Data providers',
      widget: 'object_list',
      schema: dataProviderSchema,
      schemaExtender: (schema, child) =>
        dataProviderSchemaExtender(schema, child, props),
      defaultData: {
        hasDiscodataConnector: true,
        hasParent: false,
      },
    },
  },
  required: [],
});
