var mosaicYear   = 2021;
var labelVersion = '3';
var supervisedImgS2 = ee.Image('projects/solved-mb10/assets/SENTINEL2/APICUM/Supervised_mask/'+mosaicYear+'-'+labelVersion+'-supervised_mask').gte(1).unmask(0).toByte();
var mosaicS2        = ee.ImageCollection('projects/'+userEEProject+'/assets/'+userPATH).filter(ee.Filter.and(ee.Filter.eq('year',mosaicYear),ee.Filter.eq('mosaic',1))).mosaic();

var trainingPolysS2 = ee.FeatureCollection('users/MariaLuizeSolvedCurso/Masters/Geoms/trainPolys_apicum_2020_v1');
var evalPolysS2     = ee.FeatureCollection('users/MariaLuizeSolvedCurso/Masters/Geoms/testPolys_apicum_2020_v1');
trainingPolysS2     = ee.FeatureCollection('projects/solved-mb10/assets/SENTINEL2/APICUM/Supervised_mask/new_train_test_2021_for_v3')
                          .filter(ee.Filter.bounds(trainingPolysS2).not()).merge(trainingPolysS2);

Map.addLayer(mosaicS2,{min:4, max:188, bands:['swir1','nir','red']},'Mosaico SENTINEL '+mosaicYear);
Map.addLayer(trainingPolysS2,{'color': '#ff0000'},'Treino S2', false);
Map.addLayer(evalPolysS2,{'color': '#0000ff'},'Validação S2', false);
Map.addLayer(supervisedImgS2.selfMask(),{'palette':'#9b32ff'},'supervised S2 '+mosaicYear, false);
