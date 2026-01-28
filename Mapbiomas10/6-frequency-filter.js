//------------------------------- Load data function ----------------------------------
var getImageCollection = function(firstYear, lastYear, userEEProject,userPath,versionSF){
    var fs     = ee.ImageCollection('projects/'+userEEProject+'/assets/'+userPath+'/fs_filter').filter(ee.Filter.and(ee.Filter.eq('version',versionSF)));
    var images = ee.List([]);
    for(var year = firstYear; year <= lastYear; year++){
        var img = fs.filter(ee.Filter.eq('year',year)).first()

        if(year == firstYear){
        img = img.set({'nextYear':(year-1)});
        }else{
        img = img.set({'nextYear':(year+1)});
        }
        images = images.add(img);
    }
    return ee.ImageCollection(images);
};
  

//------------------------------- Consecutive mask ----------------------------------
var getConsecutively = function(img){
    var yearRef = img.get('nextYear');
    var yearN1 = ee.Image(copyIMC.filterMetadata('year','equals',yearRef).mosaic());
    var consecutive = ee.Image(0).toByte().where(img.eq(yearN1),1);
    return img.addBands(consecutive.rename('consecutiveness'));
};
  
//------------------------------- Frequency Filter ----------------------------------
var filterPixelFrequency = function(firstYear, lastYear, imc, cutPercentage, classID){
    var temporalSeries = (lastYear - firstYear) + 1; //quantity years
    var imcFreq        = imc.map(function(e){ return e.select('classification').eq(classID)}).sum().divide(temporalSeries).multiply(100); //Frequency Image
    var filteredImages = ee.List([]);
    Map.addLayer(imcFreq,{min:0,max:100,palette:['fff9f9','ff0000','efff00','27ff00','ef00ff']},'Frequency - ' + classID, false);
    
    for(var i = firstYear; i <= lastYear; i++){
        var image       = imc.filterMetadata('year','equals',i).first();
        image           = image.updateMask(image.select('classification').eq(classID)).where(imcFreq.lte(cutPercentage),0);
        filteredImages  = filteredImages.add(image);
    }
    var imcFreqPos = ee.ImageCollection(filteredImages).map(function(e){ return e.select('classification').eq(classID)}).sum().divide(temporalSeries).multiply(100); //Frequency Image
    var imgMapAddLayer = imcFreqPos.updateMask(imcFreqPos.neq(0));

    Map.addLayer(imcFreqPos.updateMask(imcFreqPos.neq(0)),{min:0,max:100,palette:['fff9f9','ff0000','efff00','27ff00','ef00ff']},'Post  Freq Filter - ' + classID, false);
    return [filteredImages, imgMapAddLayer];
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

var versionSF = 1;
var versionFF = 1;
var scale     = 30;

var frequency = 10;

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


var imc     = getImageCollection(firstYear, lastYear, userEEProject, userPath, versionSF);
var copyIMC = imc;

imc                 = imc.map(getConsecutively);
var targetClassList = filterPixelFrequency(firstYear, lastYear, imc, frequency, targetClassID);
var targetClass     = ee.ImageCollection(targetClassList[0]);
var imgMapAddLayer  = targetClassList[1];


for(var year = firstYear; year <= lastYear; year++){
    var image = targetClass.filterMetadata('year','equals',year).first().unmask(0).updateMask(targetClass.filter(ee.Filter.eq('year',year)).first().neq(0));
    Map.addLayer(image.selfMask(),{palette:'#ff003c'}, year+' - Filtered',false);
    
    Export.image.toAsset({
        image: image.select('classification').toByte().set({'class':targetClassID,'year':year,'filter':3,'version':versionFF,'region':'BR','frequency':frequency}).toByte(),
        description:year + '-' + versionFF+'-ff',
        assetId:'projects/'+userEEProject+'/assets/'+userPath+'/unet_ff/' +year+'-'+versionFF+'-ff',
        scale: scale,
        maxPixels:1e13,
        region: ROI
    });
}
  