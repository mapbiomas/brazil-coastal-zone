var mosaicYear   = 2022;
var labelVersion = '4';
var mosaicLandsat    = ee.Image('projects/'+userEEProject+'/assets/'+userPath+'/mosaic_'+mosaicYear);

var supervisedImg    = ee.Image('projects/solved-mb10/assets/public/LANDSAT/HTF/'+datasetYear+'-'+labelVersion+'_SUPERVISEDMASK_FULL').gte(1).unmask(0).toByte();
var trainingPolys_v1 = ee.FeatureCollection('projects/solved-mb10/assets/public/LANDSAT/HTF/trainPolys_htf_2020_v1');
var evalPolys_v1     = ee.FeatureCollection('projects/solved-mb10/assets/public/LANDSAT/HTF/testPolys_htf_2020_v1');
var trainingPolys_v2 = ee.FeatureCollection('projects/solved-mb10/assets/public/LANDSAT/HTF/trainPolys_htf_2020_v2_update');
var evalPolys_v2     = ee.FeatureCollection('projects/solved-mb10/assets/public/LANDSAT/HTF/testPolys_htf_2020_v2_update');
var trainingPolys_v3 = ee.FeatureCollection('projects/solved-mb10/assets/public/LANDSAT/HTF/trainPolys_htf_2022_v3');
var evalPolys_v3     = ee.FeatureCollection('projects/solved-mb10/assets/public/LANDSAT/HTF/testPolys_htf_2022_v3');

var trainingPolysLandsat = trainingPolys_v1.merge(trainingPolys_v2);
var evalPolysLandsat     = evalPolys_v1.merge(evalPolys_v2).merge(evalPolys_v3);

var id_filter_out    = ['2_00000000000000000018','2_0000000000000000001f','1_00000000000000000004','2_0000000000000000001d'];
trainingPolysLandsat = trainingPolysLandsat.filter(ee.Filter.inList('system:index', id_filter_out).not());
trainingPolysLandsat = trainingPolysLandsat.merge(trainingPolys_v3);


trainingPolysLandsat = trainingPolysLandsat.map(function(feat){
  return feat.set('geo_type', feat.geometry().type());
}).filter(ee.Filter.neq('geo_type','LineString'));


var imageVisParam = {"opacity":1,"bands":["swir1","nir","red"],"min":4,"max":148,"gamma":1};
Map.addLayer(mosaicLandsat,imageVisParam,'Mosaio LANDSAT '+mosaicYear, false);
Map.addLayer(trainingPolysLandsat,{'color': '#ffcccb'},'Train LANDSAT', false);
Map.addLayer(evalPolysLandsat,{'color': '#87C1FF'},'Validation LANDSAT', false);
Map.addLayer(supervisedImg.selfMask(),{'palette':'#ff5f15'},'Supervised Landsat '+mosaicYear, false);