# Cache System Refactor

## Overview

This document describes the refactoring of the cache system in the Epii Analysis Pipeline. The refactoring removes the redundant analysis cache and consolidates all caching into the document cache system.

## Motivation

The previous implementation had two separate cache systems:

1. **Document Cache** (`documentCache.utils.mjs`): For caching documents and their metadata
2. **Analysis Cache** (`analysisCache.utils.mjs`): For caching analysis results

This redundancy caused confusion and potential inconsistencies. The refactoring consolidates all caching into the document cache system for a cleaner architecture.

## Changes Made

1. **Added Analysis Results Functions to Document Cache**
   - Added `storeAnalysisResultsInCache`, `getAnalysisResultsFromCache`, `clearAnalysisResultsFromCache`, and `hasAnalysisResultsInCache` functions to `documentCache.utils.mjs`
   - These functions maintain the same API as the original analysis cache functions

2. **Updated References to Use Document Cache**
   - Updated all imports and references in:
     - `analysis.controller.mjs`
     - `document.utils.mjs`
     - `stage_minus0.mjs`

3. **Added Migration Utility**
   - Created `cacheTransition.utils.mjs` to handle migration from the old analysis cache to the document cache
   - Added migration logic to the analysis controller to ensure a smooth transition

## Benefits

1. **Simplified Architecture**: One cache system instead of two
2. **Reduced Redundancy**: No duplicate code for caching
3. **Improved Consistency**: All caching follows the same patterns
4. **Better Maintainability**: Easier to understand and maintain

## Implementation Details

### Document Cache Structure

The document cache now has two separate maps:
- `documentCache`: For caching documents
- `analysisResultsCache`: For caching analysis results

This separation maintains a clean distinction between document data and analysis results while keeping them in the same module.

### Migration Strategy

The migration strategy is designed to be transparent to users:

1. When retrieving analysis results, first check the document cache
2. If not found, try to migrate from the old analysis cache
3. If migration succeeds, retrieve from the document cache
4. If migration fails, fall back to MongoDB

This ensures a smooth transition without disrupting the user experience.

## Future Work

1. **Remove Old Analysis Cache**: Once the transition is complete, remove the old analysis cache module
2. **Remove Migration Utility**: Once all analysis results have been migrated, remove the migration utility
3. **Optimize Cache Performance**: Consider adding TTL (Time To Live) and LRU (Least Recently Used) eviction to the cache

## Conclusion

This refactoring simplifies the codebase by consolidating all caching into a single system. It improves maintainability and reduces the potential for inconsistencies between different cache implementations.
