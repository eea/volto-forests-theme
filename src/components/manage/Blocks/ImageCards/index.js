import Cards from './View';

export default (config) => {
  if (
    config.blocks.blocksConfig.imagecards &&
    config.blocks.blocksConfig.imagecards.blockRenderers
  ) {
    config.blocks.blocksConfig.imagecards.blockRenderers = {
      ...config.blocks.blocksConfig.imagecards.blockRenderers,
      fise_cards_grid: {
        title: 'FISE cards grid',
        view: Cards,
        schema: Cards.schema,
        schemaExtender: Cards.schemaExtender,
      },
    };
  }
  return config;
};
