import * as LabelPrimitive from '@radix-ui/react-label';
export interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
    required?: boolean;
    importance?: 'critical' | 'standard' | 'optional';
    context?: 'form' | 'descriptive' | 'action';
    validationState?: 'error' | 'warning' | 'success' | 'default';
    helpText?: string;
    semantic?: boolean;
}
export declare const Label: import("react").ForwardRefExoticComponent<LabelProps & import("react").RefAttributes<HTMLLabelElement>>;
//# sourceMappingURL=Label.d.ts.map