/**
 * Selection Manager Service
 * Smart selection management with React-inspired patterns
 */

export class SelectionManager {
  constructor(maxSelections = 10) {
    this.maxSelections = maxSelections;
    this.selectedContent = new Map();
    this.listeners = new Set();
  }

  /**
   * Toggle selection with validation
   * Pattern inspired by legacy React components
   */
  toggleSelection(item) {
    if (this.selectedContent.has(item.id)) {
      this.selectedContent.delete(item.id);
    } else {
      if (this.selectedContent.size >= this.maxSelections) {
        this.notifyError(`Maximum ${this.maxSelections} items can be selected`);
        return false;
      }
      this.selectedContent.set(item.id, item);
    }

    this.notifyChange();
    return true;
  }

  getSelectedItems() {
    return Array.from(this.selectedContent.values());
  }

  getSelectionSummary() {
    const selected = this.getSelectedItems();

    return {
      count: selected.length,
      maxCount: this.maxSelections,
      contentTypes: this.getContentTypeBreakdown(selected),
      estimatedReach: this.estimateReach(selected)
    };
  }

  getContentTypeBreakdown(items) {
    const breakdown = {};
    items.forEach(item => {
      breakdown[item.category] = (breakdown[item.category] || 0) + 1;
    });
    return breakdown;
  }

  estimateReach(items) {
    // Simplified reach estimation algorithm
    const baseReach = items.reduce((sum, item) =>
      sum + (item.historical_reach || 1000), 0);

    return Math.floor(baseReach * 0.8); // Conservative estimate
  }

  clearSelection() {
    this.selectedContent.clear();
    this.notifyChange();
  }

  isSelected(itemId) {
    return this.selectedContent.has(itemId);
  }

  // React-inspired event system
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyChange() {
    this.listeners.forEach(callback => callback({
      type: 'selection-changed',
      summary: this.getSelectionSummary(),
      selectedItems: this.getSelectedItems()
    }));
  }

  notifyError(message) {
    this.listeners.forEach(callback => callback({
      type: 'selection-error',
      message
    }));
  }
}
