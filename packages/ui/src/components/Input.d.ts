export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: 'default' | 'error' | 'success' | 'warning';
    validationMode?: 'live' | 'onBlur' | 'onSubmit';
    sensitive?: boolean;
    showValidation?: boolean;
    validationMessage?: string;
    ref?: React.Ref<HTMLInputElement>;
}
export declare function Input({ variant, validationMode, sensitive, showValidation, validationMessage, className, type, ref, ...props }: InputProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Input.d.ts.map