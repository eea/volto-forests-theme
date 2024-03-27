import {
  ExpandableEdit,
  expandableSchema,
  ExpandableView,
} from './templates/expandable';

const applyConfig = (config) => {
  config.blocks.blocksConfig.simpleDataConnectedTable = {
    ...config.blocks.blocksConfig.simpleDataConnectedTable,
    templates: {
      ...config.blocks.blocksConfig.simpleDataConnectedTable.templates,
      expandable: {
        title: 'Expandable',
        view: ExpandableView,
        edit: ExpandableEdit,
        schema: expandableSchema,
      },
    },
  };
  return config;
};

export default applyConfig;
