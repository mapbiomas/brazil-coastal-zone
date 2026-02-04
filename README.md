<p align="right">
  <img src="misc/Solved_ vetor 1.png" width="200">
</p>

# Coastal Zone Mapping

## Overview
This repository contains the workflows and methodologies used to map land cover and land use classes in the **Brazilian Coastal Zone** within the MapBiomas Brazil project.

The mapping is based on Landsat Top-of-Atmosphere (TOA) imagery and combines machine learning and deep learning approaches to generate annual maps for multiple coastal environments.

To ensure consistency across collections, the repository is organized by MapBiomas Collection versions, with each collection implemented in its own directory.

---

## Target Classes
The coastal zone mapping includes the following classes:

- **Mangroves**
- **Beaches, Dunes, and Sand Spots (BDS)**
- **Hypersaline Tidal Flats (HTF)**

Each class may adopt a different methodological approach depending on its spatial and spectral characteristics.

---

## Repository Structure
The repository is subdivided into folders corresponding to **MapBiomas collections**, for example:

- `MapBiomas9/`
- `MapBiomas10/`

Each collection folder contains:
- The specific processing workflow adopted in that collection
- Scripts and notebooks for data preparation, training, classification, and post-processing
- Class-specific subdirectories when applicable

This structure allows methodologies to evolve across collections while preserving reproducibility and historical context.

---

## General Workflow
Across collections, the coastal zone mapping follows a common high-level workflow:

1. Annual Landsat Mosaic Generation

2. Class-Specific Mapping
   - Hypersaline Tidal Flats (HTF): mapped using deep learning semantic segmentation.
   - Mangroves and BDS: mapped using pixel-wise machine learning classifiers.

3. Temporal Consistency and Integration
   Annual results are reviewed and integrated into the corresponding MapBiomas collection.

Implementation details may vary between collections and are documented within each collection folder.

---

## Methodological Reference
A detailed description of the theoretical background and methodological decisions is available in the:

[Coastal Zone Algorithm Theoretical Basis Document.](https://doi.org/10.58053/MapBiomas/D0UVI6)


## Notes
This README provides a **general overview** of the repository.  
For collection-specific details, please refer to the README files inside each `MapBiomasX/` directory.

