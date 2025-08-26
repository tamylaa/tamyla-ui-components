# Archived UI Components

**Archive Date**: 2025-08-26T05:29:27.872Z
**Reason**: Cleanup after modularization refactoring

## Archived Files

### Refactoring Backups
These files were backed up during the monolithic refactoring process:
- core/react-pattern-adapters-backup.js → refactoring-backups/react-pattern-adapters-backup.js
- organisms/tmyl-search-interface-monolith-backup.js → refactoring-backups/tmyl-search-interface-monolith-backup.js

### Legacy Components  
These files were moved from active use to archive after modern replacements were created:


## Recovery Instructions

To restore any archived file:
1. Copy the file back to its original location
2. Update any import statements as needed
3. Test functionality

## Modern Replacements

- Legacy React components → Use adapters from `core/adapters/`
- Legacy CSS files → Use design tokens from `core/tokens.css`
- Monolithic files → Use modular components from appropriate atomic folders

## Archive Maintenance

This archive should be reviewed quarterly and files older than 1 year 
with no restoration requests can be permanently deleted.
