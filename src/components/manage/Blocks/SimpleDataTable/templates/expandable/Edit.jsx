import React, { Component } from 'react';
import { compose } from 'redux';
import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';

import config from '@plone/volto/registry';

import { connectToMultipleProviders } from '@eeacms/volto-datablocks/hocs';

import { SimpleDataTableSchema } from '@eeacms/volto-datablocks/components/manage/Blocks/SimpleDataTable/schema';
import { SimpleDataTableView } from '@eeacms/volto-datablocks/components/manage/Blocks/SimpleDataTable/View';

class Edit extends Component {
  getSchema = () => {
    const template = this.props.data.template || 'default';
    const templateSchema =
      config.blocks.blocksConfig.simpleDataConnectedTable?.templates?.[template]
        ?.schema || {};

    const schema = SimpleDataTableSchema(config, templateSchema(config));

    const provider_url = this.props.data?.provider_url;
    const provider_data = provider_url
      ? this.props.providers_data[provider_url]
      : '';

    if (!provider_data) return schema;

    const choices = Array.from(Object.keys(provider_data).sort()).map((n) => [
      n,
      n,
    ]);

    schema.properties.columns.schema.properties.column.choices = choices;
    schema.properties.columns.schema.properties.column_link.choices = choices;

    const map_provider_url = this.props.data.popup_map_provider_url
      ? this.props.data.popup_map_provider_url
      : '';
    const table_provider_url = this.props.data.popup_table_provider_url
      ? this.props.data.popup_table_provider_url
      : '';

    const map_provider_data =
      this.props.providers_data && this.props.providers_data[map_provider_url]
        ? this.props.providers_data[map_provider_url]
        : '';

    const table_provider_data =
      this.props.providers_data && this.props.providers_data[table_provider_url]
        ? this.props.providers_data[table_provider_url]
        : '';

    const mapChoices = map_provider_data
      ? Array.from(Object.keys(map_provider_data).sort()).map((n) => [n, n])
      : [];

    const tableChoices = table_provider_data
      ? Array.from(Object.keys(table_provider_data).sort()).map((n) => [n, n])
      : [];
    schema.properties.popup_data_query.choices = choices;

    schema.properties.image_url.choices = choices;
    schema.properties.popupTitle.choices = choices;
    schema.properties.popupDescription.choices = choices;
    schema.properties.popupUrl.choices = choices;
    schema.properties.popupEmail.choices = choices;

    schema.properties.defaultSortColumn.choices = choices;

    //set choices for the popup table columns
    schema.properties.popupTableColumns.schema.properties.column.choices = tableChoices;
    schema.properties.popupTableColumns.schema.properties.column_link.choices = tableChoices;

    //set choices for the popup map
    schema.properties.popupLong.choices = mapChoices;
    schema.properties.popupLat.choices = mapChoices;
    // schema.properties.popupCountryCode.choices = mapChoices;
    // schema.properties.popupMapLabel.choices = mapChoices;

    return schema;
  };

  render() {
    const schema = this.getSchema();
    return (
      <>
        <SimpleDataTableView {...this.props} />

        <SidebarPortal selected={this.props.selected}>
          <InlineForm
            schema={this.getSchema()}
            title={schema.title}
            onChangeField={(id, value) => {
              this.props.onChangeBlock(this.props.block, {
                ...this.props.data,
                [id]: value,
              });
            }}
            formData={this.props.data}
          />
        </SidebarPortal>
      </>
    );
  }
}

export default compose(
  connectToMultipleProviders((props) => {
    const {
      provider_url,
      popup_map_provider_url,
      popup_table_provider_url,
    } = props.data;
    const providers = [
      {
        provider_url: provider_url,
      },
      { provider_url: popup_map_provider_url },
      { provider_url: popup_table_provider_url },
    ];
    return { providers };
  }),
)(Edit);
