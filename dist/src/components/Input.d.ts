export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: 'default' | 'error' | 'success' | 'warning';
    validationMode?: 'live' | 'onBlur' | 'onSubmit';
    sensitive?: boolean;
    showValidation?: boolean;
    validationMessage?: string;
}
export declare const Input: import("react").ForwardRefExoticComponent<InputProps & import("react").RefAttributes<HTMLInputElement>>;
//# sourceMappingURL=Input.d.ts.map