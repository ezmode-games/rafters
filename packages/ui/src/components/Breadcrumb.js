import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Navigation breadcrumb component for wayfinding and location context
 *
 * @registry-name breadcrumb
 * @registry-version 0.1.0
 * @registry-status published
 * @registry-path components/ui/Breadcrumb.tsx
 * @registry-type registry:component
 *
 * @cognitive-load 2/10 - Optimized for peripheral navigation aid with minimal cognitive overhead
 * @attention-economics Tertiary support: Never competes with primary content, provides spatial context only
 * @trust-building Low trust routine navigation with predictable, reliable wayfinding patterns
 * @accessibility Complete ARIA support with aria-current="page", aria-hidden separators, and keyboard navigation
 * @semantic-meaning Wayfinding system with spatial context and navigation hierarchy indication
 *
 * @usage-patterns
 * DO: Provide spatial context and navigation hierarchy
 * DO: Use clear current page indication with aria-current="page"
 * DO: Implement truncation strategies for long paths (Miller's Law)
 * DO: Configure separators with proper accessibility attributes
 * NEVER: Use for primary actions, complex information, or critical alerts
 *
 * @design-guides
 * - Wayfinding Intelligence: https://rafters.realhandy.tech/docs/llm/wayfinding-intelligence
 * - Attention Economics: https://rafters.realhandy.tech/docs/llm/attention-economics
 * - Navigation Integration: https://rafters.realhandy.tech/docs/llm/navigation-integration
 *
 * @dependencies lucide-react
 *
 * @example
 * ```tsx
 * // Basic breadcrumb with navigation
 * <Breadcrumb separator="chevron-right">
 *   <BreadcrumbItem href="/">Home</BreadcrumbItem>
 *   <BreadcrumbItem href="/products">Products</BreadcrumbItem>
 *   <BreadcrumbItem current>Product Detail</BreadcrumbItem>
 * </Breadcrumb>
 *
 * // Breadcrumb with truncation for long paths
 * <Breadcrumb maxItems={3} collapseFrom="middle">
 *   // Long navigation path automatically truncated
 * </Breadcrumb>
 * ```
 */
import { ChevronRight, Home, MoreHorizontal } from 'lucide-react';
import { createContext, useCallback, useContext, useState } from 'react';
import { cn } from '../lib/utils';
// Separator intelligence with cognitive load ratings
const _SEPARATOR_INTELLIGENCE = {
    'chevron-right': {
        cognitiveLoad: 2,
        contexts: ['general', 'admin', 'dashboard'],
        trustLevel: 'high',
        accessibility: 'excellent',
    },
    slash: {
        cognitiveLoad: 2,
        contexts: ['web', 'file-system', 'url-path'],
        trustLevel: 'high',
        accessibility: 'excellent',
    },
    angle: {
        cognitiveLoad: 2,
        contexts: ['command-line', 'technical', 'developer'],
        trustLevel: 'high',
        accessibility: 'excellent',
    },
    arrow: {
        cognitiveLoad: 3,
        contexts: ['editorial', 'storytelling', 'process-flow'],
        trustLevel: 'medium',
        accessibility: 'good',
    },
    pipe: {
        cognitiveLoad: 3,
        contexts: ['structured-data', 'admin', 'technical'],
        trustLevel: 'medium',
        accessibility: 'excellent',
    },
    dot: {
        cognitiveLoad: 2,
        contexts: ['minimal', 'mobile', 'compact'],
        trustLevel: 'medium',
        accessibility: 'excellent',
    },
};
// Safe character separators with Unicode support
const SAFE_SEPARATORS = {
    slash: '/',
    angle: '>',
    arrow: '→', // U+2192
    pipe: '|',
    dot: '·', // U+00B7
};
// Context for sharing separator configuration
const BreadcrumbContext = createContext({
    separator: 'chevron-right',
    separatorProps: undefined,
});
export function Breadcrumb({ maxItems = 5, truncationMode = 'smart', separator = 'chevron-right', separatorProps, showHome = true, homeIcon: HomeIcon = Home, homeLabel = 'Home', size = 'md', variant = 'default', expandable = true, responsive = true, className, children, ref, ...props }) {
    const [_expanded, _setExpanded] = useState(false);
    const _renderSeparator = useCallback(() => {
        if (typeof separator === 'string') {
            const separatorMap = {
                'chevron-right': _jsx(ChevronRight, { className: "w-4 h-4", "aria-hidden": "true" }),
                slash: SAFE_SEPARATORS.slash,
                angle: SAFE_SEPARATORS.angle,
                arrow: SAFE_SEPARATORS.arrow,
                pipe: SAFE_SEPARATORS.pipe,
                dot: SAFE_SEPARATORS.dot,
            };
            const separatorContent = separatorMap[separator];
            if (typeof separatorContent === 'string') {
                return (_jsx("span", { "aria-hidden": "true", className: "select-none text-muted-foreground", children: separatorContent }));
            }
            return separatorContent;
        }
        // Custom Lucide icon
        const CustomIcon = separator;
        return (_jsx(CustomIcon, { "aria-hidden": true, className: "w-4 h-4 text-muted-foreground", ...separatorProps }));
    }, [separator, separatorProps]);
    return (_jsx(BreadcrumbContext.Provider, { value: { separator, separatorProps }, children: _jsx("nav", { ref: ref, "aria-label": "Breadcrumb navigation", "aria-describedby": props['aria-describedby'], className: cn(
            // Base styles with semantic tokens
            'flex items-center text-sm text-muted-foreground', 
            // Size variants
            {
                'text-xs': size === 'sm',
                'text-sm': size === 'md',
                'text-base': size === 'lg',
            }, 
            // Variant styles
            {
                'opacity-100': variant === 'default',
                'opacity-75': variant === 'minimal',
            }, className), ...props, children: _jsx("ol", { className: "flex items-center space-x-2", children: children }) }) }));
}
export function BreadcrumbItem({ children, className, ref, ...props }) {
    return (_jsx("li", { ref: ref, className: cn('flex items-center', className), ...props, children: children }));
}
export function BreadcrumbLink({ children, className, ref, ...props }) {
    return (_jsx("a", { ref: ref, className: cn(
        // Base interactive styles with semantic tokens
        'text-muted-foreground hover:text-foreground transition-colors', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2', 
        // Enhanced touch targets (WCAG AAA)
        'min-h-11 min-w-11 flex items-center justify-center rounded px-2 py-1', 'touch-manipulation', className), ...props, children: children }));
}
export function BreadcrumbPage({ children, className, ref, ...props }) {
    return (_jsx("span", { ref: ref, "aria-current": "page", className: cn('text-foreground font-medium', className), ...props, children: children }));
}
export function BreadcrumbSeparator({ children, className, ref, ...props }) {
    const { separator, separatorProps } = useContext(BreadcrumbContext);
    const renderSeparatorContent = () => {
        if (children)
            return children;
        if (typeof separator === 'string') {
            const separatorMap = {
                'chevron-right': _jsx(ChevronRight, { className: "w-4 h-4", "aria-hidden": "true" }),
                slash: SAFE_SEPARATORS.slash,
                angle: SAFE_SEPARATORS.angle,
                arrow: SAFE_SEPARATORS.arrow,
                pipe: SAFE_SEPARATORS.pipe,
                dot: SAFE_SEPARATORS.dot,
            };
            const separatorContent = separatorMap[separator];
            if (typeof separatorContent === 'string') {
                return (_jsx("span", { className: cn('text-muted-foreground', separatorProps?.className), "aria-hidden": "true", children: separatorContent }));
            }
            return separatorContent;
        }
        // Custom separator component
        const CustomIcon = separator;
        return (_jsx(CustomIcon, { "aria-hidden": true, className: "w-4 h-4 text-muted-foreground", ...separatorProps }));
    };
    return (_jsx("span", { ref: ref, "aria-hidden": "true", className: cn('text-muted-foreground mx-2 select-none', className), ...props, children: renderSeparatorContent() }));
}
export function BreadcrumbEllipsis({ className, onClick, ref, ...props }) {
    return (_jsx("button", { ref: ref, type: "button", className: cn('flex items-center justify-center w-9 h-9 rounded-md', 'text-muted-foreground hover:text-foreground', 'hover:bg-accent transition-colors', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', className), "aria-label": "Show more navigation levels", onClick: onClick, ...props, children: _jsx(MoreHorizontal, { className: "w-4 h-4", "aria-hidden": "true" }) }));
}
//# sourceMappingURL=Breadcrumb.js.map