var areaisShapesFeatCol     = ee.FeatureCollection("users/sadeckgeo/Arenizacao_group_class")
            .filterMetadata('Class','equals', 'Classificar').merge(ROIJalapao).geometry(0.1)
// Map.addLayer(areaisShapesFeatCol);
 
var version = '5'
var classID = 23
var region = areaisShapesFeatCol;
var region_name = 'areaisShapesFeatCol'
var year = 2024;
var year0 = 2023;
var bands = ['green', 'red', 'nir','swir1','NDVI', 'MNDWI', 'MMRI']
var reference = ee.Image('projects/mapbiomas-workspace/COLECAO9/zona-costeira/'+year0+'-13')
                        .eq(classID).toByte().rename('classification'); //
var mosaic_image = ee.Image('projects/mapbiomas-mosaics/assets/LANDSAT/LULC/ZC/mosaic_2024').select(bands)
reference = reference.unmask(0).updateMask(mosaic_image.select(0).mask())
Map.addLayer(mosaic_image,{},'Mosaic')
Map.addLayer(reference)

var samples = mosaic_image.addBands(reference).stratifiedSample({
  numPoints:55000,
  classBand:'classification',
  classValues:[0,1],
  classPoints:[50000,5000],
  region:region,
  scale:30
})
var classifier = ee.Classifier.smileRandomForest(100).train(samples,'classification');
var classified = mosaic_image.classify(classifier)
Map.addLayer(classified,{min:0,max:1},'New Classification')
Export.image.toAsset({
  image:classified.toByte().set({'year':year,'class':classID,'region_name':region_name}),
  description:'class_23_'+region_name+'_v'+version+'_'+year,
  assetId:'projects/solved-mb10/assets/LANDSAT/PDA/rf_raw/'+region_name+'_class_'+classID+'_'+version,
  scale:30,
  region:region,
  maxPixels:1e13
})
