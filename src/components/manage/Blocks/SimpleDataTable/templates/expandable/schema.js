const columnSchema = {
  title: 'Column',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: [
        'column',
        'title',
        'component',
        'render_as',
        'textTemplate',
        'placeholder',
        'specifier',
        'textAlign',
      ],
    },
  ],
  properties: {
    title: {
      title: 'Header',
    },
    component: {
      title: 'Component type',
      choices: [
        ['text', 'Text'],
        ['link', 'Link'],
      ],
      defaultValue: 'text',
    },
    target: {
      title: 'Target',
      choices: [
        ['_blank', 'New window'],
        ['_self', 'Same window'],
      ],
    },
    external: {
      title: 'External link',
      type: 'boolean',
    },
    linkTemplate: {
      title: 'Link template',
      description: 'Add suffix/prefix to text. Use {} for value placeholder',
    },
    render_as: {
      title: 'HTML tag',
    },
    specifier: {
      title: 'Format specifier',
      description: (
        <>
          See{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/d3/d3-3.x-api-reference/blob/master/Formatting.md#d3_format"
          >
            D3 format documentation
          </a>
        </>
      ),
    },
    textTemplate: {
      title: 'Text template',
      description: 'Add suffix/prefix to text. Use {} for value placeholder',
    },
    placeholder: {
      title: 'Placeholder',
    },
    textAlign: {
      title: 'Align',
      widget: 'align',
      type: 'string',
    },
    column: {
      title: 'Data column',
      choices: [],
    },
    column_link: {
      title: 'Data column link',
      choices: [],
    },
  },
  required: ['column'],
};

const getColumnSchema = (schema, child) => {
  return {
    ...columnSchema,
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'column',
          ...(child?.component === 'link' ? ['column_link'] : []),
          'title',
          'component',
          ...(child?.component === 'link'
            ? ['target', 'external', 'linkTemplate']
            : []),
          'render_as',
          'textTemplate',
          'specifier',
          'textAlign',
        ],
      },
    ],
    required: ['column', 'column_link'],
  };
};

export default () => ({
  title: 'Expandable datatable',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: [
        'searchDescription',
        'popup_data_query',
        'image_url',
        'popupTitle',
        'popupDescription',
        'popupUrl',
        'defaultSortColumn',
        'defaultSortOrder',
        'popup_table_provider_url',
        'popupTableColumns',
        'popup_map_provider_url',
        'popupLong',
        'popupLat',
      ],
    },
  ],
  properties: {
    searchDescription: {
      title: 'Search description',
      widget: 'textarea',
    },
    defaultSortColumn: {
      title: 'Default Sort Column',
      description: 'Automatic sorting of table by selected column',
      choices: [],
    },
    defaultSortOrder: {
      title: 'Default Sort Order',
      choices: [
        ['ascending', 'ascending'],
        ['descending', 'descending'],
      ],
    },
    popup_table_provider_url: {
      title: 'Popup Table provider',
      widget: 'object_by_path',
    },
    popup_map_provider_url: {
      title: 'Popup Map provider',
      widget: 'object_by_path',
    },
    popup_data_query: {
      title: 'Popup Data Query',
      description: 'Select attribute by which to query popup data',
      choices: [],
    },
    image_url: {
      title: 'Image Url',
      description: 'Select Image URL param for the main table and popup',
      choices: [],
    },
    popupTitle: {
      title: 'Popup Title',
      choices: [],
      description: 'Title for main table and popup',
    },
    popupDescription: {
      title: 'Popup description',
      choices: [],
    },
    popupUrl: {
      title: 'Popup Url',
      choices: [],
    },
    popupTableColumns: {
      title: 'Popup Table Columns',
      description: 'Define popup table columns',
      schema: columnSchema,
      schemaExtender: (schema, child) => getColumnSchema(schema, child),
      widget: 'object_list',
    },
    popupLong: {
      title: 'Popup Map Long',
      description: 'Define popup map Long',
      choices: [],
    },
    popupLat: {
      title: 'Popup Map Lat',
      description: 'Define popup map Lat',
      choices: [],
    },
  },
  required: [],
});
