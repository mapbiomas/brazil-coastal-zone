<p align="right">
  <img src="misc/Solved_ vetor 1.png" width="200">
</p>

# Coastal Zone Mapping
## Overview
This repository contains the workflows and methodologies used to map land cover and land use classes in the **Brazilian Coastal Zone** within the MapBiomas Brazil project.

The mapping relies on a multi-sensor approach, utilizing both Landsat Top-of-Atmosphere (TOA) imagery (`30m resolution`) and Sentinel-2 imagery (`10m resolution`). It combines traditional machine learning and advanced deep learning approaches to generate accurate annual maps for highly dynamic coastal environments.

To ensure consistency, reproducibility, and traceability across different MapBiomas mapping initiatives, the repository is organized by satellite sensor and MapBiomas Collection versions.

---

## Target Classes
The coastal zone mapping targets diverse and ecologically critical environments. Because of their distinct spatial and spectral behaviors, different modeling approaches are applied and separated into specific subdirectories in the newer collections:

* **Mangroves**: Coastal wetland forests mapped using pixel-wise machine learning classifiers.
* **Beaches, Dunes, and Sand Spots (BDS)**: Sandy coastal formations mapped using pixel-wise machine learning classifiers.
* **Hypersaline Tidal Flats (HTF)**: Also known as *Apicuns*, these transition zones are mapped using deep learning (semantic segmentation) to better capture their spatial context and texture.
* **Reefs**: Coastal reef formations mapped using specialized pixel-wise classification.

---

## Repository Structure & Collections

The codebase is divided into two main branches based on the sensor resolution:

* **`Landsat_30m/`**
  * **`Mapbiomas10/`**: Processing pipeline for MapBiomas Collection 10. Scripts are modularized, separating general steps (mosaics, filters, integration) from class-specific mapping folders (`BDS`, `HTF`, `Mangrove`, `REEFS`).
  * **`Mapbiomas09/`**: Legacy processing pipeline used for MapBiomas Collection 9.
* **`Sentinel2_10m/`**
  * **`Mapbiomas03/`**: Processing pipeline for MapBiomas Collection 3 (higher resolution), currently focused on capturing the fine details of Hypersaline Tidal Flats (`HTF`).

---

## General Workflow
Across collections, the coastal zone mapping follows a modular, multi-stage pipeline. The specific execution order generally follows the numbered scripts:

1. **Annual Mosaic Generation (`1-mosaic-generation.js`)**: Extraction and cloud-masking of annual satellite composites (Landsat or Sentinel-2) for the entire Brazilian coast.
2. **Class-Specific Mapping (`2-*` / `3-*`)**: 
   - **Deep Learning Pipeline (HTF)**: Patch generation and semantic segmentation (e.g., using Jupyter Notebooks `3-*.ipynb`).
   - **Machine Learning Pipeline (Mangroves, BDS, Reefs)**: Pixel-by-pixel classification using algorithms like Random Forest in Google Earth Engine.
3. **Post-Processing Filters (`4-*`, `5-*`, `6-*`)**: Application of temporal gap-filling, spatial morphological filters, and frequency-based stabilization to reduce noise and ensure logical transitions across the historical series.
4. **Integration (`Integration.js`)**: Final review and merging of all overlapping coastal classes into a cohesive map before integration into the overarching MapBiomas collection.

*Implementation details, hyperparameters, and specific scripts vary between collections and classes.*

---

## Methodological Reference
A detailed description of the theoretical background, feature engineering, and methodological decisions is available in the:

[Coastal Zone Algorithm Theoretical Basis Document (ATBD)](https://doi.org/10.58053/MapBiomas/D0UVI6)

---

## Notes
This README provides a **general overview** of the repository's architecture.  
For step-by-step execution guides and collection-specific details, please refer to the `README.md` files located directly inside each collection directory (e.g., `Landsat_30m/Mapbiomas10/`).