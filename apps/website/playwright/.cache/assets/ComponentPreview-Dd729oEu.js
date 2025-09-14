import { g as getDefaultExportFromCjs, r as reactExports, R as React } from './index-AEofqfxH.js';

var jsxRuntime$2 = {exports: {}};

var reactJsxRuntime_production = {};

/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_production;

function requireReactJsxRuntime_production () {
	if (hasRequiredReactJsxRuntime_production) return reactJsxRuntime_production;
	hasRequiredReactJsxRuntime_production = 1;
	"use strict";
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
	  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	function jsxProd(type, config, maybeKey) {
	  var key = null;
	  void 0 !== maybeKey && (key = "" + maybeKey);
	  void 0 !== config.key && (key = "" + config.key);
	  if ("key" in config) {
	    maybeKey = {};
	    for (var propName in config)
	      "key" !== propName && (maybeKey[propName] = config[propName]);
	  } else maybeKey = config;
	  config = maybeKey.ref;
	  return {
	    $$typeof: REACT_ELEMENT_TYPE,
	    type: type,
	    key: key,
	    ref: void 0 !== config ? config : null,
	    props: maybeKey
	  };
	}
	reactJsxRuntime_production.Fragment = REACT_FRAGMENT_TYPE;
	reactJsxRuntime_production.jsx = jsxProd;
	reactJsxRuntime_production.jsxs = jsxProd;
	return reactJsxRuntime_production;
}

var jsxRuntime$1 = jsxRuntime$2.exports;

var hasRequiredJsxRuntime;

function requireJsxRuntime () {
	if (hasRequiredJsxRuntime) return jsxRuntime$2.exports;
	hasRequiredJsxRuntime = 1;
	"use strict";
	if (true) {
	  jsxRuntime$2.exports = requireReactJsxRuntime_production();
	} else {
	  module.exports = require("./cjs/react-jsx-runtime.development.js");
	}
	return jsxRuntime$2.exports;
}

var jsxRuntimeExports = requireJsxRuntime();
const jsxRuntime = /*@__PURE__*/getDefaultExportFromCjs(jsxRuntimeExports);

function ComponentPreview({
  component,
  variant = "default",
  props = "{}",
  showIntelligence = false,
  height = "200px",
  className = ""
}) {
  const [componentData, setComponentData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const containerRef = reactExports.useRef(null);
  const shadowRootRef = reactExports.useRef(null);
  const previewId = reactExports.useId();
  const parsedProps = React.useMemo(() => {
    try {
      return JSON.parse(props || "{}");
    } catch (e) {
      console.warn(`Failed to parse props for ${component}:`, e);
      return {};
    }
  }, [props, component]);
  reactExports.useEffect(() => {
    let mounted = true;
    const loadComponentData = async () => {
      try {
        setLoading(true);
        setError(null);
        if (false) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        const response = await fetch(`/registry/components/${component}.json`);
        if (!response.ok) {
          throw new Error(`Component ${component} not found in registry`);
        }
        const data = await response.json();
        if (mounted) {
          setComponentData(data);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setLoading(false);
        }
      }
    };
    loadComponentData();
    return () => {
      mounted = false;
    };
  }, [component]);
  reactExports.useEffect(() => {
    if (!componentData || loading || !containerRef.current) return;
    const container = containerRef.current;
    if (shadowRootRef.current) {
      shadowRootRef.current.innerHTML = "";
    } else {
      shadowRootRef.current = container.attachShadow({ mode: "open" });
    }
    const shadowRoot = shadowRootRef.current;
    shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          height: 100%;
        }
        
        .component-root {
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          font-family: system-ui, sans-serif;
          pointer-events: auto;
        }
        
        /* Minimal component styles for demo */
        .rafters-button {
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          border: 1px solid transparent;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        
        .rafters-button.primary {
          background-color: #3b82f6;
          color: white;
        }
        
        .rafters-button.primary:hover {
          background-color: #2563eb;
        }
        
        .rafters-button.secondary {
          background-color: #f3f4f6;
          color: #374151;
          border-color: #d1d5db;
        }
        
        .rafters-button.destructive {
          background-color: #ef4444;
          color: white;
        }
        
        .rafters-container {
          max-width: 100%;
          margin: 0 auto;
          padding: 1rem;
          border: 1px dashed #e5e7eb;
          border-radius: 0.375rem;
        }
        
        .rafters-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        }
        
        .rafters-grid-item {
          padding: 1rem;
          background-color: #f9fafb;
          border-radius: 0.375rem;
          border: 1px solid #e5e7eb;
        }
        
        .component-placeholder {
          text-align: center;
          padding: 2rem;
          border: 1px dashed #d1d5db;
          border-radius: 0.375rem;
        }
      </style>
      
      <div class="component-root">
        <div id="component-mount"></div>
      </div>
    `;
    const mountPoint = shadowRoot.getElementById("component-mount");
    if (mountPoint) {
      const html = generateComponentHTML(componentData, variant, parsedProps);
      mountPoint.innerHTML = html;
      const buttons = mountPoint.querySelectorAll(".rafters-button");
      for (const button of buttons) {
        button.addEventListener("click", () => {
          button.setAttribute("data-clicked", "true");
          console.log(`${component} clicked with variant: ${variant}`);
        });
      }
    }
  }, [componentData, loading, component, variant, parsedProps]);
  const generateComponentHTML = (data, variantName, componentProps) => {
    const { name } = data;
    const cognitive = data.meta?.rafters?.intelligence?.cognitiveLoad || 0;
    switch (name) {
      case "button":
        return `
          <button class="rafters-button ${variantName}" data-cognitive-load="${cognitive}">
            ${componentProps.children || `${variantName} Button`}
          </button>
        `;
      case "container":
        return `
          <div class="rafters-container" data-cognitive-load="${cognitive}">
            <p>Container component (Cognitive Load: ${cognitive}/10)</p>
            <p>Invisible structure that reduces visual complexity</p>
          </div>
        `;
      case "grid":
        return `
          <div class="rafters-grid" data-cognitive-load="${cognitive}">
            <div class="rafters-grid-item">Grid Item 1</div>
            <div class="rafters-grid-item">Grid Item 2</div>
            <div class="rafters-grid-item">Grid Item 3</div>
          </div>
        `;
      default:
        return `
          <div class="component-placeholder" data-cognitive-load="${cognitive}">
            <h3>${name} Component</h3>
            <p>Cognitive Load: ${cognitive}/10</p>
            <p>Variant: ${variantName}</p>
          </div>
        `;
    }
  };
  const handleReload = () => {
    setLoading(true);
    setError(null);
    setComponentData(null);
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `component-preview-wrapper border rounded-lg p-4 ${className}`,
        "data-component": component,
        "data-variant": variant,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "preview-loading flex items-center justify-center bg-white border rounded",
            style: { height },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2", children: [
                "Loading ",
                component,
                " component..."
              ] })
            ]
          }
        )
      }
    );
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `component-preview-wrapper border rounded-lg p-4 ${className}`,
        "data-component": component,
        "data-variant": variant,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "preview-error bg-red-50 border border-red-200 rounded text-red-700 text-sm p-3",
            style: { height },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "Component Error" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: error })
            ] }) })
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `component-preview-wrapper border rounded-lg p-4 ${className}`,
      "data-component": component,
      "data-variant": variant,
      children: [
        showIntelligence && componentData?.meta?.rafters?.intelligence && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "preview-intelligence mb-3 text-sm text-gray-600", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Cognitive Load:" }),
            " ",
            componentData.meta.rafters.intelligence.cognitiveLoad,
            "/10"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Attention:" }),
            " ",
            componentData.meta.rafters.intelligence.attentionEconomics
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Trust:" }),
            " ",
            componentData.meta.rafters.intelligence.trustBuilding
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ref: containerRef,
            id: "shadow-container",
            className: "preview-container bg-white border rounded",
            style: { height, position: "relative", zIndex: 1 },
            "data-component": component,
            "data-variant": variant
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "preview-controls mt-2 flex gap-2 text-xs",
            style: { position: "relative", zIndex: 2 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "reload-btn px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded",
                  onClick: handleReload,
                  children: "Reload"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "view-code-btn px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded",
                  onClick: () => console.log("View code for:", component),
                  children: "View Code"
                }
              )
            ]
          }
        )
      ]
    }
  );
}

export { ComponentPreview as default };
//# sourceMappingURL=ComponentPreview-Dd729oEu.js.map
