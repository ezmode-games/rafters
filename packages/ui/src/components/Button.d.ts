export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'full';
    asChild?: boolean;
    loading?: boolean;
    destructiveConfirm?: boolean;
    ref?: React.Ref<HTMLButtonElement>;
}
export declare function Button({ variant, size, asChild, className, disabled, loading, destructiveConfirm, children, ref, ...props }: ButtonProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Button.d.ts.map