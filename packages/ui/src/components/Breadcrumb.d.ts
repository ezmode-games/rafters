export type BreadcrumbSeparator = 'chevron-right' | 'slash' | 'angle' | 'arrow' | 'pipe' | 'dot' | React.ComponentType<{
    className?: string;
    'aria-hidden': true;
}>;
export type TruncationMode = 'smart' | 'end' | 'start';
export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
    maxItems?: number;
    truncationMode?: TruncationMode;
    separator?: BreadcrumbSeparator;
    separatorProps?: {
        className?: string;
        size?: number;
    };
    showHome?: boolean;
    homeIcon?: React.ComponentType<{
        className?: string;
    }>;
    homeLabel?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'minimal';
    expandable?: boolean;
    responsive?: boolean;
    'aria-describedby'?: string;
    ref?: React.Ref<HTMLElement>;
}
export interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLLIElement> {
    children: React.ReactNode;
    href?: string;
    active?: boolean;
    truncated?: boolean;
    ref?: React.Ref<HTMLLIElement>;
}
export interface BreadcrumbLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    children: React.ReactNode;
    ref?: React.Ref<HTMLAnchorElement>;
}
export interface BreadcrumbPageProps extends React.HTMLAttributes<HTMLSpanElement> {
    children: React.ReactNode;
    ref?: React.Ref<HTMLSpanElement>;
}
export declare function Breadcrumb({ maxItems, truncationMode, separator, separatorProps, showHome, homeIcon: HomeIcon, homeLabel, size, variant, expandable, responsive, className, children, ref, ...props }: BreadcrumbProps): import("react/jsx-runtime").JSX.Element;
export declare function BreadcrumbItem({ children, className, ref, ...props }: BreadcrumbItemProps): import("react/jsx-runtime").JSX.Element;
export declare function BreadcrumbLink({ children, className, ref, ...props }: BreadcrumbLinkProps): import("react/jsx-runtime").JSX.Element;
export declare function BreadcrumbPage({ children, className, ref, ...props }: BreadcrumbPageProps): import("react/jsx-runtime").JSX.Element;
export interface BreadcrumbSeparatorProps extends React.HTMLAttributes<HTMLSpanElement> {
    ref?: React.Ref<HTMLSpanElement>;
}
export declare function BreadcrumbSeparator({ children, className, ref, ...props }: BreadcrumbSeparatorProps): import("react/jsx-runtime").JSX.Element;
export interface BreadcrumbEllipsisProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    ref?: React.Ref<HTMLButtonElement>;
}
export declare function BreadcrumbEllipsis({ className, onClick, ref, ...props }: BreadcrumbEllipsisProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=Breadcrumb.d.ts.map