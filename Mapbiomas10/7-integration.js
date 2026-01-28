var userEEProject = 'USER_PROJECT_ID';

var firstYear = 1985;
var lastYear  = 2024;

var versionFF          = 1;
var versionIntegration = '1';
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




// BEACHES, DUNES AND SAND SPOTS (BDS)
var userPathBDS   = 'USER_PATH_BDS';
var versionFF_BDS = 33;
var bds           = ee.ImageCollection('projects/'+userEEProject+'/assets/'+userPathBDS+'/unet_ff/' +year+'-'+versionFF+'-ff').filter(ee.Filter.eq('version',versionFF_BDS));

// MANGROVE (MG): For collection 10, we utilized the results from collection 9 and applied the detection process for the last year
var userPathMG      = 'USER_PATH_MG';
var MB9_2023_below = ee.ImageCollection('projects/'+userEEProject+'/COLECAO9/zona-costeira')
                                              .filterMetadata('version','equals','13')
                                              .filter(ee.Filter.lte('year',2023));
var MB10_new = ee.Image('projects/'+userEEProject+'/assets/'+userPathMG+'/2024-1-ff');
var mangrove = MB9_2023_below.merge(MB10_new);

// HTPERSALINE TIDAL FLAT (HTF)
var versionFF_HTF = 4;
var userPathHTF   = 'USER_PATH_HTF';
var htf           = ee.ImageCollection('projects/'+userEEProject+'/assets/'+userPathHTF+'/unet_ff')
                                              .filterMetadata('version','equals',versionFF_HTF);

var userPath  = 'USER_PATH';
for (var year = initialYear;year<=finalYear;year++){
    var cur_bds      = bds.filter(ee.Filter.eq('year',year)).unmask(0).eq(23).remap([0,1],[0,23]).selfMask().toByte();
    var cur_htf      = htf.filter(ee.Filter.eq('year',year)).first().unmask(0).eq(32).remap([0,1],[0,32]).selfMask().toByte();
    var cur_mangrove = mangrove.filter(ee.Filter.eq('year',year)).first().unmask(0).eq(5).remap([0,1],[0,5]).selfMask().toByte();
    var zc           = ee.ImageCollection([cur_bds, cur_htf, cur_mangrove]).mosaic().toByte().rename('classification');
    Map.addLayer(zc,{},' '+year,false)

    Export.image.toAsset({
        image:zc.toByte().set({'year':parseInt(year, 10),'territory':'BRAZIL','collection_id':10.0,'version':versionIntegration,'source':'solved','theme':'ZONACOSTEIRA'}),
        description:'zc-postfiltered-'+year+'-'+versionIntegration,
        assetId:'projects/'+userEEProject+'/assets/'+userPath+'/COLLECTION-10/COASTAL-ZONE/classification/'+year+'-'+versionIntegration,
        scale:scale,
        region:ROI,
        pyramidingPolicy: {'.default': 'mode'},
        maxPixels: 1e13
    });
}
