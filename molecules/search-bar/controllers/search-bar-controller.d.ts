/**
 * Search Bar Component Logic
 * Pure JavaScript logic for search-bar molecule behavior
 */
export class SearchBarController {
    constructor(element: any);
    element: any;
    form: any;
    input: any;
    suggestions: any;
    state: {
        value: any;
        isListening: boolean;
        highlightedIndex: number;
        recentSearches: any;
    };
    debounceTimer: NodeJS.Timeout | null;
    recognition: any;
    setupEventListeners(): void;
    handleSubmit(event: any): void;
    handleInput(event: any): void;
    handleKeydown(event: any): void;
    handleFocus(event: any): void;
    handleBlur(event: any): void;
    handleClick(event: any): void;
    handleSuggestionClick(event: any): void;
    handleSuggestionHover(event: any): void;
    handleDocumentClick(event: any): void;
    initializeVoiceSearch(): void;
    toggleVoiceSearch(): void;
    showSuggestions(): void;
    hideSuggestions(): void;
    highlightNextSuggestion(total: any): void;
    highlightPreviousSuggestion(total: any): void;
    highlightSuggestion(index: any): void;
    updateHighlightedSuggestion(): void;
    selectSuggestion(suggestion: any): void;
    getCurrentSuggestions(): {
        text: any;
        type: any;
    }[];
    clearSearch(): void;
    updateClearButtonVisibility(value: any): void;
    updateVoiceButtonState(isListening: any): void;
    getRecentSearches(): any;
    saveToRecentSearches(query: any): void;
    setValue(value: any): void;
    getValue(): any;
    focus(): void;
    blur(): void;
    dispatchCustomEvent(eventName: any, detail?: {}): void;
    destroy(): void;
}
//# sourceMappingURL=search-bar-controller.d.ts.map