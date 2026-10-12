<template>
  <div class="map-container">
    <div class="info-card">
      <h2>GeoInfo Map Vue 測試</h2>
      <p><strong>API:</strong> api.hkmapservice.gov.hk</p>
      <p><strong>CRS:</strong> HK80 (EPSG:2326)</p>
    </div>
    <div id="map" ref="mapElement"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import VectorTileLayer from 'ol/layer/VectorTile'
import VectorTileSource from 'ol/source/VectorTile'
import MVT from 'ol/format/MVT'
import { get as getProjection } from 'ol/proj'
import { register } from 'ol/proj/proj4'
import proj4 from 'proj4'

const mapElement = ref(null)

onMounted(() => {
  // 1. 定義與註冊 HK80 座標系 (EPSG:2326)
  proj4.defs(
    'EPSG:2326',
    '+proj=tmerc +lat_0=22.31213333333333 +lon_0=114.1785555555556 +k=1 +x_0=836694.05 +y_0=819069.8 +ellps=intl +towgs84=-162.619,-272.0,-125.65,0,0,0,0 +units=m +no_defs'
  )
  register(proj4)

  const hk80Proj = getProjection('EPSG:2326')
  // 設定 HK80 範圍邊界 [minX, minY, maxX, maxY]
  hk80Proj.setExtent([800000, 800000, 860000, 850000])

  // 2. 你的 API Key 與 Vector Tile 網址
  const apiKey = '6d31536061a9447da6d876feb2d5b277'
  const tileUrl = `https://api.hkmapservice.gov.hk/aqs/map/label-en/VT/Indexed/HK80/tile/{z}/{y}/{x}.pbf?key=${apiKey}`

  // 3. 建立 Vector Tile 圖層
  const vtLayer = new VectorTileLayer({
    source: new VectorTileSource({
      format: new MVT(),
      url: tileUrl,
      projection: hk80Proj
    })
  })

  // 4. 初始化 OpenLayers 地圖
  new Map({
    target: mapElement.value,
    layers: [vtLayer],
    view: new View({
      projection: hk80Proj,
      center: [835000, 820000], // HK80 座標：香港中心點附近
      zoom: 13,
      minZoom: 9,
      maxZoom: 19
    })
  })
})
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

#map {
  width: 100%;
  height: 100%;
}

.info-card {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-family: Arial, sans-serif;
}

.info-card h2 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
}

.info-card p {
  margin: 4px 0;
  font-size: 13px;
  color: #666;
}
</style>