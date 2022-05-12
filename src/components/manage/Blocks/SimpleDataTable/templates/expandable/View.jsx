import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import _ from 'lodash';
import qs from 'querystring';
import { Icon } from '@plone/volto/components';
import { Table, Pagination, Search } from 'semantic-ui-react';
import RenderComponent from '@eeacms/volto-datablocks/components/manage/Blocks/SimpleDataTable/components';

import upSVG from '@eeacms/volto-datablocks/icons/up-arrow.svg';
import downSVG from '@eeacms/volto-datablocks/icons/down-arrow.svg';
import upDownSVG from '@eeacms/volto-datablocks/icons/up-down-arrow.svg';

import './style.less';
import PopupRow from './PopupRow';

const getSortedTableData = (tableData, sortBy) => {
  const property = sortBy[0];
  const ASC = sortBy[1];

  return tableData.sort((a, b) => {
    const a_value = a[property];
    const b_value = b[property];
    if (a_value < b_value) return ASC ? -1 : 1;
    if (a_value > b_value) return ASC ? 1 : -1;
    return 0;
  });
};

const getFilteredTableData = (tableData) => {
  return tableData;
};

const View = (props) => {
  const {
    data = {},
    getAlignmentOfColumn,
    getNameOfColumn,
    getTitleOfColumn,
    loadingProviderData,
    placeholder,
    provider_data_length,
    provider_data,
    row_size,
    show_header,
  } = props;
  const selectedColumns = data.columns;
  const timeoutRef = React.useRef();
  const search = React.useRef();
  const [mounted, setMounted] = React.useState(false);
  const [tableData, setTableData] = React.useState([]);
  const [filteredTableData, setFilteredTableData] = React.useState([]);
  const [sortBy, setSortBy] = React.useState([]);
  const [activePage, setActivePage] = React.useState(1);
  const [value, setValue] = React.useState(props.query.searchTerm || '');
  const { loading, results } = props.search;

  const items =
    results.length || (!loading && value.length) ? results : filteredTableData;

  const handleSearchChange = React.useCallback(
    (e, data, time = 1000) => {
      clearTimeout(timeoutRef.current);
      props.dispatch({ type: 'TABLE_START_SEARCH', query: data.value });
      timeoutRef.current = setTimeout(() => {
        props.history.push({
          search:
            '?' +
            qs.stringify({
              ...props.query,
              searchTerm: data.value,
            }),
        });
        if (data.value.length === 0) {
          props.dispatch({ type: 'TABLE_CLEAN_QUERY' });
          return;
        }
        const re = new RegExp(_.escapeRegExp(data.value), 'i');

        const searchableCols =
          props.data && props.data.popupTitle
            ? [...selectedColumns, { column: props.data.popupTitle }]
            : selectedColumns;

        const isMatch = (result) => {
          for (let colDef of searchableCols) {
            if (re.test(result[colDef.column])) {
              return true;
            }
          }
          return false;
        };
        props.dispatch({
          type: 'TABLE_FINISH_SEARCH',
          results: _.filter(filteredTableData, isMatch),
        });
      }, time);
    },
    /* eslint-disable-next-line */
    [filteredTableData, selectedColumns, data.popupTitle],
  );

  React.useEffect(() => {
    if (data.defaultSortColumn && data.defaultSortOrder) {
      if (data.defaultSortOrder === 'ascending') {
        setSortBy([data.defaultSortColumn, true]);
      } else {
        setSortBy([data.defaultSortColumn, false]);
      }
    }
  }, [data.defaultSortColumn, data.defaultSortOrder]);

  React.useEffect(() => {
    const newTableData = [];
    if (provider_data_length) {
      const keys = Object.keys(provider_data);
      Array(provider_data_length)
        .fill()
        .forEach((_, i) => {
          const obj = {};
          keys.forEach((key) => {
            obj[key] = provider_data[key][i];
          });
          newTableData.push(obj);
        });
    }
    setTableData(newTableData);
    /* eslint-disable-next-line */
  }, [provider_data]);

  React.useEffect(() => {
    const newFilteredTableData = [
      ...getSortedTableData(getFilteredTableData(tableData), sortBy),
    ];
    setFilteredTableData(newFilteredTableData);
    /* eslint-disable-next-line */
  }, [tableData, sortBy]);

  React.useEffect(() => {
    if (mounted) {
      handleSearchChange({}, { value, activePage });
    } else {
      setMounted(true);
    }
    /* eslint-disable-next-line */
  }, [JSON.stringify(filteredTableData)]);

  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
      props.dispatch({ type: 'TABLE_CLEAN_QUERY' });
    };
    /* eslint-disable-next-line */
  }, []);

  return (
    <div className="expandable-table">
      <Search
        ref={search}
        placeholder={data.searchDescription}
        loading={loadingProviderData || loading}
        onResultSelect={() => {}}
        showNoResults={false}
        onSearchChange={(e, data) => {
          handleSearchChange(e, { ...data, activePage: 1 });
          setValue(data.value);
          if (activePage > 1) {
            setActivePage(1);
          }
        }}
        results={[]}
        value={value}
        resultRenderer={() => {
          return '';
        }}
      />
      <Table
        textAlign="left"
        striped={data.striped}
        className={`unstackable ${data.bordered ? 'no-borders' : ''}
          ${data.compact_table ? 'compact-table' : ''}`}
      >
        {show_header ? (
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <button
                  className="sortable-th"
                  title="Sort by"
                  onClick={() => {
                    if (sortBy[0] === data.popupTitle) {
                      setSortBy([data.popupTitle, !sortBy[1]]);
                    } else {
                      setSortBy([data.popupTitle, true]);
                    }
                  }}
                  style={{ display: 'flex' }}
                >
                  <span>
                    <span style={{ color: '#3f3227', fontWeight: 'bold' }}>
                      Organisation
                    </span>
                    {sortBy[0] === data.popupTitle ? (
                      <Icon name={sortBy[1] ? upSVG : downSVG} size="1rem" />
                    ) : (
                      <Icon name={upDownSVG} size="1rem" color="grey" />
                    )}
                  </span>
                </button>
              </Table.HeaderCell>
              {selectedColumns &&
                selectedColumns.length > 0 &&
                selectedColumns.map((colDef, j) => (
                  <Table.HeaderCell
                    key={getNameOfColumn(colDef)}
                    className={getAlignmentOfColumn(colDef, j)}
                  >
                    <p
                      role="presentation"
                      title="Sort by"
                      onClick={() => {
                        if (sortBy[0] === colDef.column) {
                          setSortBy([colDef.column, !sortBy[1]]);
                        } else {
                          setSortBy([colDef.column, true]);
                        }
                      }}
                      style={{
                        marginBottom: 0,
                        whiteSpace: 'nowrap',
                        color: '#3f3227',
                      }}
                    >
                      <span style={{ display: 'inline-block' }}>
                        <span>{getTitleOfColumn(colDef)}</span>
                        {sortBy[0] === colDef.column ? (
                          <Icon
                            name={sortBy[1] ? upSVG : downSVG}
                            size="1rem"
                          />
                        ) : (
                          <Icon name={upDownSVG} size="1rem" color="grey" />
                        )}
                      </span>
                    </p>
                  </Table.HeaderCell>
                ))}
            </Table.Row>
          </Table.Header>
        ) : null}
        <Table.Body>
          {selectedColumns && selectedColumns.length > 0 ? (
            Array(
              Math.max(
                0,
                Math.min(row_size, items.length - (activePage - 1) * row_size),
              ),
            )
              .fill()
              .map((_, i) => {
                const row_index = i + (activePage - 1) * row_size;
                const row_data = items[row_index];
                return (
                  <Table.Row key={row_index}>
                    <Table.Cell
                      key={`${row_index}-popuprow`}
                      textAlign="center"
                    >
                      <PopupRow rowData={row_data} tableData={data} />
                    </Table.Cell>
                    {selectedColumns &&
                      selectedColumns.length > 0 &&
                      selectedColumns.map((colDef, j) => (
                        <Table.Cell
                          key={`${row_index}-${getNameOfColumn(colDef)}`}
                          textAlign={getAlignmentOfColumn(colDef, j)}
                        >
                          <RenderComponent
                            {...props}
                            tableData={items}
                            colDef={colDef}
                            row={row_index}
                          />
                        </Table.Cell>
                      ))}
                  </Table.Row>
                );
              })
          ) : (
            <p style={{ textAlign: 'center', padding: '10px 0' }}>
              Select columns data from <strong>DATA SOURCE</strong> tab.
            </p>
          )}
          {!items.length ? (
            <Table.Row>
              <Table.Cell textAlign="center" colSpan="100%">
                {placeholder}
              </Table.Cell>
            </Table.Row>
          ) : (
            ''
          )}
        </Table.Body>
        {selectedColumns &&
        selectedColumns.length > 0 &&
        Math.ceil(items.length / row_size) > 1 ? (
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell
                colSpan={selectedColumns.length + 1}
                style={{ textAlign: 'center' }}
              >
                <Pagination
                  activePage={activePage}
                  totalPages={Math.ceil(items.length / row_size)}
                  onPageChange={(_, data) => {
                    setActivePage(data.activePage);
                    handleSearchChange(
                      {},
                      { value, activePage: data.activePage },
                    );
                  }}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        ) : (
          ''
        )}
      </Table>
    </div>
  );
};

export default compose(
  // extra connectors
  connect((state) => ({
    search: state.table_search || {},
    query: qs.parse(state.router.location?.search?.replace('?', '')) || {},
  })),
)(View);
