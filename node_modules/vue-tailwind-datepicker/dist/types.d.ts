import { AllowedComponentProps } from 'vue';
import { ComponentCustomProperties } from 'vue';
import { ComponentCustomProps } from 'vue';
import { ComponentInternalInstance } from 'vue';
import { ComponentOptionsBase } from 'vue';
import { ComponentOptionsMixin } from 'vue';
import { ComponentPublicInstance } from 'vue';
import { Dayjs } from 'dayjs';
import { DebuggerEvent } from 'vue';
import { ExtractPropTypes } from 'vue';
import { nextTick } from 'vue';
import { PropType } from 'vue';
import { ShallowUnwrapRef } from 'vue';
import { Slot } from 'vue';
import { VNodeProps } from 'vue';
import { WatchOptions } from 'vue';
import { WatchStopHandle } from 'vue';

declare const _default: {
    new (...args: any[]): {
        $: ComponentInternalInstance;
        $data: {};
        $props: Partial<{
            shortcuts: boolean | (() => {
                label: string;
                atClick: () => Date[];
            }[]);
            i18n: string;
            weekNumber: boolean;
            disabled: boolean;
            disableDate: boolean | ((date: Date) => boolean);
            formatter: {
                date: string;
                month: string;
            };
            separator: string;
            placeholder: string;
            inputClasses: string;
            disableInRange: boolean;
            autoApply: boolean;
            startFrom: Date;
            weekdaysSize: string;
            options: {
                shortcuts: {
                    today: string;
                    yesterday: string;
                    past: (period: number) => string;
                    currentMonth: string;
                    pastMonth: string;
                };
                footer: {
                    apply: string;
                    cancel: string;
                };
            };
            modelValue: string | [Date, Date] | {
                start: string | Date;
                end: string | Date;
            } | {
                startDate: string | Date;
                endDate: string | Date;
            };
        }> & Omit<{
            readonly shortcuts: boolean | (() => {
                label: string;
                atClick: () => Date[];
            }[]);
            readonly i18n: string;
            readonly weekNumber: boolean;
            readonly disabled: boolean;
            readonly disableDate: boolean | ((date: Date) => boolean);
            readonly formatter: {
                date: string;
                month: string;
            };
            readonly separator: string;
            readonly placeholder: string;
            readonly inputClasses: string;
            readonly disableInRange: boolean;
            readonly autoApply: boolean;
            readonly startFrom: Date;
            readonly weekdaysSize: string;
            readonly options: {
                shortcuts: {
                    today: string;
                    yesterday: string;
                    past: (period: number) => string;
                    currentMonth: string;
                    pastMonth: string;
                };
                footer: {
                    apply: string;
                    cancel: string;
                };
            };
            readonly modelValue: string | [Date, Date] | {
                start: string | Date;
                end: string | Date;
            } | {
                startDate: string | Date;
                endDate: string | Date;
            };
            readonly asSingle?: boolean | undefined;
            readonly noInput?: boolean | undefined;
            readonly overlay?: boolean | undefined;
            readonly useRange?: boolean | undefined;
            "onUpdate:modelValue"?: ((value: string | string[] | Dayjs[] | Record<string, string>) => any) | undefined;
            onSelectMonth?: ((value: Dayjs) => any) | undefined;
            onSelectYear?: ((value: Dayjs) => any) | undefined;
            onSelectRightMonth?: ((value: Dayjs) => any) | undefined;
            onSelectRightYear?: ((value: Dayjs) => any) | undefined;
            onClickPrev?: ((value: Dayjs) => any) | undefined;
            onClickNext?: ((value: Dayjs) => any) | undefined;
            onClickRightPrev?: ((value: Dayjs) => any) | undefined;
            onClickRightNext?: ((value: Dayjs) => any) | undefined;
        } & VNodeProps & AllowedComponentProps & ComponentCustomProps & Readonly<ExtractPropTypes<{
            shortcuts: {
                type: PropType<boolean | (() => {
                    label: string;
                    atClick: () => Date[];
                }[])>;
                default: boolean;
            };
            asSingle: {
                type: PropType<boolean>;
            };
            i18n: {
                type: PropType<string>;
                default: string;
            };
            weekNumber: {
                type: PropType<boolean>;
                default: boolean;
            };
            disabled: {
                type: PropType<boolean>;
                default: boolean;
            };
            disableDate: {
                type: PropType<boolean | ((date: Date) => boolean)>;
                default: boolean;
            };
            formatter: {
                type: PropType<{
                    date: string;
                    month: string;
                }>;
                default: () => {
                    date: string;
                    month: string;
                };
            };
            separator: {
                type: PropType<string>;
                default: string;
            };
            noInput: {
                type: PropType<boolean>;
            };
            overlay: {
                type: PropType<boolean>;
            };
            useRange: {
                type: PropType<boolean>;
            };
            placeholder: {
                type: PropType<string>;
                default: string;
            };
            inputClasses: {
                type: PropType<string>;
                default: string;
            };
            disableInRange: {
                type: PropType<boolean>;
                default: boolean;
            };
            autoApply: {
                type: PropType<boolean>;
                default: boolean;
            };
            startFrom: {
                type: PropType<Date>;
                default: () => Date;
            };
            weekdaysSize: {
                type: PropType<string>;
                default: string;
            };
            options: {
                type: PropType<{
                    shortcuts: {
                        today: string;
                        yesterday: string;
                        past: (period: number) => string;
                        currentMonth: string;
                        pastMonth: string;
                    };
                    footer: {
                        apply: string;
                        cancel: string;
                    };
                }>;
                default: () => {
                    shortcuts: {
                        today: string;
                        yesterday: string;
                        past: (period: any) => string;
                        currentMonth: string;
                        pastMonth: string;
                    };
                    footer: {
                        apply: string;
                        cancel: string;
                    };
                };
            };
            modelValue: {
                type: PropType<string | [Date, Date] | {
                    start: string | Date;
                    end: string | Date;
                } | {
                    startDate: string | Date;
                    endDate: string | Date;
                }>;
                required: true;
                default: () => Date[];
            };
        }>> & {
            "onUpdate:modelValue"?: ((value: string | string[] | Dayjs[] | Record<string, string>) => any) | undefined;
            onSelectMonth?: ((value: Dayjs) => any) | undefined;
            onSelectYear?: ((value: Dayjs) => any) | undefined;
            onSelectRightMonth?: ((value: Dayjs) => any) | undefined;
            onSelectRightYear?: ((value: Dayjs) => any) | undefined;
            onClickPrev?: ((value: Dayjs) => any) | undefined;
            onClickNext?: ((value: Dayjs) => any) | undefined;
            onClickRightPrev?: ((value: Dayjs) => any) | undefined;
            onClickRightNext?: ((value: Dayjs) => any) | undefined;
        }, "shortcuts" | "i18n" | "weekNumber" | "disabled" | "disableDate" | "formatter" | "separator" | "placeholder" | "inputClasses" | "disableInRange" | "autoApply" | "startFrom" | "weekdaysSize" | "options" | "modelValue">;
        $attrs: {
            [x: string]: unknown;
        };
        $refs: {
            [x: string]: unknown;
        };
        $slots: Readonly<{
            [name: string]: Slot<any> | undefined;
        }>;
        $root: ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}>, {}, {}> | null;
        $parent: ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}>, {}, {}> | null;
        $emit: ((event: "update:modelValue", value: string | string[] | Dayjs[] | Record<string, string>) => void) & ((event: "selectMonth", value: Dayjs) => void) & ((event: "selectYear", value: Dayjs) => void) & ((event: "selectRightMonth", value: Dayjs) => void) & ((event: "selectRightYear", value: Dayjs) => void) & ((event: "clickPrev", value: Dayjs) => void) & ((event: "clickNext", value: Dayjs) => void) & ((event: "clickRightPrev", value: Dayjs) => void) & ((event: "clickRightNext", value: Dayjs) => void);
        $el: any;
        $options: ComponentOptionsBase<Readonly<ExtractPropTypes<{
            shortcuts: {
                type: PropType<boolean | (() => {
                    label: string;
                    atClick: () => Date[];
                }[])>;
                default: boolean;
            };
            asSingle: {
                type: PropType<boolean>;
            };
            i18n: {
                type: PropType<string>;
                default: string;
            };
            weekNumber: {
                type: PropType<boolean>;
                default: boolean;
            };
            disabled: {
                type: PropType<boolean>;
                default: boolean;
            };
            disableDate: {
                type: PropType<boolean | ((date: Date) => boolean)>;
                default: boolean;
            };
            formatter: {
                type: PropType<{
                    date: string;
                    month: string;
                }>;
                default: () => {
                    date: string;
                    month: string;
                };
            };
            separator: {
                type: PropType<string>;
                default: string;
            };
            noInput: {
                type: PropType<boolean>;
            };
            overlay: {
                type: PropType<boolean>;
            };
            useRange: {
                type: PropType<boolean>;
            };
            placeholder: {
                type: PropType<string>;
                default: string;
            };
            inputClasses: {
                type: PropType<string>;
                default: string;
            };
            disableInRange: {
                type: PropType<boolean>;
                default: boolean;
            };
            autoApply: {
                type: PropType<boolean>;
                default: boolean;
            };
            startFrom: {
                type: PropType<Date>;
                default: () => Date;
            };
            weekdaysSize: {
                type: PropType<string>;
                default: string;
            };
            options: {
                type: PropType<{
                    shortcuts: {
                        today: string;
                        yesterday: string;
                        past: (period: number) => string;
                        currentMonth: string;
                        pastMonth: string;
                    };
                    footer: {
                        apply: string;
                        cancel: string;
                    };
                }>;
                default: () => {
                    shortcuts: {
                        today: string;
                        yesterday: string;
                        past: (period: any) => string;
                        currentMonth: string;
                        pastMonth: string;
                    };
                    footer: {
                        apply: string;
                        cancel: string;
                    };
                };
            };
            modelValue: {
                type: PropType<string | [Date, Date] | {
                    start: string | Date;
                    end: string | Date;
                } | {
                    startDate: string | Date;
                    endDate: string | Date;
                }>;
                required: true;
                default: () => Date[];
            };
        }>> & {
            "onUpdate:modelValue"?: ((value: string | string[] | Dayjs[] | Record<string, string>) => any) | undefined;
            onSelectMonth?: ((value: Dayjs) => any) | undefined;
            onSelectYear?: ((value: Dayjs) => any) | undefined;
            onSelectRightMonth?: ((value: Dayjs) => any) | undefined;
            onSelectRightYear?: ((value: Dayjs) => any) | undefined;
            onClickPrev?: ((value: Dayjs) => any) | undefined;
            onClickNext?: ((value: Dayjs) => any) | undefined;
            onClickRightPrev?: ((value: Dayjs) => any) | undefined;
            onClickRightNext?: ((value: Dayjs) => any) | undefined;
        }, {
            clearPicker: () => void;
        }, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
            "update:modelValue": (value: string | string[] | Dayjs[] | Record<string, string>) => void;
            selectMonth: (value: Dayjs) => void;
            selectYear: (value: Dayjs) => void;
            selectRightMonth: (value: Dayjs) => void;
            selectRightYear: (value: Dayjs) => void;
            clickPrev: (value: Dayjs) => void;
            clickNext: (value: Dayjs) => void;
            clickRightPrev: (value: Dayjs) => void;
            clickRightNext: (value: Dayjs) => void;
        }, string, {
            shortcuts: boolean | (() => {
                label: string;
                atClick: () => Date[];
            }[]);
            i18n: string;
            weekNumber: boolean;
            disabled: boolean;
            disableDate: boolean | ((date: Date) => boolean);
            formatter: {
                date: string;
                month: string;
            };
            separator: string;
            placeholder: string;
            inputClasses: string;
            disableInRange: boolean;
            autoApply: boolean;
            startFrom: Date;
            weekdaysSize: string;
            options: {
                shortcuts: {
                    today: string;
                    yesterday: string;
                    past: (period: number) => string;
                    currentMonth: string;
                    pastMonth: string;
                };
                footer: {
                    apply: string;
                    cancel: string;
                };
            };
            modelValue: string | [Date, Date] | {
                start: string | Date;
                end: string | Date;
            } | {
                startDate: string | Date;
                endDate: string | Date;
            };
        }, {}, string, {}> & {
            beforeCreate?: ((() => void) | (() => void)[]) | undefined;
            created?: ((() => void) | (() => void)[]) | undefined;
            beforeMount?: ((() => void) | (() => void)[]) | undefined;
            mounted?: ((() => void) | (() => void)[]) | undefined;
            beforeUpdate?: ((() => void) | (() => void)[]) | undefined;
            updated?: ((() => void) | (() => void)[]) | undefined;
            activated?: ((() => void) | (() => void)[]) | undefined;
            deactivated?: ((() => void) | (() => void)[]) | undefined;
            beforeDestroy?: ((() => void) | (() => void)[]) | undefined;
            beforeUnmount?: ((() => void) | (() => void)[]) | undefined;
            destroyed?: ((() => void) | (() => void)[]) | undefined;
            unmounted?: ((() => void) | (() => void)[]) | undefined;
            renderTracked?: (((e: DebuggerEvent) => void) | ((e: DebuggerEvent) => void)[]) | undefined;
            renderTriggered?: (((e: DebuggerEvent) => void) | ((e: DebuggerEvent) => void)[]) | undefined;
            errorCaptured?: (((err: unknown, instance: ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}>, {}, {}> | null, info: string) => boolean | void) | ((err: unknown, instance: ComponentPublicInstance<{}, {}, {}, {}, {}, {}, {}, {}, false, ComponentOptionsBase<any, any, any, any, any, any, any, any, any, {}, {}, string, {}>, {}, {}> | null, info: string) => boolean | void)[]) | undefined;
        };
        $forceUpdate: () => void;
        $nextTick: typeof nextTick;
        $watch<T extends string | ((...args: any) => any)>(source: T, cb: T extends (...args: any) => infer R ? (args_0: R, args_1: R) => any : (...args: any) => any, options?: WatchOptions<boolean> | undefined): WatchStopHandle;
    } & Readonly<ExtractPropTypes<{
        shortcuts: {
            type: PropType<boolean | (() => {
                label: string;
                atClick: () => Date[];
            }[])>;
            default: boolean;
        };
        asSingle: {
            type: PropType<boolean>;
        };
        i18n: {
            type: PropType<string>;
            default: string;
        };
        weekNumber: {
            type: PropType<boolean>;
            default: boolean;
        };
        disabled: {
            type: PropType<boolean>;
            default: boolean;
        };
        disableDate: {
            type: PropType<boolean | ((date: Date) => boolean)>;
            default: boolean;
        };
        formatter: {
            type: PropType<{
                date: string;
                month: string;
            }>;
            default: () => {
                date: string;
                month: string;
            };
        };
        separator: {
            type: PropType<string>;
            default: string;
        };
        noInput: {
            type: PropType<boolean>;
        };
        overlay: {
            type: PropType<boolean>;
        };
        useRange: {
            type: PropType<boolean>;
        };
        placeholder: {
            type: PropType<string>;
            default: string;
        };
        inputClasses: {
            type: PropType<string>;
            default: string;
        };
        disableInRange: {
            type: PropType<boolean>;
            default: boolean;
        };
        autoApply: {
            type: PropType<boolean>;
            default: boolean;
        };
        startFrom: {
            type: PropType<Date>;
            default: () => Date;
        };
        weekdaysSize: {
            type: PropType<string>;
            default: string;
        };
        options: {
            type: PropType<{
                shortcuts: {
                    today: string;
                    yesterday: string;
                    past: (period: number) => string;
                    currentMonth: string;
                    pastMonth: string;
                };
                footer: {
                    apply: string;
                    cancel: string;
                };
            }>;
            default: () => {
                shortcuts: {
                    today: string;
                    yesterday: string;
                    past: (period: any) => string;
                    currentMonth: string;
                    pastMonth: string;
                };
                footer: {
                    apply: string;
                    cancel: string;
                };
            };
        };
        modelValue: {
            type: PropType<string | [Date, Date] | {
                start: string | Date;
                end: string | Date;
            } | {
                startDate: string | Date;
                endDate: string | Date;
            }>;
            required: true;
            default: () => Date[];
        };
    }>> & {
        "onUpdate:modelValue"?: ((value: string | string[] | Dayjs[] | Record<string, string>) => any) | undefined;
        onSelectMonth?: ((value: Dayjs) => any) | undefined;
        onSelectYear?: ((value: Dayjs) => any) | undefined;
        onSelectRightMonth?: ((value: Dayjs) => any) | undefined;
        onSelectRightYear?: ((value: Dayjs) => any) | undefined;
        onClickPrev?: ((value: Dayjs) => any) | undefined;
        onClickNext?: ((value: Dayjs) => any) | undefined;
        onClickRightPrev?: ((value: Dayjs) => any) | undefined;
        onClickRightNext?: ((value: Dayjs) => any) | undefined;
    } & ShallowUnwrapRef<{
        clearPicker: () => void;
    }> & {} & ComponentCustomProperties & {};
    __isFragment?: undefined;
    __isTeleport?: undefined;
    __isSuspense?: undefined;
} & ComponentOptionsBase<Readonly<ExtractPropTypes<{
    shortcuts: {
        type: PropType<boolean | (() => {
            label: string;
            atClick: () => Date[];
        }[])>;
        default: boolean;
    };
    asSingle: {
        type: PropType<boolean>;
    };
    i18n: {
        type: PropType<string>;
        default: string;
    };
    weekNumber: {
        type: PropType<boolean>;
        default: boolean;
    };
    disabled: {
        type: PropType<boolean>;
        default: boolean;
    };
    disableDate: {
        type: PropType<boolean | ((date: Date) => boolean)>;
        default: boolean;
    };
    formatter: {
        type: PropType<{
            date: string;
            month: string;
        }>;
        default: () => {
            date: string;
            month: string;
        };
    };
    separator: {
        type: PropType<string>;
        default: string;
    };
    noInput: {
        type: PropType<boolean>;
    };
    overlay: {
        type: PropType<boolean>;
    };
    useRange: {
        type: PropType<boolean>;
    };
    placeholder: {
        type: PropType<string>;
        default: string;
    };
    inputClasses: {
        type: PropType<string>;
        default: string;
    };
    disableInRange: {
        type: PropType<boolean>;
        default: boolean;
    };
    autoApply: {
        type: PropType<boolean>;
        default: boolean;
    };
    startFrom: {
        type: PropType<Date>;
        default: () => Date;
    };
    weekdaysSize: {
        type: PropType<string>;
        default: string;
    };
    options: {
        type: PropType<{
            shortcuts: {
                today: string;
                yesterday: string;
                past: (period: number) => string;
                currentMonth: string;
                pastMonth: string;
            };
            footer: {
                apply: string;
                cancel: string;
            };
        }>;
        default: () => {
            shortcuts: {
                today: string;
                yesterday: string;
                past: (period: any) => string;
                currentMonth: string;
                pastMonth: string;
            };
            footer: {
                apply: string;
                cancel: string;
            };
        };
    };
    modelValue: {
        type: PropType<string | [Date, Date] | {
            start: string | Date;
            end: string | Date;
        } | {
            startDate: string | Date;
            endDate: string | Date;
        }>;
        required: true;
        default: () => Date[];
    };
}>> & {
    "onUpdate:modelValue"?: ((value: string | string[] | Dayjs[] | Record<string, string>) => any) | undefined;
    onSelectMonth?: ((value: Dayjs) => any) | undefined;
    onSelectYear?: ((value: Dayjs) => any) | undefined;
    onSelectRightMonth?: ((value: Dayjs) => any) | undefined;
    onSelectRightYear?: ((value: Dayjs) => any) | undefined;
    onClickPrev?: ((value: Dayjs) => any) | undefined;
    onClickNext?: ((value: Dayjs) => any) | undefined;
    onClickRightPrev?: ((value: Dayjs) => any) | undefined;
    onClickRightNext?: ((value: Dayjs) => any) | undefined;
}, {
    clearPicker: () => void;
}, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
    "update:modelValue": (value: string | string[] | Dayjs[] | Record<string, string>) => void;
    selectMonth: (value: Dayjs) => void;
    selectYear: (value: Dayjs) => void;
    selectRightMonth: (value: Dayjs) => void;
    selectRightYear: (value: Dayjs) => void;
    clickPrev: (value: Dayjs) => void;
    clickNext: (value: Dayjs) => void;
    clickRightPrev: (value: Dayjs) => void;
    clickRightNext: (value: Dayjs) => void;
}, string, {
    shortcuts: boolean | (() => {
        label: string;
        atClick: () => Date[];
    }[]);
    i18n: string;
    weekNumber: boolean;
    disabled: boolean;
    disableDate: boolean | ((date: Date) => boolean);
    formatter: {
        date: string;
        month: string;
    };
    separator: string;
    placeholder: string;
    inputClasses: string;
    disableInRange: boolean;
    autoApply: boolean;
    startFrom: Date;
    weekdaysSize: string;
    options: {
        shortcuts: {
            today: string;
            yesterday: string;
            past: (period: number) => string;
            currentMonth: string;
            pastMonth: string;
        };
        footer: {
            apply: string;
            cancel: string;
        };
    };
    modelValue: string | [Date, Date] | {
        start: string | Date;
        end: string | Date;
    } | {
        startDate: string | Date;
        endDate: string | Date;
    };
}, {}, string, {}> & VNodeProps & AllowedComponentProps & ComponentCustomProps & (new () => {
    $slots: {
        default?(_: {
            value: string;
            placeholder: string;
            clear: () => void;
        }): any;
        inputIcon?(_: {
            value: string;
        }): any;
    };
});
export default _default;

export { }
