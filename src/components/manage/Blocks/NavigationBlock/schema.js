const pagesSchema = {
  title: 'Specific pages',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['title', 'url'],
    },
  ],
  properties: {
    title: {
      title: 'Title',
      type: 'text',
    },
    url: {
      title: 'Url',
      widget: 'text',
    },
  },
  required: ['title', 'url'],
};

export default {
  title: 'Navigation block',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['navFromParent', 'className', 'fixedTabs', 'parent', 'pages'],
    },
  ],
  properties: {
    parent: {
      title: 'Parent page',
      widget: 'object_by_path',
    },
    className: {
      title: 'Classname',
      type: 'text',
    },
    fixedTabs: {
      title: 'Fixed navigation',
      type: 'boolean',
    },
    navFromParent: {
      title: 'Show navigation from parent',
      type: 'boolean',
    },
    pages: {
      title: 'Pages',
      schema: pagesSchema,
      type: 'schema',
    },
  },
  required: [],
};
