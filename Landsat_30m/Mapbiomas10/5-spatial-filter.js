/** 3.1.2 Use the mapbiomas spatial filter code */
var PostClassification = function (image) {
    this.init = function (image) {
      this.image = image;
    };
  
    var majorityFilter = function (image, params) {
      params = ee.Dictionary(params);
      var maxSize = ee.Number(params.get('maxSize')); 
      var classValue = ee.Number(params.get('classValue'));
      var classMask = image.eq(classValue);
      var labeled = classMask.mask(classMask).connectedPixelCount(maxSize, true);
      var region = labeled.lt(maxSize); 
  
      var kernel = ee.Kernel.square(1);
      var neighs = image.neighborhoodToBands(kernel).mask(region);
      var majority = neighs.reduce(ee.Reducer.mode());
      var filtered = image.where(region, majority);
      return filtered.byte();
  
    };
  
    /**
     * Reclassify small blobs of pixels  
     * @param  {list<dictionary>} filterParams [{classValue: 1, maxSize: 3},{classValue: 2, maxSize: 5}]
     * @return {ee.Image}  Filtered Classification Image
     */
    this.spatialFilter = function (filterParams) {
      var image = ee.List(filterParams)
        .iterate(
          function (params, image) {
            return majorityFilter(ee.Image(image), params);
          },
          this.image
        );
      this.image = ee.Image(image);
      return this.image;
    };
    this.init(image);
};
  
//------------------------------------ MAIN CODE --------------------------------------
var userEEProject = 'USER_PROJECT_ID';
var userPath      = 'USER_PATH';

var selectTargetClass = 1;
var dictClass = {
    0:{'name':'mangrove', 'legend':5}, 
    1:{'name':'hypersalineTidalFlat', 'legend':32}, 
    2:{'name':'beachesDunesSandSpots', 'legend':23}, 
}
var targetClassID = dictClass[selectTargetClass]['legend'];

var firstYear = 1985;
var lastYear  = 2024;

var versionFT = 1;
var versionSF = 1;
var scale     = 30;

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

var imgColFT     = ee.ImageCollection('projects/'+userEEProject+'/assets/'+userPath+'/ft_filter').filter(ee.Filter.eq('version',versionFT));
var filterParams = [{classValue: targetClassID, maxSize: 10}];

for (var year = firstYear; year<lastYear; year ++){
    var curr_segmentation = imgColFT.filter(ee.Filter.eq('year',year)).first().eq(targetClassID).remap([0,1],[0,targetClassID]).rename('classification');

    var pc           = new PostClassification(curr_segmentation);
    var finalProduct = pc.spatialFilter(filterParams);
    finalProduct     = finalProduct.eq(targetClassID).remap([0,1],[0,targetClassID]).rename('classification');

    Map.addLayer(finalProduct.selfMask(),{palette:'#ff003c'}, 'Final class selfmask '+year,false);

    Export.image.toAsset({
        image:finalProduct.select('classification').toByte().set({'classification':4,'class':targetClassID,'year':year,'version':versionSF,'region':'BR', 'filter':2}).toByte(),
        description: year+'-'+versionSF+'-fs',
        assetId:'projects/'+userEEProject+'/assets/'+userPath+'/fs_filter/'+year+'-'+versionSF+'-fs',
        scale:scale,
        maxPixels:1e13,
        region: ROI
    });
}