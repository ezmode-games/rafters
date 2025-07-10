export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'destructive' | 'success' | 'warning' | 'info' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'full';
    asChild?: boolean;
    loading?: boolean;
    destructiveConfirm?: boolean;
}
export declare const Button: import("react").ForwardRefExoticComponent<ButtonProps & import("react").RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=Button.d.ts.map