export namespace ACTION_CARD_CONFIG {
    namespace defaults {
        let type: string;
        let disabled: boolean;
        let completed: boolean;
        let showProgress: boolean;
        let showReward: boolean;
        let showCompletion: boolean;
    }
    namespace xpRewards {
        let low: number;
        let medium: number;
        let high: number;
        let premium: number;
    }
    namespace animations {
        let hover: number;
        let complete: number;
        let progress: number;
    }
    namespace sizes {
        export namespace small {
            let padding: string;
            let iconSize: string;
            let fontSize: string;
        }
        export namespace medium_1 {
            let padding_1: string;
            export { padding_1 as padding };
            let iconSize_1: string;
            export { iconSize_1 as iconSize };
            let fontSize_1: string;
            export { fontSize_1 as fontSize };
        }
        export { medium_1 as medium };
        export namespace large {
            let padding_2: string;
            export { padding_2 as padding };
            let iconSize_2: string;
            export { iconSize_2 as iconSize };
            let fontSize_2: string;
            export { fontSize_2 as fontSize };
        }
    }
    namespace themes {
        namespace _default {
            let primary: string;
            let background: string;
            let border: string;
        }
        export { _default as default };
        export namespace success {
            let primary_1: string;
            export { primary_1 as primary };
            let background_1: string;
            export { background_1 as background };
            let border_1: string;
            export { border_1 as border };
        }
        export namespace warning {
            let primary_2: string;
            export { primary_2 as primary };
            let background_2: string;
            export { background_2 as background };
            let border_2: string;
            export { border_2 as border };
        }
        export namespace danger {
            let primary_3: string;
            export { primary_3 as primary };
            let background_3: string;
            export { background_3 as background };
            let border_3: string;
            export { border_3 as border };
        }
    }
    namespace validation {
        export namespace title {
            let required: boolean;
            let maxLength: number;
        }
        export namespace description {
            let maxLength_1: number;
            export { maxLength_1 as maxLength };
        }
        export namespace progress_1 {
            let min: number;
            let max: number;
        }
        export { progress_1 as progress };
    }
}
export namespace defaultActionCardProps {
    let title_1: string;
    export { title_1 as title };
    let description_1: string;
    export { description_1 as description };
    export let icon: string;
    export let reward: string;
    let progress_2: null;
    export { progress_2 as progress };
    export let status: string;
    export let color: string;
    export let size: string;
    export let interactive: boolean;
    let showProgress_1: boolean;
    export { showProgress_1 as showProgress };
    let showReward_1: boolean;
    export { showReward_1 as showReward };
    export let analytics: boolean;
}
export namespace actionCardConfig {
    export let statuses: string[];
    export let colors: string[];
    let sizes_1: string[];
    export { sizes_1 as sizes };
    export namespace animations_1 {
        export let ripple: number;
        export let completion: number;
        let hover_1: number;
        export { hover_1 as hover };
        export let focus: number;
    }
    export { animations_1 as animations };
    export namespace accessibility {
        namespace tabIndex {
            export let enabled: string;
            let disabled_1: string;
            export { disabled_1 as disabled };
        }
        namespace roles {
            let interactive_1: string;
            export { interactive_1 as interactive };
            let _static: string;
            export { _static as static };
        }
    }
    export namespace classNames {
        export let base: string;
        let status_1: string;
        export { status_1 as status };
        let color_1: string;
        export { color_1 as color };
        let size_1: string;
        export { size_1 as size };
        let interactive_2: string;
        export { interactive_2 as interactive };
        export let withProgress: string;
        export let hovering: string;
        export let focused: string;
        export let completing: string;
    }
}
export namespace actionCardValidation {
    /**
     * Validate status value
     */
    function validateStatus(status: any): boolean;
    /**
     * Validate color value
     */
    function validateColor(color: any): boolean;
    /**
     * Validate size value
     */
    function validateSize(size: any): boolean;
    /**
     * Validate progress value
     */
    function validateProgress(progress: any): boolean;
    /**
     * Validate all props
     */
    function validateProps(props: any): string[];
}
export namespace actionCardThemes {
    namespace _default_1 {
        import colors_1 = actionCardConfig.colors;
        export { colors_1 as colors };
        import sizes_2 = actionCardConfig.sizes;
        export { sizes_2 as sizes };
    }
    export { _default_1 as default };
    export namespace minimal {
        let colors_2: string[];
        export { colors_2 as colors };
        let sizes_3: string[];
        export { sizes_3 as sizes };
        let showReward_2: boolean;
        export { showReward_2 as showReward };
        let showProgress_2: boolean;
        export { showProgress_2 as showProgress };
    }
    export namespace gamified {
        let colors_3: string[];
        export { colors_3 as colors };
        let sizes_4: string[];
        export { sizes_4 as sizes };
        let showReward_3: boolean;
        export { showReward_3 as showReward };
        let showProgress_3: boolean;
        export { showProgress_3 as showProgress };
        let interactive_3: boolean;
        export { interactive_3 as interactive };
    }
}
//# sourceMappingURL=action-card-config.d.ts.map