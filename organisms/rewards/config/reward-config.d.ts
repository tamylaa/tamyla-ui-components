export namespace ACHIEVEMENT_CONFIG {
    namespace rarities {
        namespace COMMON {
            let name: string;
            let color: string;
            let borderColor: string;
            let glow: boolean;
        }
        namespace UNCOMMON {
            let name_1: string;
            export { name_1 as name };
            let color_1: string;
            export { color_1 as color };
            let borderColor_1: string;
            export { borderColor_1 as borderColor };
            let glow_1: boolean;
            export { glow_1 as glow };
        }
        namespace RARE {
            let name_2: string;
            export { name_2 as name };
            let color_2: string;
            export { color_2 as color };
            let borderColor_2: string;
            export { borderColor_2 as borderColor };
            let glow_2: boolean;
            export { glow_2 as glow };
        }
        namespace EPIC {
            let name_3: string;
            export { name_3 as name };
            let color_3: string;
            export { color_3 as color };
            let borderColor_3: string;
            export { borderColor_3 as borderColor };
            let glow_3: boolean;
            export { glow_3 as glow };
        }
        namespace LEGENDARY {
            let name_4: string;
            export { name_4 as name };
            let color_4: string;
            export { color_4 as color };
            let borderColor_4: string;
            export { borderColor_4 as borderColor };
            let glow_4: boolean;
            export { glow_4 as glow };
            export let gradient: boolean;
        }
    }
    namespace categories {
        namespace TRADING {
            let name_5: string;
            export { name_5 as name };
            export let icon: string;
            export let description: string;
        }
        namespace LEARNING {
            let name_6: string;
            export { name_6 as name };
            let icon_1: string;
            export { icon_1 as icon };
            let description_1: string;
            export { description_1 as description };
        }
        namespace SOCIAL {
            let name_7: string;
            export { name_7 as name };
            let icon_2: string;
            export { icon_2 as icon };
            let description_2: string;
            export { description_2 as description };
        }
        namespace STREAKS {
            let name_8: string;
            export { name_8 as name };
            let icon_3: string;
            export { icon_3 as icon };
            let description_3: string;
            export { description_3 as description };
        }
        namespace MILESTONES {
            let name_9: string;
            export { name_9 as name };
            let icon_4: string;
            export { icon_4 as icon };
            let description_4: string;
            export { description_4 as description };
        }
    }
    namespace templates {
        namespace first_trade {
            export let id: string;
            export let title: string;
            let description_5: string;
            export { description_5 as description };
            let icon_5: string;
            export { icon_5 as icon };
            export let category: string;
            export let rarity: string;
            export let points: number;
            export namespace requirements {
                let type: string;
                let target: number;
                let metric: string;
            }
        }
        namespace early_bird {
            let id_1: string;
            export { id_1 as id };
            let title_1: string;
            export { title_1 as title };
            let description_6: string;
            export { description_6 as description };
            let icon_6: string;
            export { icon_6 as icon };
            let category_1: string;
            export { category_1 as category };
            let rarity_1: string;
            export { rarity_1 as rarity };
            let points_1: number;
            export { points_1 as points };
            export namespace requirements_1 {
                let type_1: string;
                export { type_1 as type };
                export let condition: string;
            }
            export { requirements_1 as requirements };
        }
        namespace knowledge_seeker {
            let id_2: string;
            export { id_2 as id };
            let title_2: string;
            export { title_2 as title };
            let description_7: string;
            export { description_7 as description };
            let icon_7: string;
            export { icon_7 as icon };
            let category_2: string;
            export { category_2 as category };
            let rarity_2: string;
            export { rarity_2 as rarity };
            let points_2: number;
            export { points_2 as points };
            export namespace requirements_2 {
                let type_2: string;
                export { type_2 as type };
                let target_1: number;
                export { target_1 as target };
                let metric_1: string;
                export { metric_1 as metric };
            }
            export { requirements_2 as requirements };
        }
        namespace community_leader {
            let id_3: string;
            export { id_3 as id };
            let title_3: string;
            export { title_3 as title };
            let description_8: string;
            export { description_8 as description };
            let icon_8: string;
            export { icon_8 as icon };
            let category_3: string;
            export { category_3 as category };
            let rarity_3: string;
            export { rarity_3 as rarity };
            let points_3: number;
            export { points_3 as points };
            export namespace requirements_3 {
                let type_3: string;
                export { type_3 as type };
                let target_2: number;
                export { target_2 as target };
                let metric_2: string;
                export { metric_2 as metric };
            }
            export { requirements_3 as requirements };
        }
        namespace trading_master {
            let id_4: string;
            export { id_4 as id };
            let title_4: string;
            export { title_4 as title };
            let description_9: string;
            export { description_9 as description };
            let icon_9: string;
            export { icon_9 as icon };
            let category_4: string;
            export { category_4 as category };
            let rarity_4: string;
            export { rarity_4 as rarity };
            let points_4: number;
            export { points_4 as points };
            export namespace requirements_4 {
                let type_4: string;
                export { type_4 as type };
                export let conditions: {
                    metric: string;
                    operator: string;
                    value: number;
                }[];
            }
            export { requirements_4 as requirements };
        }
    }
}
export namespace PROGRESS_CONFIG {
    namespace types {
        let LINEAR: string;
        let CIRCULAR: string;
        let STEPS: string;
    }
    namespace sizes {
        let SMALL: string;
        let MEDIUM: string;
        let LARGE: string;
    }
    namespace colors {
        let PRIMARY: string;
        let SUCCESS: string;
        let WARNING: string;
        let DANGER: string;
    }
    namespace animations {
        let enabled: boolean;
        let duration: number;
        let easing: string;
    }
    namespace defaults {
        let type_5: string;
        export { type_5 as type };
        export let size: string;
        let color_5: string;
        export { color_5 as color };
        export let showPercentage: boolean;
        export let animated: boolean;
    }
    namespace formatters {
        function percentage(value: any, total: any): string;
        function count(value: any, total: any): string;
        function xp(value: any, total: any): string;
        function level(value: any, total: any): string;
        function custom(value: any, total: any, format: any): any;
    }
}
export namespace NOTIFICATION_CONFIG {
    export namespace types_1 {
        namespace XP {
            let name_10: string;
            export { name_10 as name };
            let icon_10: string;
            export { icon_10 as icon };
            let duration_1: number;
            export { duration_1 as duration };
            export let sound: string;
        }
        namespace ACHIEVEMENT {
            let name_11: string;
            export { name_11 as name };
            let icon_11: string;
            export { icon_11 as icon };
            let duration_2: number;
            export { duration_2 as duration };
            let sound_1: string;
            export { sound_1 as sound };
        }
        namespace LEVEL {
            let name_12: string;
            export { name_12 as name };
            let icon_12: string;
            export { icon_12 as icon };
            let duration_3: number;
            export { duration_3 as duration };
            let sound_2: string;
            export { sound_2 as sound };
        }
        namespace BADGE {
            let name_13: string;
            export { name_13 as name };
            let icon_13: string;
            export { icon_13 as icon };
            let duration_4: number;
            export { duration_4 as duration };
            let sound_3: string;
            export { sound_3 as sound };
        }
    }
    export { types_1 as types };
    export namespace positions {
        let TOP_LEFT: string;
        let TOP_RIGHT: string;
        let BOTTOM_LEFT: string;
        let BOTTOM_RIGHT: string;
        let CENTER: string;
    }
    export namespace defaults_1 {
        export let position: string;
        let duration_5: number;
        export { duration_5 as duration };
        export let closable: boolean;
        let sound_4: boolean;
        export { sound_4 as sound };
        export let animation: boolean;
    }
    export { defaults_1 as defaults };
    export namespace limits {
        let maxVisible: number;
        let queueSize: number;
        let minDisplayTime: number;
    }
    export namespace templates_1 {
        namespace xp_gained {
            let title_5: string;
            export { title_5 as title };
            export let message: string;
            let type_6: string;
            export { type_6 as type };
        }
        namespace achievement_unlocked {
            let title_6: string;
            export { title_6 as title };
            let message_1: string;
            export { message_1 as message };
            let type_7: string;
            export { type_7 as type };
        }
        namespace level_up {
            let title_7: string;
            export { title_7 as title };
            let message_2: string;
            export { message_2 as message };
            let type_8: string;
            export { type_8 as type };
        }
        namespace badge_earned {
            let title_8: string;
            export { title_8 as title };
            let message_3: string;
            export { message_3 as message };
            let type_9: string;
            export { type_9 as type };
        }
    }
    export { templates_1 as templates };
}
export namespace XP_CONFIG {
    let baseXP: number;
    let multiplier: number;
    let maxLevel: number;
    namespace sources {
        let TRADE_COMPLETED: number;
        let PROFITABLE_TRADE: number;
        let STREAK_DAY: number;
        let MODULE_COMPLETED: number;
        let QUIZ_PASSED: number;
        let COMMUNITY_HELP: number;
        let FORUM_POST: number;
        let ACHIEVEMENT_UNLOCK: number;
    }
    namespace bonuses {
        let FIRST_DAILY: number;
        let WEEKEND: number;
        let STREAK_MULTIPLIER: number;
        let PERFECT_WEEK: number;
    }
    function levelFormula(level: any): number;
    function getXPForLevel(targetLevel: any): number;
    function getLevelFromXP(xp: any): {
        level: number;
        currentXP: number;
        requiredXP: number;
        totalXP: any;
    };
}
export namespace GAMIFICATION_PRESETS {
    namespace beginner {
        let name_14: string;
        export { name_14 as name };
        export let achievements: string[];
        export let xpMultiplier: number;
        export namespace notifications {
            export let frequency: string;
            let types_2: string[];
            export { types_2 as types };
        }
    }
    namespace intermediate {
        let name_15: string;
        export { name_15 as name };
        let achievements_1: string[];
        export { achievements_1 as achievements };
        let xpMultiplier_1: number;
        export { xpMultiplier_1 as xpMultiplier };
        export namespace notifications_1 {
            let frequency_1: string;
            export { frequency_1 as frequency };
            let types_3: string[];
            export { types_3 as types };
        }
        export { notifications_1 as notifications };
    }
    namespace advanced {
        let name_16: string;
        export { name_16 as name };
        let achievements_2: string[];
        export { achievements_2 as achievements };
        let xpMultiplier_2: number;
        export { xpMultiplier_2 as xpMultiplier };
        export namespace notifications_2 {
            let frequency_2: string;
            export { frequency_2 as frequency };
            let types_4: string[];
            export { types_4 as types };
        }
        export { notifications_2 as notifications };
    }
    namespace competitive {
        let name_17: string;
        export { name_17 as name };
        let achievements_3: string[];
        export { achievements_3 as achievements };
        let xpMultiplier_3: number;
        export { xpMultiplier_3 as xpMultiplier };
        export namespace notifications_3 {
            let frequency_3: string;
            export { frequency_3 as frequency };
            let types_5: string[];
            export { types_5 as types };
            let sound_5: boolean;
            export { sound_5 as sound };
        }
        export { notifications_3 as notifications };
        export let leaderboards: boolean;
        export let streaks: boolean;
    }
}
export namespace VALIDATION_RULES {
    namespace achievement {
        export namespace id_5 {
            export let required: boolean;
            let type_10: string;
            export { type_10 as type };
            export let minLength: number;
        }
        export { id_5 as id };
        export namespace title_9 {
            let required_1: boolean;
            export { required_1 as required };
            let type_11: string;
            export { type_11 as type };
            let minLength_1: number;
            export { minLength_1 as minLength };
        }
        export { title_9 as title };
        export namespace description_10 {
            let required_2: boolean;
            export { required_2 as required };
            let type_12: string;
            export { type_12 as type };
            let minLength_2: number;
            export { minLength_2 as minLength };
        }
        export { description_10 as description };
        export namespace icon_14 {
            let required_3: boolean;
            export { required_3 as required };
            let type_13: string;
            export { type_13 as type };
        }
        export { icon_14 as icon };
        export namespace category_5 {
            let required_4: boolean;
            export { required_4 as required };
            let _enum: string[];
            export { _enum as enum };
        }
        export { category_5 as category };
        export namespace rarity_5 {
            let required_5: boolean;
            export { required_5 as required };
            let _enum_1: string[];
            export { _enum_1 as enum };
        }
        export { rarity_5 as rarity };
        export namespace points_5 {
            let required_6: boolean;
            export { required_6 as required };
            let type_14: string;
            export { type_14 as type };
            export let min: number;
        }
        export { points_5 as points };
    }
    namespace progress {
        export namespace current {
            let required_7: boolean;
            export { required_7 as required };
            let type_15: string;
            export { type_15 as type };
            let min_1: number;
            export { min_1 as min };
        }
        export namespace total {
            let required_8: boolean;
            export { required_8 as required };
            let type_16: string;
            export { type_16 as type };
            let min_2: number;
            export { min_2 as min };
        }
        export namespace type_17 {
            let required_9: boolean;
            export { required_9 as required };
            let _enum_2: string[];
            export { _enum_2 as enum };
        }
        export { type_17 as type };
        export namespace color_6 {
            let required_10: boolean;
            export { required_10 as required };
            let _enum_3: string[];
            export { _enum_3 as enum };
        }
        export { color_6 as color };
    }
    namespace notification {
        export namespace title_10 {
            let required_11: boolean;
            export { required_11 as required };
            let type_18: string;
            export { type_18 as type };
            let minLength_3: number;
            export { minLength_3 as minLength };
        }
        export { title_10 as title };
        export namespace message_4 {
            let required_12: boolean;
            export { required_12 as required };
            let type_19: string;
            export { type_19 as type };
            let minLength_4: number;
            export { minLength_4 as minLength };
        }
        export { message_4 as message };
        export namespace type_20 {
            let required_13: boolean;
            export { required_13 as required };
            let _enum_4: string[];
            export { _enum_4 as enum };
        }
        export { type_20 as type };
        export namespace duration_6 {
            let required_14: boolean;
            export { required_14 as required };
            let type_21: string;
            export { type_21 as type };
            let min_3: number;
            export { min_3 as min };
            export let max: number;
        }
        export { duration_6 as duration };
    }
}
//# sourceMappingURL=reward-config.d.ts.map