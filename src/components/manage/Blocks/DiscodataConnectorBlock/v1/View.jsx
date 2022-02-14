import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import { connectToMultipleProviders } from '@eeacms/volto-datablocks/hocs';
import { DataConnectedValue } from '@eeacms/volto-datablocks/Utils';
import { Sources } from '@eeacms/volto-datablocks/Utils';

const providerView = (dataProviderKey, dataProvider, editMode) => {
  return (
    <div
      key={`land-data-for-${dataProviderKey}`}
      className={dataProvider.className}
    >
      <span>
        {dataProvider.hasDiscodataConnector && (
          <DataConnectedValue
            url={dataProvider.path}
            column={dataProvider.displayColumn}
            textTemplate={dataProvider.textTemplate}
            specifier={dataProvider.specifier}
            animatedCounter={!editMode ? dataProvider.animatedCounter : ''}
            placeholder="_"
          />
        )}
        {dataProvider.measurmentUnit || ''}
      </span>
      {' ' + (dataProvider.additionalText || '')}
    </div>
  );
};

const bulletListView = (items) => (
  <div className="ui bulleted list">
    {items &&
      Object.entries(items).map(([key, item]) => (
        <div className="item">
          {item.leftText}
          <span className="float-right">{item.rightText}</span>
        </div>
      ))}
  </div>
);

const View = (props) => {
  const [dataProviders, setDataProviders] = useState({});
  const [parentsDataProviders, setParentsDataProviders] = useState({});
  const { providers_data, providers_metadata } = props;
  const bulletList =
    props.data?.bullet_list?.value &&
    JSON.parse(props.data?.bullet_list?.value).properties;

  const updateDataProviders = () => {
    let newDataProviders = { ...dataProviders };
    if (props.data.data_providers) {
      if (
        typeof props.data.data_providers === 'object' &&
        props.data.data_providers.value
      ) {
        newDataProviders = {};
        const dataProvidersSchema =
          props.data?.data_providers?.value &&
          JSON.parse(props.data?.data_providers?.value);
        dataProvidersSchema?.fieldsets?.[0]?.fields &&
          dataProvidersSchema.fieldsets[0].fields.forEach((dataProvider) => {
            newDataProviders[dataProvider] = {
              ...dataProvidersSchema.properties[dataProvider],
            };
          });
      } else if (Array.isArray(props.data.data_providers)) {
        newDataProviders = {};
        props.data.data_providers.forEach((provider) => {
          newDataProviders[provider.id] = { ...provider };
        });
      }
    }
    setDataProviders({ ...newDataProviders });
    return newDataProviders;
  };

  const updateParentsDataProviders = () => {
    const newParentsDataProviders = {};
    dataProviders &&
      Object.entries(dataProviders).forEach(
        ([dataProviderKey, dataProvider]) => {
          if (!dataProvider.hasParent) {
            newParentsDataProviders[dataProviderKey] = { ...dataProvider };
          } else if (
            dataProvider.parent &&
            newParentsDataProviders[dataProvider.parent]
          ) {
            if (!newParentsDataProviders[dataProvider.parent].children) {
              newParentsDataProviders[dataProvider.parent].children = {};
            }
            newParentsDataProviders[dataProvider.parent].children[
              dataProviderKey
            ] = dataProvider;
          }
        },
      );
    setParentsDataProviders({ ...newParentsDataProviders });
    return newParentsDataProviders;
  };

  useEffect(() => {
    updateDataProviders();
    /* eslint-disable-next-line */
  }, [JSON.stringify(props.data?.data_providers)]);

  useEffect(() => {
    updateParentsDataProviders();
    /* eslint-disable-next-line */
  }, [JSON.stringify(dataProviders)]);

  const view = (
    <div className="flex h-100 pa-1">
      <div className="flex flex-column w-100">
        {/* {props.data?.block_title ? <h5>{props.data.block_title}</h5> : ''} */}
        {parentsDataProviders &&
          Object.entries(parentsDataProviders).map(
            ([dataProviderKey, dataProvider]) => {
              if (dataProvider.children) {
                return (
                  <div
                    className={dataProvider.wrapperClassName}
                    key={`data-wrapper-${dataProviderKey}`}
                  >
                    {providerView(
                      dataProviderKey,
                      dataProvider,
                      props.editMode,
                    )}
                    {Object.entries(
                      dataProvider.children,
                    ).map(([cildrenKey, children]) =>
                      providerView(cildrenKey, children, props.editMode),
                    )}
                  </div>
                );
              }
              return (
                <div
                  className={dataProvider.wrapperClassName}
                  key={`data-wrapper-${dataProviderKey}`}
                >
                  {providerView(dataProviderKey, dataProvider, props.editMode)}
                </div>
              );
            },
          )}
        {bulletList && bulletListView(bulletList)}
        {props?.data?.chartSources && (
          <div>
            <Sources
              sources={props.data?.chartSources}
              providers_data={providers_data}
              providers_metadata={providers_metadata}
              download_button={props.data?.download_button}
              title={
                props.data?.block_title ||
                props.data?.data_providers
                  ?.map((provider) => provider.path)
                  ?.filter((path) => path)?.[0]
              }
            />
          </div>
        )}
      </div>
    </div>
  );
  return view;
};

export default compose(
  connectToMultipleProviders((props) => ({
    providers:
      props.data?.data_providers
        ?.map((provider) => ({
          provider_url: provider.path,
          title: provider.title,
          has_data_query_by_context: provider.has_data_query_by_context,
          has_data_query_by_provider: provider.has_data_query_by_provider,
          data_query: provider.data_query,
        }))
        ?.filter((provider) => provider.provider_url) || [],
  })),
)(View);
