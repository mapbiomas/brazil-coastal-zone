<div class="fluid-row" id="header">
    <div id="column">
        <div class = "blocks">
            <img src='./misc/solved-logo.jpeg' height='auto' width='200' align='right'>
        </div>
    </div>
    <h1 class="title toc-ignore">Coastal Zone</h1>
    <h4 class="author"><em>Solved - Solutions in Geoinformation</em></h4>
</div>

# About
This repository provides the steps to classify Coastal Zone classes using Landsat Top of Atmosphere (TOA) mosaics.

Two machine learning techniques were used: Mangrove; Beach, Dunes, & Sand-Spot; and Shallow Coral Reefs are based on Random Forests, and Hypersaline Tidal-Flats are U-Net derived.

For more information about the methodology, please see the [Coastal Zone Algorithm Theoretical Basis Document](https://brasil.mapbiomas.org/wp-content/uploads/sites/4/2024/08/Coastal-Zone-Appendix-ATBD-Collection-9.docx.pdf)

<!-- # Release History

* 1.0.0
    * Description -->

# How to use

Scripts that are common between all classes are numbered with single digits in order of processing.

Example: 

"0 - Mosaic.js" is the first common script for generating mosaics, some classes use the same base for training and classification.

Each unique script are a sequence of 3 numbers: first the the order in which they are executed, followed by the pair that defines the class in MapBiomas legend. If the three digit number first character is the same as a single numbered script that means that that class uses a different script in that step.

The following table is each class and its correspnding MapBiomas class number:

|CLASS| NUMBER|
|:---:|:-----:|
|MANGROVE| 05 |
|BEACH, DUNE AND SAND-SPOT| 23 |
|HYPERSALINE TIDAL-FLAT| 32 |
| SHALLOW CORAL REEFS| 69 |

Example: 

"069 - Mosaic.js" is the Shallow Coral Reefs mosaic generating script, which differs from the one presented previously ("0 - Mosaic.js").

"123 - Classification.js" is the Beach, Dune and Sand-Spot classification script, that immediately follows the common script for generating mosaics ("0 - Mosaic.js").

## 1. Prepare environment.

The Hypersaline Tidal-Flat mapping is based on DeepLearning (DL) classifier U-Net. Thus it uses the COLAB structure, rather than purelly GEE code editor as the other classes in this repository.


## 1. Mosaic and grid generation. 
Start processing the annual cloud free composities, Mosaic.js (cloud removed median mosaics from 1985 - 2023).

Example: users/solved/0 - Mosaic.js 
`// linkar aqui o script`


## 2. Classification.


The automatic classification of the Landsat mosaics was mainly performed on the Google Earth Engine platform, based on the Random Forest classifier (Breiman, 2001). The Hypersaline Salt-flat and the Aquaculture classes were deep-learning derived and thus classified outside the GEE.

Example:
users/solved/0 - Mosaic.js

2.2. Execute the classification scripts. They are all starting with numebre 1 (1 - Apicum MapbiomasBased.js, 1 - BeD MapbiomasBased.js, 1 - Mangrove MapbiomasBased.js).

users/solved/1 - Mangrove MapbiomasBased.js `// linkar aqui o script`

users/solved/1 - BeD MapbiomasBased.js `// linkar aqui o script`

users/solved/1 - Apicum MapbiomasBased.js `// linkar aqui o script`

## 3. Gap-fill & Temporal filter.
Gap-fill: Replace no-data values using the nearest available valid class.
Temporal Filter: Apply a 3-year moving window to correct temporal inconsistencies.
Example: [4-GapFill_TemporalFilter.js](./4-GapFill_TemporalFilter.js)

|RULE| INPUT (YEAR) | OUTPUT|
|:--:|:------------:|:-----:|
| - | T1 / T2 / T3 | T1 / T2 / T3 |
| GR| Tg / N-Tg / Tg | Tg / Tg / Tg |
| GR| N-Tg / Tg / N-Tg | N-Tg / N-Tg / N-Tg

## 4. Spatial filter.
Spatial Filter: Use GEE's connectedPixelCount to remove isolated pixels, ensuring a minimum mapping unit of ~1 ha.
Example: [5-SpatialFilter.js](./5-SpatialFilter)

#### 5. Frequency filter
Frequency Filter: Remove classes with less than 10% temporal persistence.

Example: [6-FrequencyFilter.js](./6-FrequencyFilter.js)

## 5. Integration. 

Every classification is a binary set of pixel values. 0 - "non-class", 1 - "class of interest" (eg. 0 - Non-Mangrove, 1 - Mangrove)

The different outputs from each classification are then integrated, Mangrove is placed above all other classes, then Hypersaline Tidal-Flats and Beach, Dune and Sand Spots. Shallow Coral Reefs are published separately, under all other MapBiomas classes.

users/solved/4 - Integration.js

# References
### REFERENCE DATA

|CLASS | REFERENCES|
|:----:|:---------:|
|MANGROVE|MapBiomas Collection 8, Giri et al., 2011, ICMBio Mangrove Attlas (ICMBio, 2018), Global Mangrove Watch (Bunting et al., 2018; Thomas et al., 2018), Diniz et al., 2019, Panorama da Conservação dos Ecossistemas Costeiros e Marinhos no Brasil (MMA, 2010), plus visual inspection.|
|HYPERSALINE TIDAL FLAT| MapBiomas Collection 8, Atlas Dos Remanescentes Florestais da Mata Atlântica (SOS Mata Atlântica, 2020), Prates, Gonçalves and Rosa, 2010, Panorama da Conservação dos Ecossistemas Costeiros e Marinhos no Brasil (MMA, 2010), plus visual inspection.|
|BEACHES, DUNES AND SAND SPOTS|MapBiomas Collection 8, Atlas Dos Remanescentes Florestais da Mata Atlântica (SOS Mata Atlântica, 2020), Prates, Gonçalves and Rosa, 2010, Panorama da Conservação dos Ecossistemas Costeiros e Marinhos no Brasil (MMA, 2010), plus visual inspection.|
|SHALLOW CORAL REEFS| Áreas Prioritárias para Conservação da Biodiversidade (MMA), Panorama da Conservação dos Ecossistemas Costeiros e Marinhos no Brasil (MMA, 2010), Atlas dos Recifes de Corais nas Unidades de Conservação Brasileiras (MMA), Allen Coral Reef Atlas, and UNEP-WCMC Global Distribution of Coral Reefs.|

--- 

### REFERENCE LITERATURE
ABADI, M. et al. TensorFlow: Large-scale machine learning on heterogeneous systems. Methods in Enzymology, 2015. 

Adey, W. H. (2000). Coral Reef Ecosystems and Human Health: Biodiversity Counts! Ecosystem Health, 6(4), 227–236. doi:10.1046/j.1526-0992.2000.006004227.x

Allen Coral Atlas. Imagery, maps and monitoring of the world's tropical coral reefs, 2024. doi.org/10.5281/zenodo.3833242

BARBIER, E. B.; COX, M. Does Economic Development Lead to Mangrove Loss? A Cross-Country Analysis. Contemporary Economic Policy, v. 21, n. 4, p. 418–432, 1 out. 2003. 

BREIMAN, L. Random Forests. Machine Learning, v. 45, n. 1, p. 5–32, 2001. 

BUNTING, P. et al. The Global Mangrove Watch—A New 2010 Global Baseline of Mangrove Extent Remote Sensing , 2018. 

Diniz, C., Cortinhas, L., Nerino, G., Rodrigues, J., Sadeck, L., Adami, M., Souza-Filho, W.P., Brazilian Mangrove Status: Three Decades of Satellite Data Analysis. Remote Sensing 11, http://dx.doi.org/10.3390/rs11070808. 2019. 

Diniz, C., Cortinhas, L., Pinheiro, M.L., Sadeck, L., Fernandes Filho, A., Baumann, L.R.F., Adami, M., Souza-Filho, P.W.M., 2021. A Large-Scale Deep-Learning Approach for Multi-Temporal Aqua and Salt-Culture Mapping Remote Sensing, Remote Sensing, http://dx.doi.org/10.3390/rs13081415, 2021. 

DOMINGUEZ, J. M. L. The Coastal Zone of Brazil. In: Geology and Geomorphology of Holocene Coastal Barriers of Brazil. Berlin, Heidelberg: Springer Berlin Heidelberg, 2009. p. 17–51. 

ESCADAFAL, R., BELGHIT, A. AND BEN-MOUSSA, A. (1994) Indices spectraux pour la télédétection de la dégradation des milieux naturels en Tunisie aride. In: Guyot, G. réd., Actes du 6eme Symposium international sur les mesures physiques et signatures en télédétection, Val d’Isère (France), 17-24 Janvier 1994, 253-259

FERREIRA, B.P.; MAIDA, M.. Monitoramento dos recifes de coral do Brasil. Brasília: MMA, 2006.

FU-MIN WANG, JING-FENG HUANG, YAN-LIN TANG, XIU-ZHEN WANG, New Vegetation Index and Its Application in Estimating Leaf Area Index of Rice, Rice Science, Volume 14, Issue 3, 2007, Pages 195-203, ISSN 1672-6308

GIRI, C. et al. Status and distribution of mangrove forests of the world using earth observation satellite data. Global Ecology and Biogeography, v. 20, n. 1, p. 154–159, 2011. 

GITELSON, A. A., A. VIÑA, T. J. ARKEBAUER, D. C. RUNDQUIST, G. KEYDAN, AND B. LEAVITT (2003), Remote estimation of leaf area index and green leaf biomass in maize canopies, Geophys. Res. Lett., 30, 1248, doi:10.1029/2002GL016450, 5.

GUIMARÃES, A. S. et al. Impact of aquaculture on mangrove areas in the northern Pernambuco Coast (Brazil) using remote sensing and geographic information system. Aquaculture Research, v. 41, n. 6, p. 828–838, 13 maio 2010. 

ICMBIO. Atlas dos manguezais do Brasil. 1. ed. Brasília, Brazil: ICMBio, 2018. 

KNOWLTON, Nancy, et al. Coral reef biodiversity. Life in the world’s oceans: diversity distribution and abundance, 2010: 65-74.

LIU, H. Q.; HUETE, A. Feedback based modification of the NDVI to minimize canopy background and atmospheric noise. IEEE Transactions on Geoscience and Remote Sensing, 1995. 

MMA. Gerência de Biodiversidade Aquática e Recursos Pesqueiros. Panorama da conservação dos
ecossistemas costeiros e marinhos no Brasil. Brasília: MMA/SBF/GBA, 2010. 148 p.

MMA, MAPA DAS ÁREAS PRIORITÁRIAS DA ZONA COSTEIRA E MARINHA PARA CONSERVAÇÃO DA BIODIVERSIDADE. 2018. Disponível em: https://www.gov.br/mma/pt-br/assuntos/biodiversidade-e-biomas/ecossistemas/conservacao-1/areas-prioritarias/zona_costeira.jpg

PRATES, A. P. L.; GONÇALVES, M. A.; ROSA, M. R. Panorama da conservação dos ecossistemas costeiros e marinhos no Brasil. Brasília: MMA/SBF/GBA, 2010. 

QUEIROZ, L. et al. Shrimp aquaculture in the federal state of Ceará, 1970–2012: Trends after mangrove forest privatization in Brazil. [s.l: s.n.]. v. 73

ROGERS, A. S.; KEARNEY, M. S. Reducing signature variability in unmixing coastal marsh Thematic Mapper scenes using spectral indices. International Journal of Remote Sensing, 2004. 

SOS MATA ATL NTICA. Atlas dos remanescentes florestais da Mata Atlântica, período 2019-2020. São Paulo, Brasil. Fundação SOS Mata Atlantica. Instituto Nacional das Pesquisas Espaciais, 2020. 

SOSMA; INPE. ATLAS DOS REMANESCENTES FLORESTAIS DA MATA ATL NTICA PERÍODO 2016-2017. Fundação SOS Mata Atlântica e Instituto de Pesquisas Espaciais, 2018. 

Souza-Filho, P.W.M., Diniz, C.G., Souza-Neto, P.W.M., Lopes, J.P.N., Nascimento Júnior, W.R., Cortinhas, L., Asp, N.E., Fernandes, M.E.B., Dominguez, J.M.L., 2023. Mangrove Swamps of Brazil: Current Status and Impact of Sea-Level Changes, in: Dominguez, J.M.L., Kikuchi, R.K.P.d., Filho, M.C.d.A., Schwamborn, R., Vital, H. (Eds.), Tropical Marine Environments of Brazil: Spatio-Temporal Heterogeneities and Responses to Climate Changes. Springer International Publishing, Cham, pp. 45-74, 10.1007/978-3-031-21329-8_3.

TENÓRIO, G. S. et al. Mangrove shrimp farm mapping and productivity on the Brazilian Amazon coast: Environmental and economic reasons for coastal conservation. Ocean & Coastal Management, v. 104, p. 65–77, 2015. 

THOMAS, N. et al. Distribution and drivers of global mangrove forest change, 1996–2010. PLOS ONE, v. 12, n. 6, p. e0179302, 8 jun. 2017. 

___. Mapping Mangrove Extent and Change: A Globally Applicable ApproachRemote Sensing , 2018. 
TUCKER, C. J. Red and photographic infrared linear combinations for monitoring vegetation. Remote Sensing of Environment, v. 8, n. 2, p. 127–150, 1979. 

USGS. LANDSAT COLLECTION 1 LEVEL 1 PRODUCT DEFINITION. [s.l.] Earth Resources Observation and Science (EROS) Center, 2017. 

XU, H. Modification of normalised difference water index (NDWI) to enhance open water features in remotely sensed imagery. International Journal of Remote Sensing, v. 27, n. 14, p. 3025–3033, 20 jul. 2006. 
 

