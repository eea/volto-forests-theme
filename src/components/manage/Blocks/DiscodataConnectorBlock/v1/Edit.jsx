import React, { useState, useEffect } from 'react';
import { compose } from 'redux';
import _uniqueId from 'lodash/uniqueId';
import { v4 as uuid } from 'uuid';
import View from './View';
import { SidebarPortal } from '@plone/volto/components';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { connectToMultipleProviders } from '@eeacms/volto-datablocks/hocs';

import { getSchema } from './schema';

import '../styles.css';

const Edit = (props) => {
  const [state, setState] = useState({
    id: _uniqueId('block_'),
    schema: getSchema(props),
  });

  useEffect(() => {
    const newData = { ...props.data };
    if (props.data.data_providers) {
      if (
        typeof props.data?.data_providers === 'object' &&
        props.data?.data_providers?.value
      ) {
        try {
          newData.data_providers = [];
          const dataProvidersSchema = JSON.parse(
            props.data?.data_providers?.value,
          );
          dataProvidersSchema?.fieldsets?.[0]?.fields &&
            dataProvidersSchema.fieldsets[0].fields.forEach((dataProvider) => {
              newData.data_providers.push({
                ...dataProvidersSchema.properties[dataProvider],
                '@id': uuid(),
                id: dataProvider,
              });
            });
        } catch {}
      }
    }
    if (JSON.stringify(newData) !== JSON.stringify(props.data)) {
      props.onChangeBlock(props.block, {
        ...newData,
      });
    }
    /* eslint-disable-next-line */
  }, []);

  useEffect(() => {
    setState({
      ...state,
      schema: getSchema(props),
    });
    /* eslint-disable-next-line */
  }, [props.providers_data, props.data.data_providers_new]);

  return (
    <div>
      <SidebarPortal selected={props.selected}>
        <InlineForm
          schema={state.schema}
          title={state.schema.title}
          onChangeField={(field, data) => {
            props.onChangeBlock(props.block, {
              ...(props.data || {}),
              [field]: data,
            });
          }}
          formData={props.data || {}}
          block={props.block}
        />
      </SidebarPortal>
      <View {...props} id={state.id} />
    </div>
  );
};

export default compose(
  connectToMultipleProviders((props) => ({
    providers:
      props.data?.data_providers
        ?.map((provider) => ({
          provider_url: provider.path,
          title: provider.title,
        }))
        ?.filter((provider) => provider.provider_url) || [],
  })),
)(Edit);
