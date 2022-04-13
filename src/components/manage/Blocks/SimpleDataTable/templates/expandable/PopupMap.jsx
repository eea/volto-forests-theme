import React from 'react';
import { compose } from 'redux';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';
import { Map } from '@eeacms/volto-openlayers-map/Map';
import { Layers, Layer } from '@eeacms/volto-openlayers-map/Layers';
import { openlayers } from '@eeacms/volto-openlayers-map';

// import { Map, Marker } from 'pigeon-maps';

const getLayerBaseURL = () =>
  'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';

const getProviderDataLength = (provider_data) => {
  return provider_data
    ? provider_data[Object.keys(provider_data)[0]]?.length || 0
    : 0;
};

const PopupMap = ({ rowData, provider_data, mapData }) => {
  const [mapRendered, setMapRendered] = React.useState(false);
  const [mapCenter, setMapCenter] = React.useState([9, 45]);
  const mapRef = React.useRef();

  const [selectedData, setSelectedData] = React.useState([]);

  const { proj, source, style, format } = openlayers;

  React.useEffect(() => {
    const { long, lat } = mapData;
    const allLong =
      selectedData.length > 0 ? selectedData.map((i) => i[long]) : '';
    const allLat =
      selectedData.length > 0 ? selectedData.map((i) => i[lat]) : '';
    const minLong = allLong && allLong.length > 0 ? Math.min(...allLong) : '';
    const maxLong = allLong && allLong.length > 0 ? Math.max(...allLong) : '';
    const minLat = allLong && allLong.length > 0 ? Math.min(...allLat) : '';
    const maxLat = allLong && allLong.length > 0 ? Math.max(...allLat) : '';

    const centerLat = minLat && maxLat ? (minLat + maxLat) / 2 : '';
    const centerLong = minLong && maxLong ? (minLong + maxLong) / 2 : '';

    if (centerLat && centerLong) {
      setMapCenter([centerLong, centerLat]);
      centerToPosition({ longitude: centerLong, latitude: centerLat }, 5);
    }
  }, [selectedData, mapData]);

  React.useEffect(() => {
    const provider_data_length = getProviderDataLength(provider_data);
    const newMapData = [];
    if (provider_data_length) {
      const keys = Object.keys(provider_data);
      Array(provider_data_length)
        .fill()
        .forEach((_, i) => {
          const obj = {};
          keys.forEach((key) => {
            obj[key] = provider_data[key][i];
          });
          newMapData.push(obj);
        });
    }
    setSelectedData(newMapData);
    /* eslint-disable-next-line */
  }, [provider_data]);

  // const countries =
  //   provider_data && provider_data[mapData.country]
  //     ? provider_data[mapData.country]
  //     : '';

  //const uniqueCountries = [...new Set(countries)];

  const centerToPosition = (position, zoom) => {
    const { proj } = openlayers;
    return mapRef.current.getView().animate({
      center: proj.fromLonLat([position.longitude, position.latitude]),
      duration: 1000,
      zoom,
    });
  };

  if (!provider_data) {
    return 'Loading..';
  }
  return (
    <div>
      {selectedData.length > 0 ? (
        <React.Fragment>
          <Map
            ref={(data) => {
              mapRef.current = data?.map;
              if (data?.mapRendered && !mapRendered) {
                setMapRendered(true);
              }
            }}
            view={{
              center: proj.fromLonLat(mapCenter),
              showFullExtent: true,
              // maxZoom: 1,
              minZoom: 1,
              zoom: 5,
            }}
            renderer="webgl"
            // onPointermove={this.onPointermove}
            // onClick={this.onClick}
            // onMoveend={this.onMoveend}
          >
            <Layers>
              <Layer.Tile
                source={
                  new source.XYZ({
                    url: getLayerBaseURL(),
                  })
                }
              />
              <Layer.VectorImage
                source={
                  new source.Vector({
                    loader: function (extent, _, projection) {
                      const esrijsonFormat = new format.EsriJSON();
                    },
                  })
                }
                style={
                  new style.Style({
                    image: new style.Circle({
                      radius: 6,
                      fill: new style.Fill({ color: '#00FF00' }),
                      stroke: new style.Stroke({ color: '#6A6A6A', width: 1 }),
                      zIndex: 0,
                    }),
                  })
                }
                title="1.Sites"
                zIndex={1}
              />
            </Layers>
          </Map>
          {/* <Map height={400} center={mapCenter} defaultZoom={5}>
          {selectedData.map((item, i) => {
            const long = item[mapData.long] ? item[mapData.long] : '';
            const lat = item[mapData.lat] ? item[mapData.lat] : '';
            return <Marker width={30} color={'#00519d'} anchor={[lat, long]} />;
          })}
        </Map> */}
        </React.Fragment>
      ) : (
        <p>No data available for map.</p>
      )}
    </div>
  );
};

export default compose(
  connectToProviderData((props) => {
    return {
      provider_url: props.providerUrl,
    };
  }),
)(PopupMap);
