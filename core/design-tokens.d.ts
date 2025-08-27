export namespace designTokens {
    namespace colors {
        let primary: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
            contrast: string;
        };
        let neutral: {
            50: string;
            100: string;
            200: string;
            300: string;
            400: string;
            500: string;
            600: string;
            700: string;
            800: string;
            900: string;
        };
        namespace semantic {
            let success: string;
            let warning: string;
            let error: string;
            let info: string;
        }
        namespace surface {
            let primary_1: string;
            export { primary_1 as primary };
            export let secondary: string;
            export let tertiary: string;
        }
        namespace text {
            let primary_2: string;
            export { primary_2 as primary };
            let secondary_1: string;
            export { secondary_1 as secondary };
            let tertiary_1: string;
            export { tertiary_1 as tertiary };
            export let inverse: string;
        }
        namespace border {
            let primary_3: string;
            export { primary_3 as primary };
            let secondary_2: string;
            export { secondary_2 as secondary };
            export let focus: string;
        }
    }
    let spacing: {
        px: string;
        0: string;
        0.5: string;
        1: string;
        1.5: string;
        2: string;
        2.5: string;
        3: string;
        3.5: string;
        4: string;
        5: string;
        6: string;
        7: string;
        8: string;
        9: string;
        10: string;
        11: string;
        12: string;
        14: string;
        16: string;
        20: string;
        24: string;
        28: string;
        32: string;
    };
    namespace sizes {
        namespace xs {
            let height: string;
            let padding: string;
            let fontSize: string;
            let iconSize: string;
        }
        namespace sm {
            let height_1: string;
            export { height_1 as height };
            let padding_1: string;
            export { padding_1 as padding };
            let fontSize_1: string;
            export { fontSize_1 as fontSize };
            let iconSize_1: string;
            export { iconSize_1 as iconSize };
        }
        namespace md {
            let height_2: string;
            export { height_2 as height };
            let padding_2: string;
            export { padding_2 as padding };
            let fontSize_2: string;
            export { fontSize_2 as fontSize };
            let iconSize_2: string;
            export { iconSize_2 as iconSize };
        }
        namespace lg {
            let height_3: string;
            export { height_3 as height };
            let padding_3: string;
            export { padding_3 as padding };
            let fontSize_3: string;
            export { fontSize_3 as fontSize };
            let iconSize_3: string;
            export { iconSize_3 as iconSize };
        }
        namespace xl {
            let height_4: string;
            export { height_4 as height };
            let padding_4: string;
            export { padding_4 as padding };
            let fontSize_4: string;
            export { fontSize_4 as fontSize };
            let iconSize_4: string;
            export { iconSize_4 as iconSize };
        }
    }
    namespace typography {
        export namespace fontFamily {
            let sans: string;
            let mono: string;
        }
        let fontSize_5: {
            xs: string;
            sm: string;
            base: string;
            lg: string;
            xl: string;
            '2xl': string;
            '3xl': string;
            '4xl': string;
        };
        export { fontSize_5 as fontSize };
        export namespace fontWeight {
            let normal: string;
            let medium: string;
            let semibold: string;
            let bold: string;
        }
        export namespace lineHeight {
            export let tight: string;
            let normal_1: string;
            export { normal_1 as normal };
            export let relaxed: string;
        }
    }
    namespace borderRadius {
        export let none: string;
        let sm_1: string;
        export { sm_1 as sm };
        let md_1: string;
        export { md_1 as md };
        let lg_1: string;
        export { lg_1 as lg };
        let xl_1: string;
        export { xl_1 as xl };
        export let full: string;
    }
    namespace shadows {
        let none_1: string;
        export { none_1 as none };
        let xs_1: string;
        export { xs_1 as xs };
        let sm_2: string;
        export { sm_2 as sm };
        let md_2: string;
        export { md_2 as md };
        let lg_2: string;
        export { lg_2 as lg };
        let xl_2: string;
        export { xl_2 as xl };
        export let inner: string;
    }
    namespace animations {
        namespace transition {
            export let fast: string;
            let normal_2: string;
            export { normal_2 as normal };
            export let slow: string;
        }
        namespace easing {
            let ease: string;
            let easeIn: string;
            let easeOut: string;
            let easeInOut: string;
        }
    }
    namespace zIndex {
        let hide: number;
        let auto: string;
        let base: number;
        let docked: number;
        let dropdown: number;
        let sticky: number;
        let banner: number;
        let overlay: number;
        let modal: number;
        let popover: number;
        let skipLink: number;
        let toast: number;
        let tooltip: number;
    }
}
export namespace sharedVariants {
    export namespace primary_4 {
        export let backgroundColor: string;
        import color = contrast;
        export { color };
        export let borderColor: string;
    }
    export { primary_4 as primary };
    export namespace secondary_3 {
        let backgroundColor_1: string;
        export { backgroundColor_1 as backgroundColor };
        import color_1 = primary;
        export { color_1 as color };
        import borderColor_1 = primary;
        export { borderColor_1 as borderColor };
    }
    export { secondary_3 as secondary };
    export namespace success_1 {
        import backgroundColor_2 = success;
        export { backgroundColor_2 as backgroundColor };
        import color_2 = inverse;
        export { color_2 as color };
        import borderColor_2 = success;
        export { borderColor_2 as borderColor };
    }
    export { success_1 as success };
    export namespace warning_1 {
        import backgroundColor_3 = warning;
        export { backgroundColor_3 as backgroundColor };
        import color_3 = inverse;
        export { color_3 as color };
        import borderColor_3 = warning;
        export { borderColor_3 as borderColor };
    }
    export { warning_1 as warning };
    export namespace error_1 {
        import backgroundColor_4 = error;
        export { backgroundColor_4 as backgroundColor };
        import color_4 = inverse;
        export { color_4 as color };
        import borderColor_4 = error;
        export { borderColor_4 as borderColor };
    }
    export { error_1 as error };
    export namespace ghost {
        let backgroundColor_5: string;
        export { backgroundColor_5 as backgroundColor };
        import color_5 = primary;
        export { color_5 as color };
        let borderColor_5: string;
        export { borderColor_5 as borderColor };
    }
    export namespace outline {
        let backgroundColor_6: string;
        export { backgroundColor_6 as backgroundColor };
        import color_6 = primary;
        export { color_6 as color };
        import borderColor_6 = primary;
        export { borderColor_6 as borderColor };
    }
}
export namespace sharedStates {
    export namespace hover {
        export let transform: string;
        import transition_1 = fast;
        export { transition_1 as transition };
    }
    export namespace focus_1 {
        let outline_1: string;
        export { outline_1 as outline };
        import borderColor_7 = focus;
        export { borderColor_7 as borderColor };
        export let boxShadow: string;
    }
    export { focus_1 as focus };
    export namespace active {
        let transform_1: string;
        export { transform_1 as transform };
        let transition_2: string;
        export { transition_2 as transition };
    }
    export namespace disabled {
        let opacity: string;
        let cursor: string;
        let pointerEvents: string;
    }
    export namespace loading {
        let cursor_1: string;
        export { cursor_1 as cursor };
        export let position: string;
    }
}
export default designTokens;
export namespace ENHANCED_TOKENS {
    export namespace trading {
        export let profit: string;
        export let loss: string;
        let warning_2: string;
        export { warning_2 as warning };
        let neutral_1: string;
        export { neutral_1 as neutral };
    }
    export namespace animations_1 {
        let microInteraction: string;
        let premium: string;
        let smooth: string;
    }
    export { animations_1 as animations };
    export namespace shadows_1 {
        let premium_1: string;
        export { premium_1 as premium };
        export let elevated: string;
        export let glow: string;
    }
    export { shadows_1 as shadows };
}
//# sourceMappingURL=design-tokens.d.ts.map