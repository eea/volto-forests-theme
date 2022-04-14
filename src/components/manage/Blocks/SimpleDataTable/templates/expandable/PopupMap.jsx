import React from 'react';
import { compose } from 'redux';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';
import { Map } from '@eeacms/volto-openlayers-map/Map';
import { Layers, Layer } from '@eeacms/volto-openlayers-map/Layers';
import { openlayers } from '@eeacms/volto-openlayers-map';

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
  const [featuresData, setFeaturesData] = React.useState([]);

  const { proj, source, style } = openlayers;

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
    const { long, lat } = mapData;
    const provider_data_length = getProviderDataLength(provider_data);
    const newMapData = [];
    const newFeaturesData = [];
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

          newFeaturesData.push(
            new openlayers.ol.Feature(
              new openlayers.geom.Point(
                openlayers.proj.fromLonLat([obj[long], obj[lat]]),
              ),
            ),
          );
        });
    }
    setSelectedData(newMapData);

    setFeaturesData(newFeaturesData);
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
    <div className="map-container">
      {selectedData.length > 0 ? (
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
            minZoom: 1,
            zoom: 2,
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
            <Layer.Vector
              source={
                new source.Vector({
                  features: featuresData,
                })
              }
              style={
                new style.Style({
                  image: new style.Circle({
                    radius: 6,
                    fill: new style.Fill({ color: '#058373' }),
                    stroke: new style.Stroke({ color: 'black', width: 1 }),
                    zIndex: 0,
                  }),
                  text: new style.Text({
                    font: '12px Calibri,sans-serif',
                    fill: new style.Fill({ color: '#000' }),
                    stroke: new style.Stroke({
                      color: '#fff',
                      width: 2,
                    }),
                  }),
                })
              }
              title="1.Sites"
              zIndex={1}
            />
          </Layers>
        </Map>
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
