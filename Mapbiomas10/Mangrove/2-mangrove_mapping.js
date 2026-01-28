import { ESSP, SPSC, AP,PIBA_1,PIBA_2,PAMA,MAR} from './regions.js';

var imageVisParam_mosaic = {"opacity":1,"bands":["swir1","nir","red"],"min":4,"max":107,"gamma":1}

var regions = [ee.Feature(ESSP).set({'region':'ESSP'}),
                                  ee.Feature(SPSC).set({'region':'SPSC'}),
                                  ee.Feature(AP).set({'region':'AP'}),
                                  ee.Feature(PIBA_1).set({'region':'PIBA_1'}),
                                  ee.Feature(PIBA_2).set({'region':'PIBA_2'}),
                                  ee.Feature(PAMA).set({'region':'PAMA'}),
                                  ee.Feature(MAR).set({'region':'MAR'})];

var year         = 2024;
var year_Reference_for_Samples = year-1
var currentMapBioCol   = 10
var previousMapBioCol  = currentMapBioCol-1
var classID      = 5

var userEEProject = 'USER_PROJECT_ID';
var userPath      = 'USER_PATH';

var ROI = ee.Geometry.Polygon(
  [
      [
          [-75.46319738935682, 6.627809464162168],
          [-75.46319738935682, -34.62753178950752],
          [-32.92413488935683, -34.62753178950752],
          [-32.92413488935683, 6.627809464162168]
      ]
  ], null, false
);
var scale   = 30;
var versionRaw = 1;


var listclass = ee.List([])
var regions   = [ESSP,SPSC,AP,PIBA_1,PIBA_2,PAMA,MAR]
var listClassYears = regions.map(function(region){
  var mosaic_image = ee.Image('projects/'+userEEProject+'/assets/'+userPath+'/mosaic_'+year).clip(region);
  
  var lastYear     = ee.Image('projects/'+userEEProject+'/COLECAO'+ previousMapBioCol +'/zona-costeira/'+year_Reference_for_Samples+'-'+13).eq(classID).toByte();
  lastYear = ee.ImageCollection([lastYear.rename('classification')]).max()
  lastYear = lastYear.unmask(0).updateMask(mosaic_image.select(0).mask())
  
  var samples = mosaic_image.addBands(lastYear).stratifiedSample({
    numPoints:5000,
    classBand:'classification',
    classValues:[0,1],
    classPoints:[50000,5000],
    region:region,
    scale:30
  })
  var classifier = ee.Classifier.smileRandomForest(100).train(samples,'classification');
  var classification = mosaic_image.classify(classifier)
  return listclass.add(classification)
})

listClassYears         = ee.List(listClassYears).flatten()
var classificationNewYear = ee.ImageCollection(listClassYears).mosaic()
var finalProduct = classificationNewYear.updateMask(classificationNewYear.neq(0))
Map.addLayer(mosaic_image,imageVisParam_mosaic,'Mosaic '+year)
Map.addLayer(finalProduct,{min:0,max:1, palette:'#0014ff'}, 'Final class '+year, false)


finalProduct = finalProduct.remap([0,1],[0,classID]).rename(['classification'])

Export.image.toAsset({
  image:finalProduct.select('classification').set({'classification':1,'class':classID,'year':year,'version':versionRaw,'region':'BR'}).toByte(),
  description:'Mangrove_v'+versionRaw+'_'+ year,
  assetId: 'projects/'+userEEProject+'/'+year+'-'+versionRaw+'-LandsatSample-raw',
  scale:scale,
  maxPixels:1e13,
  region: ROI
})