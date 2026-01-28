<p align="right">
  <img src="../misc/Solved_ vetor 1.png" width="200">
</p>

# Coastal Zone Mapping

# About
This repository provides the steps to map classes located in the **Brazilian Coastal Zone** using Landsat Top-of-Atmosphere (TOA) mosaics.

The target classes are **mangroves; beaches, dunes, and sand spots (BDS); and hypersaline tidal flats (HTF)**. With the exception of HTF, which is mapped using a deep learning model, the remaining classes are detected using a Random Forest algorithm.

The deep learning workflow focuses on identifying HTF areas from Landsat TOA mosaics. It involves generating annual cloud-free mosaics using Google Earth Engine (GEE) and applying a [U-Net](https://arxiv.org/abs/1505.04597) model for semantic segmentation.

For more information about the methodology, please consult the [Coastal Zone Algorithm Theoretical Basis Document.](https://doi.org/10.58053/MapBiomas/D0UVI6)

# How to use
## 0. Prepare environment.
A Google Earth Engine account is required ([Get Started](https://earthengine.google.com)). Users must be able to create a GEE repository in the Code Editor and upload the required modules.

GPU resources are also required for the model training process.

## 1. Start processing the annual cloud free composities
Landsat TOA Mosaics:
        Use USGS Landsat Collection 2 Tier 1 TOA imagery.
        Generate annual cloud-free mosaics from January 1st to December 31st for the period 1985–2024.
        Apply a median filter to reduce clouds and cloud shadows.

* Script: [1-mosaic-generation.js](./1-mosaic-generation.js)

--- 
## Hypersaline Tidal Flat Deep Learning Approach
### 2. Sampling Script 
Visualize the training and validation regions along with the publicly available supervised layer.

* Script:  [HTF/2-train-test-dataset.js](./HTF/2-train-test-dataset.js)

### 3. Neural network execution
#### 3.1. Training
Training Samples:
        Select samples based on htf and non-htf categories.

#### 3.2. Prediction
Every prediction is a binary set of pixel values. 0 - "non-htf", 1 - "htf"

The task is framed as semantic segmentation.

Model:
Use a U-Net neural network to perform semantic segmentation on local servers.

| PARAMETERS   |   VALUES|
|:------------:|:-------:|
Neural network | U-Net |
Tile-Size      | 256 x 256 px |
Samples        | 47700(Train), 13355 (Validation)|
Attributes     | green, red, nir, swir1, NDVI, MNDWI|
Output         | 2 (htf and non-htf)|

##### Table 2 - CNN attributes and segmentation parameters. In total, six (6) distinct attributes were used.

* Script: [HTF/3-Jupyter Notebook](./HTF/3-mb10_htf.ipynb)

--- 

## Machine Learning Approach
## 2. Classification.
Mangroves and beaches, dunes, and sand spots (BDS) were classified using a pixel-wise Random Forest algorithm (Breiman, 2001).

For mangroves, the analysis was performed separately for different regions, which are defined in [Mangrove/regions.js](./Mangrove/regions.js).

Scripts used:
* Mangrove: [Mangrove/2-mangrove_mapping.js](./Mangrove/2-mangrove_mapping.js)
* Beaches, Dunes and Sand-Spots: [BDS/2-bds_mapping.js](./BDS/2-bds_mapping.js)

--- 
# Filter Chain
## 4. Gap-fill & Temporal filter
Gap-fill: Replace no-data values using the nearest available valid class.
Temporal Filter: Apply a 3-year moving window to correct temporal inconsistencies.

* Script:  [4-gap-fill-temporal-filter.js](./4-gap-fill-temporal-filter.js)
|RULE| INPUT (YEAR) | OUTPUT|
|:--:|:------------:|:-----:|
| - | T1 / T2 / T3 | T1 / T2 / T3 |
| GR| Tg / N-Tg / Tg | Tg / Tg / Tg |
| GR| N-Tg / Tg / N-Tg | N-Tg / N-Tg / N-Tg

## 5. Spatial filter
Spatial Filter: Use GEE's connectedPixelCount to remove isolated pixels, ensuring a minimum mapping unit of ~1 ha.

* Script:  [5-spatial-filter.js](./5-spatial-filter.js)

## 6. Frequency filter
Frequency Filter: Remove classes with less than 10% temporal persistence.

P.S. The threshold frequency may vary according to class, collection or satellite type. However, 10% remains the start point for investigation.

* Script:  [6-frequency-filter.js](./6-frequency-filter.js)

## 7. Integration. 

Every detection is a binary set of pixel values. 0 - "non-class", 1 - "class of interest".

Each mapping (been segmentation for the HTF and classification to the rest) are then integrated. Mangrove is placed above all other classes, then Hypersaline Tidal-Flats and Beach, Dune and Sand Spots. Shallow Coral Reefs are published separately, under all other MapBiomas classes.

* Script:  [7-integration.js](./7-integration.js)

--- 
# References
### DATA

|CLASS | REFERENCES|
|:----:|:---------:|
|MANGROVE|MapBiomas Collection 8, Giri et al., 2011, ICMBio Mangrove Attlas (ICMBio, 2018), Global Mangrove Watch (Bunting et al., 2018; Thomas et al., 2018), Diniz et al., 2019, Panorama da Conservação dos Ecossistemas Costeiros e Marinhos no Brasil (MMA, 2010), plus visual inspection.|
|HYPERSALINE TIDAL FLAT| MapBiomas Collection 8, Atlas Dos Remanescentes Florestais da Mata Atlântica (SOS Mata Atlântica, 2020), Prates, Gonçalves and Rosa, 2010, Panorama da Conservação dos Ecossistemas Costeiros e Marinhos no Brasil (MMA, 2010), plus visual inspection.|
|BEACHES, DUNES AND SAND SPOTS|MapBiomas Collection 8, Atlas Dos Remanescentes Florestais da Mata Atlântica (SOS Mata Atlântica, 2020), Prates, Gonçalves and Rosa, 2010, Panorama da Conservação dos Ecossistemas Costeiros e Marinhos no Brasil (MMA, 2010), plus visual inspection.|
|SHALLOW CORAL REEFS| Áreas Prioritárias para Conservação da Biodiversidade (MMA), Panorama da Conservação dos Ecossistemas Costeiros e Marinhos no Brasil (MMA, 2010), Atlas dos Recifes de Corais nas Unidades de Conservação Brasileiras (MMA), Allen Coral Reef Atlas, and UNEP-WCMC Global Distribution of Coral Reefs.|

###  LITERATURE
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

E SOUZA-FILHO, P.W.M. et al. (2023). Mangrove Swamps of Brazil: Current Status and Impact of Sea-Level Changes. In: Dominguez, J.M.L., Kikuchi, R.K.P.d., Filho, M.C.d.A., Schwamborn, R., Vital, H. (eds) Tropical Marine Environments of Brazil. The Latin American Studies Book Series. Springer, Cham. https://doi.org/10.1007/978-3-031-21329-8_3

TENÓRIO, G. S. et al. Mangrove shrimp farm mapping and productivity on the Brazilian Amazon coast: Environmental and economic reasons for coastal conservation. Ocean & Coastal Management, v. 104, p. 65–77, 2015. 

THOMAS, N. et al. Distribution and drivers of global mangrove forest change, 1996–2010. PLOS ONE, v. 12, n. 6, p. e0179302, 8 jun. 2017. 

THOMAS, N. et al. Mapping Mangrove Extent and Change: A Globally Applicable Approach. Remote Sens. 2018, 10, 1466. https://doi.org/10.3390/rs10091466

TUCKER, C. J. Red and photographic infrared linear combinations for monitoring vegetation. Remote Sensing of Environment, v. 8, n. 2, p. 127–150, 1979. 

USGS. LANDSAT COLLECTION 1 LEVEL 1 PRODUCT DEFINITION. [s.l.] Earth Resources Observation and Science (EROS) Center, 2017. 

XU, H. Modification of normalised difference water index (NDWI) to enhance open water features in remotely sensed imagery. International Journal of Remote Sensing, v. 27, n. 14, p. 3025–3033, 20 jul. 2006. 