import { g as getDefaultExportFromCjs, R as React, r as requireReactDom, a as reactExports } from './index-D5KIJQBl.js';

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

var isCheckBoxInput = (element) => element.type === 'checkbox';

var isDateObject = (value) => value instanceof Date;

var isNullOrUndefined = (value) => value == null;

const isObjectType = (value) => typeof value === 'object';
var isObject$2 = (value) => !isNullOrUndefined(value) &&
    !Array.isArray(value) &&
    isObjectType(value) &&
    !isDateObject(value);

var getEventValue = (event) => isObject$2(event) && event.target
    ? isCheckBoxInput(event.target)
        ? event.target.checked
        : event.target.value
    : event;

var getNodeParentName = (name) => name.substring(0, name.search(/\.\d+(\.|$)/)) || name;

var isNameInFieldArray = (names, name) => names.has(getNodeParentName(name));

var isPlainObject$2 = (tempObject) => {
    const prototypeCopy = tempObject.constructor && tempObject.constructor.prototype;
    return (isObject$2(prototypeCopy) && prototypeCopy.hasOwnProperty('isPrototypeOf'));
};

var isWeb = typeof window !== 'undefined' &&
    typeof window.HTMLElement !== 'undefined' &&
    typeof document !== 'undefined';

function cloneObject(data) {
    let copy;
    const isArray = Array.isArray(data);
    const isFileListInstance = typeof FileList !== 'undefined' ? data instanceof FileList : false;
    if (data instanceof Date) {
        copy = new Date(data);
    }
    else if (!(isWeb && (data instanceof Blob || isFileListInstance)) &&
        (isArray || isObject$2(data))) {
        copy = isArray ? [] : Object.create(Object.getPrototypeOf(data));
        if (!isArray && !isPlainObject$2(data)) {
            copy = data;
        }
        else {
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    copy[key] = cloneObject(data[key]);
                }
            }
        }
    }
    else {
        return data;
    }
    return copy;
}

var isKey = (value) => /^\w*$/.test(value);

var isUndefined = (val) => val === undefined;

var compact = (value) => Array.isArray(value) ? value.filter(Boolean) : [];

var stringToPath = (input) => compact(input.replace(/["|']|\]/g, '').split(/\.|\[/));

var get = (object, path, defaultValue) => {
    if (!path || !isObject$2(object)) {
        return defaultValue;
    }
    const result = (isKey(path) ? [path] : stringToPath(path)).reduce((result, key) => isNullOrUndefined(result) ? result : result[key], object);
    return isUndefined(result) || result === object
        ? isUndefined(object[path])
            ? defaultValue
            : object[path]
        : result;
};

var isBoolean = (value) => typeof value === 'boolean';

var set$1 = (object, path, value) => {
    let index = -1;
    const tempPath = isKey(path) ? [path] : stringToPath(path);
    const length = tempPath.length;
    const lastIndex = length - 1;
    while (++index < length) {
        const key = tempPath[index];
        let newValue = value;
        if (index !== lastIndex) {
            const objValue = object[key];
            newValue =
                isObject$2(objValue) || Array.isArray(objValue)
                    ? objValue
                    : !isNaN(+tempPath[index + 1])
                        ? []
                        : {};
        }
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
            return;
        }
        object[key] = newValue;
        object = object[key];
    }
};

const EVENTS = {
    BLUR: 'blur',
    FOCUS_OUT: 'focusout',
    CHANGE: 'change',
};
const VALIDATION_MODE = {
    onBlur: 'onBlur',
    onChange: 'onChange',
    onSubmit: 'onSubmit',
    onTouched: 'onTouched',
    all: 'all',
};
const INPUT_VALIDATION_RULES = {
    max: 'max',
    min: 'min',
    maxLength: 'maxLength',
    minLength: 'minLength',
    pattern: 'pattern',
    required: 'required',
    validate: 'validate',
};

const HookFormContext = React.createContext(null);
HookFormContext.displayName = 'HookFormContext';
/**
 * This custom hook allows you to access the form context. useFormContext is intended to be used in deeply nested structures, where it would become inconvenient to pass the context as a prop. To be used with {@link FormProvider}.
 *
 * @remarks
 * [API](https://react-hook-form.com/docs/useformcontext) • [Demo](https://codesandbox.io/s/react-hook-form-v7-form-context-ytudi)
 *
 * @returns return all useForm methods
 *
 * @example
 * ```tsx
 * function App() {
 *   const methods = useForm();
 *   const onSubmit = data => console.log(data);
 *
 *   return (
 *     <FormProvider {...methods} >
 *       <form onSubmit={methods.handleSubmit(onSubmit)}>
 *         <NestedInput />
 *         <input type="submit" />
 *       </form>
 *     </FormProvider>
 *   );
 * }
 *
 *  function NestedInput() {
 *   const { register } = useFormContext(); // retrieve all hook methods
 *   return <input {...register("test")} />;
 * }
 * ```
 */
const useFormContext = () => React.useContext(HookFormContext);
/**
 * A provider component that propagates the `useForm` methods to all children components via [React Context](https://react.dev/reference/react/useContext) API. To be used with {@link useFormContext}.
 *
 * @remarks
 * [API](https://react-hook-form.com/docs/useformcontext) • [Demo](https://codesandbox.io/s/react-hook-form-v7-form-context-ytudi)
 *
 * @param props - all useForm methods
 *
 * @example
 * ```tsx
 * function App() {
 *   const methods = useForm();
 *   const onSubmit = data => console.log(data);
 *
 *   return (
 *     <FormProvider {...methods} >
 *       <form onSubmit={methods.handleSubmit(onSubmit)}>
 *         <NestedInput />
 *         <input type="submit" />
 *       </form>
 *     </FormProvider>
 *   );
 * }
 *
 *  function NestedInput() {
 *   const { register } = useFormContext(); // retrieve all hook methods
 *   return <input {...register("test")} />;
 * }
 * ```
 */
const FormProvider = (props) => {
    const { children, ...data } = props;
    return (React.createElement(HookFormContext.Provider, { value: data }, children));
};

var getProxyFormState = (formState, control, localProxyFormState, isRoot = true) => {
    const result = {
        defaultValues: control._defaultValues,
    };
    for (const key in formState) {
        Object.defineProperty(result, key, {
            get: () => {
                const _key = key;
                if (control._proxyFormState[_key] !== VALIDATION_MODE.all) {
                    control._proxyFormState[_key] = !isRoot || VALIDATION_MODE.all;
                }
                localProxyFormState && (localProxyFormState[_key] = true);
                return formState[_key];
            },
        });
    }
    return result;
};

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/**
 * This custom hook allows you to subscribe to each form state, and isolate the re-render at the custom hook level. It has its scope in terms of form state subscription, so it would not affect other useFormState and useForm. Using this hook can reduce the re-render impact on large and complex form application.
 *
 * @remarks
 * [API](https://react-hook-form.com/docs/useformstate) • [Demo](https://codesandbox.io/s/useformstate-75xly)
 *
 * @param props - include options on specify fields to subscribe. {@link UseFormStateReturn}
 *
 * @example
 * ```tsx
 * function App() {
 *   const { register, handleSubmit, control } = useForm({
 *     defaultValues: {
 *     firstName: "firstName"
 *   }});
 *   const { dirtyFields } = useFormState({
 *     control
 *   });
 *   const onSubmit = (data) => console.log(data);
 *
 *   return (
 *     <form onSubmit={handleSubmit(onSubmit)}>
 *       <input {...register("firstName")} placeholder="First Name" />
 *       {dirtyFields.firstName && <p>Field is dirty.</p>}
 *       <input type="submit" />
 *     </form>
 *   );
 * }
 * ```
 */
function useFormState(props) {
    const methods = useFormContext();
    const { control = methods.control, disabled, name, exact } = props || {};
    const [formState, updateFormState] = React.useState(control._formState);
    const _localProxyFormState = React.useRef({
        isDirty: false,
        isLoading: false,
        dirtyFields: false,
        touchedFields: false,
        validatingFields: false,
        isValidating: false,
        isValid: false,
        errors: false,
    });
    useIsomorphicLayoutEffect(() => control._subscribe({
        name,
        formState: _localProxyFormState.current,
        exact,
        callback: (formState) => {
            !disabled &&
                updateFormState({
                    ...control._formState,
                    ...formState,
                });
        },
    }), [name, disabled, exact]);
    React.useEffect(() => {
        _localProxyFormState.current.isValid && control._setValid(true);
    }, [control]);
    return React.useMemo(() => getProxyFormState(formState, control, _localProxyFormState.current, false), [formState, control]);
}

var isString = (value) => typeof value === 'string';

var generateWatchOutput = (names, _names, formValues, isGlobal, defaultValue) => {
    if (isString(names)) {
        isGlobal && _names.watch.add(names);
        return get(formValues, names, defaultValue);
    }
    if (Array.isArray(names)) {
        return names.map((fieldName) => (isGlobal && _names.watch.add(fieldName),
            get(formValues, fieldName)));
    }
    isGlobal && (_names.watchAll = true);
    return formValues;
};

var isPrimitive = (value) => isNullOrUndefined(value) || !isObjectType(value);

function deepEqual(object1, object2, _internal_visited = new WeakSet()) {
    if (isPrimitive(object1) || isPrimitive(object2)) {
        return object1 === object2;
    }
    if (isDateObject(object1) && isDateObject(object2)) {
        return object1.getTime() === object2.getTime();
    }
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    if (_internal_visited.has(object1) || _internal_visited.has(object2)) {
        return true;
    }
    _internal_visited.add(object1);
    _internal_visited.add(object2);
    for (const key of keys1) {
        const val1 = object1[key];
        if (!keys2.includes(key)) {
            return false;
        }
        if (key !== 'ref') {
            const val2 = object2[key];
            if ((isDateObject(val1) && isDateObject(val2)) ||
                (isObject$2(val1) && isObject$2(val2)) ||
                (Array.isArray(val1) && Array.isArray(val2))
                ? !deepEqual(val1, val2, _internal_visited)
                : val1 !== val2) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Custom hook to subscribe to field change and isolate re-rendering at the component level.
 *
 * @remarks
 *
 * [API](https://react-hook-form.com/docs/usewatch) • [Demo](https://codesandbox.io/s/react-hook-form-v7-ts-usewatch-h9i5e)
 *
 * @example
 * ```tsx
 * const { control } = useForm();
 * const values = useWatch({
 *   name: "fieldName"
 *   control,
 * })
 * ```
 */
function useWatch(props) {
    const methods = useFormContext();
    const { control = methods.control, name, defaultValue, disabled, exact, compute, } = props || {};
    const _defaultValue = React.useRef(defaultValue);
    const _compute = React.useRef(compute);
    const _computeFormValues = React.useRef(undefined);
    const _prevControl = React.useRef(control);
    const _prevName = React.useRef(name);
    _compute.current = compute;
    const [value, updateValue] = React.useState(() => {
        const defaultValue = control._getWatch(name, _defaultValue.current);
        return _compute.current ? _compute.current(defaultValue) : defaultValue;
    });
    const getCurrentOutput = React.useCallback((values) => {
        const formValues = generateWatchOutput(name, control._names, values || control._formValues, false, _defaultValue.current);
        return _compute.current ? _compute.current(formValues) : formValues;
    }, [control._formValues, control._names, name]);
    const refreshValue = React.useCallback((values) => {
        if (!disabled) {
            const formValues = generateWatchOutput(name, control._names, values || control._formValues, false, _defaultValue.current);
            if (_compute.current) {
                const computedFormValues = _compute.current(formValues);
                if (!deepEqual(computedFormValues, _computeFormValues.current)) {
                    updateValue(computedFormValues);
                    _computeFormValues.current = computedFormValues;
                }
            }
            else {
                updateValue(formValues);
            }
        }
    }, [control._formValues, control._names, disabled, name]);
    useIsomorphicLayoutEffect(() => {
        if (_prevControl.current !== control ||
            !deepEqual(_prevName.current, name)) {
            _prevControl.current = control;
            _prevName.current = name;
            refreshValue();
        }
        return control._subscribe({
            name,
            formState: {
                values: true,
            },
            exact,
            callback: (formState) => {
                refreshValue(formState.values);
            },
        });
    }, [control, exact, name, refreshValue]);
    React.useEffect(() => control._removeUnmounted());
    // If name or control changed for this render, synchronously reflect the
    // latest value so callers (like useController) see the correct value
    // immediately on the same render.
    // Optimize: Check control reference first before expensive deepEqual
    const controlChanged = _prevControl.current !== control;
    const prevName = _prevName.current;
    // Cache the computed output to avoid duplicate calls within the same render
    // We include shouldReturnImmediate in deps to ensure proper recomputation
    const computedOutput = React.useMemo(() => {
        if (disabled) {
            return null;
        }
        const nameChanged = !controlChanged && !deepEqual(prevName, name);
        const shouldReturnImmediate = controlChanged || nameChanged;
        return shouldReturnImmediate ? getCurrentOutput() : null;
    }, [disabled, controlChanged, name, prevName, getCurrentOutput]);
    return computedOutput !== null ? computedOutput : value;
}

/**
 * Custom hook to work with controlled component, this function provide you with both form and field level state. Re-render is isolated at the hook level.
 *
 * @remarks
 * [API](https://react-hook-form.com/docs/usecontroller) • [Demo](https://codesandbox.io/s/usecontroller-0o8px)
 *
 * @param props - the path name to the form field value, and validation rules.
 *
 * @returns field properties, field and form state. {@link UseControllerReturn}
 *
 * @example
 * ```tsx
 * function Input(props) {
 *   const { field, fieldState, formState } = useController(props);
 *   return (
 *     <div>
 *       <input {...field} placeholder={props.name} />
 *       <p>{fieldState.isTouched && "Touched"}</p>
 *       <p>{formState.isSubmitted ? "submitted" : ""}</p>
 *     </div>
 *   );
 * }
 * ```
 */
function useController(props) {
    const methods = useFormContext();
    const { name, disabled, control = methods.control, shouldUnregister, defaultValue, } = props;
    const isArrayField = isNameInFieldArray(control._names.array, name);
    const defaultValueMemo = React.useMemo(() => get(control._formValues, name, get(control._defaultValues, name, defaultValue)), [control, name, defaultValue]);
    const value = useWatch({
        control,
        name,
        defaultValue: defaultValueMemo,
        exact: true,
    });
    const formState = useFormState({
        control,
        name,
        exact: true,
    });
    const _props = React.useRef(props);
    const _previousNameRef = React.useRef(undefined);
    const _registerProps = React.useRef(control.register(name, {
        ...props.rules,
        value,
        ...(isBoolean(props.disabled) ? { disabled: props.disabled } : {}),
    }));
    _props.current = props;
    const fieldState = React.useMemo(() => Object.defineProperties({}, {
        invalid: {
            enumerable: true,
            get: () => !!get(formState.errors, name),
        },
        isDirty: {
            enumerable: true,
            get: () => !!get(formState.dirtyFields, name),
        },
        isTouched: {
            enumerable: true,
            get: () => !!get(formState.touchedFields, name),
        },
        isValidating: {
            enumerable: true,
            get: () => !!get(formState.validatingFields, name),
        },
        error: {
            enumerable: true,
            get: () => get(formState.errors, name),
        },
    }), [formState, name]);
    const onChange = React.useCallback((event) => _registerProps.current.onChange({
        target: {
            value: getEventValue(event),
            name: name,
        },
        type: EVENTS.CHANGE,
    }), [name]);
    const onBlur = React.useCallback(() => _registerProps.current.onBlur({
        target: {
            value: get(control._formValues, name),
            name: name,
        },
        type: EVENTS.BLUR,
    }), [name, control._formValues]);
    const ref = React.useCallback((elm) => {
        const field = get(control._fields, name);
        if (field && elm) {
            field._f.ref = {
                focus: () => elm.focus && elm.focus(),
                select: () => elm.select && elm.select(),
                setCustomValidity: (message) => elm.setCustomValidity(message),
                reportValidity: () => elm.reportValidity(),
            };
        }
    }, [control._fields, name]);
    const field = React.useMemo(() => ({
        name,
        value,
        ...(isBoolean(disabled) || formState.disabled
            ? { disabled: formState.disabled || disabled }
            : {}),
        onChange,
        onBlur,
        ref,
    }), [name, disabled, formState.disabled, onChange, onBlur, ref, value]);
    React.useEffect(() => {
        const _shouldUnregisterField = control._options.shouldUnregister || shouldUnregister;
        const previousName = _previousNameRef.current;
        if (previousName && previousName !== name && !isArrayField) {
            control.unregister(previousName);
        }
        control.register(name, {
            ..._props.current.rules,
            ...(isBoolean(_props.current.disabled)
                ? { disabled: _props.current.disabled }
                : {}),
        });
        const updateMounted = (name, value) => {
            const field = get(control._fields, name);
            if (field && field._f) {
                field._f.mount = value;
            }
        };
        updateMounted(name, true);
        if (_shouldUnregisterField) {
            const value = cloneObject(get(control._options.defaultValues, name, _props.current.defaultValue));
            set$1(control._defaultValues, name, value);
            if (isUndefined(get(control._formValues, name))) {
                set$1(control._formValues, name, value);
            }
        }
        !isArrayField && control.register(name);
        _previousNameRef.current = name;
        return () => {
            (isArrayField
                ? _shouldUnregisterField && !control._state.action
                : _shouldUnregisterField)
                ? control.unregister(name)
                : updateMounted(name, false);
        };
    }, [name, control, isArrayField, shouldUnregister]);
    React.useEffect(() => {
        control._setDisabledField({
            disabled,
            name,
        });
    }, [disabled, name, control]);
    return React.useMemo(() => ({
        field,
        formState,
        fieldState,
    }), [field, formState, fieldState]);
}

/**
 * Component based on `useController` hook to work with controlled component.
 *
 * @remarks
 * [API](https://react-hook-form.com/docs/usecontroller/controller) • [Demo](https://codesandbox.io/s/react-hook-form-v6-controller-ts-jwyzw) • [Video](https://www.youtube.com/watch?v=N2UNk_UCVyA)
 *
 * @param props - the path name to the form field value, and validation rules.
 *
 * @returns provide field handler functions, field and form state.
 *
 * @example
 * ```tsx
 * function App() {
 *   const { control } = useForm<FormValues>({
 *     defaultValues: {
 *       test: ""
 *     }
 *   });
 *
 *   return (
 *     <form>
 *       <Controller
 *         control={control}
 *         name="test"
 *         render={({ field: { onChange, onBlur, value, ref }, formState, fieldState }) => (
 *           <>
 *             <input
 *               onChange={onChange} // send value to hook form
 *               onBlur={onBlur} // notify when input is touched
 *               value={value} // return updated value
 *               ref={ref} // set ref for focus management
 *             />
 *             <p>{formState.isSubmitted ? "submitted" : ""}</p>
 *             <p>{fieldState.isTouched ? "touched" : ""}</p>
 *           </>
 *         )}
 *       />
 *     </form>
 *   );
 * }
 * ```
 */
const Controller = (props) => props.render(useController(props));

const flatten = (obj) => {
    const output = {};
    for (const key of Object.keys(obj)) {
        if (isObjectType(obj[key]) && obj[key] !== null) {
            const nested = flatten(obj[key]);
            for (const nestedKey of Object.keys(nested)) {
                output[`${key}.${nestedKey}`] = nested[nestedKey];
            }
        }
        else {
            output[key] = obj[key];
        }
    }
    return output;
};

const POST_REQUEST = 'post';
/**
 * Form component to manage submission.
 *
 * @param props - to setup submission detail. {@link FormProps}
 *
 * @returns form component or headless render prop.
 *
 * @example
 * ```tsx
 * function App() {
 *   const { control, formState: { errors } } = useForm();
 *
 *   return (
 *     <Form action="/api" control={control}>
 *       <input {...register("name")} />
 *       <p>{errors?.root?.server && 'Server error'}</p>
 *       <button>Submit</button>
 *     </Form>
 *   );
 * }
 * ```
 */
function Form(props) {
    const methods = useFormContext();
    const [mounted, setMounted] = React.useState(false);
    const { control = methods.control, onSubmit, children, action, method = POST_REQUEST, headers, encType, onError, render, onSuccess, validateStatus, ...rest } = props;
    const submit = async (event) => {
        let hasError = false;
        let type = '';
        await control.handleSubmit(async (data) => {
            const formData = new FormData();
            let formDataJson = '';
            try {
                formDataJson = JSON.stringify(data);
            }
            catch (_a) { }
            const flattenFormValues = flatten(control._formValues);
            for (const key in flattenFormValues) {
                formData.append(key, flattenFormValues[key]);
            }
            if (onSubmit) {
                await onSubmit({
                    data,
                    event,
                    method,
                    formData,
                    formDataJson,
                });
            }
            if (action) {
                try {
                    const shouldStringifySubmissionData = [
                        headers && headers['Content-Type'],
                        encType,
                    ].some((value) => value && value.includes('json'));
                    const response = await fetch(String(action), {
                        method,
                        headers: {
                            ...headers,
                            ...(encType && encType !== 'multipart/form-data'
                                ? { 'Content-Type': encType }
                                : {}),
                        },
                        body: shouldStringifySubmissionData ? formDataJson : formData,
                    });
                    if (response &&
                        (validateStatus
                            ? !validateStatus(response.status)
                            : response.status < 200 || response.status >= 300)) {
                        hasError = true;
                        onError && onError({ response });
                        type = String(response.status);
                    }
                    else {
                        onSuccess && onSuccess({ response });
                    }
                }
                catch (error) {
                    hasError = true;
                    onError && onError({ error });
                }
            }
        })(event);
        if (hasError && props.control) {
            props.control._subjects.state.next({
                isSubmitSuccessful: false,
            });
            props.control.setError('root.server', {
                type,
            });
        }
    };
    React.useEffect(() => {
        setMounted(true);
    }, []);
    return render ? (React.createElement(React.Fragment, null, render({
        submit,
    }))) : (React.createElement("form", { noValidate: mounted, action: action, method: method, encType: encType, onSubmit: submit, ...rest }, children));
}

var appendErrors = (name, validateAllFieldCriteria, errors, type, message) => validateAllFieldCriteria
    ? {
        ...errors[name],
        types: {
            ...(errors[name] && errors[name].types ? errors[name].types : {}),
            [type]: message || true,
        },
    }
    : {};

var convertToArrayPayload = (value) => (Array.isArray(value) ? value : [value]);

var createSubject = () => {
    let _observers = [];
    const next = (value) => {
        for (const observer of _observers) {
            observer.next && observer.next(value);
        }
    };
    const subscribe = (observer) => {
        _observers.push(observer);
        return {
            unsubscribe: () => {
                _observers = _observers.filter((o) => o !== observer);
            },
        };
    };
    const unsubscribe = () => {
        _observers = [];
    };
    return {
        get observers() {
            return _observers;
        },
        next,
        subscribe,
        unsubscribe,
    };
};

function extractFormValues(fieldsState, formValues) {
    const values = {};
    for (const key in fieldsState) {
        if (fieldsState.hasOwnProperty(key)) {
            const fieldState = fieldsState[key];
            const fieldValue = formValues[key];
            if (fieldState && isObject$2(fieldState) && fieldValue) {
                const nestedFieldsState = extractFormValues(fieldState, fieldValue);
                if (isObject$2(nestedFieldsState)) {
                    values[key] = nestedFieldsState;
                }
            }
            else if (fieldsState[key]) {
                values[key] = fieldValue;
            }
        }
    }
    return values;
}

var isEmptyObject = (value) => isObject$2(value) && !Object.keys(value).length;

var isFileInput = (element) => element.type === 'file';

var isFunction = (value) => typeof value === 'function';

var isHTMLElement = (value) => {
    if (!isWeb) {
        return false;
    }
    const owner = value ? value.ownerDocument : 0;
    return (value instanceof
        (owner && owner.defaultView ? owner.defaultView.HTMLElement : HTMLElement));
};

var isMultipleSelect = (element) => element.type === `select-multiple`;

var isRadioInput = (element) => element.type === 'radio';

var isRadioOrCheckbox = (ref) => isRadioInput(ref) || isCheckBoxInput(ref);

var live = (ref) => isHTMLElement(ref) && ref.isConnected;

function baseGet(object, updatePath) {
    const length = updatePath.slice(0, -1).length;
    let index = 0;
    while (index < length) {
        object = isUndefined(object) ? index++ : object[updatePath[index++]];
    }
    return object;
}
function isEmptyArray(obj) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && !isUndefined(obj[key])) {
            return false;
        }
    }
    return true;
}
function unset(object, path) {
    const paths = Array.isArray(path)
        ? path
        : isKey(path)
            ? [path]
            : stringToPath(path);
    const childObject = paths.length === 1 ? object : baseGet(object, paths);
    const index = paths.length - 1;
    const key = paths[index];
    if (childObject) {
        delete childObject[key];
    }
    if (index !== 0 &&
        ((isObject$2(childObject) && isEmptyObject(childObject)) ||
            (Array.isArray(childObject) && isEmptyArray(childObject)))) {
        unset(object, paths.slice(0, -1));
    }
    return object;
}

var objectHasFunction = (data) => {
    for (const key in data) {
        if (isFunction(data[key])) {
            return true;
        }
    }
    return false;
};

function isTraversable(value) {
    return Array.isArray(value) || (isObject$2(value) && !objectHasFunction(value));
}
function markFieldsDirty(data, fields = {}) {
    for (const key in data) {
        if (isTraversable(data[key])) {
            fields[key] = Array.isArray(data[key]) ? [] : {};
            markFieldsDirty(data[key], fields[key]);
        }
        else if (!isUndefined(data[key])) {
            fields[key] = true;
        }
    }
    return fields;
}
function getDirtyFields(data, formValues, dirtyFieldsFromValues) {
    if (!dirtyFieldsFromValues) {
        dirtyFieldsFromValues = markFieldsDirty(formValues);
    }
    for (const key in data) {
        if (isTraversable(data[key])) {
            if (isUndefined(formValues) || isPrimitive(dirtyFieldsFromValues[key])) {
                dirtyFieldsFromValues[key] = markFieldsDirty(data[key], Array.isArray(data[key]) ? [] : {});
            }
            else {
                getDirtyFields(data[key], isNullOrUndefined(formValues) ? {} : formValues[key], dirtyFieldsFromValues[key]);
            }
        }
        else {
            dirtyFieldsFromValues[key] = !deepEqual(data[key], formValues[key]);
        }
    }
    return dirtyFieldsFromValues;
}

const defaultResult = {
    value: false,
    isValid: false,
};
const validResult = { value: true, isValid: true };
var getCheckboxValue = (options) => {
    if (Array.isArray(options)) {
        if (options.length > 1) {
            const values = options
                .filter((option) => option && option.checked && !option.disabled)
                .map((option) => option.value);
            return { value: values, isValid: !!values.length };
        }
        return options[0].checked && !options[0].disabled
            ? // @ts-expect-error expected to work in the browser
                options[0].attributes && !isUndefined(options[0].attributes.value)
                    ? isUndefined(options[0].value) || options[0].value === ''
                        ? validResult
                        : { value: options[0].value, isValid: true }
                    : validResult
            : defaultResult;
    }
    return defaultResult;
};

var getFieldValueAs = (value, { valueAsNumber, valueAsDate, setValueAs }) => isUndefined(value)
    ? value
    : valueAsNumber
        ? value === ''
            ? NaN
            : value
                ? +value
                : value
        : valueAsDate && isString(value)
            ? new Date(value)
            : setValueAs
                ? setValueAs(value)
                : value;

const defaultReturn = {
    isValid: false,
    value: null,
};
var getRadioValue = (options) => Array.isArray(options)
    ? options.reduce((previous, option) => option && option.checked && !option.disabled
        ? {
            isValid: true,
            value: option.value,
        }
        : previous, defaultReturn)
    : defaultReturn;

function getFieldValue(_f) {
    const ref = _f.ref;
    if (isFileInput(ref)) {
        return ref.files;
    }
    if (isRadioInput(ref)) {
        return getRadioValue(_f.refs).value;
    }
    if (isMultipleSelect(ref)) {
        return [...ref.selectedOptions].map(({ value }) => value);
    }
    if (isCheckBoxInput(ref)) {
        return getCheckboxValue(_f.refs).value;
    }
    return getFieldValueAs(isUndefined(ref.value) ? _f.ref.value : ref.value, _f);
}

var getResolverOptions = (fieldsNames, _fields, criteriaMode, shouldUseNativeValidation) => {
    const fields = {};
    for (const name of fieldsNames) {
        const field = get(_fields, name);
        field && set$1(fields, name, field._f);
    }
    return {
        criteriaMode,
        names: [...fieldsNames],
        fields,
        shouldUseNativeValidation,
    };
};

var isRegex = (value) => value instanceof RegExp;

var getRuleValue = (rule) => isUndefined(rule)
    ? rule
    : isRegex(rule)
        ? rule.source
        : isObject$2(rule)
            ? isRegex(rule.value)
                ? rule.value.source
                : rule.value
            : rule;

var getValidationModes = (mode) => ({
    isOnSubmit: !mode || mode === VALIDATION_MODE.onSubmit,
    isOnBlur: mode === VALIDATION_MODE.onBlur,
    isOnChange: mode === VALIDATION_MODE.onChange,
    isOnAll: mode === VALIDATION_MODE.all,
    isOnTouch: mode === VALIDATION_MODE.onTouched,
});

const ASYNC_FUNCTION = 'AsyncFunction';
var hasPromiseValidation = (fieldReference) => !!fieldReference &&
    !!fieldReference.validate &&
    !!((isFunction(fieldReference.validate) &&
        fieldReference.validate.constructor.name === ASYNC_FUNCTION) ||
        (isObject$2(fieldReference.validate) &&
            Object.values(fieldReference.validate).find((validateFunction) => validateFunction.constructor.name === ASYNC_FUNCTION)));

var hasValidation = (options) => options.mount &&
    (options.required ||
        options.min ||
        options.max ||
        options.maxLength ||
        options.minLength ||
        options.pattern ||
        options.validate);

var isWatched = (name, _names, isBlurEvent) => !isBlurEvent &&
    (_names.watchAll ||
        _names.watch.has(name) ||
        [..._names.watch].some((watchName) => name.startsWith(watchName) &&
            /^\.\w+/.test(name.slice(watchName.length))));

const iterateFieldsByAction = (fields, action, fieldsNames, abortEarly) => {
    for (const key of fieldsNames || Object.keys(fields)) {
        const field = get(fields, key);
        if (field) {
            const { _f, ...currentField } = field;
            if (_f) {
                if (_f.refs && _f.refs[0] && action(_f.refs[0], key) && !abortEarly) {
                    return true;
                }
                else if (_f.ref && action(_f.ref, _f.name) && !abortEarly) {
                    return true;
                }
                else {
                    if (iterateFieldsByAction(currentField, action)) {
                        break;
                    }
                }
            }
            else if (isObject$2(currentField)) {
                if (iterateFieldsByAction(currentField, action)) {
                    break;
                }
            }
        }
    }
    return;
};

function schemaErrorLookup(errors, _fields, name) {
    const error = get(errors, name);
    if (error || isKey(name)) {
        return {
            error,
            name,
        };
    }
    const names = name.split('.');
    while (names.length) {
        const fieldName = names.join('.');
        const field = get(_fields, fieldName);
        const foundError = get(errors, fieldName);
        if (field && !Array.isArray(field) && name !== fieldName) {
            return { name };
        }
        if (foundError && foundError.type) {
            return {
                name: fieldName,
                error: foundError,
            };
        }
        if (foundError && foundError.root && foundError.root.type) {
            return {
                name: `${fieldName}.root`,
                error: foundError.root,
            };
        }
        names.pop();
    }
    return {
        name,
    };
}

var shouldRenderFormState = (formStateData, _proxyFormState, updateFormState, isRoot) => {
    updateFormState(formStateData);
    const { name, ...formState } = formStateData;
    return (isEmptyObject(formState) ||
        Object.keys(formState).length >= Object.keys(_proxyFormState).length ||
        Object.keys(formState).find((key) => _proxyFormState[key] ===
            (!isRoot || VALIDATION_MODE.all)));
};

var shouldSubscribeByName = (name, signalName, exact) => !name ||
    !signalName ||
    name === signalName ||
    convertToArrayPayload(name).some((currentName) => currentName &&
        (exact
            ? currentName === signalName
            : currentName.startsWith(signalName) ||
                signalName.startsWith(currentName)));

var skipValidation = (isBlurEvent, isTouched, isSubmitted, reValidateMode, mode) => {
    if (mode.isOnAll) {
        return false;
    }
    else if (!isSubmitted && mode.isOnTouch) {
        return !(isTouched || isBlurEvent);
    }
    else if (isSubmitted ? reValidateMode.isOnBlur : mode.isOnBlur) {
        return !isBlurEvent;
    }
    else if (isSubmitted ? reValidateMode.isOnChange : mode.isOnChange) {
        return isBlurEvent;
    }
    return true;
};

var unsetEmptyArray = (ref, name) => !compact(get(ref, name)).length && unset(ref, name);

var updateFieldArrayRootError = (errors, error, name) => {
    const fieldArrayErrors = convertToArrayPayload(get(errors, name));
    set$1(fieldArrayErrors, 'root', error[name]);
    set$1(errors, name, fieldArrayErrors);
    return errors;
};

function getValidateError(result, ref, type = 'validate') {
    if (isString(result) ||
        (Array.isArray(result) && result.every(isString)) ||
        (isBoolean(result) && !result)) {
        return {
            type,
            message: isString(result) ? result : '',
            ref,
        };
    }
}

var getValueAndMessage = (validationData) => isObject$2(validationData) && !isRegex(validationData)
    ? validationData
    : {
        value: validationData,
        message: '',
    };

var validateField = async (field, disabledFieldNames, formValues, validateAllFieldCriteria, shouldUseNativeValidation, isFieldArray) => {
    const { ref, refs, required, maxLength, minLength, min, max, pattern, validate, name, valueAsNumber, mount, } = field._f;
    const inputValue = get(formValues, name);
    if (!mount || disabledFieldNames.has(name)) {
        return {};
    }
    const inputRef = refs ? refs[0] : ref;
    const setCustomValidity = (message) => {
        if (shouldUseNativeValidation && inputRef.reportValidity) {
            inputRef.setCustomValidity(isBoolean(message) ? '' : message || '');
            inputRef.reportValidity();
        }
    };
    const error = {};
    const isRadio = isRadioInput(ref);
    const isCheckBox = isCheckBoxInput(ref);
    const isRadioOrCheckbox = isRadio || isCheckBox;
    const isEmpty = ((valueAsNumber || isFileInput(ref)) &&
        isUndefined(ref.value) &&
        isUndefined(inputValue)) ||
        (isHTMLElement(ref) && ref.value === '') ||
        inputValue === '' ||
        (Array.isArray(inputValue) && !inputValue.length);
    const appendErrorsCurry = appendErrors.bind(null, name, validateAllFieldCriteria, error);
    const getMinMaxMessage = (exceedMax, maxLengthMessage, minLengthMessage, maxType = INPUT_VALIDATION_RULES.maxLength, minType = INPUT_VALIDATION_RULES.minLength) => {
        const message = exceedMax ? maxLengthMessage : minLengthMessage;
        error[name] = {
            type: exceedMax ? maxType : minType,
            message,
            ref,
            ...appendErrorsCurry(exceedMax ? maxType : minType, message),
        };
    };
    if (isFieldArray
        ? !Array.isArray(inputValue) || !inputValue.length
        : required &&
            ((!isRadioOrCheckbox && (isEmpty || isNullOrUndefined(inputValue))) ||
                (isBoolean(inputValue) && !inputValue) ||
                (isCheckBox && !getCheckboxValue(refs).isValid) ||
                (isRadio && !getRadioValue(refs).isValid))) {
        const { value, message } = isString(required)
            ? { value: !!required, message: required }
            : getValueAndMessage(required);
        if (value) {
            error[name] = {
                type: INPUT_VALIDATION_RULES.required,
                message,
                ref: inputRef,
                ...appendErrorsCurry(INPUT_VALIDATION_RULES.required, message),
            };
            if (!validateAllFieldCriteria) {
                setCustomValidity(message);
                return error;
            }
        }
    }
    if (!isEmpty && (!isNullOrUndefined(min) || !isNullOrUndefined(max))) {
        let exceedMax;
        let exceedMin;
        const maxOutput = getValueAndMessage(max);
        const minOutput = getValueAndMessage(min);
        if (!isNullOrUndefined(inputValue) && !isNaN(inputValue)) {
            const valueNumber = ref.valueAsNumber ||
                (inputValue ? +inputValue : inputValue);
            if (!isNullOrUndefined(maxOutput.value)) {
                exceedMax = valueNumber > maxOutput.value;
            }
            if (!isNullOrUndefined(minOutput.value)) {
                exceedMin = valueNumber < minOutput.value;
            }
        }
        else {
            const valueDate = ref.valueAsDate || new Date(inputValue);
            const convertTimeToDate = (time) => new Date(new Date().toDateString() + ' ' + time);
            const isTime = ref.type == 'time';
            const isWeek = ref.type == 'week';
            if (isString(maxOutput.value) && inputValue) {
                exceedMax = isTime
                    ? convertTimeToDate(inputValue) > convertTimeToDate(maxOutput.value)
                    : isWeek
                        ? inputValue > maxOutput.value
                        : valueDate > new Date(maxOutput.value);
            }
            if (isString(minOutput.value) && inputValue) {
                exceedMin = isTime
                    ? convertTimeToDate(inputValue) < convertTimeToDate(minOutput.value)
                    : isWeek
                        ? inputValue < minOutput.value
                        : valueDate < new Date(minOutput.value);
            }
        }
        if (exceedMax || exceedMin) {
            getMinMaxMessage(!!exceedMax, maxOutput.message, minOutput.message, INPUT_VALIDATION_RULES.max, INPUT_VALIDATION_RULES.min);
            if (!validateAllFieldCriteria) {
                setCustomValidity(error[name].message);
                return error;
            }
        }
    }
    if ((maxLength || minLength) &&
        !isEmpty &&
        (isString(inputValue) || (isFieldArray && Array.isArray(inputValue)))) {
        const maxLengthOutput = getValueAndMessage(maxLength);
        const minLengthOutput = getValueAndMessage(minLength);
        const exceedMax = !isNullOrUndefined(maxLengthOutput.value) &&
            inputValue.length > +maxLengthOutput.value;
        const exceedMin = !isNullOrUndefined(minLengthOutput.value) &&
            inputValue.length < +minLengthOutput.value;
        if (exceedMax || exceedMin) {
            getMinMaxMessage(exceedMax, maxLengthOutput.message, minLengthOutput.message);
            if (!validateAllFieldCriteria) {
                setCustomValidity(error[name].message);
                return error;
            }
        }
    }
    if (pattern && !isEmpty && isString(inputValue)) {
        const { value: patternValue, message } = getValueAndMessage(pattern);
        if (isRegex(patternValue) && !inputValue.match(patternValue)) {
            error[name] = {
                type: INPUT_VALIDATION_RULES.pattern,
                message,
                ref,
                ...appendErrorsCurry(INPUT_VALIDATION_RULES.pattern, message),
            };
            if (!validateAllFieldCriteria) {
                setCustomValidity(message);
                return error;
            }
        }
    }
    if (validate) {
        if (isFunction(validate)) {
            const result = await validate(inputValue, formValues);
            const validateError = getValidateError(result, inputRef);
            if (validateError) {
                error[name] = {
                    ...validateError,
                    ...appendErrorsCurry(INPUT_VALIDATION_RULES.validate, validateError.message),
                };
                if (!validateAllFieldCriteria) {
                    setCustomValidity(validateError.message);
                    return error;
                }
            }
        }
        else if (isObject$2(validate)) {
            let validationResult = {};
            for (const key in validate) {
                if (!isEmptyObject(validationResult) && !validateAllFieldCriteria) {
                    break;
                }
                const validateError = getValidateError(await validate[key](inputValue, formValues), inputRef, key);
                if (validateError) {
                    validationResult = {
                        ...validateError,
                        ...appendErrorsCurry(key, validateError.message),
                    };
                    setCustomValidity(validateError.message);
                    if (validateAllFieldCriteria) {
                        error[name] = validationResult;
                    }
                }
            }
            if (!isEmptyObject(validationResult)) {
                error[name] = {
                    ref: inputRef,
                    ...validationResult,
                };
                if (!validateAllFieldCriteria) {
                    return error;
                }
            }
        }
    }
    setCustomValidity(true);
    return error;
};

const defaultOptions = {
    mode: VALIDATION_MODE.onSubmit,
    reValidateMode: VALIDATION_MODE.onChange,
    shouldFocusError: true,
};
function createFormControl(props = {}) {
    let _options = {
        ...defaultOptions,
        ...props,
    };
    let _formState = {
        submitCount: 0,
        isDirty: false,
        isReady: false,
        isLoading: isFunction(_options.defaultValues),
        isValidating: false,
        isSubmitted: false,
        isSubmitting: false,
        isSubmitSuccessful: false,
        isValid: false,
        touchedFields: {},
        dirtyFields: {},
        validatingFields: {},
        errors: _options.errors || {},
        disabled: _options.disabled || false,
    };
    let _fields = {};
    let _defaultValues = isObject$2(_options.defaultValues) || isObject$2(_options.values)
        ? cloneObject(_options.defaultValues || _options.values) || {}
        : {};
    let _formValues = _options.shouldUnregister
        ? {}
        : cloneObject(_defaultValues);
    let _state = {
        action: false,
        mount: false,
        watch: false,
    };
    let _names = {
        mount: new Set(),
        disabled: new Set(),
        unMount: new Set(),
        array: new Set(),
        watch: new Set(),
    };
    let delayErrorCallback;
    let timer = 0;
    const _proxyFormState = {
        isDirty: false,
        dirtyFields: false,
        validatingFields: false,
        touchedFields: false,
        isValidating: false,
        isValid: false,
        errors: false,
    };
    let _proxySubscribeFormState = {
        ..._proxyFormState,
    };
    const _subjects = {
        array: createSubject(),
        state: createSubject(),
    };
    const shouldDisplayAllAssociatedErrors = _options.criteriaMode === VALIDATION_MODE.all;
    const debounce = (callback) => (wait) => {
        clearTimeout(timer);
        timer = setTimeout(callback, wait);
    };
    const _setValid = async (shouldUpdateValid) => {
        if (!_options.disabled &&
            (_proxyFormState.isValid ||
                _proxySubscribeFormState.isValid ||
                shouldUpdateValid)) {
            const isValid = _options.resolver
                ? isEmptyObject((await _runSchema()).errors)
                : await executeBuiltInValidation(_fields, true);
            if (isValid !== _formState.isValid) {
                _subjects.state.next({
                    isValid,
                });
            }
        }
    };
    const _updateIsValidating = (names, isValidating) => {
        if (!_options.disabled &&
            (_proxyFormState.isValidating ||
                _proxyFormState.validatingFields ||
                _proxySubscribeFormState.isValidating ||
                _proxySubscribeFormState.validatingFields)) {
            (names || Array.from(_names.mount)).forEach((name) => {
                if (name) {
                    isValidating
                        ? set$1(_formState.validatingFields, name, isValidating)
                        : unset(_formState.validatingFields, name);
                }
            });
            _subjects.state.next({
                validatingFields: _formState.validatingFields,
                isValidating: !isEmptyObject(_formState.validatingFields),
            });
        }
    };
    const _setFieldArray = (name, values = [], method, args, shouldSetValues = true, shouldUpdateFieldsAndState = true) => {
        if (args && method && !_options.disabled) {
            _state.action = true;
            if (shouldUpdateFieldsAndState && Array.isArray(get(_fields, name))) {
                const fieldValues = method(get(_fields, name), args.argA, args.argB);
                shouldSetValues && set$1(_fields, name, fieldValues);
            }
            if (shouldUpdateFieldsAndState &&
                Array.isArray(get(_formState.errors, name))) {
                const errors = method(get(_formState.errors, name), args.argA, args.argB);
                shouldSetValues && set$1(_formState.errors, name, errors);
                unsetEmptyArray(_formState.errors, name);
            }
            if ((_proxyFormState.touchedFields ||
                _proxySubscribeFormState.touchedFields) &&
                shouldUpdateFieldsAndState &&
                Array.isArray(get(_formState.touchedFields, name))) {
                const touchedFields = method(get(_formState.touchedFields, name), args.argA, args.argB);
                shouldSetValues && set$1(_formState.touchedFields, name, touchedFields);
            }
            if (_proxyFormState.dirtyFields || _proxySubscribeFormState.dirtyFields) {
                _formState.dirtyFields = getDirtyFields(_defaultValues, _formValues);
            }
            _subjects.state.next({
                name,
                isDirty: _getDirty(name, values),
                dirtyFields: _formState.dirtyFields,
                errors: _formState.errors,
                isValid: _formState.isValid,
            });
        }
        else {
            set$1(_formValues, name, values);
        }
    };
    const updateErrors = (name, error) => {
        set$1(_formState.errors, name, error);
        _subjects.state.next({
            errors: _formState.errors,
        });
    };
    const _setErrors = (errors) => {
        _formState.errors = errors;
        _subjects.state.next({
            errors: _formState.errors,
            isValid: false,
        });
    };
    const updateValidAndValue = (name, shouldSkipSetValueAs, value, ref) => {
        const field = get(_fields, name);
        if (field) {
            const defaultValue = get(_formValues, name, isUndefined(value) ? get(_defaultValues, name) : value);
            isUndefined(defaultValue) ||
                (ref && ref.defaultChecked) ||
                shouldSkipSetValueAs
                ? set$1(_formValues, name, shouldSkipSetValueAs ? defaultValue : getFieldValue(field._f))
                : setFieldValue(name, defaultValue);
            _state.mount && _setValid();
        }
    };
    const updateTouchAndDirty = (name, fieldValue, isBlurEvent, shouldDirty, shouldRender) => {
        let shouldUpdateField = false;
        let isPreviousDirty = false;
        const output = {
            name,
        };
        if (!_options.disabled) {
            if (!isBlurEvent || shouldDirty) {
                if (_proxyFormState.isDirty || _proxySubscribeFormState.isDirty) {
                    isPreviousDirty = _formState.isDirty;
                    _formState.isDirty = output.isDirty = _getDirty();
                    shouldUpdateField = isPreviousDirty !== output.isDirty;
                }
                const isCurrentFieldPristine = deepEqual(get(_defaultValues, name), fieldValue);
                isPreviousDirty = !!get(_formState.dirtyFields, name);
                isCurrentFieldPristine
                    ? unset(_formState.dirtyFields, name)
                    : set$1(_formState.dirtyFields, name, true);
                output.dirtyFields = _formState.dirtyFields;
                shouldUpdateField =
                    shouldUpdateField ||
                        ((_proxyFormState.dirtyFields ||
                            _proxySubscribeFormState.dirtyFields) &&
                            isPreviousDirty !== !isCurrentFieldPristine);
            }
            if (isBlurEvent) {
                const isPreviousFieldTouched = get(_formState.touchedFields, name);
                if (!isPreviousFieldTouched) {
                    set$1(_formState.touchedFields, name, isBlurEvent);
                    output.touchedFields = _formState.touchedFields;
                    shouldUpdateField =
                        shouldUpdateField ||
                            ((_proxyFormState.touchedFields ||
                                _proxySubscribeFormState.touchedFields) &&
                                isPreviousFieldTouched !== isBlurEvent);
                }
            }
            shouldUpdateField && shouldRender && _subjects.state.next(output);
        }
        return shouldUpdateField ? output : {};
    };
    const shouldRenderByError = (name, isValid, error, fieldState) => {
        const previousFieldError = get(_formState.errors, name);
        const shouldUpdateValid = (_proxyFormState.isValid || _proxySubscribeFormState.isValid) &&
            isBoolean(isValid) &&
            _formState.isValid !== isValid;
        if (_options.delayError && error) {
            delayErrorCallback = debounce(() => updateErrors(name, error));
            delayErrorCallback(_options.delayError);
        }
        else {
            clearTimeout(timer);
            delayErrorCallback = null;
            error
                ? set$1(_formState.errors, name, error)
                : unset(_formState.errors, name);
        }
        if ((error ? !deepEqual(previousFieldError, error) : previousFieldError) ||
            !isEmptyObject(fieldState) ||
            shouldUpdateValid) {
            const updatedFormState = {
                ...fieldState,
                ...(shouldUpdateValid && isBoolean(isValid) ? { isValid } : {}),
                errors: _formState.errors,
                name,
            };
            _formState = {
                ..._formState,
                ...updatedFormState,
            };
            _subjects.state.next(updatedFormState);
        }
    };
    const _runSchema = async (name) => {
        _updateIsValidating(name, true);
        const result = await _options.resolver(_formValues, _options.context, getResolverOptions(name || _names.mount, _fields, _options.criteriaMode, _options.shouldUseNativeValidation));
        _updateIsValidating(name);
        return result;
    };
    const executeSchemaAndUpdateState = async (names) => {
        const { errors } = await _runSchema(names);
        if (names) {
            for (const name of names) {
                const error = get(errors, name);
                error
                    ? set$1(_formState.errors, name, error)
                    : unset(_formState.errors, name);
            }
        }
        else {
            _formState.errors = errors;
        }
        return errors;
    };
    const executeBuiltInValidation = async (fields, shouldOnlyCheckValid, context = {
        valid: true,
    }) => {
        for (const name in fields) {
            const field = fields[name];
            if (field) {
                const { _f, ...fieldValue } = field;
                if (_f) {
                    const isFieldArrayRoot = _names.array.has(_f.name);
                    const isPromiseFunction = field._f && hasPromiseValidation(field._f);
                    if (isPromiseFunction && _proxyFormState.validatingFields) {
                        _updateIsValidating([_f.name], true);
                    }
                    const fieldError = await validateField(field, _names.disabled, _formValues, shouldDisplayAllAssociatedErrors, _options.shouldUseNativeValidation && !shouldOnlyCheckValid, isFieldArrayRoot);
                    if (isPromiseFunction && _proxyFormState.validatingFields) {
                        _updateIsValidating([_f.name]);
                    }
                    if (fieldError[_f.name]) {
                        context.valid = false;
                        if (shouldOnlyCheckValid) {
                            break;
                        }
                    }
                    !shouldOnlyCheckValid &&
                        (get(fieldError, _f.name)
                            ? isFieldArrayRoot
                                ? updateFieldArrayRootError(_formState.errors, fieldError, _f.name)
                                : set$1(_formState.errors, _f.name, fieldError[_f.name])
                            : unset(_formState.errors, _f.name));
                }
                !isEmptyObject(fieldValue) &&
                    (await executeBuiltInValidation(fieldValue, shouldOnlyCheckValid, context));
            }
        }
        return context.valid;
    };
    const _removeUnmounted = () => {
        for (const name of _names.unMount) {
            const field = get(_fields, name);
            field &&
                (field._f.refs
                    ? field._f.refs.every((ref) => !live(ref))
                    : !live(field._f.ref)) &&
                unregister(name);
        }
        _names.unMount = new Set();
    };
    const _getDirty = (name, data) => !_options.disabled &&
        (name && data && set$1(_formValues, name, data),
            !deepEqual(getValues(), _defaultValues));
    const _getWatch = (names, defaultValue, isGlobal) => generateWatchOutput(names, _names, {
        ...(_state.mount
            ? _formValues
            : isUndefined(defaultValue)
                ? _defaultValues
                : isString(names)
                    ? { [names]: defaultValue }
                    : defaultValue),
    }, isGlobal, defaultValue);
    const _getFieldArray = (name) => compact(get(_state.mount ? _formValues : _defaultValues, name, _options.shouldUnregister ? get(_defaultValues, name, []) : []));
    const setFieldValue = (name, value, options = {}) => {
        const field = get(_fields, name);
        let fieldValue = value;
        if (field) {
            const fieldReference = field._f;
            if (fieldReference) {
                !fieldReference.disabled &&
                    set$1(_formValues, name, getFieldValueAs(value, fieldReference));
                fieldValue =
                    isHTMLElement(fieldReference.ref) && isNullOrUndefined(value)
                        ? ''
                        : value;
                if (isMultipleSelect(fieldReference.ref)) {
                    [...fieldReference.ref.options].forEach((optionRef) => (optionRef.selected = fieldValue.includes(optionRef.value)));
                }
                else if (fieldReference.refs) {
                    if (isCheckBoxInput(fieldReference.ref)) {
                        fieldReference.refs.forEach((checkboxRef) => {
                            if (!checkboxRef.defaultChecked || !checkboxRef.disabled) {
                                if (Array.isArray(fieldValue)) {
                                    checkboxRef.checked = !!fieldValue.find((data) => data === checkboxRef.value);
                                }
                                else {
                                    checkboxRef.checked =
                                        fieldValue === checkboxRef.value || !!fieldValue;
                                }
                            }
                        });
                    }
                    else {
                        fieldReference.refs.forEach((radioRef) => (radioRef.checked = radioRef.value === fieldValue));
                    }
                }
                else if (isFileInput(fieldReference.ref)) {
                    fieldReference.ref.value = '';
                }
                else {
                    fieldReference.ref.value = fieldValue;
                    if (!fieldReference.ref.type) {
                        _subjects.state.next({
                            name,
                            values: cloneObject(_formValues),
                        });
                    }
                }
            }
        }
        (options.shouldDirty || options.shouldTouch) &&
            updateTouchAndDirty(name, fieldValue, options.shouldTouch, options.shouldDirty, true);
        options.shouldValidate && trigger(name);
    };
    const setValues = (name, value, options) => {
        for (const fieldKey in value) {
            if (!value.hasOwnProperty(fieldKey)) {
                return;
            }
            const fieldValue = value[fieldKey];
            const fieldName = name + '.' + fieldKey;
            const field = get(_fields, fieldName);
            (_names.array.has(name) ||
                isObject$2(fieldValue) ||
                (field && !field._f)) &&
                !isDateObject(fieldValue)
                ? setValues(fieldName, fieldValue, options)
                : setFieldValue(fieldName, fieldValue, options);
        }
    };
    const setValue = (name, value, options = {}) => {
        const field = get(_fields, name);
        const isFieldArray = _names.array.has(name);
        const cloneValue = cloneObject(value);
        set$1(_formValues, name, cloneValue);
        if (isFieldArray) {
            _subjects.array.next({
                name,
                values: cloneObject(_formValues),
            });
            if ((_proxyFormState.isDirty ||
                _proxyFormState.dirtyFields ||
                _proxySubscribeFormState.isDirty ||
                _proxySubscribeFormState.dirtyFields) &&
                options.shouldDirty) {
                _subjects.state.next({
                    name,
                    dirtyFields: getDirtyFields(_defaultValues, _formValues),
                    isDirty: _getDirty(name, cloneValue),
                });
            }
        }
        else {
            field && !field._f && !isNullOrUndefined(cloneValue)
                ? setValues(name, cloneValue, options)
                : setFieldValue(name, cloneValue, options);
        }
        isWatched(name, _names) && _subjects.state.next({ ..._formState, name });
        _subjects.state.next({
            name: _state.mount ? name : undefined,
            values: cloneObject(_formValues),
        });
    };
    const onChange = async (event) => {
        _state.mount = true;
        const target = event.target;
        let name = target.name;
        let isFieldValueUpdated = true;
        const field = get(_fields, name);
        const _updateIsFieldValueUpdated = (fieldValue) => {
            isFieldValueUpdated =
                Number.isNaN(fieldValue) ||
                    (isDateObject(fieldValue) && isNaN(fieldValue.getTime())) ||
                    deepEqual(fieldValue, get(_formValues, name, fieldValue));
        };
        const validationModeBeforeSubmit = getValidationModes(_options.mode);
        const validationModeAfterSubmit = getValidationModes(_options.reValidateMode);
        if (field) {
            let error;
            let isValid;
            const fieldValue = target.type
                ? getFieldValue(field._f)
                : getEventValue(event);
            const isBlurEvent = event.type === EVENTS.BLUR || event.type === EVENTS.FOCUS_OUT;
            const shouldSkipValidation = (!hasValidation(field._f) &&
                !_options.resolver &&
                !get(_formState.errors, name) &&
                !field._f.deps) ||
                skipValidation(isBlurEvent, get(_formState.touchedFields, name), _formState.isSubmitted, validationModeAfterSubmit, validationModeBeforeSubmit);
            const watched = isWatched(name, _names, isBlurEvent);
            set$1(_formValues, name, fieldValue);
            if (isBlurEvent) {
                if (!target || !target.readOnly) {
                    field._f.onBlur && field._f.onBlur(event);
                    delayErrorCallback && delayErrorCallback(0);
                }
            }
            else if (field._f.onChange) {
                field._f.onChange(event);
            }
            const fieldState = updateTouchAndDirty(name, fieldValue, isBlurEvent);
            const shouldRender = !isEmptyObject(fieldState) || watched;
            !isBlurEvent &&
                _subjects.state.next({
                    name,
                    type: event.type,
                    values: cloneObject(_formValues),
                });
            if (shouldSkipValidation) {
                if (_proxyFormState.isValid || _proxySubscribeFormState.isValid) {
                    if (_options.mode === 'onBlur') {
                        if (isBlurEvent) {
                            _setValid();
                        }
                    }
                    else if (!isBlurEvent) {
                        _setValid();
                    }
                }
                return (shouldRender &&
                    _subjects.state.next({ name, ...(watched ? {} : fieldState) }));
            }
            !isBlurEvent && watched && _subjects.state.next({ ..._formState });
            if (_options.resolver) {
                const { errors } = await _runSchema([name]);
                _updateIsFieldValueUpdated(fieldValue);
                if (isFieldValueUpdated) {
                    const previousErrorLookupResult = schemaErrorLookup(_formState.errors, _fields, name);
                    const errorLookupResult = schemaErrorLookup(errors, _fields, previousErrorLookupResult.name || name);
                    error = errorLookupResult.error;
                    name = errorLookupResult.name;
                    isValid = isEmptyObject(errors);
                }
            }
            else {
                _updateIsValidating([name], true);
                error = (await validateField(field, _names.disabled, _formValues, shouldDisplayAllAssociatedErrors, _options.shouldUseNativeValidation))[name];
                _updateIsValidating([name]);
                _updateIsFieldValueUpdated(fieldValue);
                if (isFieldValueUpdated) {
                    if (error) {
                        isValid = false;
                    }
                    else if (_proxyFormState.isValid ||
                        _proxySubscribeFormState.isValid) {
                        isValid = await executeBuiltInValidation(_fields, true);
                    }
                }
            }
            if (isFieldValueUpdated) {
                field._f.deps &&
                    (!Array.isArray(field._f.deps) || field._f.deps.length > 0) &&
                    trigger(field._f.deps);
                shouldRenderByError(name, isValid, error, fieldState);
            }
        }
    };
    const _focusInput = (ref, key) => {
        if (get(_formState.errors, key) && ref.focus) {
            ref.focus();
            return 1;
        }
        return;
    };
    const trigger = async (name, options = {}) => {
        let isValid;
        let validationResult;
        const fieldNames = convertToArrayPayload(name);
        if (_options.resolver) {
            const errors = await executeSchemaAndUpdateState(isUndefined(name) ? name : fieldNames);
            isValid = isEmptyObject(errors);
            validationResult = name
                ? !fieldNames.some((name) => get(errors, name))
                : isValid;
        }
        else if (name) {
            validationResult = (await Promise.all(fieldNames.map(async (fieldName) => {
                const field = get(_fields, fieldName);
                return await executeBuiltInValidation(field && field._f ? { [fieldName]: field } : field);
            }))).every(Boolean);
            !(!validationResult && !_formState.isValid) && _setValid();
        }
        else {
            validationResult = isValid = await executeBuiltInValidation(_fields);
        }
        _subjects.state.next({
            ...(!isString(name) ||
                ((_proxyFormState.isValid || _proxySubscribeFormState.isValid) &&
                    isValid !== _formState.isValid)
                ? {}
                : { name }),
            ...(_options.resolver || !name ? { isValid } : {}),
            errors: _formState.errors,
        });
        options.shouldFocus &&
            !validationResult &&
            iterateFieldsByAction(_fields, _focusInput, name ? fieldNames : _names.mount);
        return validationResult;
    };
    const getValues = (fieldNames, config) => {
        let values = {
            ...(_state.mount ? _formValues : _defaultValues),
        };
        if (config) {
            values = extractFormValues(config.dirtyFields ? _formState.dirtyFields : _formState.touchedFields, values);
        }
        return isUndefined(fieldNames)
            ? values
            : isString(fieldNames)
                ? get(values, fieldNames)
                : fieldNames.map((name) => get(values, name));
    };
    const getFieldState = (name, formState) => ({
        invalid: !!get((formState || _formState).errors, name),
        isDirty: !!get((formState || _formState).dirtyFields, name),
        error: get((formState || _formState).errors, name),
        isValidating: !!get(_formState.validatingFields, name),
        isTouched: !!get((formState || _formState).touchedFields, name),
    });
    const clearErrors = (name) => {
        name &&
            convertToArrayPayload(name).forEach((inputName) => unset(_formState.errors, inputName));
        _subjects.state.next({
            errors: name ? _formState.errors : {},
        });
    };
    const setError = (name, error, options) => {
        const ref = (get(_fields, name, { _f: {} })._f || {}).ref;
        const currentError = get(_formState.errors, name) || {};
        // Don't override existing error messages elsewhere in the object tree.
        const { ref: currentRef, message, type, ...restOfErrorTree } = currentError;
        set$1(_formState.errors, name, {
            ...restOfErrorTree,
            ...error,
            ref,
        });
        _subjects.state.next({
            name,
            errors: _formState.errors,
            isValid: false,
        });
        options && options.shouldFocus && ref && ref.focus && ref.focus();
    };
    const watch = (name, defaultValue) => isFunction(name)
        ? _subjects.state.subscribe({
            next: (payload) => 'values' in payload &&
                name(_getWatch(undefined, defaultValue), payload),
        })
        : _getWatch(name, defaultValue, true);
    const _subscribe = (props) => _subjects.state.subscribe({
        next: (formState) => {
            if (shouldSubscribeByName(props.name, formState.name, props.exact) &&
                shouldRenderFormState(formState, props.formState || _proxyFormState, _setFormState, props.reRenderRoot)) {
                props.callback({
                    values: { ..._formValues },
                    ..._formState,
                    ...formState,
                    defaultValues: _defaultValues,
                });
            }
        },
    }).unsubscribe;
    const subscribe = (props) => {
        _state.mount = true;
        _proxySubscribeFormState = {
            ..._proxySubscribeFormState,
            ...props.formState,
        };
        return _subscribe({
            ...props,
            formState: _proxySubscribeFormState,
        });
    };
    const unregister = (name, options = {}) => {
        for (const fieldName of name ? convertToArrayPayload(name) : _names.mount) {
            _names.mount.delete(fieldName);
            _names.array.delete(fieldName);
            if (!options.keepValue) {
                unset(_fields, fieldName);
                unset(_formValues, fieldName);
            }
            !options.keepError && unset(_formState.errors, fieldName);
            !options.keepDirty && unset(_formState.dirtyFields, fieldName);
            !options.keepTouched && unset(_formState.touchedFields, fieldName);
            !options.keepIsValidating &&
                unset(_formState.validatingFields, fieldName);
            !_options.shouldUnregister &&
                !options.keepDefaultValue &&
                unset(_defaultValues, fieldName);
        }
        _subjects.state.next({
            values: cloneObject(_formValues),
        });
        _subjects.state.next({
            ..._formState,
            ...(!options.keepDirty ? {} : { isDirty: _getDirty() }),
        });
        !options.keepIsValid && _setValid();
    };
    const _setDisabledField = ({ disabled, name, }) => {
        if ((isBoolean(disabled) && _state.mount) ||
            !!disabled ||
            _names.disabled.has(name)) {
            disabled ? _names.disabled.add(name) : _names.disabled.delete(name);
        }
    };
    const register = (name, options = {}) => {
        let field = get(_fields, name);
        const disabledIsDefined = isBoolean(options.disabled) || isBoolean(_options.disabled);
        set$1(_fields, name, {
            ...(field || {}),
            _f: {
                ...(field && field._f ? field._f : { ref: { name } }),
                name,
                mount: true,
                ...options,
            },
        });
        _names.mount.add(name);
        if (field) {
            _setDisabledField({
                disabled: isBoolean(options.disabled)
                    ? options.disabled
                    : _options.disabled,
                name,
            });
        }
        else {
            updateValidAndValue(name, true, options.value);
        }
        return {
            ...(disabledIsDefined
                ? { disabled: options.disabled || _options.disabled }
                : {}),
            ...(_options.progressive
                ? {
                    required: !!options.required,
                    min: getRuleValue(options.min),
                    max: getRuleValue(options.max),
                    minLength: getRuleValue(options.minLength),
                    maxLength: getRuleValue(options.maxLength),
                    pattern: getRuleValue(options.pattern),
                }
                : {}),
            name,
            onChange,
            onBlur: onChange,
            ref: (ref) => {
                if (ref) {
                    register(name, options);
                    field = get(_fields, name);
                    const fieldRef = isUndefined(ref.value)
                        ? ref.querySelectorAll
                            ? ref.querySelectorAll('input,select,textarea')[0] || ref
                            : ref
                        : ref;
                    const radioOrCheckbox = isRadioOrCheckbox(fieldRef);
                    const refs = field._f.refs || [];
                    if (radioOrCheckbox
                        ? refs.find((option) => option === fieldRef)
                        : fieldRef === field._f.ref) {
                        return;
                    }
                    set$1(_fields, name, {
                        _f: {
                            ...field._f,
                            ...(radioOrCheckbox
                                ? {
                                    refs: [
                                        ...refs.filter(live),
                                        fieldRef,
                                        ...(Array.isArray(get(_defaultValues, name)) ? [{}] : []),
                                    ],
                                    ref: { type: fieldRef.type, name },
                                }
                                : { ref: fieldRef }),
                        },
                    });
                    updateValidAndValue(name, false, undefined, fieldRef);
                }
                else {
                    field = get(_fields, name, {});
                    if (field._f) {
                        field._f.mount = false;
                    }
                    (_options.shouldUnregister || options.shouldUnregister) &&
                        !(isNameInFieldArray(_names.array, name) && _state.action) &&
                        _names.unMount.add(name);
                }
            },
        };
    };
    const _focusError = () => _options.shouldFocusError &&
        iterateFieldsByAction(_fields, _focusInput, _names.mount);
    const _disableForm = (disabled) => {
        if (isBoolean(disabled)) {
            _subjects.state.next({ disabled });
            iterateFieldsByAction(_fields, (ref, name) => {
                const currentField = get(_fields, name);
                if (currentField) {
                    ref.disabled = currentField._f.disabled || disabled;
                    if (Array.isArray(currentField._f.refs)) {
                        currentField._f.refs.forEach((inputRef) => {
                            inputRef.disabled = currentField._f.disabled || disabled;
                        });
                    }
                }
            }, 0, false);
        }
    };
    const handleSubmit = (onValid, onInvalid) => async (e) => {
        let onValidError = undefined;
        if (e) {
            e.preventDefault && e.preventDefault();
            e.persist &&
                e.persist();
        }
        let fieldValues = cloneObject(_formValues);
        _subjects.state.next({
            isSubmitting: true,
        });
        if (_options.resolver) {
            const { errors, values } = await _runSchema();
            _formState.errors = errors;
            fieldValues = cloneObject(values);
        }
        else {
            await executeBuiltInValidation(_fields);
        }
        if (_names.disabled.size) {
            for (const name of _names.disabled) {
                unset(fieldValues, name);
            }
        }
        unset(_formState.errors, 'root');
        if (isEmptyObject(_formState.errors)) {
            _subjects.state.next({
                errors: {},
            });
            try {
                await onValid(fieldValues, e);
            }
            catch (error) {
                onValidError = error;
            }
        }
        else {
            if (onInvalid) {
                await onInvalid({ ..._formState.errors }, e);
            }
            _focusError();
            setTimeout(_focusError);
        }
        _subjects.state.next({
            isSubmitted: true,
            isSubmitting: false,
            isSubmitSuccessful: isEmptyObject(_formState.errors) && !onValidError,
            submitCount: _formState.submitCount + 1,
            errors: _formState.errors,
        });
        if (onValidError) {
            throw onValidError;
        }
    };
    const resetField = (name, options = {}) => {
        if (get(_fields, name)) {
            if (isUndefined(options.defaultValue)) {
                setValue(name, cloneObject(get(_defaultValues, name)));
            }
            else {
                setValue(name, options.defaultValue);
                set$1(_defaultValues, name, cloneObject(options.defaultValue));
            }
            if (!options.keepTouched) {
                unset(_formState.touchedFields, name);
            }
            if (!options.keepDirty) {
                unset(_formState.dirtyFields, name);
                _formState.isDirty = options.defaultValue
                    ? _getDirty(name, cloneObject(get(_defaultValues, name)))
                    : _getDirty();
            }
            if (!options.keepError) {
                unset(_formState.errors, name);
                _proxyFormState.isValid && _setValid();
            }
            _subjects.state.next({ ..._formState });
        }
    };
    const _reset = (formValues, keepStateOptions = {}) => {
        const updatedValues = formValues ? cloneObject(formValues) : _defaultValues;
        const cloneUpdatedValues = cloneObject(updatedValues);
        const isEmptyResetValues = isEmptyObject(formValues);
        const values = isEmptyResetValues ? _defaultValues : cloneUpdatedValues;
        if (!keepStateOptions.keepDefaultValues) {
            _defaultValues = updatedValues;
        }
        if (!keepStateOptions.keepValues) {
            if (keepStateOptions.keepDirtyValues) {
                const fieldsToCheck = new Set([
                    ..._names.mount,
                    ...Object.keys(getDirtyFields(_defaultValues, _formValues)),
                ]);
                for (const fieldName of Array.from(fieldsToCheck)) {
                    get(_formState.dirtyFields, fieldName)
                        ? set$1(values, fieldName, get(_formValues, fieldName))
                        : setValue(fieldName, get(values, fieldName));
                }
            }
            else {
                if (isWeb && isUndefined(formValues)) {
                    for (const name of _names.mount) {
                        const field = get(_fields, name);
                        if (field && field._f) {
                            const fieldReference = Array.isArray(field._f.refs)
                                ? field._f.refs[0]
                                : field._f.ref;
                            if (isHTMLElement(fieldReference)) {
                                const form = fieldReference.closest('form');
                                if (form) {
                                    form.reset();
                                    break;
                                }
                            }
                        }
                    }
                }
                if (keepStateOptions.keepFieldsRef) {
                    for (const fieldName of _names.mount) {
                        setValue(fieldName, get(values, fieldName));
                    }
                }
                else {
                    _fields = {};
                }
            }
            _formValues = _options.shouldUnregister
                ? keepStateOptions.keepDefaultValues
                    ? cloneObject(_defaultValues)
                    : {}
                : cloneObject(values);
            _subjects.array.next({
                values: { ...values },
            });
            _subjects.state.next({
                values: { ...values },
            });
        }
        _names = {
            mount: keepStateOptions.keepDirtyValues ? _names.mount : new Set(),
            unMount: new Set(),
            array: new Set(),
            disabled: new Set(),
            watch: new Set(),
            watchAll: false,
            focus: '',
        };
        _state.mount =
            !_proxyFormState.isValid ||
                !!keepStateOptions.keepIsValid ||
                !!keepStateOptions.keepDirtyValues ||
                (!_options.shouldUnregister && !isEmptyObject(values));
        _state.watch = !!_options.shouldUnregister;
        _subjects.state.next({
            submitCount: keepStateOptions.keepSubmitCount
                ? _formState.submitCount
                : 0,
            isDirty: isEmptyResetValues
                ? false
                : keepStateOptions.keepDirty
                    ? _formState.isDirty
                    : !!(keepStateOptions.keepDefaultValues &&
                        !deepEqual(formValues, _defaultValues)),
            isSubmitted: keepStateOptions.keepIsSubmitted
                ? _formState.isSubmitted
                : false,
            dirtyFields: isEmptyResetValues
                ? {}
                : keepStateOptions.keepDirtyValues
                    ? keepStateOptions.keepDefaultValues && _formValues
                        ? getDirtyFields(_defaultValues, _formValues)
                        : _formState.dirtyFields
                    : keepStateOptions.keepDefaultValues && formValues
                        ? getDirtyFields(_defaultValues, formValues)
                        : keepStateOptions.keepDirty
                            ? _formState.dirtyFields
                            : {},
            touchedFields: keepStateOptions.keepTouched
                ? _formState.touchedFields
                : {},
            errors: keepStateOptions.keepErrors ? _formState.errors : {},
            isSubmitSuccessful: keepStateOptions.keepIsSubmitSuccessful
                ? _formState.isSubmitSuccessful
                : false,
            isSubmitting: false,
            defaultValues: _defaultValues,
        });
    };
    const reset = (formValues, keepStateOptions) => _reset(isFunction(formValues)
        ? formValues(_formValues)
        : formValues, keepStateOptions);
    const setFocus = (name, options = {}) => {
        const field = get(_fields, name);
        const fieldReference = field && field._f;
        if (fieldReference) {
            const fieldRef = fieldReference.refs
                ? fieldReference.refs[0]
                : fieldReference.ref;
            if (fieldRef.focus) {
                fieldRef.focus();
                options.shouldSelect &&
                    isFunction(fieldRef.select) &&
                    fieldRef.select();
            }
        }
    };
    const _setFormState = (updatedFormState) => {
        _formState = {
            ..._formState,
            ...updatedFormState,
        };
    };
    const _resetDefaultValues = () => isFunction(_options.defaultValues) &&
        _options.defaultValues().then((values) => {
            reset(values, _options.resetOptions);
            _subjects.state.next({
                isLoading: false,
            });
        });
    const methods = {
        control: {
            register,
            unregister,
            getFieldState,
            handleSubmit,
            setError,
            _subscribe,
            _runSchema,
            _focusError,
            _getWatch,
            _getDirty,
            _setValid,
            _setFieldArray,
            _setDisabledField,
            _setErrors,
            _getFieldArray,
            _reset,
            _resetDefaultValues,
            _removeUnmounted,
            _disableForm,
            _subjects,
            _proxyFormState,
            get _fields() {
                return _fields;
            },
            get _formValues() {
                return _formValues;
            },
            get _state() {
                return _state;
            },
            set _state(value) {
                _state = value;
            },
            get _defaultValues() {
                return _defaultValues;
            },
            get _names() {
                return _names;
            },
            set _names(value) {
                _names = value;
            },
            get _formState() {
                return _formState;
            },
            get _options() {
                return _options;
            },
            set _options(value) {
                _options = {
                    ..._options,
                    ...value,
                };
            },
        },
        subscribe,
        trigger,
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        reset,
        resetField,
        clearErrors,
        unregister,
        setError,
        setFocus,
        getFieldState,
    };
    return {
        ...methods,
        formControl: methods,
    };
}

var generateId$1 = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    const d = typeof performance === 'undefined' ? Date.now() : performance.now() * 1000;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16 + d) % 16 | 0;
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
};

var getFocusFieldName = (name, index, options = {}) => options.shouldFocus || isUndefined(options.shouldFocus)
    ? options.focusName ||
        `${name}.${isUndefined(options.focusIndex) ? index : options.focusIndex}.`
    : '';

var appendAt = (data, value) => [
    ...data,
    ...convertToArrayPayload(value),
];

var fillEmptyArray = (value) => Array.isArray(value) ? value.map(() => undefined) : undefined;

function insert(data, index, value) {
    return [
        ...data.slice(0, index),
        ...convertToArrayPayload(value),
        ...data.slice(index),
    ];
}

var moveArrayAt = (data, from, to) => {
    if (!Array.isArray(data)) {
        return [];
    }
    if (isUndefined(data[to])) {
        data[to] = undefined;
    }
    data.splice(to, 0, data.splice(from, 1)[0]);
    return data;
};

var prependAt = (data, value) => [
    ...convertToArrayPayload(value),
    ...convertToArrayPayload(data),
];

function removeAtIndexes(data, indexes) {
    let i = 0;
    const temp = [...data];
    for (const index of indexes) {
        temp.splice(index - i, 1);
        i++;
    }
    return compact(temp).length ? temp : [];
}
var removeArrayAt = (data, index) => isUndefined(index)
    ? []
    : removeAtIndexes(data, convertToArrayPayload(index).sort((a, b) => a - b));

var swapArrayAt = (data, indexA, indexB) => {
    [data[indexA], data[indexB]] = [data[indexB], data[indexA]];
};

var updateAt = (fieldValues, index, value) => {
    fieldValues[index] = value;
    return fieldValues;
};

/**
 * A custom hook that exposes convenient methods to perform operations with a list of dynamic inputs that need to be appended, updated, removed etc. • [Demo](https://codesandbox.io/s/react-hook-form-usefieldarray-ssugn) • [Video](https://youtu.be/4MrbfGSFY2A)
 *
 * @remarks
 * [API](https://react-hook-form.com/docs/usefieldarray) • [Demo](https://codesandbox.io/s/react-hook-form-usefieldarray-ssugn)
 *
 * @param props - useFieldArray props
 *
 * @returns methods - functions to manipulate with the Field Arrays (dynamic inputs) {@link UseFieldArrayReturn}
 *
 * @example
 * ```tsx
 * function App() {
 *   const { register, control, handleSubmit, reset, trigger, setError } = useForm({
 *     defaultValues: {
 *       test: []
 *     }
 *   });
 *   const { fields, append } = useFieldArray({
 *     control,
 *     name: "test"
 *   });
 *
 *   return (
 *     <form onSubmit={handleSubmit(data => console.log(data))}>
 *       {fields.map((item, index) => (
 *          <input key={item.id} {...register(`test.${index}.firstName`)}  />
 *       ))}
 *       <button type="button" onClick={() => append({ firstName: "bill" })}>
 *         append
 *       </button>
 *       <input type="submit" />
 *     </form>
 *   );
 * }
 * ```
 */
function useFieldArray(props) {
    const methods = useFormContext();
    const { control = methods.control, name, keyName = 'id', shouldUnregister, rules, } = props;
    const [fields, setFields] = React.useState(control._getFieldArray(name));
    const ids = React.useRef(control._getFieldArray(name).map(generateId$1));
    const _actioned = React.useRef(false);
    control._names.array.add(name);
    React.useMemo(() => rules &&
        fields.length >= 0 &&
        control.register(name, rules), [control, name, fields.length, rules]);
    useIsomorphicLayoutEffect(() => control._subjects.array.subscribe({
        next: ({ values, name: fieldArrayName, }) => {
            if (fieldArrayName === name || !fieldArrayName) {
                const fieldValues = get(values, name);
                if (Array.isArray(fieldValues)) {
                    setFields(fieldValues);
                    ids.current = fieldValues.map(generateId$1);
                }
            }
        },
    }).unsubscribe, [control, name]);
    const updateValues = React.useCallback((updatedFieldArrayValues) => {
        _actioned.current = true;
        control._setFieldArray(name, updatedFieldArrayValues);
    }, [control, name]);
    const append = (value, options) => {
        const appendValue = convertToArrayPayload(cloneObject(value));
        const updatedFieldArrayValues = appendAt(control._getFieldArray(name), appendValue);
        control._names.focus = getFocusFieldName(name, updatedFieldArrayValues.length - 1, options);
        ids.current = appendAt(ids.current, appendValue.map(generateId$1));
        updateValues(updatedFieldArrayValues);
        setFields(updatedFieldArrayValues);
        control._setFieldArray(name, updatedFieldArrayValues, appendAt, {
            argA: fillEmptyArray(value),
        });
    };
    const prepend = (value, options) => {
        const prependValue = convertToArrayPayload(cloneObject(value));
        const updatedFieldArrayValues = prependAt(control._getFieldArray(name), prependValue);
        control._names.focus = getFocusFieldName(name, 0, options);
        ids.current = prependAt(ids.current, prependValue.map(generateId$1));
        updateValues(updatedFieldArrayValues);
        setFields(updatedFieldArrayValues);
        control._setFieldArray(name, updatedFieldArrayValues, prependAt, {
            argA: fillEmptyArray(value),
        });
    };
    const remove = (index) => {
        const updatedFieldArrayValues = removeArrayAt(control._getFieldArray(name), index);
        ids.current = removeArrayAt(ids.current, index);
        updateValues(updatedFieldArrayValues);
        setFields(updatedFieldArrayValues);
        !Array.isArray(get(control._fields, name)) &&
            set$1(control._fields, name, undefined);
        control._setFieldArray(name, updatedFieldArrayValues, removeArrayAt, {
            argA: index,
        });
    };
    const insert$1 = (index, value, options) => {
        const insertValue = convertToArrayPayload(cloneObject(value));
        const updatedFieldArrayValues = insert(control._getFieldArray(name), index, insertValue);
        control._names.focus = getFocusFieldName(name, index, options);
        ids.current = insert(ids.current, index, insertValue.map(generateId$1));
        updateValues(updatedFieldArrayValues);
        setFields(updatedFieldArrayValues);
        control._setFieldArray(name, updatedFieldArrayValues, insert, {
            argA: index,
            argB: fillEmptyArray(value),
        });
    };
    const swap = (indexA, indexB) => {
        const updatedFieldArrayValues = control._getFieldArray(name);
        swapArrayAt(updatedFieldArrayValues, indexA, indexB);
        swapArrayAt(ids.current, indexA, indexB);
        updateValues(updatedFieldArrayValues);
        setFields(updatedFieldArrayValues);
        control._setFieldArray(name, updatedFieldArrayValues, swapArrayAt, {
            argA: indexA,
            argB: indexB,
        }, false);
    };
    const move = (from, to) => {
        const updatedFieldArrayValues = control._getFieldArray(name);
        moveArrayAt(updatedFieldArrayValues, from, to);
        moveArrayAt(ids.current, from, to);
        updateValues(updatedFieldArrayValues);
        setFields(updatedFieldArrayValues);
        control._setFieldArray(name, updatedFieldArrayValues, moveArrayAt, {
            argA: from,
            argB: to,
        }, false);
    };
    const update = (index, value) => {
        const updateValue = cloneObject(value);
        const updatedFieldArrayValues = updateAt(control._getFieldArray(name), index, updateValue);
        ids.current = [...updatedFieldArrayValues].map((item, i) => !item || i === index ? generateId$1() : ids.current[i]);
        updateValues(updatedFieldArrayValues);
        setFields([...updatedFieldArrayValues]);
        control._setFieldArray(name, updatedFieldArrayValues, updateAt, {
            argA: index,
            argB: updateValue,
        }, true, false);
    };
    const replace = (value) => {
        const updatedFieldArrayValues = convertToArrayPayload(cloneObject(value));
        ids.current = updatedFieldArrayValues.map(generateId$1);
        updateValues([...updatedFieldArrayValues]);
        setFields([...updatedFieldArrayValues]);
        control._setFieldArray(name, [...updatedFieldArrayValues], (data) => data, {}, true, false);
    };
    React.useEffect(() => {
        control._state.action = false;
        isWatched(name, control._names) &&
            control._subjects.state.next({
                ...control._formState,
            });
        if (_actioned.current &&
            (!getValidationModes(control._options.mode).isOnSubmit ||
                control._formState.isSubmitted) &&
            !getValidationModes(control._options.reValidateMode).isOnSubmit) {
            if (control._options.resolver) {
                control._runSchema([name]).then((result) => {
                    const error = get(result.errors, name);
                    const existingError = get(control._formState.errors, name);
                    if (existingError
                        ? (!error && existingError.type) ||
                            (error &&
                                (existingError.type !== error.type ||
                                    existingError.message !== error.message))
                        : error && error.type) {
                        error
                            ? set$1(control._formState.errors, name, error)
                            : unset(control._formState.errors, name);
                        control._subjects.state.next({
                            errors: control._formState.errors,
                        });
                    }
                });
            }
            else {
                const field = get(control._fields, name);
                if (field &&
                    field._f &&
                    !(getValidationModes(control._options.reValidateMode).isOnSubmit &&
                        getValidationModes(control._options.mode).isOnSubmit)) {
                    validateField(field, control._names.disabled, control._formValues, control._options.criteriaMode === VALIDATION_MODE.all, control._options.shouldUseNativeValidation, true).then((error) => !isEmptyObject(error) &&
                        control._subjects.state.next({
                            errors: updateFieldArrayRootError(control._formState.errors, error, name),
                        }));
                }
            }
        }
        control._subjects.state.next({
            name,
            values: cloneObject(control._formValues),
        });
        control._names.focus &&
            iterateFieldsByAction(control._fields, (ref, key) => {
                if (control._names.focus &&
                    key.startsWith(control._names.focus) &&
                    ref.focus) {
                    ref.focus();
                    return 1;
                }
                return;
            });
        control._names.focus = '';
        control._setValid();
        _actioned.current = false;
    }, [fields, name, control]);
    React.useEffect(() => {
        !get(control._formValues, name) && control._setFieldArray(name);
        return () => {
            const updateMounted = (name, value) => {
                const field = get(control._fields, name);
                if (field && field._f) {
                    field._f.mount = value;
                }
            };
            control._options.shouldUnregister || shouldUnregister
                ? control.unregister(name)
                : updateMounted(name, false);
        };
    }, [name, control, keyName, shouldUnregister]);
    return {
        swap: React.useCallback(swap, [updateValues, name, control]),
        move: React.useCallback(move, [updateValues, name, control]),
        prepend: React.useCallback(prepend, [updateValues, name, control]),
        append: React.useCallback(append, [updateValues, name, control]),
        remove: React.useCallback(remove, [updateValues, name, control]),
        insert: React.useCallback(insert$1, [updateValues, name, control]),
        update: React.useCallback(update, [updateValues, name, control]),
        replace: React.useCallback(replace, [updateValues, name, control]),
        fields: React.useMemo(() => fields.map((field, index) => ({
            ...field,
            [keyName]: ids.current[index] || generateId$1(),
        })), [fields, keyName]),
    };
}

/**
 * Custom hook to manage the entire form.
 *
 * @remarks
 * [API](https://react-hook-form.com/docs/useform) • [Demo](https://codesandbox.io/s/react-hook-form-get-started-ts-5ksmm) • [Video](https://www.youtube.com/watch?v=RkXv4AXXC_4)
 *
 * @param props - form configuration and validation parameters.
 *
 * @returns methods - individual functions to manage the form state. {@link UseFormReturn}
 *
 * @example
 * ```tsx
 * function App() {
 *   const { register, handleSubmit, watch, formState: { errors } } = useForm();
 *   const onSubmit = data => console.log(data);
 *
 *   console.log(watch("example"));
 *
 *   return (
 *     <form onSubmit={handleSubmit(onSubmit)}>
 *       <input defaultValue="test" {...register("example")} />
 *       <input {...register("exampleRequired", { required: true })} />
 *       {errors.exampleRequired && <span>This field is required</span>}
 *       <button>Submit</button>
 *     </form>
 *   );
 * }
 * ```
 */
function useForm(props = {}) {
    const _formControl = React.useRef(undefined);
    const _values = React.useRef(undefined);
    const [formState, updateFormState] = React.useState({
        isDirty: false,
        isValidating: false,
        isLoading: isFunction(props.defaultValues),
        isSubmitted: false,
        isSubmitting: false,
        isSubmitSuccessful: false,
        isValid: false,
        submitCount: 0,
        dirtyFields: {},
        touchedFields: {},
        validatingFields: {},
        errors: props.errors || {},
        disabled: props.disabled || false,
        isReady: false,
        defaultValues: isFunction(props.defaultValues)
            ? undefined
            : props.defaultValues,
    });
    if (!_formControl.current) {
        if (props.formControl) {
            _formControl.current = {
                ...props.formControl,
                formState,
            };
            if (props.defaultValues && !isFunction(props.defaultValues)) {
                props.formControl.reset(props.defaultValues, props.resetOptions);
            }
        }
        else {
            const { formControl, ...rest } = createFormControl(props);
            _formControl.current = {
                ...rest,
                formState,
            };
        }
    }
    const control = _formControl.current.control;
    control._options = props;
    useIsomorphicLayoutEffect(() => {
        const sub = control._subscribe({
            formState: control._proxyFormState,
            callback: () => updateFormState({ ...control._formState }),
            reRenderRoot: true,
        });
        updateFormState((data) => ({
            ...data,
            isReady: true,
        }));
        control._formState.isReady = true;
        return sub;
    }, [control]);
    React.useEffect(() => control._disableForm(props.disabled), [control, props.disabled]);
    React.useEffect(() => {
        if (props.mode) {
            control._options.mode = props.mode;
        }
        if (props.reValidateMode) {
            control._options.reValidateMode = props.reValidateMode;
        }
    }, [control, props.mode, props.reValidateMode]);
    React.useEffect(() => {
        if (props.errors) {
            control._setErrors(props.errors);
            control._focusError();
        }
    }, [control, props.errors]);
    React.useEffect(() => {
        props.shouldUnregister &&
            control._subjects.state.next({
                values: control._getWatch(),
            });
    }, [control, props.shouldUnregister]);
    React.useEffect(() => {
        if (control._proxyFormState.isDirty) {
            const isDirty = control._getDirty();
            if (isDirty !== formState.isDirty) {
                control._subjects.state.next({
                    isDirty,
                });
            }
        }
    }, [control, formState.isDirty]);
    React.useEffect(() => {
        if (props.values && !deepEqual(props.values, _values.current)) {
            control._reset(props.values, {
                keepFieldsRef: true,
                ...control._options.resetOptions,
            });
            _values.current = props.values;
            updateFormState((state) => ({ ...state }));
        }
        else {
            control._resetDefaultValues();
        }
    }, [control, props.values]);
    React.useEffect(() => {
        if (!control._state.mount) {
            control._setValid();
            control._state.mount = true;
        }
        if (control._state.watch) {
            control._state.watch = false;
            control._subjects.state.next({ ...control._formState });
        }
        control._removeUnmounted();
    });
    _formControl.current.formState = getProxyFormState(formState, control);
    return _formControl.current;
}

/**
 * Watch component that subscribes to form field changes and re-renders when watched fields update.
 *
 * @param control - The form control object from useForm
 * @param names - Array of field names to watch for changes
 * @param render - The function that receives watched values and returns ReactNode
 * @returns The result of calling render function with watched values
 *
 * @example
 * The `Watch` component only re-render when the values of `foo`, `bar`, and `baz.qux` change.
 * The types of `foo`, `bar`, and `baz.qux` are precisely inferred.
 *
 * ```tsx
 * const { control } = useForm();
 *
 * <Watch
 *   control={control}
 *   names={['foo', 'bar', 'baz.qux']}
 *   render={([foo, bar, baz_qux]) => <div>{foo}{bar}{baz_qux}</div>}
 * />
 * ```
 */
const Watch = ({ control, names, render, }) => render(useWatch({ control, name: names }));

const r=(t,r,o)=>{if(t&&"reportValidity"in t){const s=get(o,r);t.setCustomValidity(s&&s.message||""),t.reportValidity();}},o=(e,t)=>{for(const o in t.fields){const s=t.fields[o];s&&s.ref&&"reportValidity"in s.ref?r(s.ref,o,e):s&&s.refs&&s.refs.forEach(t=>r(t,o,e));}},s$1=(r,s)=>{s.shouldUseNativeValidation&&o(r,s);const n={};for(const o in r){const f=get(s.fields,o),c=Object.assign(r[o]||{},{ref:f&&f.ref});if(i$1(s.names||Object.keys(r),o)){const r=Object.assign({},get(n,o));set$1(r,"root",c),set$1(n,o,r);}else set$1(n,o,c);}return n},i$1=(e,t)=>{const r=n(t);return e.some(e=>n(e).match(`^${r}\\.\\d+`))};function n(e){return e.replace(/\]|\[/g,"")}

/** A special constant with type `never` */
const NEVER$1 = Object.freeze({
    status: "aborted",
});
function $constructor$1(name, initializer, params) {
    function init(inst, def) {
        var _a;
        Object.defineProperty(inst, "_zod", {
            value: inst._zod ?? {},
            enumerable: false,
        });
        (_a = inst._zod).traits ?? (_a.traits = new Set());
        inst._zod.traits.add(name);
        initializer(inst, def);
        // support prototype modifications
        for (const k in _.prototype) {
            if (!(k in inst))
                Object.defineProperty(inst, k, { value: _.prototype[k].bind(inst) });
        }
        inst._zod.constr = _;
        inst._zod.def = def;
    }
    // doesn't work if Parent has a constructor with arguments
    const Parent = params?.Parent ?? Object;
    class Definition extends Parent {
    }
    Object.defineProperty(Definition, "name", { value: name });
    function _(def) {
        var _a;
        const inst = params?.Parent ? new Definition() : this;
        init(inst, def);
        (_a = inst._zod).deferred ?? (_a.deferred = []);
        for (const fn of inst._zod.deferred) {
            fn();
        }
        return inst;
    }
    Object.defineProperty(_, "init", { value: init });
    Object.defineProperty(_, Symbol.hasInstance, {
        value: (inst) => {
            if (params?.Parent && inst instanceof params.Parent)
                return true;
            return inst?._zod?.traits?.has(name);
        },
    });
    Object.defineProperty(_, "name", { value: name });
    return _;
}
//////////////////////////////   UTILITIES   ///////////////////////////////////////
const $brand$1 = Symbol("zod_brand");
let $ZodAsyncError$1 = class $ZodAsyncError extends Error {
    constructor() {
        super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
    }
};
const globalConfig$1 = {};
function config$1(newConfig) {
    if (newConfig)
        Object.assign(globalConfig$1, newConfig);
    return globalConfig$1;
}

// functions
function assertEqual$1(val) {
    return val;
}
function assertNotEqual$1(val) {
    return val;
}
function assertIs$1(_arg) { }
function assertNever$1(_x) {
    throw new Error();
}
function assert$1(_) { }
function getEnumValues$1(entries) {
    const numericValues = Object.values(entries).filter((v) => typeof v === "number");
    const values = Object.entries(entries)
        .filter(([k, _]) => numericValues.indexOf(+k) === -1)
        .map(([_, v]) => v);
    return values;
}
function joinValues$1(array, separator = "|") {
    return array.map((val) => stringifyPrimitive$1(val)).join(separator);
}
function jsonStringifyReplacer$1(_, value) {
    if (typeof value === "bigint")
        return value.toString();
    return value;
}
function cached$1(getter) {
    const set = false;
    return {
        get value() {
            if (!set) {
                const value = getter();
                Object.defineProperty(this, "value", { value });
                return value;
            }
            throw new Error("cached value already set");
        },
    };
}
function nullish$2(input) {
    return input === null || input === undefined;
}
function cleanRegex$1(source) {
    const start = source.startsWith("^") ? 1 : 0;
    const end = source.endsWith("$") ? source.length - 1 : source.length;
    return source.slice(start, end);
}
function floatSafeRemainder$1(val, step) {
    const valDecCount = (val.toString().split(".")[1] || "").length;
    const stepDecCount = (step.toString().split(".")[1] || "").length;
    const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
    const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
    return (valInt % stepInt) / 10 ** decCount;
}
function defineLazy$1(object, key, getter) {
    const set = false;
    Object.defineProperty(object, key, {
        get() {
            if (!set) {
                const value = getter();
                object[key] = value;
                return value;
            }
            throw new Error("cached value already set");
        },
        set(v) {
            Object.defineProperty(object, key, {
                value: v,
                // configurable: true,
            });
            // object[key] = v;
        },
        configurable: true,
    });
}
function assignProp$1(target, prop, value) {
    Object.defineProperty(target, prop, {
        value,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}
function getElementAtPath$1(obj, path) {
    if (!path)
        return obj;
    return path.reduce((acc, key) => acc?.[key], obj);
}
function promiseAllObject$1(promisesObj) {
    const keys = Object.keys(promisesObj);
    const promises = keys.map((key) => promisesObj[key]);
    return Promise.all(promises).then((results) => {
        const resolvedObj = {};
        for (let i = 0; i < keys.length; i++) {
            resolvedObj[keys[i]] = results[i];
        }
        return resolvedObj;
    });
}
function randomString$1(length = 10) {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    let str = "";
    for (let i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}
function esc$1(str) {
    return JSON.stringify(str);
}
const captureStackTrace$1 = Error.captureStackTrace
    ? Error.captureStackTrace
    : (..._args) => { };
function isObject$1(data) {
    return typeof data === "object" && data !== null && !Array.isArray(data);
}
const allowsEval$1 = cached$1(() => {
    if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
        return false;
    }
    try {
        const F = Function;
        new F("");
        return true;
    }
    catch (_) {
        return false;
    }
});
function isPlainObject$1(o) {
    if (isObject$1(o) === false)
        return false;
    // modified constructor
    const ctor = o.constructor;
    if (ctor === undefined)
        return true;
    // modified prototype
    const prot = ctor.prototype;
    if (isObject$1(prot) === false)
        return false;
    // ctor doesn't have static `isPrototypeOf`
    if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
        return false;
    }
    return true;
}
function numKeys$1(data) {
    let keyCount = 0;
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            keyCount++;
        }
    }
    return keyCount;
}
const getParsedType$1 = (data) => {
    const t = typeof data;
    switch (t) {
        case "undefined":
            return "undefined";
        case "string":
            return "string";
        case "number":
            return Number.isNaN(data) ? "nan" : "number";
        case "boolean":
            return "boolean";
        case "function":
            return "function";
        case "bigint":
            return "bigint";
        case "symbol":
            return "symbol";
        case "object":
            if (Array.isArray(data)) {
                return "array";
            }
            if (data === null) {
                return "null";
            }
            if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
                return "promise";
            }
            if (typeof Map !== "undefined" && data instanceof Map) {
                return "map";
            }
            if (typeof Set !== "undefined" && data instanceof Set) {
                return "set";
            }
            if (typeof Date !== "undefined" && data instanceof Date) {
                return "date";
            }
            if (typeof File !== "undefined" && data instanceof File) {
                return "file";
            }
            return "object";
        default:
            throw new Error(`Unknown data type: ${t}`);
    }
};
const propertyKeyTypes$1 = new Set(["string", "number", "symbol"]);
const primitiveTypes$1 = new Set(["string", "number", "bigint", "boolean", "symbol", "undefined"]);
function escapeRegex$1(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
// zod-specific utils
function clone$1(inst, def, params) {
    const cl = new inst._zod.constr(def ?? inst._zod.def);
    if (!def || params?.parent)
        cl._zod.parent = inst;
    return cl;
}
function normalizeParams$1(_params) {
    const params = _params;
    if (!params)
        return {};
    if (typeof params === "string")
        return { error: () => params };
    if (params?.message !== undefined) {
        if (params?.error !== undefined)
            throw new Error("Cannot specify both `message` and `error` params");
        params.error = params.message;
    }
    delete params.message;
    if (typeof params.error === "string")
        return { ...params, error: () => params.error };
    return params;
}
function createTransparentProxy$1(getter) {
    let target;
    return new Proxy({}, {
        get(_, prop, receiver) {
            target ?? (target = getter());
            return Reflect.get(target, prop, receiver);
        },
        set(_, prop, value, receiver) {
            target ?? (target = getter());
            return Reflect.set(target, prop, value, receiver);
        },
        has(_, prop) {
            target ?? (target = getter());
            return Reflect.has(target, prop);
        },
        deleteProperty(_, prop) {
            target ?? (target = getter());
            return Reflect.deleteProperty(target, prop);
        },
        ownKeys(_) {
            target ?? (target = getter());
            return Reflect.ownKeys(target);
        },
        getOwnPropertyDescriptor(_, prop) {
            target ?? (target = getter());
            return Reflect.getOwnPropertyDescriptor(target, prop);
        },
        defineProperty(_, prop, descriptor) {
            target ?? (target = getter());
            return Reflect.defineProperty(target, prop, descriptor);
        },
    });
}
function stringifyPrimitive$1(value) {
    if (typeof value === "bigint")
        return value.toString() + "n";
    if (typeof value === "string")
        return `"${value}"`;
    return `${value}`;
}
function optionalKeys$1(shape) {
    return Object.keys(shape).filter((k) => {
        return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
    });
}
const NUMBER_FORMAT_RANGES$1 = {
    safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
    int32: [-2147483648, 2147483647],
    uint32: [0, 4294967295],
    float32: [-3.4028234663852886e38, 3.4028234663852886e38],
    float64: [-Number.MAX_VALUE, Number.MAX_VALUE],
};
const BIGINT_FORMAT_RANGES$1 = {
    int64: [/* @__PURE__*/ BigInt("-9223372036854775808"), /* @__PURE__*/ BigInt("9223372036854775807")],
    uint64: [/* @__PURE__*/ BigInt(0), /* @__PURE__*/ BigInt("18446744073709551615")],
};
function pick$1(schema, mask) {
    const newShape = {};
    const currDef = schema._zod.def; //.shape;
    for (const key in mask) {
        if (!(key in currDef.shape)) {
            throw new Error(`Unrecognized key: "${key}"`);
        }
        if (!mask[key])
            continue;
        // pick key
        newShape[key] = currDef.shape[key];
    }
    return clone$1(schema, {
        ...schema._zod.def,
        shape: newShape,
        checks: [],
    });
}
function omit$1(schema, mask) {
    const newShape = { ...schema._zod.def.shape };
    const currDef = schema._zod.def; //.shape;
    for (const key in mask) {
        if (!(key in currDef.shape)) {
            throw new Error(`Unrecognized key: "${key}"`);
        }
        if (!mask[key])
            continue;
        delete newShape[key];
    }
    return clone$1(schema, {
        ...schema._zod.def,
        shape: newShape,
        checks: [],
    });
}
function extend$1(schema, shape) {
    if (!isPlainObject$1(shape)) {
        throw new Error("Invalid input to extend: expected a plain object");
    }
    const def = {
        ...schema._zod.def,
        get shape() {
            const _shape = { ...schema._zod.def.shape, ...shape };
            assignProp$1(this, "shape", _shape); // self-caching
            return _shape;
        },
        checks: [], // delete existing checks
    };
    return clone$1(schema, def);
}
function merge$1(a, b) {
    return clone$1(a, {
        ...a._zod.def,
        get shape() {
            const _shape = { ...a._zod.def.shape, ...b._zod.def.shape };
            assignProp$1(this, "shape", _shape); // self-caching
            return _shape;
        },
        catchall: b._zod.def.catchall,
        checks: [], // delete existing checks
    });
}
function partial$1(Class, schema, mask) {
    const oldShape = schema._zod.def.shape;
    const shape = { ...oldShape };
    if (mask) {
        for (const key in mask) {
            if (!(key in oldShape)) {
                throw new Error(`Unrecognized key: "${key}"`);
            }
            if (!mask[key])
                continue;
            // if (oldShape[key]!._zod.optin === "optional") continue;
            shape[key] = Class
                ? new Class({
                    type: "optional",
                    innerType: oldShape[key],
                })
                : oldShape[key];
        }
    }
    else {
        for (const key in oldShape) {
            // if (oldShape[key]!._zod.optin === "optional") continue;
            shape[key] = Class
                ? new Class({
                    type: "optional",
                    innerType: oldShape[key],
                })
                : oldShape[key];
        }
    }
    return clone$1(schema, {
        ...schema._zod.def,
        shape,
        checks: [],
    });
}
function required$1(Class, schema, mask) {
    const oldShape = schema._zod.def.shape;
    const shape = { ...oldShape };
    if (mask) {
        for (const key in mask) {
            if (!(key in shape)) {
                throw new Error(`Unrecognized key: "${key}"`);
            }
            if (!mask[key])
                continue;
            // overwrite with non-optional
            shape[key] = new Class({
                type: "nonoptional",
                innerType: oldShape[key],
            });
        }
    }
    else {
        for (const key in oldShape) {
            // overwrite with non-optional
            shape[key] = new Class({
                type: "nonoptional",
                innerType: oldShape[key],
            });
        }
    }
    return clone$1(schema, {
        ...schema._zod.def,
        shape,
        // optional: [],
        checks: [],
    });
}
function aborted$1(x, startIndex = 0) {
    for (let i = startIndex; i < x.issues.length; i++) {
        if (x.issues[i]?.continue !== true)
            return true;
    }
    return false;
}
function prefixIssues$1(path, issues) {
    return issues.map((iss) => {
        var _a;
        (_a = iss).path ?? (_a.path = []);
        iss.path.unshift(path);
        return iss;
    });
}
function unwrapMessage$1(message) {
    return typeof message === "string" ? message : message?.message;
}
function finalizeIssue$1(iss, ctx, config) {
    const full = { ...iss, path: iss.path ?? [] };
    // for backwards compatibility
    if (!iss.message) {
        const message = unwrapMessage$1(iss.inst?._zod.def?.error?.(iss)) ??
            unwrapMessage$1(ctx?.error?.(iss)) ??
            unwrapMessage$1(config.customError?.(iss)) ??
            unwrapMessage$1(config.localeError?.(iss)) ??
            "Invalid input";
        full.message = message;
    }
    // delete (full as any).def;
    delete full.inst;
    delete full.continue;
    if (!ctx?.reportInput) {
        delete full.input;
    }
    return full;
}
function getSizableOrigin$1(input) {
    if (input instanceof Set)
        return "set";
    if (input instanceof Map)
        return "map";
    if (input instanceof File)
        return "file";
    return "unknown";
}
function getLengthableOrigin$1(input) {
    if (Array.isArray(input))
        return "array";
    if (typeof input === "string")
        return "string";
    return "unknown";
}
function issue$1(...args) {
    const [iss, input, inst] = args;
    if (typeof iss === "string") {
        return {
            message: iss,
            code: "custom",
            input,
            inst,
        };
    }
    return { ...iss };
}
function cleanEnum$1(obj) {
    return Object.entries(obj)
        .filter(([k, _]) => {
        // return true if NaN, meaning it's not a number, thus a string key
        return Number.isNaN(Number.parseInt(k, 10));
    })
        .map((el) => el[1]);
}
// instanceof
let Class$1 = class Class {
    constructor(..._args) { }
};

const util$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  BIGINT_FORMAT_RANGES: BIGINT_FORMAT_RANGES$1,
  Class: Class$1,
  NUMBER_FORMAT_RANGES: NUMBER_FORMAT_RANGES$1,
  aborted: aborted$1,
  allowsEval: allowsEval$1,
  assert: assert$1,
  assertEqual: assertEqual$1,
  assertIs: assertIs$1,
  assertNever: assertNever$1,
  assertNotEqual: assertNotEqual$1,
  assignProp: assignProp$1,
  cached: cached$1,
  captureStackTrace: captureStackTrace$1,
  cleanEnum: cleanEnum$1,
  cleanRegex: cleanRegex$1,
  clone: clone$1,
  createTransparentProxy: createTransparentProxy$1,
  defineLazy: defineLazy$1,
  esc: esc$1,
  escapeRegex: escapeRegex$1,
  extend: extend$1,
  finalizeIssue: finalizeIssue$1,
  floatSafeRemainder: floatSafeRemainder$1,
  getElementAtPath: getElementAtPath$1,
  getEnumValues: getEnumValues$1,
  getLengthableOrigin: getLengthableOrigin$1,
  getParsedType: getParsedType$1,
  getSizableOrigin: getSizableOrigin$1,
  isObject: isObject$1,
  isPlainObject: isPlainObject$1,
  issue: issue$1,
  joinValues: joinValues$1,
  jsonStringifyReplacer: jsonStringifyReplacer$1,
  merge: merge$1,
  normalizeParams: normalizeParams$1,
  nullish: nullish$2,
  numKeys: numKeys$1,
  omit: omit$1,
  optionalKeys: optionalKeys$1,
  partial: partial$1,
  pick: pick$1,
  prefixIssues: prefixIssues$1,
  primitiveTypes: primitiveTypes$1,
  promiseAllObject: promiseAllObject$1,
  propertyKeyTypes: propertyKeyTypes$1,
  randomString: randomString$1,
  required: required$1,
  stringifyPrimitive: stringifyPrimitive$1,
  unwrapMessage: unwrapMessage$1
}, Symbol.toStringTag, { value: 'Module' }));

const initializer$2 = (inst, def) => {
    inst.name = "$ZodError";
    Object.defineProperty(inst, "_zod", {
        value: inst._zod,
        enumerable: false,
    });
    Object.defineProperty(inst, "issues", {
        value: def,
        enumerable: false,
    });
    Object.defineProperty(inst, "message", {
        get() {
            return JSON.stringify(def, jsonStringifyReplacer$1, 2);
        },
        enumerable: true,
        // configurable: false,
    });
    Object.defineProperty(inst, "toString", {
        value: () => inst.message,
        enumerable: false,
    });
};
const $ZodError$1 = $constructor$1("$ZodError", initializer$2);
const $ZodRealError$1 = $constructor$1("$ZodError", initializer$2, { Parent: Error });
function flattenError$1(error, mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of error.issues) {
        if (sub.path.length > 0) {
            fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
            fieldErrors[sub.path[0]].push(mapper(sub));
        }
        else {
            formErrors.push(mapper(sub));
        }
    }
    return { formErrors, fieldErrors };
}
function formatError$1(error, _mapper) {
    const mapper = _mapper ||
        function (issue) {
            return issue.message;
        };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
        for (const issue of error.issues) {
            if (issue.code === "invalid_union" && issue.errors.length) {
                issue.errors.map((issues) => processError({ issues }));
            }
            else if (issue.code === "invalid_key") {
                processError({ issues: issue.issues });
            }
            else if (issue.code === "invalid_element") {
                processError({ issues: issue.issues });
            }
            else if (issue.path.length === 0) {
                fieldErrors._errors.push(mapper(issue));
            }
            else {
                let curr = fieldErrors;
                let i = 0;
                while (i < issue.path.length) {
                    const el = issue.path[i];
                    const terminal = i === issue.path.length - 1;
                    if (!terminal) {
                        curr[el] = curr[el] || { _errors: [] };
                    }
                    else {
                        curr[el] = curr[el] || { _errors: [] };
                        curr[el]._errors.push(mapper(issue));
                    }
                    curr = curr[el];
                    i++;
                }
            }
        }
    };
    processError(error);
    return fieldErrors;
}
function treeifyError$1(error, _mapper) {
    const mapper = _mapper ||
        function (issue) {
            return issue.message;
        };
    const result = { errors: [] };
    const processError = (error, path = []) => {
        var _a, _b;
        for (const issue of error.issues) {
            if (issue.code === "invalid_union" && issue.errors.length) {
                // regular union error
                issue.errors.map((issues) => processError({ issues }, issue.path));
            }
            else if (issue.code === "invalid_key") {
                processError({ issues: issue.issues }, issue.path);
            }
            else if (issue.code === "invalid_element") {
                processError({ issues: issue.issues }, issue.path);
            }
            else {
                const fullpath = [...path, ...issue.path];
                if (fullpath.length === 0) {
                    result.errors.push(mapper(issue));
                    continue;
                }
                let curr = result;
                let i = 0;
                while (i < fullpath.length) {
                    const el = fullpath[i];
                    const terminal = i === fullpath.length - 1;
                    if (typeof el === "string") {
                        curr.properties ?? (curr.properties = {});
                        (_a = curr.properties)[el] ?? (_a[el] = { errors: [] });
                        curr = curr.properties[el];
                    }
                    else {
                        curr.items ?? (curr.items = []);
                        (_b = curr.items)[el] ?? (_b[el] = { errors: [] });
                        curr = curr.items[el];
                    }
                    if (terminal) {
                        curr.errors.push(mapper(issue));
                    }
                    i++;
                }
            }
        }
    };
    processError(error);
    return result;
}
/** Format a ZodError as a human-readable string in the following form.
 *
 * From
 *
 * ```ts
 * ZodError {
 *   issues: [
 *     {
 *       expected: 'string',
 *       code: 'invalid_type',
 *       path: [ 'username' ],
 *       message: 'Invalid input: expected string'
 *     },
 *     {
 *       expected: 'number',
 *       code: 'invalid_type',
 *       path: [ 'favoriteNumbers', 1 ],
 *       message: 'Invalid input: expected number'
 *     }
 *   ];
 * }
 * ```
 *
 * to
 *
 * ```
 * username
 *   ✖ Expected number, received string at "username
 * favoriteNumbers[0]
 *   ✖ Invalid input: expected number
 * ```
 */
function toDotPath$1(path) {
    const segs = [];
    for (const seg of path) {
        if (typeof seg === "number")
            segs.push(`[${seg}]`);
        else if (typeof seg === "symbol")
            segs.push(`[${JSON.stringify(String(seg))}]`);
        else if (/[^\w$]/.test(seg))
            segs.push(`[${JSON.stringify(seg)}]`);
        else {
            if (segs.length)
                segs.push(".");
            segs.push(seg);
        }
    }
    return segs.join("");
}
function prettifyError$1(error) {
    const lines = [];
    // sort by path length
    const issues = [...error.issues].sort((a, b) => a.path.length - b.path.length);
    // Process each issue
    for (const issue of issues) {
        lines.push(`✖ ${issue.message}`);
        if (issue.path?.length)
            lines.push(`  → at ${toDotPath$1(issue.path)}`);
    }
    // Convert Map to formatted string
    return lines.join("\n");
}

const _parse$1 = (_Err) => (schema, value, _ctx, _params) => {
    const ctx = _ctx ? Object.assign(_ctx, { async: false }) : { async: false };
    const result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise) {
        throw new $ZodAsyncError$1();
    }
    if (result.issues.length) {
        const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue$1(iss, ctx, config$1())));
        captureStackTrace$1(e, _params?.callee);
        throw e;
    }
    return result.value;
};
const parse$2 = /* @__PURE__*/ _parse$1($ZodRealError$1);
const _parseAsync$1 = (_Err) => async (schema, value, _ctx, params) => {
    const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
    let result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise)
        result = await result;
    if (result.issues.length) {
        const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue$1(iss, ctx, config$1())));
        captureStackTrace$1(e, params?.callee);
        throw e;
    }
    return result.value;
};
const parseAsync$2 = /* @__PURE__*/ _parseAsync$1($ZodRealError$1);
const _safeParse$1 = (_Err) => (schema, value, _ctx) => {
    const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
    const result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise) {
        throw new $ZodAsyncError$1();
    }
    return result.issues.length
        ? {
            success: false,
            error: new (_Err ?? $ZodError$1)(result.issues.map((iss) => finalizeIssue$1(iss, ctx, config$1()))),
        }
        : { success: true, data: result.value };
};
const safeParse$2 = /* @__PURE__*/ _safeParse$1($ZodRealError$1);
const _safeParseAsync$1 = (_Err) => async (schema, value, _ctx) => {
    const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
    let result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise)
        result = await result;
    return result.issues.length
        ? {
            success: false,
            error: new _Err(result.issues.map((iss) => finalizeIssue$1(iss, ctx, config$1()))),
        }
        : { success: true, data: result.value };
};
const safeParseAsync$2 = /* @__PURE__*/ _safeParseAsync$1($ZodRealError$1);

const cuid$2 = /^[cC][^\s-]{8,}$/;
const cuid2$2 = /^[0-9a-z]+$/;
const ulid$2 = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
const xid$2 = /^[0-9a-vA-V]{20}$/;
const ksuid$2 = /^[A-Za-z0-9]{27}$/;
const nanoid$2 = /^[a-zA-Z0-9_-]{21}$/;
/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
const duration$2 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
/** Implements ISO 8601-2 extensions like explicit +- prefixes, mixing weeks with other units, and fractional/negative components. */
const extendedDuration$1 = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
const guid$2 = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
/** Returns a regex for validating an RFC 4122 UUID.
 *
 * @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
const uuid$2 = (version) => {
    if (!version)
        return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000)$/;
    return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
const uuid4$1 = /*@__PURE__*/ uuid$2(4);
const uuid6$1 = /*@__PURE__*/ uuid$2(6);
const uuid7$1 = /*@__PURE__*/ uuid$2(7);
/** Practical email validation */
const email$2 = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
/** Equivalent to the HTML5 input[type=email] validation implemented by browsers. Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email */
const html5Email$1 = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
/** The classic emailregex.com regex for RFC 5322-compliant emails */
const rfc5322Email$1 = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
/** A loose regex that allows Unicode characters, enforces length limits, and that's about it. */
const unicodeEmail$1 = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u;
const browserEmail$1 = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
// from https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression
const _emoji$3 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
function emoji$2() {
    return new RegExp(_emoji$3, "u");
}
const ipv4$2 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv6$2 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})$/;
const cidrv4$2 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
const cidrv6$2 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
// https://stackoverflow.com/questions/7860392/determine-if-string-is-in-base64-using-javascript
const base64$2 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
const base64url$2 = /^[A-Za-z0-9_-]*$/;
// based on https://stackoverflow.com/questions/106179/regular-expression-to-match-dns-hostname-or-ip-address
// export const hostname: RegExp =
//   /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)+([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/;
const hostname$2 = /^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+$/;
const domain$1 = /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
// https://blog.stevenlevithan.com/archives/validate-phone-number#r4-3 (regex sans spaces)
const e164$2 = /^\+(?:[0-9]){6,14}[0-9]$/;
// const dateSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
const dateSource$1 = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
const date$4 = /*@__PURE__*/ new RegExp(`^${dateSource$1}$`);
function timeSource$1(args) {
    const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
    const regex = typeof args.precision === "number"
        ? args.precision === -1
            ? `${hhmm}`
            : args.precision === 0
                ? `${hhmm}:[0-5]\\d`
                : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}`
        : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
    return regex;
}
function time$2(args) {
    return new RegExp(`^${timeSource$1(args)}$`);
}
// Adapted from https://stackoverflow.com/a/3143231
function datetime$2(args) {
    const time = timeSource$1({ precision: args.precision });
    const opts = ["Z"];
    if (args.local)
        opts.push("");
    if (args.offset)
        opts.push(`([+-]\\d{2}:\\d{2})`);
    const timeRegex = `${time}(?:${opts.join("|")})`;
    return new RegExp(`^${dateSource$1}T(?:${timeRegex})$`);
}
const string$3 = (params) => {
    const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
    return new RegExp(`^${regex}$`);
};
const bigint$3 = /^\d+n?$/;
const integer$1 = /^\d+$/;
const number$3 = /^-?\d+(?:\.\d+)?/i;
const boolean$3 = /true|false/i;
const _null$4 = /null/i;
const _undefined$4 = /undefined/i;
// regex for string with no uppercase letters
const lowercase$1 = /^[^A-Z]*$/;
// regex for string with no lowercase letters
const uppercase$1 = /^[^a-z]*$/;

const regexes$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  _emoji: _emoji$3,
  base64: base64$2,
  base64url: base64url$2,
  bigint: bigint$3,
  boolean: boolean$3,
  browserEmail: browserEmail$1,
  cidrv4: cidrv4$2,
  cidrv6: cidrv6$2,
  cuid: cuid$2,
  cuid2: cuid2$2,
  date: date$4,
  datetime: datetime$2,
  domain: domain$1,
  duration: duration$2,
  e164: e164$2,
  email: email$2,
  emoji: emoji$2,
  extendedDuration: extendedDuration$1,
  guid: guid$2,
  hostname: hostname$2,
  html5Email: html5Email$1,
  integer: integer$1,
  ipv4: ipv4$2,
  ipv6: ipv6$2,
  ksuid: ksuid$2,
  lowercase: lowercase$1,
  nanoid: nanoid$2,
  null: _null$4,
  number: number$3,
  rfc5322Email: rfc5322Email$1,
  string: string$3,
  time: time$2,
  ulid: ulid$2,
  undefined: _undefined$4,
  unicodeEmail: unicodeEmail$1,
  uppercase: uppercase$1,
  uuid: uuid$2,
  uuid4: uuid4$1,
  uuid6: uuid6$1,
  uuid7: uuid7$1,
  xid: xid$2
}, Symbol.toStringTag, { value: 'Module' }));

// import { $ZodType } from "./schemas.js";
const $ZodCheck$1 = /*@__PURE__*/ $constructor$1("$ZodCheck", (inst, def) => {
    var _a;
    inst._zod ?? (inst._zod = {});
    inst._zod.def = def;
    (_a = inst._zod).onattach ?? (_a.onattach = []);
});
const numericOriginMap$1 = {
    number: "number",
    bigint: "bigint",
    object: "date",
};
const $ZodCheckLessThan$1 = /*@__PURE__*/ $constructor$1("$ZodCheckLessThan", (inst, def) => {
    $ZodCheck$1.init(inst, def);
    const origin = numericOriginMap$1[typeof def.value];
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
        if (def.value < curr) {
            if (def.inclusive)
                bag.maximum = def.value;
            else
                bag.exclusiveMaximum = def.value;
        }
    });
    inst._zod.check = (payload) => {
        if (def.inclusive ? payload.value <= def.value : payload.value < def.value) {
            return;
        }
        payload.issues.push({
            origin,
            code: "too_big",
            maximum: def.value,
            input: payload.value,
            inclusive: def.inclusive,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckGreaterThan$1 = /*@__PURE__*/ $constructor$1("$ZodCheckGreaterThan", (inst, def) => {
    $ZodCheck$1.init(inst, def);
    const origin = numericOriginMap$1[typeof def.value];
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
        if (def.value > curr) {
            if (def.inclusive)
                bag.minimum = def.value;
            else
                bag.exclusiveMinimum = def.value;
        }
    });
    inst._zod.check = (payload) => {
        if (def.inclusive ? payload.value >= def.value : payload.value > def.value) {
            return;
        }
        payload.issues.push({
            origin,
            code: "too_small",
            minimum: def.value,
            input: payload.value,
            inclusive: def.inclusive,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckMultipleOf$1 = 
/*@__PURE__*/ $constructor$1("$ZodCheckMultipleOf", (inst, def) => {
    $ZodCheck$1.init(inst, def);
    inst._zod.onattach.push((inst) => {
        var _a;
        (_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
    });
    inst._zod.check = (payload) => {
        if (typeof payload.value !== typeof def.value)
            throw new Error("Cannot mix number and bigint in multiple_of check.");
        const isMultiple = typeof payload.value === "bigint"
            ? payload.value % def.value === BigInt(0)
            : floatSafeRemainder$1(payload.value, def.value) === 0;
        if (isMultiple)
            return;
        payload.issues.push({
            origin: typeof payload.value,
            code: "not_multiple_of",
            divisor: def.value,
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckNumberFormat$1 = /*@__PURE__*/ $constructor$1("$ZodCheckNumberFormat", (inst, def) => {
    $ZodCheck$1.init(inst, def); // no format checks
    def.format = def.format || "float64";
    const isInt = def.format?.includes("int");
    const origin = isInt ? "int" : "number";
    const [minimum, maximum] = NUMBER_FORMAT_RANGES$1[def.format];
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.format = def.format;
        bag.minimum = minimum;
        bag.maximum = maximum;
        if (isInt)
            bag.pattern = integer$1;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        if (isInt) {
            if (!Number.isInteger(input)) {
                // invalid_format issue
                // payload.issues.push({
                //   expected: def.format,
                //   format: def.format,
                //   code: "invalid_format",
                //   input,
                //   inst,
                // });
                // invalid_type issue
                payload.issues.push({
                    expected: origin,
                    format: def.format,
                    code: "invalid_type",
                    input,
                    inst,
                });
                return;
                // not_multiple_of issue
                // payload.issues.push({
                //   code: "not_multiple_of",
                //   origin: "number",
                //   input,
                //   inst,
                //   divisor: 1,
                // });
            }
            if (!Number.isSafeInteger(input)) {
                if (input > 0) {
                    // too_big
                    payload.issues.push({
                        input,
                        code: "too_big",
                        maximum: Number.MAX_SAFE_INTEGER,
                        note: "Integers must be within the safe integer range.",
                        inst,
                        origin,
                        continue: !def.abort,
                    });
                }
                else {
                    // too_small
                    payload.issues.push({
                        input,
                        code: "too_small",
                        minimum: Number.MIN_SAFE_INTEGER,
                        note: "Integers must be within the safe integer range.",
                        inst,
                        origin,
                        continue: !def.abort,
                    });
                }
                return;
            }
        }
        if (input < minimum) {
            payload.issues.push({
                origin: "number",
                input,
                code: "too_small",
                minimum,
                inclusive: true,
                inst,
                continue: !def.abort,
            });
        }
        if (input > maximum) {
            payload.issues.push({
                origin: "number",
                input,
                code: "too_big",
                maximum,
                inst,
            });
        }
    };
});
const $ZodCheckBigIntFormat$1 = /*@__PURE__*/ $constructor$1("$ZodCheckBigIntFormat", (inst, def) => {
    $ZodCheck$1.init(inst, def); // no format checks
    const [minimum, maximum] = BIGINT_FORMAT_RANGES$1[def.format];
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.format = def.format;
        bag.minimum = minimum;
        bag.maximum = maximum;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        if (input < minimum) {
            payload.issues.push({
                origin: "bigint",
                input,
                code: "too_small",
                minimum: minimum,
                inclusive: true,
                inst,
                continue: !def.abort,
            });
        }
        if (input > maximum) {
            payload.issues.push({
                origin: "bigint",
                input,
                code: "too_big",
                maximum,
                inst,
            });
        }
    };
});
const $ZodCheckMaxSize$1 = /*@__PURE__*/ $constructor$1("$ZodCheckMaxSize", (inst, def) => {
    var _a;
    $ZodCheck$1.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !nullish$2(val) && val.size !== undefined;
    });
    inst._zod.onattach.push((inst) => {
        const curr = (inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY);
        if (def.maximum < curr)
            inst._zod.bag.maximum = def.maximum;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        const size = input.size;
        if (size <= def.maximum)
            return;
        payload.issues.push({
            origin: getSizableOrigin$1(input),
            code: "too_big",
            maximum: def.maximum,
            input,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckMinSize$1 = /*@__PURE__*/ $constructor$1("$ZodCheckMinSize", (inst, def) => {
    var _a;
    $ZodCheck$1.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !nullish$2(val) && val.size !== undefined;
    });
    inst._zod.onattach.push((inst) => {
        const curr = (inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY);
        if (def.minimum > curr)
            inst._zod.bag.minimum = def.minimum;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        const size = input.size;
        if (size >= def.minimum)
            return;
        payload.issues.push({
            origin: getSizableOrigin$1(input),
            code: "too_small",
            minimum: def.minimum,
            input,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckSizeEquals$1 = /*@__PURE__*/ $constructor$1("$ZodCheckSizeEquals", (inst, def) => {
    var _a;
    $ZodCheck$1.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !nullish$2(val) && val.size !== undefined;
    });
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.minimum = def.size;
        bag.maximum = def.size;
        bag.size = def.size;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        const size = input.size;
        if (size === def.size)
            return;
        const tooBig = size > def.size;
        payload.issues.push({
            origin: getSizableOrigin$1(input),
            ...(tooBig ? { code: "too_big", maximum: def.size } : { code: "too_small", minimum: def.size }),
            inclusive: true,
            exact: true,
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckMaxLength$1 = /*@__PURE__*/ $constructor$1("$ZodCheckMaxLength", (inst, def) => {
    var _a;
    $ZodCheck$1.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !nullish$2(val) && val.length !== undefined;
    });
    inst._zod.onattach.push((inst) => {
        const curr = (inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY);
        if (def.maximum < curr)
            inst._zod.bag.maximum = def.maximum;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        const length = input.length;
        if (length <= def.maximum)
            return;
        const origin = getLengthableOrigin$1(input);
        payload.issues.push({
            origin,
            code: "too_big",
            maximum: def.maximum,
            inclusive: true,
            input,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckMinLength$1 = /*@__PURE__*/ $constructor$1("$ZodCheckMinLength", (inst, def) => {
    var _a;
    $ZodCheck$1.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !nullish$2(val) && val.length !== undefined;
    });
    inst._zod.onattach.push((inst) => {
        const curr = (inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY);
        if (def.minimum > curr)
            inst._zod.bag.minimum = def.minimum;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        const length = input.length;
        if (length >= def.minimum)
            return;
        const origin = getLengthableOrigin$1(input);
        payload.issues.push({
            origin,
            code: "too_small",
            minimum: def.minimum,
            inclusive: true,
            input,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckLengthEquals$1 = /*@__PURE__*/ $constructor$1("$ZodCheckLengthEquals", (inst, def) => {
    var _a;
    $ZodCheck$1.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !nullish$2(val) && val.length !== undefined;
    });
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.minimum = def.length;
        bag.maximum = def.length;
        bag.length = def.length;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        const length = input.length;
        if (length === def.length)
            return;
        const origin = getLengthableOrigin$1(input);
        const tooBig = length > def.length;
        payload.issues.push({
            origin,
            ...(tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length }),
            inclusive: true,
            exact: true,
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckStringFormat$1 = /*@__PURE__*/ $constructor$1("$ZodCheckStringFormat", (inst, def) => {
    var _a, _b;
    $ZodCheck$1.init(inst, def);
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.format = def.format;
        if (def.pattern) {
            bag.patterns ?? (bag.patterns = new Set());
            bag.patterns.add(def.pattern);
        }
    });
    if (def.pattern)
        (_a = inst._zod).check ?? (_a.check = (payload) => {
            def.pattern.lastIndex = 0;
            if (def.pattern.test(payload.value))
                return;
            payload.issues.push({
                origin: "string",
                code: "invalid_format",
                format: def.format,
                input: payload.value,
                ...(def.pattern ? { pattern: def.pattern.toString() } : {}),
                inst,
                continue: !def.abort,
            });
        });
    else
        (_b = inst._zod).check ?? (_b.check = () => { });
});
const $ZodCheckRegex$1 = /*@__PURE__*/ $constructor$1("$ZodCheckRegex", (inst, def) => {
    $ZodCheckStringFormat$1.init(inst, def);
    inst._zod.check = (payload) => {
        def.pattern.lastIndex = 0;
        if (def.pattern.test(payload.value))
            return;
        payload.issues.push({
            origin: "string",
            code: "invalid_format",
            format: "regex",
            input: payload.value,
            pattern: def.pattern.toString(),
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckLowerCase$1 = /*@__PURE__*/ $constructor$1("$ZodCheckLowerCase", (inst, def) => {
    def.pattern ?? (def.pattern = lowercase$1);
    $ZodCheckStringFormat$1.init(inst, def);
});
const $ZodCheckUpperCase$1 = /*@__PURE__*/ $constructor$1("$ZodCheckUpperCase", (inst, def) => {
    def.pattern ?? (def.pattern = uppercase$1);
    $ZodCheckStringFormat$1.init(inst, def);
});
const $ZodCheckIncludes$1 = /*@__PURE__*/ $constructor$1("$ZodCheckIncludes", (inst, def) => {
    $ZodCheck$1.init(inst, def);
    const escapedRegex = escapeRegex$1(def.includes);
    const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
    def.pattern = pattern;
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.patterns ?? (bag.patterns = new Set());
        bag.patterns.add(pattern);
    });
    inst._zod.check = (payload) => {
        if (payload.value.includes(def.includes, def.position))
            return;
        payload.issues.push({
            origin: "string",
            code: "invalid_format",
            format: "includes",
            includes: def.includes,
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckStartsWith$1 = /*@__PURE__*/ $constructor$1("$ZodCheckStartsWith", (inst, def) => {
    $ZodCheck$1.init(inst, def);
    const pattern = new RegExp(`^${escapeRegex$1(def.prefix)}.*`);
    def.pattern ?? (def.pattern = pattern);
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.patterns ?? (bag.patterns = new Set());
        bag.patterns.add(pattern);
    });
    inst._zod.check = (payload) => {
        if (payload.value.startsWith(def.prefix))
            return;
        payload.issues.push({
            origin: "string",
            code: "invalid_format",
            format: "starts_with",
            prefix: def.prefix,
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckEndsWith$1 = /*@__PURE__*/ $constructor$1("$ZodCheckEndsWith", (inst, def) => {
    $ZodCheck$1.init(inst, def);
    const pattern = new RegExp(`.*${escapeRegex$1(def.suffix)}$`);
    def.pattern ?? (def.pattern = pattern);
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.patterns ?? (bag.patterns = new Set());
        bag.patterns.add(pattern);
    });
    inst._zod.check = (payload) => {
        if (payload.value.endsWith(def.suffix))
            return;
        payload.issues.push({
            origin: "string",
            code: "invalid_format",
            format: "ends_with",
            suffix: def.suffix,
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
///////////////////////////////////
/////    $ZodCheckProperty    /////
///////////////////////////////////
function handleCheckPropertyResult$1(result, payload, property) {
    if (result.issues.length) {
        payload.issues.push(...prefixIssues$1(property, result.issues));
    }
}
const $ZodCheckProperty$1 = /*@__PURE__*/ $constructor$1("$ZodCheckProperty", (inst, def) => {
    $ZodCheck$1.init(inst, def);
    inst._zod.check = (payload) => {
        const result = def.schema._zod.run({
            value: payload.value[def.property],
            issues: [],
        }, {});
        if (result instanceof Promise) {
            return result.then((result) => handleCheckPropertyResult$1(result, payload, def.property));
        }
        handleCheckPropertyResult$1(result, payload, def.property);
        return;
    };
});
const $ZodCheckMimeType$1 = /*@__PURE__*/ $constructor$1("$ZodCheckMimeType", (inst, def) => {
    $ZodCheck$1.init(inst, def);
    const mimeSet = new Set(def.mime);
    inst._zod.onattach.push((inst) => {
        inst._zod.bag.mime = def.mime;
    });
    inst._zod.check = (payload) => {
        if (mimeSet.has(payload.value.type))
            return;
        payload.issues.push({
            code: "invalid_value",
            values: def.mime,
            input: payload.value.type,
            inst,
        });
    };
});
const $ZodCheckOverwrite$1 = /*@__PURE__*/ $constructor$1("$ZodCheckOverwrite", (inst, def) => {
    $ZodCheck$1.init(inst, def);
    inst._zod.check = (payload) => {
        payload.value = def.tx(payload.value);
    };
});

let Doc$1 = class Doc {
    constructor(args = []) {
        this.content = [];
        this.indent = 0;
        if (this)
            this.args = args;
    }
    indented(fn) {
        this.indent += 1;
        fn(this);
        this.indent -= 1;
    }
    write(arg) {
        if (typeof arg === "function") {
            arg(this, { execution: "sync" });
            arg(this, { execution: "async" });
            return;
        }
        const content = arg;
        const lines = content.split("\n").filter((x) => x);
        const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
        const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
        for (const line of dedented) {
            this.content.push(line);
        }
    }
    compile() {
        const F = Function;
        const args = this?.args;
        const content = this?.content ?? [``];
        const lines = [...content.map((x) => `  ${x}`)];
        // console.log(lines.join("\n"));
        return new F(...args, lines.join("\n"));
    }
};

const version$1 = {
    major: 4,
    minor: 0,
    patch: 0,
};

const $ZodType$1 = /*@__PURE__*/ $constructor$1("$ZodType", (inst, def) => {
    var _a;
    inst ?? (inst = {});
    inst._zod.def = def; // set _def property
    inst._zod.bag = inst._zod.bag || {}; // initialize _bag object
    inst._zod.version = version$1;
    const checks = [...(inst._zod.def.checks ?? [])];
    // if inst is itself a checks.$ZodCheck, run it as a check
    if (inst._zod.traits.has("$ZodCheck")) {
        checks.unshift(inst);
    }
    //
    for (const ch of checks) {
        for (const fn of ch._zod.onattach) {
            fn(inst);
        }
    }
    if (checks.length === 0) {
        // deferred initializer
        // inst._zod.parse is not yet defined
        (_a = inst._zod).deferred ?? (_a.deferred = []);
        inst._zod.deferred?.push(() => {
            inst._zod.run = inst._zod.parse;
        });
    }
    else {
        const runChecks = (payload, checks, ctx) => {
            let isAborted = aborted$1(payload);
            let asyncResult;
            for (const ch of checks) {
                if (ch._zod.def.when) {
                    const shouldRun = ch._zod.def.when(payload);
                    if (!shouldRun)
                        continue;
                }
                else if (isAborted) {
                    continue;
                }
                const currLen = payload.issues.length;
                const _ = ch._zod.check(payload);
                if (_ instanceof Promise && ctx?.async === false) {
                    throw new $ZodAsyncError$1();
                }
                if (asyncResult || _ instanceof Promise) {
                    asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
                        await _;
                        const nextLen = payload.issues.length;
                        if (nextLen === currLen)
                            return;
                        if (!isAborted)
                            isAborted = aborted$1(payload, currLen);
                    });
                }
                else {
                    const nextLen = payload.issues.length;
                    if (nextLen === currLen)
                        continue;
                    if (!isAborted)
                        isAborted = aborted$1(payload, currLen);
                }
            }
            if (asyncResult) {
                return asyncResult.then(() => {
                    return payload;
                });
            }
            return payload;
        };
        inst._zod.run = (payload, ctx) => {
            const result = inst._zod.parse(payload, ctx);
            if (result instanceof Promise) {
                if (ctx.async === false)
                    throw new $ZodAsyncError$1();
                return result.then((result) => runChecks(result, checks, ctx));
            }
            return runChecks(result, checks, ctx);
        };
    }
    inst["~standard"] = {
        validate: (value) => {
            try {
                const r = safeParse$2(inst, value);
                return r.success ? { value: r.data } : { issues: r.error?.issues };
            }
            catch (_) {
                return safeParseAsync$2(inst, value).then((r) => (r.success ? { value: r.data } : { issues: r.error?.issues }));
            }
        },
        vendor: "zod",
        version: 1,
    };
});
const $ZodString$1 = /*@__PURE__*/ $constructor$1("$ZodString", (inst, def) => {
    $ZodType$1.init(inst, def);
    inst._zod.pattern = [...(inst?._zod.bag?.patterns ?? [])].pop() ?? string$3(inst._zod.bag);
    inst._zod.parse = (payload, _) => {
        if (def.coerce)
            try {
                payload.value = String(payload.value);
            }
            catch (_) { }
        if (typeof payload.value === "string")
            return payload;
        payload.issues.push({
            expected: "string",
            code: "invalid_type",
            input: payload.value,
            inst,
        });
        return payload;
    };
});
const $ZodStringFormat$1 = /*@__PURE__*/ $constructor$1("$ZodStringFormat", (inst, def) => {
    // check initialization must come first
    $ZodCheckStringFormat$1.init(inst, def);
    $ZodString$1.init(inst, def);
});
const $ZodGUID$1 = /*@__PURE__*/ $constructor$1("$ZodGUID", (inst, def) => {
    def.pattern ?? (def.pattern = guid$2);
    $ZodStringFormat$1.init(inst, def);
});
const $ZodUUID$1 = /*@__PURE__*/ $constructor$1("$ZodUUID", (inst, def) => {
    if (def.version) {
        const versionMap = {
            v1: 1,
            v2: 2,
            v3: 3,
            v4: 4,
            v5: 5,
            v6: 6,
            v7: 7,
            v8: 8,
        };
        const v = versionMap[def.version];
        if (v === undefined)
            throw new Error(`Invalid UUID version: "${def.version}"`);
        def.pattern ?? (def.pattern = uuid$2(v));
    }
    else
        def.pattern ?? (def.pattern = uuid$2());
    $ZodStringFormat$1.init(inst, def);
});
const $ZodEmail$1 = /*@__PURE__*/ $constructor$1("$ZodEmail", (inst, def) => {
    def.pattern ?? (def.pattern = email$2);
    $ZodStringFormat$1.init(inst, def);
});
const $ZodURL$1 = /*@__PURE__*/ $constructor$1("$ZodURL", (inst, def) => {
    $ZodStringFormat$1.init(inst, def);
    inst._zod.check = (payload) => {
        try {
            const orig = payload.value;
            const url = new URL(orig);
            const href = url.href;
            if (def.hostname) {
                def.hostname.lastIndex = 0;
                if (!def.hostname.test(url.hostname)) {
                    payload.issues.push({
                        code: "invalid_format",
                        format: "url",
                        note: "Invalid hostname",
                        pattern: hostname$2.source,
                        input: payload.value,
                        inst,
                        continue: !def.abort,
                    });
                }
            }
            if (def.protocol) {
                def.protocol.lastIndex = 0;
                if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) {
                    payload.issues.push({
                        code: "invalid_format",
                        format: "url",
                        note: "Invalid protocol",
                        pattern: def.protocol.source,
                        input: payload.value,
                        inst,
                        continue: !def.abort,
                    });
                }
            }
            // payload.value = url.href;
            if (!orig.endsWith("/") && href.endsWith("/")) {
                payload.value = href.slice(0, -1);
            }
            else {
                payload.value = href;
            }
            return;
        }
        catch (_) {
            payload.issues.push({
                code: "invalid_format",
                format: "url",
                input: payload.value,
                inst,
                continue: !def.abort,
            });
        }
    };
});
const $ZodEmoji$1 = /*@__PURE__*/ $constructor$1("$ZodEmoji", (inst, def) => {
    def.pattern ?? (def.pattern = emoji$2());
    $ZodStringFormat$1.init(inst, def);
});
const $ZodNanoID$1 = /*@__PURE__*/ $constructor$1("$ZodNanoID", (inst, def) => {
    def.pattern ?? (def.pattern = nanoid$2);
    $ZodStringFormat$1.init(inst, def);
});
const $ZodCUID$1 = /*@__PURE__*/ $constructor$1("$ZodCUID", (inst, def) => {
    def.pattern ?? (def.pattern = cuid$2);
    $ZodStringFormat$1.init(inst, def);
});
const $ZodCUID2$1 = /*@__PURE__*/ $constructor$1("$ZodCUID2", (inst, def) => {
    def.pattern ?? (def.pattern = cuid2$2);
    $ZodStringFormat$1.init(inst, def);
});
const $ZodULID$1 = /*@__PURE__*/ $constructor$1("$ZodULID", (inst, def) => {
    def.pattern ?? (def.pattern = ulid$2);
    $ZodStringFormat$1.init(inst, def);
});
const $ZodXID$1 = /*@__PURE__*/ $constructor$1("$ZodXID", (inst, def) => {
    def.pattern ?? (def.pattern = xid$2);
    $ZodStringFormat$1.init(inst, def);
});
const $ZodKSUID$1 = /*@__PURE__*/ $constructor$1("$ZodKSUID", (inst, def) => {
    def.pattern ?? (def.pattern = ksuid$2);
    $ZodStringFormat$1.init(inst, def);
});
const $ZodISODateTime$1 = /*@__PURE__*/ $constructor$1("$ZodISODateTime", (inst, def) => {
    def.pattern ?? (def.pattern = datetime$2(def));
    $ZodStringFormat$1.init(inst, def);
});
const $ZodISODate$1 = /*@__PURE__*/ $constructor$1("$ZodISODate", (inst, def) => {
    def.pattern ?? (def.pattern = date$4);
    $ZodStringFormat$1.init(inst, def);
});
const $ZodISOTime$1 = /*@__PURE__*/ $constructor$1("$ZodISOTime", (inst, def) => {
    def.pattern ?? (def.pattern = time$2(def));
    $ZodStringFormat$1.init(inst, def);
});
const $ZodISODuration$1 = /*@__PURE__*/ $constructor$1("$ZodISODuration", (inst, def) => {
    def.pattern ?? (def.pattern = duration$2);
    $ZodStringFormat$1.init(inst, def);
});
const $ZodIPv4$1 = /*@__PURE__*/ $constructor$1("$ZodIPv4", (inst, def) => {
    def.pattern ?? (def.pattern = ipv4$2);
    $ZodStringFormat$1.init(inst, def);
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.format = `ipv4`;
    });
});
const $ZodIPv6$1 = /*@__PURE__*/ $constructor$1("$ZodIPv6", (inst, def) => {
    def.pattern ?? (def.pattern = ipv6$2);
    $ZodStringFormat$1.init(inst, def);
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.format = `ipv6`;
    });
    inst._zod.check = (payload) => {
        try {
            new URL(`http://[${payload.value}]`);
            // return;
        }
        catch {
            payload.issues.push({
                code: "invalid_format",
                format: "ipv6",
                input: payload.value,
                inst,
                continue: !def.abort,
            });
        }
    };
});
const $ZodCIDRv4$1 = /*@__PURE__*/ $constructor$1("$ZodCIDRv4", (inst, def) => {
    def.pattern ?? (def.pattern = cidrv4$2);
    $ZodStringFormat$1.init(inst, def);
});
const $ZodCIDRv6$1 = /*@__PURE__*/ $constructor$1("$ZodCIDRv6", (inst, def) => {
    def.pattern ?? (def.pattern = cidrv6$2); // not used for validation
    $ZodStringFormat$1.init(inst, def);
    inst._zod.check = (payload) => {
        const [address, prefix] = payload.value.split("/");
        try {
            if (!prefix)
                throw new Error();
            const prefixNum = Number(prefix);
            if (`${prefixNum}` !== prefix)
                throw new Error();
            if (prefixNum < 0 || prefixNum > 128)
                throw new Error();
            new URL(`http://[${address}]`);
        }
        catch {
            payload.issues.push({
                code: "invalid_format",
                format: "cidrv6",
                input: payload.value,
                inst,
                continue: !def.abort,
            });
        }
    };
});
//////////////////////////////   ZodBase64   //////////////////////////////
function isValidBase64$1(data) {
    if (data === "")
        return true;
    if (data.length % 4 !== 0)
        return false;
    try {
        atob(data);
        return true;
    }
    catch {
        return false;
    }
}
const $ZodBase64$1 = /*@__PURE__*/ $constructor$1("$ZodBase64", (inst, def) => {
    def.pattern ?? (def.pattern = base64$2);
    $ZodStringFormat$1.init(inst, def);
    inst._zod.onattach.push((inst) => {
        inst._zod.bag.contentEncoding = "base64";
    });
    inst._zod.check = (payload) => {
        if (isValidBase64$1(payload.value))
            return;
        payload.issues.push({
            code: "invalid_format",
            format: "base64",
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
//////////////////////////////   ZodBase64   //////////////////////////////
function isValidBase64URL$1(data) {
    if (!base64url$2.test(data))
        return false;
    const base64 = data.replace(/[-_]/g, (c) => (c === "-" ? "+" : "/"));
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    return isValidBase64$1(padded);
}
const $ZodBase64URL$1 = /*@__PURE__*/ $constructor$1("$ZodBase64URL", (inst, def) => {
    def.pattern ?? (def.pattern = base64url$2);
    $ZodStringFormat$1.init(inst, def);
    inst._zod.onattach.push((inst) => {
        inst._zod.bag.contentEncoding = "base64url";
    });
    inst._zod.check = (payload) => {
        if (isValidBase64URL$1(payload.value))
            return;
        payload.issues.push({
            code: "invalid_format",
            format: "base64url",
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodE164$1 = /*@__PURE__*/ $constructor$1("$ZodE164", (inst, def) => {
    def.pattern ?? (def.pattern = e164$2);
    $ZodStringFormat$1.init(inst, def);
});
//////////////////////////////   ZodJWT   //////////////////////////////
function isValidJWT$1(token, algorithm = null) {
    try {
        const tokensParts = token.split(".");
        if (tokensParts.length !== 3)
            return false;
        const [header] = tokensParts;
        if (!header)
            return false;
        const parsedHeader = JSON.parse(atob(header));
        if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
            return false;
        if (!parsedHeader.alg)
            return false;
        if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
            return false;
        return true;
    }
    catch {
        return false;
    }
}
const $ZodJWT$1 = /*@__PURE__*/ $constructor$1("$ZodJWT", (inst, def) => {
    $ZodStringFormat$1.init(inst, def);
    inst._zod.check = (payload) => {
        if (isValidJWT$1(payload.value, def.alg))
            return;
        payload.issues.push({
            code: "invalid_format",
            format: "jwt",
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCustomStringFormat$1 = /*@__PURE__*/ $constructor$1("$ZodCustomStringFormat", (inst, def) => {
    $ZodStringFormat$1.init(inst, def);
    inst._zod.check = (payload) => {
        if (def.fn(payload.value))
            return;
        payload.issues.push({
            code: "invalid_format",
            format: def.format,
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodNumber$1 = /*@__PURE__*/ $constructor$1("$ZodNumber", (inst, def) => {
    $ZodType$1.init(inst, def);
    inst._zod.pattern = inst._zod.bag.pattern ?? number$3;
    inst._zod.parse = (payload, _ctx) => {
        if (def.coerce)
            try {
                payload.value = Number(payload.value);
            }
            catch (_) { }
        const input = payload.value;
        if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) {
            return payload;
        }
        const received = typeof input === "number"
            ? Number.isNaN(input)
                ? "NaN"
                : !Number.isFinite(input)
                    ? "Infinity"
                    : undefined
            : undefined;
        payload.issues.push({
            expected: "number",
            code: "invalid_type",
            input,
            inst,
            ...(received ? { received } : {}),
        });
        return payload;
    };
});
const $ZodNumberFormat$1 = /*@__PURE__*/ $constructor$1("$ZodNumber", (inst, def) => {
    $ZodCheckNumberFormat$1.init(inst, def);
    $ZodNumber$1.init(inst, def); // no format checksp
});
const $ZodBoolean$1 = /*@__PURE__*/ $constructor$1("$ZodBoolean", (inst, def) => {
    $ZodType$1.init(inst, def);
    inst._zod.pattern = boolean$3;
    inst._zod.parse = (payload, _ctx) => {
        if (def.coerce)
            try {
                payload.value = Boolean(payload.value);
            }
            catch (_) { }
        const input = payload.value;
        if (typeof input === "boolean")
            return payload;
        payload.issues.push({
            expected: "boolean",
            code: "invalid_type",
            input,
            inst,
        });
        return payload;
    };
});
const $ZodBigInt$1 = /*@__PURE__*/ $constructor$1("$ZodBigInt", (inst, def) => {
    $ZodType$1.init(inst, def);
    inst._zod.pattern = bigint$3;
    inst._zod.parse = (payload, _ctx) => {
        if (def.coerce)
            try {
                payload.value = BigInt(payload.value);
            }
            catch (_) { }
        if (typeof payload.value === "bigint")
            return payload;
        payload.issues.push({
            expected: "bigint",
            code: "invalid_type",
            input: payload.value,
            inst,
        });
        return payload;
    };
});
const $ZodBigIntFormat$1 = /*@__PURE__*/ $constructor$1("$ZodBigInt", (inst, def) => {
    $ZodCheckBigIntFormat$1.init(inst, def);
    $ZodBigInt$1.init(inst, def); // no format checks
});
const $ZodSymbol$1 = /*@__PURE__*/ $constructor$1("$ZodSymbol", (inst, def) => {
    $ZodType$1.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (typeof input === "symbol")
            return payload;
        payload.issues.push({
            expected: "symbol",
            code: "invalid_type",
            input,
            inst,
        });
        return payload;
    };
});
const $ZodUndefined$1 = /*@__PURE__*/ $constructor$1("$ZodUndefined", (inst, def) => {
    $ZodType$1.init(inst, def);
    inst._zod.pattern = _undefined$4;
    inst._zod.values = new Set([undefined]);
    inst._zod.optin = "optional";
    inst._zod.optout = "optional";
    inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (typeof input === "undefined")
            return payload;
        payload.issues.push({
            expected: "undefined",
            code: "invalid_type",
            input,
            inst,
        });
        return payload;
    };
});
const $ZodNull$1 = /*@__PURE__*/ $constructor$1("$ZodNull", (inst, def) => {
    $ZodType$1.init(inst, def);
    inst._zod.pattern = _null$4;
    inst._zod.values = new Set([null]);
    inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (input === null)
            return payload;
        payload.issues.push({
            expected: "null",
            code: "invalid_type",
            input,
            inst,
        });
        return payload;
    };
});
const $ZodAny$1 = /*@__PURE__*/ $constructor$1("$ZodAny", (inst, def) => {
    $ZodType$1.init(inst, def);
    inst._zod.parse = (payload) => payload;
});
const $ZodUnknown$1 = /*@__PURE__*/ $constructor$1("$ZodUnknown", (inst, def) => {
    $ZodType$1.init(inst, def);
    inst._zod.parse = (payload) => payload;
});
const $ZodNever$1 = /*@__PURE__*/ $constructor$1("$ZodNever", (inst, def) => {
    $ZodType$1.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
        payload.issues.push({
            expected: "never",
            code: "invalid_type",
            input: payload.value,
            inst,
        });
        return payload;
    };
});
const $ZodVoid$1 = /*@__PURE__*/ $constructor$1("$ZodVoid", (inst, def) => {
    $ZodType$1.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (typeof input === "undefined")
            return payload;
        payload.issues.push({
            expected: "void",
            code: "invalid_type",
            input,
            inst,
        });
        return payload;
    };
});
const $ZodDate$1 = /*@__PURE__*/ $constructor$1("$ZodDate", (inst, def) => {
    $ZodType$1.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
        if (def.coerce) {
            try {
                payload.value = new Date(payload.value);
            }
            catch (_err) { }
        }
        const input = payload.value;
        const isDate = input instanceof Date;
        const isValidDate = isDate && !Number.isNaN(input.getTime());
        if (isValidDate)
            return payload;
        payload.issues.push({
            expected: "date",
            code: "invalid_type",
            input,
            ...(isDate ? { received: "Invalid Date" } : {}),
            inst,
        });
        return payload;
    };
});
function handleArrayResult$1(result, final, index) {
    if (result.issues.length) {
        final.issues.push(...prefixIssues$1(index, result.issues));
    }
    final.value[index] = result.value;
}
const $ZodArray$1 = /*@__PURE__*/ $constructor$1("$ZodArray", (inst, def) => {
    $ZodType$1.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!Array.isArray(input)) {
            payload.issues.push({
                expected: "array",
                code: "invalid_type",
                input,
                inst,
            });
            return payload;
        }
        payload.value = Array(input.length);
        const proms = [];
        for (let i = 0; i < input.length; i++) {
            const item = input[i];
            const result = def.element._zod.run({
                value: item,
                issues: [],
            }, ctx);
            if (result instanceof Promise) {
                proms.push(result.then((result) => handleArrayResult$1(result, payload, i)));
            }
            else {
                handleArrayResult$1(result, payload, i);
            }
        }
        if (proms.length) {
            return Promise.all(proms).then(() => payload);
        }
        return payload; //handleArrayResultsAsync(parseResults, final);
    };
});
function handleObjectResult(result, final, key) {
    // if(isOptional)
    if (result.issues.length) {
        final.issues.push(...prefixIssues$1(key, result.issues));
    }
    final.value[key] = result.value;
}
function handleOptionalObjectResult(result, final, key, input) {
    if (result.issues.length) {
        // validation failed against value schema
        if (input[key] === undefined) {
            // if input was undefined, ignore the error
            if (key in input) {
                final.value[key] = undefined;
            }
            else {
                final.value[key] = result.value;
            }
        }
        else {
            final.issues.push(...prefixIssues$1(key, result.issues));
        }
    }
    else if (result.value === undefined) {
        // validation returned `undefined`
        if (key in input)
            final.value[key] = undefined;
    }
    else {
        // non-undefined value
        final.value[key] = result.value;
    }
}
const $ZodObject$1 = /*@__PURE__*/ $constructor$1("$ZodObject", (inst, def) => {
    // requires cast because technically $ZodObject doesn't extend
    $ZodType$1.init(inst, def);
    const _normalized = cached$1(() => {
        const keys = Object.keys(def.shape);
        for (const k of keys) {
            if (!(def.shape[k] instanceof $ZodType$1)) {
                throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
            }
        }
        const okeys = optionalKeys$1(def.shape);
        return {
            shape: def.shape,
            keys,
            keySet: new Set(keys),
            numKeys: keys.length,
            optionalKeys: new Set(okeys),
        };
    });
    defineLazy$1(inst._zod, "propValues", () => {
        const shape = def.shape;
        const propValues = {};
        for (const key in shape) {
            const field = shape[key]._zod;
            if (field.values) {
                propValues[key] ?? (propValues[key] = new Set());
                for (const v of field.values)
                    propValues[key].add(v);
            }
        }
        return propValues;
    });
    const generateFastpass = (shape) => {
        const doc = new Doc$1(["shape", "payload", "ctx"]);
        const normalized = _normalized.value;
        const parseStr = (key) => {
            const k = esc$1(key);
            return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
        };
        doc.write(`const input = payload.value;`);
        const ids = Object.create(null);
        let counter = 0;
        for (const key of normalized.keys) {
            ids[key] = `key_${counter++}`;
        }
        // A: preserve key order {
        doc.write(`const newResult = {}`);
        for (const key of normalized.keys) {
            if (normalized.optionalKeys.has(key)) {
                const id = ids[key];
                doc.write(`const ${id} = ${parseStr(key)};`);
                const k = esc$1(key);
                doc.write(`
        if (${id}.issues.length) {
          if (input[${k}] === undefined) {
            if (${k} in input) {
              newResult[${k}] = undefined;
            }
          } else {
            payload.issues = payload.issues.concat(
              ${id}.issues.map((iss) => ({
                ...iss,
                path: iss.path ? [${k}, ...iss.path] : [${k}],
              }))
            );
          }
        } else if (${id}.value === undefined) {
          if (${k} in input) newResult[${k}] = undefined;
        } else {
          newResult[${k}] = ${id}.value;
        }
        `);
            }
            else {
                const id = ids[key];
                //  const id = ids[key];
                doc.write(`const ${id} = ${parseStr(key)};`);
                doc.write(`
          if (${id}.issues.length) payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${esc$1(key)}, ...iss.path] : [${esc$1(key)}]
          })));`);
                doc.write(`newResult[${esc$1(key)}] = ${id}.value`);
            }
        }
        doc.write(`payload.value = newResult;`);
        doc.write(`return payload;`);
        const fn = doc.compile();
        return (payload, ctx) => fn(shape, payload, ctx);
    };
    let fastpass;
    const isObject = isObject$1;
    const jit = !globalConfig$1.jitless;
    const allowsEval = allowsEval$1;
    const fastEnabled = jit && allowsEval.value; // && !def.catchall;
    const catchall = def.catchall;
    let value;
    inst._zod.parse = (payload, ctx) => {
        value ?? (value = _normalized.value);
        const input = payload.value;
        if (!isObject(input)) {
            payload.issues.push({
                expected: "object",
                code: "invalid_type",
                input,
                inst,
            });
            return payload;
        }
        const proms = [];
        if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
            // always synchronous
            if (!fastpass)
                fastpass = generateFastpass(def.shape);
            payload = fastpass(payload, ctx);
        }
        else {
            payload.value = {};
            const shape = value.shape;
            for (const key of value.keys) {
                const el = shape[key];
                // do not add omitted optional keys
                // if (!(key in input)) {
                //   if (optionalKeys.has(key)) continue;
                //   payload.issues.push({
                //     code: "invalid_type",
                //     path: [key],
                //     expected: "nonoptional",
                //     note: `Missing required key: "${key}"`,
                //     input,
                //     inst,
                //   });
                // }
                const r = el._zod.run({ value: input[key], issues: [] }, ctx);
                const isOptional = el._zod.optin === "optional" && el._zod.optout === "optional";
                if (r instanceof Promise) {
                    proms.push(r.then((r) => isOptional ? handleOptionalObjectResult(r, payload, key, input) : handleObjectResult(r, payload, key)));
                }
                else if (isOptional) {
                    handleOptionalObjectResult(r, payload, key, input);
                }
                else {
                    handleObjectResult(r, payload, key);
                }
            }
        }
        if (!catchall) {
            // return payload;
            return proms.length ? Promise.all(proms).then(() => payload) : payload;
        }
        const unrecognized = [];
        // iterate over input keys
        const keySet = value.keySet;
        const _catchall = catchall._zod;
        const t = _catchall.def.type;
        for (const key of Object.keys(input)) {
            if (keySet.has(key))
                continue;
            if (t === "never") {
                unrecognized.push(key);
                continue;
            }
            const r = _catchall.run({ value: input[key], issues: [] }, ctx);
            if (r instanceof Promise) {
                proms.push(r.then((r) => handleObjectResult(r, payload, key)));
            }
            else {
                handleObjectResult(r, payload, key);
            }
        }
        if (unrecognized.length) {
            payload.issues.push({
                code: "unrecognized_keys",
                keys: unrecognized,
                input,
                inst,
            });
        }
        if (!proms.length)
            return payload;
        return Promise.all(proms).then(() => {
            return payload;
        });
    };
});
function handleUnionResults$1(results, final, inst, ctx) {
    for (const result of results) {
        if (result.issues.length === 0) {
            final.value = result.value;
            return final;
        }
    }
    final.issues.push({
        code: "invalid_union",
        input: final.value,
        inst,
        errors: results.map((result) => result.issues.map((iss) => finalizeIssue$1(iss, ctx, config$1()))),
    });
    return final;
}
const $ZodUnion$1 = /*@__PURE__*/ $constructor$1("$ZodUnion", (inst, def) => {
    $ZodType$1.init(inst, def);
    defineLazy$1(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : undefined);
    defineLazy$1(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : undefined);
    defineLazy$1(inst._zod, "values", () => {
        if (def.options.every((o) => o._zod.values)) {
            return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
        }
        return undefined;
    });
    defineLazy$1(inst._zod, "pattern", () => {
        if (def.options.every((o) => o._zod.pattern)) {
            const patterns = def.options.map((o) => o._zod.pattern);
            return new RegExp(`^(${patterns.map((p) => cleanRegex$1(p.source)).join("|")})$`);
        }
        return undefined;
    });
    inst._zod.parse = (payload, ctx) => {
        let async = false;
        const results = [];
        for (const option of def.options) {
            const result = option._zod.run({
                value: payload.value,
                issues: [],
            }, ctx);
            if (result instanceof Promise) {
                results.push(result);
                async = true;
            }
            else {
                if (result.issues.length === 0)
                    return result;
                results.push(result);
            }
        }
        if (!async)
            return handleUnionResults$1(results, payload, inst, ctx);
        return Promise.all(results).then((results) => {
            return handleUnionResults$1(results, payload, inst, ctx);
        });
    };
});
const $ZodDiscriminatedUnion$1 = 
/*@__PURE__*/
$constructor$1("$ZodDiscriminatedUnion", (inst, def) => {
    $ZodUnion$1.init(inst, def);
    const _super = inst._zod.parse;
    defineLazy$1(inst._zod, "propValues", () => {
        const propValues = {};
        for (const option of def.options) {
            const pv = option._zod.propValues;
            if (!pv || Object.keys(pv).length === 0)
                throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(option)}"`);
            for (const [k, v] of Object.entries(pv)) {
                if (!propValues[k])
                    propValues[k] = new Set();
                for (const val of v) {
                    propValues[k].add(val);
                }
            }
        }
        return propValues;
    });
    const disc = cached$1(() => {
        const opts = def.options;
        const map = new Map();
        for (const o of opts) {
            const values = o._zod.propValues[def.discriminator];
            if (!values || values.size === 0)
                throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(o)}"`);
            for (const v of values) {
                if (map.has(v)) {
                    throw new Error(`Duplicate discriminator value "${String(v)}"`);
                }
                map.set(v, o);
            }
        }
        return map;
    });
    inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!isObject$1(input)) {
            payload.issues.push({
                code: "invalid_type",
                expected: "object",
                input,
                inst,
            });
            return payload;
        }
        const opt = disc.value.get(input?.[def.discriminator]);
        if (opt) {
            return opt._zod.run(payload, ctx);
        }
        if (def.unionFallback) {
            return _super(payload, ctx);
        }
        // no matching discriminator
        payload.issues.push({
            code: "invalid_union",
            errors: [],
            note: "No matching discriminator",
            input,
            path: [def.discriminator],
            inst,
        });
        return payload;
    };
});
const $ZodIntersection$1 = /*@__PURE__*/ $constructor$1("$ZodIntersection", (inst, def) => {
    $ZodType$1.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        const left = def.left._zod.run({ value: input, issues: [] }, ctx);
        const right = def.right._zod.run({ value: input, issues: [] }, ctx);
        const async = left instanceof Promise || right instanceof Promise;
        if (async) {
            return Promise.all([left, right]).then(([left, right]) => {
                return handleIntersectionResults$1(payload, left, right);
            });
        }
        return handleIntersectionResults$1(payload, left, right);
    };
});
function mergeValues$1(a, b) {
    // const aType = parse.t(a);
    // const bType = parse.t(b);
    if (a === b) {
        return { valid: true, data: a };
    }
    if (a instanceof Date && b instanceof Date && +a === +b) {
        return { valid: true, data: a };
    }
    if (isPlainObject$1(a) && isPlainObject$1(b)) {
        const bKeys = Object.keys(b);
        const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
        const newObj = { ...a, ...b };
        for (const key of sharedKeys) {
            const sharedValue = mergeValues$1(a[key], b[key]);
            if (!sharedValue.valid) {
                return {
                    valid: false,
                    mergeErrorPath: [key, ...sharedValue.mergeErrorPath],
                };
            }
            newObj[key] = sharedValue.data;
        }
        return { valid: true, data: newObj };
    }
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return { valid: false, mergeErrorPath: [] };
        }
        const newArray = [];
        for (let index = 0; index < a.length; index++) {
            const itemA = a[index];
            const itemB = b[index];
            const sharedValue = mergeValues$1(itemA, itemB);
            if (!sharedValue.valid) {
                return {
                    valid: false,
                    mergeErrorPath: [index, ...sharedValue.mergeErrorPath],
                };
            }
            newArray.push(sharedValue.data);
        }
        return { valid: true, data: newArray };
    }
    return { valid: false, mergeErrorPath: [] };
}
function handleIntersectionResults$1(result, left, right) {
    if (left.issues.length) {
        result.issues.push(...left.issues);
    }
    if (right.issues.length) {
        result.issues.push(...right.issues);
    }
    if (aborted$1(result))
        return result;
    const merged = mergeValues$1(left.value, right.value);
    if (!merged.valid) {
        throw new Error(`Unmergable intersection. Error path: ` + `${JSON.stringify(merged.mergeErrorPath)}`);
    }
    result.value = merged.data;
    return result;
}
const $ZodTuple$1 = /*@__PURE__*/ $constructor$1("$ZodTuple", (inst, def) => {
    $ZodType$1.init(inst, def);
    const items = def.items;
    const optStart = items.length - [...items].reverse().findIndex((item) => item._zod.optin !== "optional");
    inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!Array.isArray(input)) {
            payload.issues.push({
                input,
                inst,
                expected: "tuple",
                code: "invalid_type",
            });
            return payload;
        }
        payload.value = [];
        const proms = [];
        if (!def.rest) {
            const tooBig = input.length > items.length;
            const tooSmall = input.length < optStart - 1;
            if (tooBig || tooSmall) {
                payload.issues.push({
                    input,
                    inst,
                    origin: "array",
                    ...(tooBig ? { code: "too_big", maximum: items.length } : { code: "too_small", minimum: items.length }),
                });
                return payload;
            }
        }
        let i = -1;
        for (const item of items) {
            i++;
            if (i >= input.length)
                if (i >= optStart)
                    continue;
            const result = item._zod.run({
                value: input[i],
                issues: [],
            }, ctx);
            if (result instanceof Promise) {
                proms.push(result.then((result) => handleTupleResult$1(result, payload, i)));
            }
            else {
                handleTupleResult$1(result, payload, i);
            }
        }
        if (def.rest) {
            const rest = input.slice(items.length);
            for (const el of rest) {
                i++;
                const result = def.rest._zod.run({
                    value: el,
                    issues: [],
                }, ctx);
                if (result instanceof Promise) {
                    proms.push(result.then((result) => handleTupleResult$1(result, payload, i)));
                }
                else {
                    handleTupleResult$1(result, payload, i);
                }
            }
        }
        if (proms.length)
            return Promise.all(proms).then(() => payload);
        return payload;
    };
});
function handleTupleResult$1(result, final, index) {
    if (result.issues.length) {
        final.issues.push(...prefixIssues$1(index, result.issues));
    }
    final.value[index] = result.value;
}
const $ZodRecord$1 = /*@__PURE__*/ $constructor$1("$ZodRecord", (inst, def) => {
    $ZodType$1.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!isPlainObject$1(input)) {
            payload.issues.push({
                expected: "record",
                code: "invalid_type",
                input,
                inst,
            });
            return payload;
        }
        const proms = [];
        if (def.keyType._zod.values) {
            const values = def.keyType._zod.values;
            payload.value = {};
            for (const key of values) {
                if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
                    const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
                    if (result instanceof Promise) {
                        proms.push(result.then((result) => {
                            if (result.issues.length) {
                                payload.issues.push(...prefixIssues$1(key, result.issues));
                            }
                            payload.value[key] = result.value;
                        }));
                    }
                    else {
                        if (result.issues.length) {
                            payload.issues.push(...prefixIssues$1(key, result.issues));
                        }
                        payload.value[key] = result.value;
                    }
                }
            }
            let unrecognized;
            for (const key in input) {
                if (!values.has(key)) {
                    unrecognized = unrecognized ?? [];
                    unrecognized.push(key);
                }
            }
            if (unrecognized && unrecognized.length > 0) {
                payload.issues.push({
                    code: "unrecognized_keys",
                    input,
                    inst,
                    keys: unrecognized,
                });
            }
        }
        else {
            payload.value = {};
            for (const key of Reflect.ownKeys(input)) {
                if (key === "__proto__")
                    continue;
                const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
                if (keyResult instanceof Promise) {
                    throw new Error("Async schemas not supported in object keys currently");
                }
                if (keyResult.issues.length) {
                    payload.issues.push({
                        origin: "record",
                        code: "invalid_key",
                        issues: keyResult.issues.map((iss) => finalizeIssue$1(iss, ctx, config$1())),
                        input: key,
                        path: [key],
                        inst,
                    });
                    payload.value[keyResult.value] = keyResult.value;
                    continue;
                }
                const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
                if (result instanceof Promise) {
                    proms.push(result.then((result) => {
                        if (result.issues.length) {
                            payload.issues.push(...prefixIssues$1(key, result.issues));
                        }
                        payload.value[keyResult.value] = result.value;
                    }));
                }
                else {
                    if (result.issues.length) {
                        payload.issues.push(...prefixIssues$1(key, result.issues));
                    }
                    payload.value[keyResult.value] = result.value;
                }
            }
        }
        if (proms.length) {
            return Promise.all(proms).then(() => payload);
        }
        return payload;
    };
});
const $ZodMap$1 = /*@__PURE__*/ $constructor$1("$ZodMap", (inst, def) => {
    $ZodType$1.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!(input instanceof Map)) {
            payload.issues.push({
                expected: "map",
                code: "invalid_type",
                input,
                inst,
            });
            return payload;
        }
        const proms = [];
        payload.value = new Map();
        for (const [key, value] of input) {
            const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
            const valueResult = def.valueType._zod.run({ value: value, issues: [] }, ctx);
            if (keyResult instanceof Promise || valueResult instanceof Promise) {
                proms.push(Promise.all([keyResult, valueResult]).then(([keyResult, valueResult]) => {
                    handleMapResult$1(keyResult, valueResult, payload, key, input, inst, ctx);
                }));
            }
            else {
                handleMapResult$1(keyResult, valueResult, payload, key, input, inst, ctx);
            }
        }
        if (proms.length)
            return Promise.all(proms).then(() => payload);
        return payload;
    };
});
function handleMapResult$1(keyResult, valueResult, final, key, input, inst, ctx) {
    if (keyResult.issues.length) {
        if (propertyKeyTypes$1.has(typeof key)) {
            final.issues.push(...prefixIssues$1(key, keyResult.issues));
        }
        else {
            final.issues.push({
                origin: "map",
                code: "invalid_key",
                input,
                inst,
                issues: keyResult.issues.map((iss) => finalizeIssue$1(iss, ctx, config$1())),
            });
        }
    }
    if (valueResult.issues.length) {
        if (propertyKeyTypes$1.has(typeof key)) {
            final.issues.push(...prefixIssues$1(key, valueResult.issues));
        }
        else {
            final.issues.push({
                origin: "map",
                code: "invalid_element",
                input,
                inst,
                key: key,
                issues: valueResult.issues.map((iss) => finalizeIssue$1(iss, ctx, config$1())),
            });
        }
    }
    final.value.set(keyResult.value, valueResult.value);
}
const $ZodSet$1 = /*@__PURE__*/ $constructor$1("$ZodSet", (inst, def) => {
    $ZodType$1.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!(input instanceof Set)) {
            payload.issues.push({
                input,
                inst,
                expected: "set",
                code: "invalid_type",
            });
            return payload;
        }
        const proms = [];
        payload.value = new Set();
        for (const item of input) {
            const result = def.valueType._zod.run({ value: item, issues: [] }, ctx);
            if (result instanceof Promise) {
                proms.push(result.then((result) => handleSetResult$1(result, payload)));
            }
            else
                handleSetResult$1(result, payload);
        }
        if (proms.length)
            return Promise.all(proms).then(() => payload);
        return payload;
    };
});
function handleSetResult$1(result, final) {
    if (result.issues.length) {
        final.issues.push(...result.issues);
    }
    final.value.add(result.value);
}
const $ZodEnum$1 = /*@__PURE__*/ $constructor$1("$ZodEnum", (inst, def) => {
    $ZodType$1.init(inst, def);
    const values = getEnumValues$1(def.entries);
    inst._zod.values = new Set(values);
    inst._zod.pattern = new RegExp(`^(${values
        .filter((k) => propertyKeyTypes$1.has(typeof k))
        .map((o) => (typeof o === "string" ? escapeRegex$1(o) : o.toString()))
        .join("|")})$`);
    inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (inst._zod.values.has(input)) {
            return payload;
        }
        payload.issues.push({
            code: "invalid_value",
            values,
            input,
            inst,
        });
        return payload;
    };
});
const $ZodLiteral$1 = /*@__PURE__*/ $constructor$1("$ZodLiteral", (inst, def) => {
    $ZodType$1.init(inst, def);
    inst._zod.values = new Set(def.values);
    inst._zod.pattern = new RegExp(`^(${def.values
        .map((o) => (typeof o === "string" ? escapeRegex$1(o) : o ? o.toString() : String(o)))
        .join("|")})$`);
    inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (inst._zod.values.has(input)) {
            return payload;
        }
        payload.issues.push({
            code: "invalid_value",
            values: def.values,
            input,
            inst,
        });
        return payload;
    };
});
const $ZodFile$1 = /*@__PURE__*/ $constructor$1("$ZodFile", (inst, def) => {
    $ZodType$1.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (input instanceof File)
            return payload;
        payload.issues.push({
            expected: "file",
            code: "invalid_type",
            input,
            inst,
        });
        return payload;
    };
});
const $ZodTransform$1 = /*@__PURE__*/ $constructor$1("$ZodTransform", (inst, def) => {
    $ZodType$1.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
        const _out = def.transform(payload.value, payload);
        if (_ctx.async) {
            const output = _out instanceof Promise ? _out : Promise.resolve(_out);
            return output.then((output) => {
                payload.value = output;
                return payload;
            });
        }
        if (_out instanceof Promise) {
            throw new $ZodAsyncError$1();
        }
        payload.value = _out;
        return payload;
    };
});
const $ZodOptional$1 = /*@__PURE__*/ $constructor$1("$ZodOptional", (inst, def) => {
    $ZodType$1.init(inst, def);
    inst._zod.optin = "optional";
    inst._zod.optout = "optional";
    defineLazy$1(inst._zod, "values", () => {
        return def.innerType._zod.values ? new Set([...def.innerType._zod.values, undefined]) : undefined;
    });
    defineLazy$1(inst._zod, "pattern", () => {
        const pattern = def.innerType._zod.pattern;
        return pattern ? new RegExp(`^(${cleanRegex$1(pattern.source)})?$`) : undefined;
    });
    inst._zod.parse = (payload, ctx) => {
        if (def.innerType._zod.optin === "optional") {
            return def.innerType._zod.run(payload, ctx);
        }
        if (payload.value === undefined) {
            return payload;
        }
        return def.innerType._zod.run(payload, ctx);
    };
});
const $ZodNullable$1 = /*@__PURE__*/ $constructor$1("$ZodNullable", (inst, def) => {
    $ZodType$1.init(inst, def);
    defineLazy$1(inst._zod, "optin", () => def.innerType._zod.optin);
    defineLazy$1(inst._zod, "optout", () => def.innerType._zod.optout);
    defineLazy$1(inst._zod, "pattern", () => {
        const pattern = def.innerType._zod.pattern;
        return pattern ? new RegExp(`^(${cleanRegex$1(pattern.source)}|null)$`) : undefined;
    });
    defineLazy$1(inst._zod, "values", () => {
        return def.innerType._zod.values ? new Set([...def.innerType._zod.values, null]) : undefined;
    });
    inst._zod.parse = (payload, ctx) => {
        if (payload.value === null)
            return payload;
        return def.innerType._zod.run(payload, ctx);
    };
});
const $ZodDefault$1 = /*@__PURE__*/ $constructor$1("$ZodDefault", (inst, def) => {
    $ZodType$1.init(inst, def);
    // inst._zod.qin = "true";
    inst._zod.optin = "optional";
    defineLazy$1(inst._zod, "values", () => def.innerType._zod.values);
    inst._zod.parse = (payload, ctx) => {
        if (payload.value === undefined) {
            payload.value = def.defaultValue;
            /**
             * $ZodDefault always returns the default value immediately.
             * It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
            return payload;
        }
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
            return result.then((result) => handleDefaultResult$1(result, def));
        }
        return handleDefaultResult$1(result, def);
    };
});
function handleDefaultResult$1(payload, def) {
    if (payload.value === undefined) {
        payload.value = def.defaultValue;
    }
    return payload;
}
const $ZodPrefault$1 = /*@__PURE__*/ $constructor$1("$ZodPrefault", (inst, def) => {
    $ZodType$1.init(inst, def);
    inst._zod.optin = "optional";
    defineLazy$1(inst._zod, "values", () => def.innerType._zod.values);
    inst._zod.parse = (payload, ctx) => {
        if (payload.value === undefined) {
            payload.value = def.defaultValue;
        }
        return def.innerType._zod.run(payload, ctx);
    };
});
const $ZodNonOptional$1 = /*@__PURE__*/ $constructor$1("$ZodNonOptional", (inst, def) => {
    $ZodType$1.init(inst, def);
    defineLazy$1(inst._zod, "values", () => {
        const v = def.innerType._zod.values;
        return v ? new Set([...v].filter((x) => x !== undefined)) : undefined;
    });
    inst._zod.parse = (payload, ctx) => {
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
            return result.then((result) => handleNonOptionalResult$1(result, inst));
        }
        return handleNonOptionalResult$1(result, inst);
    };
});
function handleNonOptionalResult$1(payload, inst) {
    if (!payload.issues.length && payload.value === undefined) {
        payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: payload.value,
            inst,
        });
    }
    return payload;
}
const $ZodSuccess$1 = /*@__PURE__*/ $constructor$1("$ZodSuccess", (inst, def) => {
    $ZodType$1.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
            return result.then((result) => {
                payload.value = result.issues.length === 0;
                return payload;
            });
        }
        payload.value = result.issues.length === 0;
        return payload;
    };
});
const $ZodCatch$1 = /*@__PURE__*/ $constructor$1("$ZodCatch", (inst, def) => {
    $ZodType$1.init(inst, def);
    inst._zod.optin = "optional";
    defineLazy$1(inst._zod, "optout", () => def.innerType._zod.optout);
    defineLazy$1(inst._zod, "values", () => def.innerType._zod.values);
    inst._zod.parse = (payload, ctx) => {
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
            return result.then((result) => {
                payload.value = result.value;
                if (result.issues.length) {
                    payload.value = def.catchValue({
                        ...payload,
                        error: {
                            issues: result.issues.map((iss) => finalizeIssue$1(iss, ctx, config$1())),
                        },
                        input: payload.value,
                    });
                    payload.issues = [];
                }
                return payload;
            });
        }
        payload.value = result.value;
        if (result.issues.length) {
            payload.value = def.catchValue({
                ...payload,
                error: {
                    issues: result.issues.map((iss) => finalizeIssue$1(iss, ctx, config$1())),
                },
                input: payload.value,
            });
            payload.issues = [];
        }
        return payload;
    };
});
const $ZodNaN$1 = /*@__PURE__*/ $constructor$1("$ZodNaN", (inst, def) => {
    $ZodType$1.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
        if (typeof payload.value !== "number" || !Number.isNaN(payload.value)) {
            payload.issues.push({
                input: payload.value,
                inst,
                expected: "nan",
                code: "invalid_type",
            });
            return payload;
        }
        return payload;
    };
});
const $ZodPipe$1 = /*@__PURE__*/ $constructor$1("$ZodPipe", (inst, def) => {
    $ZodType$1.init(inst, def);
    defineLazy$1(inst._zod, "values", () => def.in._zod.values);
    defineLazy$1(inst._zod, "optin", () => def.in._zod.optin);
    defineLazy$1(inst._zod, "optout", () => def.out._zod.optout);
    inst._zod.parse = (payload, ctx) => {
        const left = def.in._zod.run(payload, ctx);
        if (left instanceof Promise) {
            return left.then((left) => handlePipeResult$1(left, def, ctx));
        }
        return handlePipeResult$1(left, def, ctx);
    };
});
function handlePipeResult$1(left, def, ctx) {
    if (aborted$1(left)) {
        return left;
    }
    return def.out._zod.run({ value: left.value, issues: left.issues }, ctx);
}
const $ZodReadonly$1 = /*@__PURE__*/ $constructor$1("$ZodReadonly", (inst, def) => {
    $ZodType$1.init(inst, def);
    defineLazy$1(inst._zod, "propValues", () => def.innerType._zod.propValues);
    defineLazy$1(inst._zod, "values", () => def.innerType._zod.values);
    defineLazy$1(inst._zod, "optin", () => def.innerType._zod.optin);
    defineLazy$1(inst._zod, "optout", () => def.innerType._zod.optout);
    inst._zod.parse = (payload, ctx) => {
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
            return result.then(handleReadonlyResult$1);
        }
        return handleReadonlyResult$1(result);
    };
});
function handleReadonlyResult$1(payload) {
    payload.value = Object.freeze(payload.value);
    return payload;
}
const $ZodTemplateLiteral$1 = /*@__PURE__*/ $constructor$1("$ZodTemplateLiteral", (inst, def) => {
    $ZodType$1.init(inst, def);
    const regexParts = [];
    for (const part of def.parts) {
        if (part instanceof $ZodType$1) {
            if (!part._zod.pattern) {
                // if (!source)
                throw new Error(`Invalid template literal part, no pattern found: ${[...part._zod.traits].shift()}`);
            }
            const source = part._zod.pattern instanceof RegExp ? part._zod.pattern.source : part._zod.pattern;
            if (!source)
                throw new Error(`Invalid template literal part: ${part._zod.traits}`);
            const start = source.startsWith("^") ? 1 : 0;
            const end = source.endsWith("$") ? source.length - 1 : source.length;
            regexParts.push(source.slice(start, end));
        }
        else if (part === null || primitiveTypes$1.has(typeof part)) {
            regexParts.push(escapeRegex$1(`${part}`));
        }
        else {
            throw new Error(`Invalid template literal part: ${part}`);
        }
    }
    inst._zod.pattern = new RegExp(`^${regexParts.join("")}$`);
    inst._zod.parse = (payload, _ctx) => {
        if (typeof payload.value !== "string") {
            payload.issues.push({
                input: payload.value,
                inst,
                expected: "template_literal",
                code: "invalid_type",
            });
            return payload;
        }
        inst._zod.pattern.lastIndex = 0;
        if (!inst._zod.pattern.test(payload.value)) {
            payload.issues.push({
                input: payload.value,
                inst,
                code: "invalid_format",
                format: "template_literal",
                pattern: inst._zod.pattern.source,
            });
            return payload;
        }
        return payload;
    };
});
const $ZodPromise$1 = /*@__PURE__*/ $constructor$1("$ZodPromise", (inst, def) => {
    $ZodType$1.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
        return Promise.resolve(payload.value).then((inner) => def.innerType._zod.run({ value: inner, issues: [] }, ctx));
    };
});
const $ZodLazy$1 = /*@__PURE__*/ $constructor$1("$ZodLazy", (inst, def) => {
    $ZodType$1.init(inst, def);
    defineLazy$1(inst._zod, "innerType", () => def.getter());
    defineLazy$1(inst._zod, "pattern", () => inst._zod.innerType._zod.pattern);
    defineLazy$1(inst._zod, "propValues", () => inst._zod.innerType._zod.propValues);
    defineLazy$1(inst._zod, "optin", () => inst._zod.innerType._zod.optin);
    defineLazy$1(inst._zod, "optout", () => inst._zod.innerType._zod.optout);
    inst._zod.parse = (payload, ctx) => {
        const inner = inst._zod.innerType;
        return inner._zod.run(payload, ctx);
    };
});
const $ZodCustom$1 = /*@__PURE__*/ $constructor$1("$ZodCustom", (inst, def) => {
    $ZodCheck$1.init(inst, def);
    $ZodType$1.init(inst, def);
    inst._zod.parse = (payload, _) => {
        return payload;
    };
    inst._zod.check = (payload) => {
        const input = payload.value;
        const r = def.fn(input);
        if (r instanceof Promise) {
            return r.then((r) => handleRefineResult$1(r, payload, input, inst));
        }
        handleRefineResult$1(r, payload, input, inst);
        return;
    };
});
function handleRefineResult$1(result, payload, input, inst) {
    if (!result) {
        const _iss = {
            code: "custom",
            input,
            inst, // incorporates params.error into issue reporting
            path: [...(inst._zod.def.path ?? [])], // incorporates params.error into issue reporting
            continue: !inst._zod.def.abort,
            // params: inst._zod.def.params,
        };
        if (inst._zod.def.params)
            _iss.params = inst._zod.def.params;
        payload.issues.push(issue$1(_iss));
    }
}

const error$1j = () => {
    const Sizable = {
        string: { unit: "حرف", verb: "أن يحوي" },
        file: { unit: "بايت", verb: "أن يحوي" },
        array: { unit: "عنصر", verb: "أن يحوي" },
        set: { unit: "عنصر", verb: "أن يحوي" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "number";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "مدخل",
        email: "بريد إلكتروني",
        url: "رابط",
        emoji: "إيموجي",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "تاريخ ووقت بمعيار ISO",
        date: "تاريخ بمعيار ISO",
        time: "وقت بمعيار ISO",
        duration: "مدة بمعيار ISO",
        ipv4: "عنوان IPv4",
        ipv6: "عنوان IPv6",
        cidrv4: "مدى عناوين بصيغة IPv4",
        cidrv6: "مدى عناوين بصيغة IPv6",
        base64: "نَص بترميز base64-encoded",
        base64url: "نَص بترميز base64url-encoded",
        json_string: "نَص على هيئة JSON",
        e164: "رقم هاتف بمعيار E.164",
        jwt: "JWT",
        template_literal: "مدخل",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `مدخلات غير مقبولة: يفترض إدخال ${issue.expected}، ولكن تم إدخال ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `مدخلات غير مقبولة: يفترض إدخال ${stringifyPrimitive$1(issue.values[0])}`;
                return `اختيار غير مقبول: يتوقع انتقاء أحد هذه الخيارات: ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return ` أكبر من اللازم: يفترض أن تكون ${issue.origin ?? "القيمة"} ${adj} ${issue.maximum.toString()} ${sizing.unit ?? "عنصر"}`;
                return `أكبر من اللازم: يفترض أن تكون ${issue.origin ?? "القيمة"} ${adj} ${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `أصغر من اللازم: يفترض لـ ${issue.origin} أن يكون ${adj} ${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `أصغر من اللازم: يفترض لـ ${issue.origin} أن يكون ${adj} ${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `نَص غير مقبول: يجب أن يبدأ بـ "${issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `نَص غير مقبول: يجب أن ينتهي بـ "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `نَص غير مقبول: يجب أن يتضمَّن "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `نَص غير مقبول: يجب أن يطابق النمط ${_issue.pattern}`;
                return `${Nouns[_issue.format] ?? issue.format} غير مقبول`;
            }
            case "not_multiple_of":
                return `رقم غير مقبول: يجب أن يكون من مضاعفات ${issue.divisor}`;
            case "unrecognized_keys":
                return `معرف${issue.keys.length > 1 ? "ات" : ""} غريب${issue.keys.length > 1 ? "ة" : ""}: ${joinValues$1(issue.keys, "، ")}`;
            case "invalid_key":
                return `معرف غير مقبول في ${issue.origin}`;
            case "invalid_union":
                return "مدخل غير مقبول";
            case "invalid_element":
                return `مدخل غير مقبول في ${issue.origin}`;
            default:
                return "مدخل غير مقبول";
        }
    };
};
function ar$1 () {
    return {
        localeError: error$1j(),
    };
}

const error$1i = () => {
    const Sizable = {
        string: { unit: "simvol", verb: "olmalıdır" },
        file: { unit: "bayt", verb: "olmalıdır" },
        array: { unit: "element", verb: "olmalıdır" },
        set: { unit: "element", verb: "olmalıdır" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "number";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "input",
        email: "email address",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO datetime",
        date: "ISO date",
        time: "ISO time",
        duration: "ISO duration",
        ipv4: "IPv4 address",
        ipv6: "IPv6 address",
        cidrv4: "IPv4 range",
        cidrv6: "IPv6 range",
        base64: "base64-encoded string",
        base64url: "base64url-encoded string",
        json_string: "JSON string",
        e164: "E.164 number",
        jwt: "JWT",
        template_literal: "input",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Yanlış dəyər: gözlənilən ${issue.expected}, daxil olan ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Yanlış dəyər: gözlənilən ${stringifyPrimitive$1(issue.values[0])}`;
                return `Yanlış seçim: aşağıdakılardan biri olmalıdır: ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Çox böyük: gözlənilən ${issue.origin ?? "dəyər"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "element"}`;
                return `Çox böyük: gözlənilən ${issue.origin ?? "dəyər"} ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Çox kiçik: gözlənilən ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                return `Çox kiçik: gözlənilən ${issue.origin} ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Yanlış mətn: "${_issue.prefix}" ilə başlamalıdır`;
                if (_issue.format === "ends_with")
                    return `Yanlış mətn: "${_issue.suffix}" ilə bitməlidir`;
                if (_issue.format === "includes")
                    return `Yanlış mətn: "${_issue.includes}" daxil olmalıdır`;
                if (_issue.format === "regex")
                    return `Yanlış mətn: ${_issue.pattern} şablonuna uyğun olmalıdır`;
                return `Yanlış ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Yanlış ədəd: ${issue.divisor} ilə bölünə bilən olmalıdır`;
            case "unrecognized_keys":
                return `Tanınmayan açar${issue.keys.length > 1 ? "lar" : ""}: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `${issue.origin} daxilində yanlış açar`;
            case "invalid_union":
                return "Yanlış dəyər";
            case "invalid_element":
                return `${issue.origin} daxilində yanlış dəyər`;
            default:
                return `Yanlış dəyər`;
        }
    };
};
function az$1 () {
    return {
        localeError: error$1i(),
    };
}

function getBelarusianPlural$1(count, one, few, many) {
    const absCount = Math.abs(count);
    const lastDigit = absCount % 10;
    const lastTwoDigits = absCount % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return many;
    }
    if (lastDigit === 1) {
        return one;
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
        return few;
    }
    return many;
}
const error$1h = () => {
    const Sizable = {
        string: {
            unit: {
                one: "сімвал",
                few: "сімвалы",
                many: "сімвалаў",
            },
            verb: "мець",
        },
        array: {
            unit: {
                one: "элемент",
                few: "элементы",
                many: "элементаў",
            },
            verb: "мець",
        },
        set: {
            unit: {
                one: "элемент",
                few: "элементы",
                many: "элементаў",
            },
            verb: "мець",
        },
        file: {
            unit: {
                one: "байт",
                few: "байты",
                many: "байтаў",
            },
            verb: "мець",
        },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "лік";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "масіў";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "увод",
        email: "email адрас",
        url: "URL",
        emoji: "эмодзі",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO дата і час",
        date: "ISO дата",
        time: "ISO час",
        duration: "ISO працягласць",
        ipv4: "IPv4 адрас",
        ipv6: "IPv6 адрас",
        cidrv4: "IPv4 дыяпазон",
        cidrv6: "IPv6 дыяпазон",
        base64: "радок у фармаце base64",
        base64url: "радок у фармаце base64url",
        json_string: "JSON радок",
        e164: "нумар E.164",
        jwt: "JWT",
        template_literal: "увод",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Няправільны ўвод: чакаўся ${issue.expected}, атрымана ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Няправільны ўвод: чакалася ${stringifyPrimitive$1(issue.values[0])}`;
                return `Няправільны варыянт: чакаўся адзін з ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    const maxValue = Number(issue.maximum);
                    const unit = getBelarusianPlural$1(maxValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
                    return `Занадта вялікі: чакалася, што ${issue.origin ?? "значэнне"} павінна ${sizing.verb} ${adj}${issue.maximum.toString()} ${unit}`;
                }
                return `Занадта вялікі: чакалася, што ${issue.origin ?? "значэнне"} павінна быць ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    const minValue = Number(issue.minimum);
                    const unit = getBelarusianPlural$1(minValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
                    return `Занадта малы: чакалася, што ${issue.origin} павінна ${sizing.verb} ${adj}${issue.minimum.toString()} ${unit}`;
                }
                return `Занадта малы: чакалася, што ${issue.origin} павінна быць ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Няправільны радок: павінен пачынацца з "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Няправільны радок: павінен заканчвацца на "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Няправільны радок: павінен змяшчаць "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Няправільны радок: павінен адпавядаць шаблону ${_issue.pattern}`;
                return `Няправільны ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Няправільны лік: павінен быць кратным ${issue.divisor}`;
            case "unrecognized_keys":
                return `Нераспазнаны ${issue.keys.length > 1 ? "ключы" : "ключ"}: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `Няправільны ключ у ${issue.origin}`;
            case "invalid_union":
                return "Няправільны ўвод";
            case "invalid_element":
                return `Няправільнае значэнне ў ${issue.origin}`;
            default:
                return `Няправільны ўвод`;
        }
    };
};
function be$1 () {
    return {
        localeError: error$1h(),
    };
}

const error$1g = () => {
    const Sizable = {
        string: { unit: "caràcters", verb: "contenir" },
        file: { unit: "bytes", verb: "contenir" },
        array: { unit: "elements", verb: "contenir" },
        set: { unit: "elements", verb: "contenir" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "number";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "entrada",
        email: "adreça electrònica",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "data i hora ISO",
        date: "data ISO",
        time: "hora ISO",
        duration: "durada ISO",
        ipv4: "adreça IPv4",
        ipv6: "adreça IPv6",
        cidrv4: "rang IPv4",
        cidrv6: "rang IPv6",
        base64: "cadena codificada en base64",
        base64url: "cadena codificada en base64url",
        json_string: "cadena JSON",
        e164: "número E.164",
        jwt: "JWT",
        template_literal: "entrada",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Tipus invàlid: s'esperava ${issue.expected}, s'ha rebut ${parsedType(issue.input)}`;
            // return `Tipus invàlid: s'esperava ${issue.expected}, s'ha rebut ${util.getParsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Valor invàlid: s'esperava ${stringifyPrimitive$1(issue.values[0])}`;
                return `Opció invàlida: s'esperava una de ${joinValues$1(issue.values, " o ")}`;
            case "too_big": {
                const adj = issue.inclusive ? "com a màxim" : "menys de";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Massa gran: s'esperava que ${issue.origin ?? "el valor"} contingués ${adj} ${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
                return `Massa gran: s'esperava que ${issue.origin ?? "el valor"} fos ${adj} ${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? "com a mínim" : "més de";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Massa petit: s'esperava que ${issue.origin} contingués ${adj} ${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Massa petit: s'esperava que ${issue.origin} fos ${adj} ${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `Format invàlid: ha de començar amb "${_issue.prefix}"`;
                }
                if (_issue.format === "ends_with")
                    return `Format invàlid: ha d'acabar amb "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Format invàlid: ha d'incloure "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Format invàlid: ha de coincidir amb el patró ${_issue.pattern}`;
                return `Format invàlid per a ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Número invàlid: ha de ser múltiple de ${issue.divisor}`;
            case "unrecognized_keys":
                return `Clau${issue.keys.length > 1 ? "s" : ""} no reconeguda${issue.keys.length > 1 ? "s" : ""}: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `Clau invàlida a ${issue.origin}`;
            case "invalid_union":
                return "Entrada invàlida"; // Could also be "Tipus d'unió invàlid" but "Entrada invàlida" is more general
            case "invalid_element":
                return `Element invàlid a ${issue.origin}`;
            default:
                return `Entrada invàlida`;
        }
    };
};
function ca$1 () {
    return {
        localeError: error$1g(),
    };
}

const error$1f = () => {
    const Sizable = {
        string: { unit: "znaků", verb: "mít" },
        file: { unit: "bajtů", verb: "mít" },
        array: { unit: "prvků", verb: "mít" },
        set: { unit: "prvků", verb: "mít" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "číslo";
            }
            case "string": {
                return "řetězec";
            }
            case "boolean": {
                return "boolean";
            }
            case "bigint": {
                return "bigint";
            }
            case "function": {
                return "funkce";
            }
            case "symbol": {
                return "symbol";
            }
            case "undefined": {
                return "undefined";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "pole";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "regulární výraz",
        email: "e-mailová adresa",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "datum a čas ve formátu ISO",
        date: "datum ve formátu ISO",
        time: "čas ve formátu ISO",
        duration: "doba trvání ISO",
        ipv4: "IPv4 adresa",
        ipv6: "IPv6 adresa",
        cidrv4: "rozsah IPv4",
        cidrv6: "rozsah IPv6",
        base64: "řetězec zakódovaný ve formátu base64",
        base64url: "řetězec zakódovaný ve formátu base64url",
        json_string: "řetězec ve formátu JSON",
        e164: "číslo E.164",
        jwt: "JWT",
        template_literal: "vstup",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Neplatný vstup: očekáváno ${issue.expected}, obdrženo ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Neplatný vstup: očekáváno ${stringifyPrimitive$1(issue.values[0])}`;
                return `Neplatná možnost: očekávána jedna z hodnot ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Hodnota je příliš velká: ${issue.origin ?? "hodnota"} musí mít ${adj}${issue.maximum.toString()} ${sizing.unit ?? "prvků"}`;
                }
                return `Hodnota je příliš velká: ${issue.origin ?? "hodnota"} musí být ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Hodnota je příliš malá: ${issue.origin ?? "hodnota"} musí mít ${adj}${issue.minimum.toString()} ${sizing.unit ?? "prvků"}`;
                }
                return `Hodnota je příliš malá: ${issue.origin ?? "hodnota"} musí být ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Neplatný řetězec: musí začínat na "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Neplatný řetězec: musí končit na "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Neplatný řetězec: musí obsahovat "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Neplatný řetězec: musí odpovídat vzoru ${_issue.pattern}`;
                return `Neplatný formát ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Neplatné číslo: musí být násobkem ${issue.divisor}`;
            case "unrecognized_keys":
                return `Neznámé klíče: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `Neplatný klíč v ${issue.origin}`;
            case "invalid_union":
                return "Neplatný vstup";
            case "invalid_element":
                return `Neplatná hodnota v ${issue.origin}`;
            default:
                return `Neplatný vstup`;
        }
    };
};
function cs$1 () {
    return {
        localeError: error$1f(),
    };
}

const error$1e = () => {
    const Sizable = {
        string: { unit: "Zeichen", verb: "zu haben" },
        file: { unit: "Bytes", verb: "zu haben" },
        array: { unit: "Elemente", verb: "zu haben" },
        set: { unit: "Elemente", verb: "zu haben" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "Zahl";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "Array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "Eingabe",
        email: "E-Mail-Adresse",
        url: "URL",
        emoji: "Emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO-Datum und -Uhrzeit",
        date: "ISO-Datum",
        time: "ISO-Uhrzeit",
        duration: "ISO-Dauer",
        ipv4: "IPv4-Adresse",
        ipv6: "IPv6-Adresse",
        cidrv4: "IPv4-Bereich",
        cidrv6: "IPv6-Bereich",
        base64: "Base64-codierter String",
        base64url: "Base64-URL-codierter String",
        json_string: "JSON-String",
        e164: "E.164-Nummer",
        jwt: "JWT",
        template_literal: "Eingabe",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Ungültige Eingabe: erwartet ${issue.expected}, erhalten ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Ungültige Eingabe: erwartet ${stringifyPrimitive$1(issue.values[0])}`;
                return `Ungültige Option: erwartet eine von ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Zu groß: erwartet, dass ${issue.origin ?? "Wert"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "Elemente"} hat`;
                return `Zu groß: erwartet, dass ${issue.origin ?? "Wert"} ${adj}${issue.maximum.toString()} ist`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Zu klein: erwartet, dass ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit} hat`;
                }
                return `Zu klein: erwartet, dass ${issue.origin} ${adj}${issue.minimum.toString()} ist`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Ungültiger String: muss mit "${_issue.prefix}" beginnen`;
                if (_issue.format === "ends_with")
                    return `Ungültiger String: muss mit "${_issue.suffix}" enden`;
                if (_issue.format === "includes")
                    return `Ungültiger String: muss "${_issue.includes}" enthalten`;
                if (_issue.format === "regex")
                    return `Ungültiger String: muss dem Muster ${_issue.pattern} entsprechen`;
                return `Ungültig: ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Ungültige Zahl: muss ein Vielfaches von ${issue.divisor} sein`;
            case "unrecognized_keys":
                return `${issue.keys.length > 1 ? "Unbekannte Schlüssel" : "Unbekannter Schlüssel"}: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `Ungültiger Schlüssel in ${issue.origin}`;
            case "invalid_union":
                return "Ungültige Eingabe";
            case "invalid_element":
                return `Ungültiger Wert in ${issue.origin}`;
            default:
                return `Ungültige Eingabe`;
        }
    };
};
function de$1 () {
    return {
        localeError: error$1e(),
    };
}

const parsedType$9 = (data) => {
    const t = typeof data;
    switch (t) {
        case "number": {
            return Number.isNaN(data) ? "NaN" : "number";
        }
        case "object": {
            if (Array.isArray(data)) {
                return "array";
            }
            if (data === null) {
                return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                return data.constructor.name;
            }
        }
    }
    return t;
};
const error$1d = () => {
    const Sizable = {
        string: { unit: "characters", verb: "to have" },
        file: { unit: "bytes", verb: "to have" },
        array: { unit: "items", verb: "to have" },
        set: { unit: "items", verb: "to have" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const Nouns = {
        regex: "input",
        email: "email address",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO datetime",
        date: "ISO date",
        time: "ISO time",
        duration: "ISO duration",
        ipv4: "IPv4 address",
        ipv6: "IPv6 address",
        cidrv4: "IPv4 range",
        cidrv6: "IPv6 range",
        base64: "base64-encoded string",
        base64url: "base64url-encoded string",
        json_string: "JSON string",
        e164: "E.164 number",
        jwt: "JWT",
        template_literal: "input",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Invalid input: expected ${issue.expected}, received ${parsedType$9(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Invalid input: expected ${stringifyPrimitive$1(issue.values[0])}`;
                return `Invalid option: expected one of ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Too big: expected ${issue.origin ?? "value"} to have ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
                return `Too big: expected ${issue.origin ?? "value"} to be ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Too small: expected ${issue.origin} to have ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Too small: expected ${issue.origin} to be ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `Invalid string: must start with "${_issue.prefix}"`;
                }
                if (_issue.format === "ends_with")
                    return `Invalid string: must end with "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Invalid string: must include "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Invalid string: must match pattern ${_issue.pattern}`;
                return `Invalid ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Invalid number: must be a multiple of ${issue.divisor}`;
            case "unrecognized_keys":
                return `Unrecognized key${issue.keys.length > 1 ? "s" : ""}: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `Invalid key in ${issue.origin}`;
            case "invalid_union":
                return "Invalid input";
            case "invalid_element":
                return `Invalid value in ${issue.origin}`;
            default:
                return `Invalid input`;
        }
    };
};
function en$1 () {
    return {
        localeError: error$1d(),
    };
}

const parsedType$8 = (data) => {
    const t = typeof data;
    switch (t) {
        case "number": {
            return Number.isNaN(data) ? "NaN" : "nombro";
        }
        case "object": {
            if (Array.isArray(data)) {
                return "tabelo";
            }
            if (data === null) {
                return "senvalora";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                return data.constructor.name;
            }
        }
    }
    return t;
};
const error$1c = () => {
    const Sizable = {
        string: { unit: "karaktrojn", verb: "havi" },
        file: { unit: "bajtojn", verb: "havi" },
        array: { unit: "elementojn", verb: "havi" },
        set: { unit: "elementojn", verb: "havi" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const Nouns = {
        regex: "enigo",
        email: "retadreso",
        url: "URL",
        emoji: "emoĝio",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO-datotempo",
        date: "ISO-dato",
        time: "ISO-tempo",
        duration: "ISO-daŭro",
        ipv4: "IPv4-adreso",
        ipv6: "IPv6-adreso",
        cidrv4: "IPv4-rango",
        cidrv6: "IPv6-rango",
        base64: "64-ume kodita karaktraro",
        base64url: "URL-64-ume kodita karaktraro",
        json_string: "JSON-karaktraro",
        e164: "E.164-nombro",
        jwt: "JWT",
        template_literal: "enigo",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Nevalida enigo: atendiĝis ${issue.expected}, riceviĝis ${parsedType$8(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Nevalida enigo: atendiĝis ${stringifyPrimitive$1(issue.values[0])}`;
                return `Nevalida opcio: atendiĝis unu el ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Tro granda: atendiĝis ke ${issue.origin ?? "valoro"} havu ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementojn"}`;
                return `Tro granda: atendiĝis ke ${issue.origin ?? "valoro"} havu ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Tro malgranda: atendiĝis ke ${issue.origin} havu ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Tro malgranda: atendiĝis ke ${issue.origin} estu ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Nevalida karaktraro: devas komenciĝi per "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Nevalida karaktraro: devas finiĝi per "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Nevalida karaktraro: devas inkluzivi "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Nevalida karaktraro: devas kongrui kun la modelo ${_issue.pattern}`;
                return `Nevalida ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Nevalida nombro: devas esti oblo de ${issue.divisor}`;
            case "unrecognized_keys":
                return `Nekonata${issue.keys.length > 1 ? "j" : ""} ŝlosilo${issue.keys.length > 1 ? "j" : ""}: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `Nevalida ŝlosilo en ${issue.origin}`;
            case "invalid_union":
                return "Nevalida enigo";
            case "invalid_element":
                return `Nevalida valoro en ${issue.origin}`;
            default:
                return `Nevalida enigo`;
        }
    };
};
function eo$1 () {
    return {
        localeError: error$1c(),
    };
}

const error$1b = () => {
    const Sizable = {
        string: { unit: "caracteres", verb: "tener" },
        file: { unit: "bytes", verb: "tener" },
        array: { unit: "elementos", verb: "tener" },
        set: { unit: "elementos", verb: "tener" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "número";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "arreglo";
                }
                if (data === null) {
                    return "nulo";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "entrada",
        email: "dirección de correo electrónico",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "fecha y hora ISO",
        date: "fecha ISO",
        time: "hora ISO",
        duration: "duración ISO",
        ipv4: "dirección IPv4",
        ipv6: "dirección IPv6",
        cidrv4: "rango IPv4",
        cidrv6: "rango IPv6",
        base64: "cadena codificada en base64",
        base64url: "URL codificada en base64",
        json_string: "cadena JSON",
        e164: "número E.164",
        jwt: "JWT",
        template_literal: "entrada",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Entrada inválida: se esperaba ${issue.expected}, recibido ${parsedType(issue.input)}`;
            // return `Entrada inválida: se esperaba ${issue.expected}, recibido ${util.getParsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Entrada inválida: se esperaba ${stringifyPrimitive$1(issue.values[0])}`;
                return `Opción inválida: se esperaba una de ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Demasiado grande: se esperaba que ${issue.origin ?? "valor"} tuviera ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementos"}`;
                return `Demasiado grande: se esperaba que ${issue.origin ?? "valor"} fuera ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Demasiado pequeño: se esperaba que ${issue.origin} tuviera ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Demasiado pequeño: se esperaba que ${issue.origin} fuera ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Cadena inválida: debe comenzar con "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Cadena inválida: debe terminar en "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Cadena inválida: debe incluir "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Cadena inválida: debe coincidir con el patrón ${_issue.pattern}`;
                return `Inválido ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Número inválido: debe ser múltiplo de ${issue.divisor}`;
            case "unrecognized_keys":
                return `Llave${issue.keys.length > 1 ? "s" : ""} desconocida${issue.keys.length > 1 ? "s" : ""}: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `Llave inválida en ${issue.origin}`;
            case "invalid_union":
                return "Entrada inválida";
            case "invalid_element":
                return `Valor inválido en ${issue.origin}`;
            default:
                return `Entrada inválida`;
        }
    };
};
function es$1 () {
    return {
        localeError: error$1b(),
    };
}

const error$1a = () => {
    const Sizable = {
        string: { unit: "کاراکتر", verb: "داشته باشد" },
        file: { unit: "بایت", verb: "داشته باشد" },
        array: { unit: "آیتم", verb: "داشته باشد" },
        set: { unit: "آیتم", verb: "داشته باشد" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "عدد";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "آرایه";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "ورودی",
        email: "آدرس ایمیل",
        url: "URL",
        emoji: "ایموجی",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "تاریخ و زمان ایزو",
        date: "تاریخ ایزو",
        time: "زمان ایزو",
        duration: "مدت زمان ایزو",
        ipv4: "IPv4 آدرس",
        ipv6: "IPv6 آدرس",
        cidrv4: "IPv4 دامنه",
        cidrv6: "IPv6 دامنه",
        base64: "base64-encoded رشته",
        base64url: "base64url-encoded رشته",
        json_string: "JSON رشته",
        e164: "E.164 عدد",
        jwt: "JWT",
        template_literal: "ورودی",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `ورودی نامعتبر: می‌بایست ${issue.expected} می‌بود، ${parsedType(issue.input)} دریافت شد`;
            case "invalid_value":
                if (issue.values.length === 1) {
                    return `ورودی نامعتبر: می‌بایست ${stringifyPrimitive$1(issue.values[0])} می‌بود`;
                }
                return `گزینه نامعتبر: می‌بایست یکی از ${joinValues$1(issue.values, "|")} می‌بود`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `خیلی بزرگ: ${issue.origin ?? "مقدار"} باید ${adj}${issue.maximum.toString()} ${sizing.unit ?? "عنصر"} باشد`;
                }
                return `خیلی بزرگ: ${issue.origin ?? "مقدار"} باید ${adj}${issue.maximum.toString()} باشد`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `خیلی کوچک: ${issue.origin} باید ${adj}${issue.minimum.toString()} ${sizing.unit} باشد`;
                }
                return `خیلی کوچک: ${issue.origin} باید ${adj}${issue.minimum.toString()} باشد`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `رشته نامعتبر: باید با "${_issue.prefix}" شروع شود`;
                }
                if (_issue.format === "ends_with") {
                    return `رشته نامعتبر: باید با "${_issue.suffix}" تمام شود`;
                }
                if (_issue.format === "includes") {
                    return `رشته نامعتبر: باید شامل "${_issue.includes}" باشد`;
                }
                if (_issue.format === "regex") {
                    return `رشته نامعتبر: باید با الگوی ${_issue.pattern} مطابقت داشته باشد`;
                }
                return `${Nouns[_issue.format] ?? issue.format} نامعتبر`;
            }
            case "not_multiple_of":
                return `عدد نامعتبر: باید مضرب ${issue.divisor} باشد`;
            case "unrecognized_keys":
                return `کلید${issue.keys.length > 1 ? "های" : ""} ناشناس: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `کلید ناشناس در ${issue.origin}`;
            case "invalid_union":
                return `ورودی نامعتبر`;
            case "invalid_element":
                return `مقدار نامعتبر در ${issue.origin}`;
            default:
                return `ورودی نامعتبر`;
        }
    };
};
function fa$1 () {
    return {
        localeError: error$1a(),
    };
}

const error$19 = () => {
    const Sizable = {
        string: { unit: "merkkiä", subject: "merkkijonon" },
        file: { unit: "tavua", subject: "tiedoston" },
        array: { unit: "alkiota", subject: "listan" },
        set: { unit: "alkiota", subject: "joukon" },
        number: { unit: "", subject: "luvun" },
        bigint: { unit: "", subject: "suuren kokonaisluvun" },
        int: { unit: "", subject: "kokonaisluvun" },
        date: { unit: "", subject: "päivämäärän" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "number";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "säännöllinen lauseke",
        email: "sähköpostiosoite",
        url: "URL-osoite",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO-aikaleima",
        date: "ISO-päivämäärä",
        time: "ISO-aika",
        duration: "ISO-kesto",
        ipv4: "IPv4-osoite",
        ipv6: "IPv6-osoite",
        cidrv4: "IPv4-alue",
        cidrv6: "IPv6-alue",
        base64: "base64-koodattu merkkijono",
        base64url: "base64url-koodattu merkkijono",
        json_string: "JSON-merkkijono",
        e164: "E.164-luku",
        jwt: "JWT",
        template_literal: "templaattimerkkijono",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Virheellinen tyyppi: odotettiin ${issue.expected}, oli ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Virheellinen syöte: täytyy olla ${stringifyPrimitive$1(issue.values[0])}`;
                return `Virheellinen valinta: täytyy olla yksi seuraavista: ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Liian suuri: ${sizing.subject} täytyy olla ${adj}${issue.maximum.toString()} ${sizing.unit}`.trim();
                }
                return `Liian suuri: arvon täytyy olla ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Liian pieni: ${sizing.subject} täytyy olla ${adj}${issue.minimum.toString()} ${sizing.unit}`.trim();
                }
                return `Liian pieni: arvon täytyy olla ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Virheellinen syöte: täytyy alkaa "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Virheellinen syöte: täytyy loppua "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Virheellinen syöte: täytyy sisältää "${_issue.includes}"`;
                if (_issue.format === "regex") {
                    return `Virheellinen syöte: täytyy vastata säännöllistä lauseketta ${_issue.pattern}`;
                }
                return `Virheellinen ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Virheellinen luku: täytyy olla luvun ${issue.divisor} monikerta`;
            case "unrecognized_keys":
                return `${issue.keys.length > 1 ? "Tuntemattomat avaimet" : "Tuntematon avain"}: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return "Virheellinen avain tietueessa";
            case "invalid_union":
                return "Virheellinen unioni";
            case "invalid_element":
                return "Virheellinen arvo joukossa";
            default:
                return `Virheellinen syöte`;
        }
    };
};
function fi$1 () {
    return {
        localeError: error$19(),
    };
}

const error$18 = () => {
    const Sizable = {
        string: { unit: "caractères", verb: "avoir" },
        file: { unit: "octets", verb: "avoir" },
        array: { unit: "éléments", verb: "avoir" },
        set: { unit: "éléments", verb: "avoir" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "nombre";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "tableau";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "entrée",
        email: "adresse e-mail",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "date et heure ISO",
        date: "date ISO",
        time: "heure ISO",
        duration: "durée ISO",
        ipv4: "adresse IPv4",
        ipv6: "adresse IPv6",
        cidrv4: "plage IPv4",
        cidrv6: "plage IPv6",
        base64: "chaîne encodée en base64",
        base64url: "chaîne encodée en base64url",
        json_string: "chaîne JSON",
        e164: "numéro E.164",
        jwt: "JWT",
        template_literal: "entrée",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Entrée invalide : ${issue.expected} attendu, ${parsedType(issue.input)} reçu`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Entrée invalide : ${stringifyPrimitive$1(issue.values[0])} attendu`;
                return `Option invalide : une valeur parmi ${joinValues$1(issue.values, "|")} attendue`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Trop grand : ${issue.origin ?? "valeur"} doit ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "élément(s)"}`;
                return `Trop grand : ${issue.origin ?? "valeur"} doit être ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Trop petit : ${issue.origin} doit ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Trop petit : ${issue.origin} doit être ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Chaîne invalide : doit commencer par "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Chaîne invalide : doit se terminer par "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Chaîne invalide : doit inclure "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Chaîne invalide : doit correspondre au modèle ${_issue.pattern}`;
                return `${Nouns[_issue.format] ?? issue.format} invalide`;
            }
            case "not_multiple_of":
                return `Nombre invalide : doit être un multiple de ${issue.divisor}`;
            case "unrecognized_keys":
                return `Clé${issue.keys.length > 1 ? "s" : ""} non reconnue${issue.keys.length > 1 ? "s" : ""} : ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `Clé invalide dans ${issue.origin}`;
            case "invalid_union":
                return "Entrée invalide";
            case "invalid_element":
                return `Valeur invalide dans ${issue.origin}`;
            default:
                return `Entrée invalide`;
        }
    };
};
function fr$1 () {
    return {
        localeError: error$18(),
    };
}

const error$17 = () => {
    const Sizable = {
        string: { unit: "caractères", verb: "avoir" },
        file: { unit: "octets", verb: "avoir" },
        array: { unit: "éléments", verb: "avoir" },
        set: { unit: "éléments", verb: "avoir" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "number";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "entrée",
        email: "adresse courriel",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "date-heure ISO",
        date: "date ISO",
        time: "heure ISO",
        duration: "durée ISO",
        ipv4: "adresse IPv4",
        ipv6: "adresse IPv6",
        cidrv4: "plage IPv4",
        cidrv6: "plage IPv6",
        base64: "chaîne encodée en base64",
        base64url: "chaîne encodée en base64url",
        json_string: "chaîne JSON",
        e164: "numéro E.164",
        jwt: "JWT",
        template_literal: "entrée",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Entrée invalide : attendu ${issue.expected}, reçu ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Entrée invalide : attendu ${stringifyPrimitive$1(issue.values[0])}`;
                return `Option invalide : attendu l'une des valeurs suivantes ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "≤" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Trop grand : attendu que ${issue.origin ?? "la valeur"} ait ${adj}${issue.maximum.toString()} ${sizing.unit}`;
                return `Trop grand : attendu que ${issue.origin ?? "la valeur"} soit ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? "≥" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Trop petit : attendu que ${issue.origin} ait ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Trop petit : attendu que ${issue.origin} soit ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `Chaîne invalide : doit commencer par "${_issue.prefix}"`;
                }
                if (_issue.format === "ends_with")
                    return `Chaîne invalide : doit se terminer par "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Chaîne invalide : doit inclure "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Chaîne invalide : doit correspondre au motif ${_issue.pattern}`;
                return `${Nouns[_issue.format] ?? issue.format} invalide`;
            }
            case "not_multiple_of":
                return `Nombre invalide : doit être un multiple de ${issue.divisor}`;
            case "unrecognized_keys":
                return `Clé${issue.keys.length > 1 ? "s" : ""} non reconnue${issue.keys.length > 1 ? "s" : ""} : ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `Clé invalide dans ${issue.origin}`;
            case "invalid_union":
                return "Entrée invalide";
            case "invalid_element":
                return `Valeur invalide dans ${issue.origin}`;
            default:
                return `Entrée invalide`;
        }
    };
};
function frCA$1 () {
    return {
        localeError: error$17(),
    };
}

const error$16 = () => {
    const Sizable = {
        string: { unit: "אותיות", verb: "לכלול" },
        file: { unit: "בייטים", verb: "לכלול" },
        array: { unit: "פריטים", verb: "לכלול" },
        set: { unit: "פריטים", verb: "לכלול" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "number";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "קלט",
        email: "כתובת אימייל",
        url: "כתובת רשת",
        emoji: "אימוג'י",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "תאריך וזמן ISO",
        date: "תאריך ISO",
        time: "זמן ISO",
        duration: "משך זמן ISO",
        ipv4: "כתובת IPv4",
        ipv6: "כתובת IPv6",
        cidrv4: "טווח IPv4",
        cidrv6: "טווח IPv6",
        base64: "מחרוזת בבסיס 64",
        base64url: "מחרוזת בבסיס 64 לכתובות רשת",
        json_string: "מחרוזת JSON",
        e164: "מספר E.164",
        jwt: "JWT",
        template_literal: "קלט",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `קלט לא תקין: צריך ${issue.expected}, התקבל ${parsedType(issue.input)}`;
            // return `Invalid input: expected ${issue.expected}, received ${util.getParsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `קלט לא תקין: צריך ${stringifyPrimitive$1(issue.values[0])}`;
                return `קלט לא תקין: צריך אחת מהאפשרויות  ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `גדול מדי: ${issue.origin ?? "value"} צריך להיות ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
                return `גדול מדי: ${issue.origin ?? "value"} צריך להיות ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `קטן מדי: ${issue.origin} צריך להיות ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `קטן מדי: ${issue.origin} צריך להיות ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `מחרוזת לא תקינה: חייבת להתחיל ב"${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `מחרוזת לא תקינה: חייבת להסתיים ב "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `מחרוזת לא תקינה: חייבת לכלול "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `מחרוזת לא תקינה: חייבת להתאים לתבנית ${_issue.pattern}`;
                return `${Nouns[_issue.format] ?? issue.format} לא תקין`;
            }
            case "not_multiple_of":
                return `מספר לא תקין: חייב להיות מכפלה של ${issue.divisor}`;
            case "unrecognized_keys":
                return `מפתח${issue.keys.length > 1 ? "ות" : ""} לא מזוה${issue.keys.length > 1 ? "ים" : "ה"}: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `מפתח לא תקין ב${issue.origin}`;
            case "invalid_union":
                return "קלט לא תקין";
            case "invalid_element":
                return `ערך לא תקין ב${issue.origin}`;
            default:
                return `קלט לא תקין`;
        }
    };
};
function he$1 () {
    return {
        localeError: error$16(),
    };
}

const error$15 = () => {
    const Sizable = {
        string: { unit: "karakter", verb: "legyen" },
        file: { unit: "byte", verb: "legyen" },
        array: { unit: "elem", verb: "legyen" },
        set: { unit: "elem", verb: "legyen" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "szám";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "tömb";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "bemenet",
        email: "email cím",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO időbélyeg",
        date: "ISO dátum",
        time: "ISO idő",
        duration: "ISO időintervallum",
        ipv4: "IPv4 cím",
        ipv6: "IPv6 cím",
        cidrv4: "IPv4 tartomány",
        cidrv6: "IPv6 tartomány",
        base64: "base64-kódolt string",
        base64url: "base64url-kódolt string",
        json_string: "JSON string",
        e164: "E.164 szám",
        jwt: "JWT",
        template_literal: "bemenet",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Érvénytelen bemenet: a várt érték ${issue.expected}, a kapott érték ${parsedType(issue.input)}`;
            // return `Invalid input: expected ${issue.expected}, received ${util.getParsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Érvénytelen bemenet: a várt érték ${stringifyPrimitive$1(issue.values[0])}`;
                return `Érvénytelen opció: valamelyik érték várt ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Túl nagy: ${issue.origin ?? "érték"} mérete túl nagy ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elem"}`;
                return `Túl nagy: a bemeneti érték ${issue.origin ?? "érték"} túl nagy: ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Túl kicsi: a bemeneti érték ${issue.origin} mérete túl kicsi ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Túl kicsi: a bemeneti érték ${issue.origin} túl kicsi ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Érvénytelen string: "${_issue.prefix}" értékkel kell kezdődnie`;
                if (_issue.format === "ends_with")
                    return `Érvénytelen string: "${_issue.suffix}" értékkel kell végződnie`;
                if (_issue.format === "includes")
                    return `Érvénytelen string: "${_issue.includes}" értéket kell tartalmaznia`;
                if (_issue.format === "regex")
                    return `Érvénytelen string: ${_issue.pattern} mintának kell megfelelnie`;
                return `Érvénytelen ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Érvénytelen szám: ${issue.divisor} többszörösének kell lennie`;
            case "unrecognized_keys":
                return `Ismeretlen kulcs${issue.keys.length > 1 ? "s" : ""}: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `Érvénytelen kulcs ${issue.origin}`;
            case "invalid_union":
                return "Érvénytelen bemenet";
            case "invalid_element":
                return `Érvénytelen érték: ${issue.origin}`;
            default:
                return `Érvénytelen bemenet`;
        }
    };
};
function hu$1 () {
    return {
        localeError: error$15(),
    };
}

const error$14 = () => {
    const Sizable = {
        string: { unit: "karakter", verb: "memiliki" },
        file: { unit: "byte", verb: "memiliki" },
        array: { unit: "item", verb: "memiliki" },
        set: { unit: "item", verb: "memiliki" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "number";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "input",
        email: "alamat email",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "tanggal dan waktu format ISO",
        date: "tanggal format ISO",
        time: "jam format ISO",
        duration: "durasi format ISO",
        ipv4: "alamat IPv4",
        ipv6: "alamat IPv6",
        cidrv4: "rentang alamat IPv4",
        cidrv6: "rentang alamat IPv6",
        base64: "string dengan enkode base64",
        base64url: "string dengan enkode base64url",
        json_string: "string JSON",
        e164: "angka E.164",
        jwt: "JWT",
        template_literal: "input",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Input tidak valid: diharapkan ${issue.expected}, diterima ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Input tidak valid: diharapkan ${stringifyPrimitive$1(issue.values[0])}`;
                return `Pilihan tidak valid: diharapkan salah satu dari ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Terlalu besar: diharapkan ${issue.origin ?? "value"} memiliki ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elemen"}`;
                return `Terlalu besar: diharapkan ${issue.origin ?? "value"} menjadi ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Terlalu kecil: diharapkan ${issue.origin} memiliki ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Terlalu kecil: diharapkan ${issue.origin} menjadi ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `String tidak valid: harus dimulai dengan "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `String tidak valid: harus berakhir dengan "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `String tidak valid: harus menyertakan "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `String tidak valid: harus sesuai pola ${_issue.pattern}`;
                return `${Nouns[_issue.format] ?? issue.format} tidak valid`;
            }
            case "not_multiple_of":
                return `Angka tidak valid: harus kelipatan dari ${issue.divisor}`;
            case "unrecognized_keys":
                return `Kunci tidak dikenali ${issue.keys.length > 1 ? "s" : ""}: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `Kunci tidak valid di ${issue.origin}`;
            case "invalid_union":
                return "Input tidak valid";
            case "invalid_element":
                return `Nilai tidak valid di ${issue.origin}`;
            default:
                return `Input tidak valid`;
        }
    };
};
function id$1 () {
    return {
        localeError: error$14(),
    };
}

const error$13 = () => {
    const Sizable = {
        string: { unit: "caratteri", verb: "avere" },
        file: { unit: "byte", verb: "avere" },
        array: { unit: "elementi", verb: "avere" },
        set: { unit: "elementi", verb: "avere" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "numero";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "vettore";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "input",
        email: "indirizzo email",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "data e ora ISO",
        date: "data ISO",
        time: "ora ISO",
        duration: "durata ISO",
        ipv4: "indirizzo IPv4",
        ipv6: "indirizzo IPv6",
        cidrv4: "intervallo IPv4",
        cidrv6: "intervallo IPv6",
        base64: "stringa codificata in base64",
        base64url: "URL codificata in base64",
        json_string: "stringa JSON",
        e164: "numero E.164",
        jwt: "JWT",
        template_literal: "input",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Input non valido: atteso ${issue.expected}, ricevuto ${parsedType(issue.input)}`;
            // return `Input non valido: atteso ${issue.expected}, ricevuto ${util.getParsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Input non valido: atteso ${stringifyPrimitive$1(issue.values[0])}`;
                return `Opzione non valida: atteso uno tra ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Troppo grande: ${issue.origin ?? "valore"} deve avere ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementi"}`;
                return `Troppo grande: ${issue.origin ?? "valore"} deve essere ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Troppo piccolo: ${issue.origin} deve avere ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Troppo piccolo: ${issue.origin} deve essere ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Stringa non valida: deve iniziare con "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Stringa non valida: deve terminare con "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Stringa non valida: deve includere "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Stringa non valida: deve corrispondere al pattern ${_issue.pattern}`;
                return `Invalid ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Numero non valido: deve essere un multiplo di ${issue.divisor}`;
            case "unrecognized_keys":
                return `Chiav${issue.keys.length > 1 ? "i" : "e"} non riconosciut${issue.keys.length > 1 ? "e" : "a"}: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `Chiave non valida in ${issue.origin}`;
            case "invalid_union":
                return "Input non valido";
            case "invalid_element":
                return `Valore non valido in ${issue.origin}`;
            default:
                return `Input non valido`;
        }
    };
};
function it$1 () {
    return {
        localeError: error$13(),
    };
}

const error$12 = () => {
    const Sizable = {
        string: { unit: "文字", verb: "である" },
        file: { unit: "バイト", verb: "である" },
        array: { unit: "要素", verb: "である" },
        set: { unit: "要素", verb: "である" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "数値";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "配列";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "入力値",
        email: "メールアドレス",
        url: "URL",
        emoji: "絵文字",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO日時",
        date: "ISO日付",
        time: "ISO時刻",
        duration: "ISO期間",
        ipv4: "IPv4アドレス",
        ipv6: "IPv6アドレス",
        cidrv4: "IPv4範囲",
        cidrv6: "IPv6範囲",
        base64: "base64エンコード文字列",
        base64url: "base64urlエンコード文字列",
        json_string: "JSON文字列",
        e164: "E.164番号",
        jwt: "JWT",
        template_literal: "入力値",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `無効な入力: ${issue.expected}が期待されましたが、${parsedType(issue.input)}が入力されました`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `無効な入力: ${stringifyPrimitive$1(issue.values[0])}が期待されました`;
                return `無効な選択: ${joinValues$1(issue.values, "、")}のいずれかである必要があります`;
            case "too_big": {
                const adj = issue.inclusive ? "以下である" : "より小さい";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `大きすぎる値: ${issue.origin ?? "値"}は${issue.maximum.toString()}${sizing.unit ?? "要素"}${adj}必要があります`;
                return `大きすぎる値: ${issue.origin ?? "値"}は${issue.maximum.toString()}${adj}必要があります`;
            }
            case "too_small": {
                const adj = issue.inclusive ? "以上である" : "より大きい";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `小さすぎる値: ${issue.origin}は${issue.minimum.toString()}${sizing.unit}${adj}必要があります`;
                return `小さすぎる値: ${issue.origin}は${issue.minimum.toString()}${adj}必要があります`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `無効な文字列: "${_issue.prefix}"で始まる必要があります`;
                if (_issue.format === "ends_with")
                    return `無効な文字列: "${_issue.suffix}"で終わる必要があります`;
                if (_issue.format === "includes")
                    return `無効な文字列: "${_issue.includes}"を含む必要があります`;
                if (_issue.format === "regex")
                    return `無効な文字列: パターン${_issue.pattern}に一致する必要があります`;
                return `無効な${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `無効な数値: ${issue.divisor}の倍数である必要があります`;
            case "unrecognized_keys":
                return `認識されていないキー${issue.keys.length > 1 ? "群" : ""}: ${joinValues$1(issue.keys, "、")}`;
            case "invalid_key":
                return `${issue.origin}内の無効なキー`;
            case "invalid_union":
                return "無効な入力";
            case "invalid_element":
                return `${issue.origin}内の無効な値`;
            default:
                return `無効な入力`;
        }
    };
};
function ja$1 () {
    return {
        localeError: error$12(),
    };
}

const error$11 = () => {
    const Sizable = {
        string: { unit: "តួអក្សរ", verb: "គួរមាន" },
        file: { unit: "បៃ", verb: "គួរមាន" },
        array: { unit: "ធាតុ", verb: "គួរមាន" },
        set: { unit: "ធាតុ", verb: "គួរមាន" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "មិនមែនជាលេខ (NaN)" : "លេខ";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "អារេ (Array)";
                }
                if (data === null) {
                    return "គ្មានតម្លៃ (null)";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "ទិន្នន័យបញ្ចូល",
        email: "អាសយដ្ឋានអ៊ីមែល",
        url: "URL",
        emoji: "សញ្ញាអារម្មណ៍",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "កាលបរិច្ឆេទ និងម៉ោង ISO",
        date: "កាលបរិច្ឆេទ ISO",
        time: "ម៉ោង ISO",
        duration: "រយៈពេល ISO",
        ipv4: "អាសយដ្ឋាន IPv4",
        ipv6: "អាសយដ្ឋាន IPv6",
        cidrv4: "ដែនអាសយដ្ឋាន IPv4",
        cidrv6: "ដែនអាសយដ្ឋាន IPv6",
        base64: "ខ្សែអក្សរអ៊ិកូដ base64",
        base64url: "ខ្សែអក្សរអ៊ិកូដ base64url",
        json_string: "ខ្សែអក្សរ JSON",
        e164: "លេខ E.164",
        jwt: "JWT",
        template_literal: "ទិន្នន័យបញ្ចូល",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${issue.expected} ប៉ុន្តែទទួលបាន ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${stringifyPrimitive$1(issue.values[0])}`;
                return `ជម្រើសមិនត្រឹមត្រូវ៖ ត្រូវជាមួយក្នុងចំណោម ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `ធំពេក៖ ត្រូវការ ${issue.origin ?? "តម្លៃ"} ${adj} ${issue.maximum.toString()} ${sizing.unit ?? "ធាតុ"}`;
                return `ធំពេក៖ ត្រូវការ ${issue.origin ?? "តម្លៃ"} ${adj} ${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `តូចពេក៖ ត្រូវការ ${issue.origin} ${adj} ${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `តូចពេក៖ ត្រូវការ ${issue.origin} ${adj} ${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវចាប់ផ្តើមដោយ "${_issue.prefix}"`;
                }
                if (_issue.format === "ends_with")
                    return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវបញ្ចប់ដោយ "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវមាន "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវតែផ្គូផ្គងនឹងទម្រង់ដែលបានកំណត់ ${_issue.pattern}`;
                return `មិនត្រឹមត្រូវ៖ ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `លេខមិនត្រឹមត្រូវ៖ ត្រូវតែជាពហុគុណនៃ ${issue.divisor}`;
            case "unrecognized_keys":
                return `រកឃើញសោមិនស្គាល់៖ ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `សោមិនត្រឹមត្រូវនៅក្នុង ${issue.origin}`;
            case "invalid_union":
                return `ទិន្នន័យមិនត្រឹមត្រូវ`;
            case "invalid_element":
                return `ទិន្នន័យមិនត្រឹមត្រូវនៅក្នុង ${issue.origin}`;
            default:
                return `ទិន្នន័យមិនត្រឹមត្រូវ`;
        }
    };
};
function kh$1 () {
    return {
        localeError: error$11(),
    };
}

const error$10 = () => {
    const Sizable = {
        string: { unit: "문자", verb: "to have" },
        file: { unit: "바이트", verb: "to have" },
        array: { unit: "개", verb: "to have" },
        set: { unit: "개", verb: "to have" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "number";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "입력",
        email: "이메일 주소",
        url: "URL",
        emoji: "이모지",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO 날짜시간",
        date: "ISO 날짜",
        time: "ISO 시간",
        duration: "ISO 기간",
        ipv4: "IPv4 주소",
        ipv6: "IPv6 주소",
        cidrv4: "IPv4 범위",
        cidrv6: "IPv6 범위",
        base64: "base64 인코딩 문자열",
        base64url: "base64url 인코딩 문자열",
        json_string: "JSON 문자열",
        e164: "E.164 번호",
        jwt: "JWT",
        template_literal: "입력",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `잘못된 입력: 예상 타입은 ${issue.expected}, 받은 타입은 ${parsedType(issue.input)}입니다`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `잘못된 입력: 값은 ${stringifyPrimitive$1(issue.values[0])} 이어야 합니다`;
                return `잘못된 옵션: ${joinValues$1(issue.values, "또는 ")} 중 하나여야 합니다`;
            case "too_big": {
                const adj = issue.inclusive ? "이하" : "미만";
                const suffix = adj === "미만" ? "이어야 합니다" : "여야 합니다";
                const sizing = getSizing(issue.origin);
                const unit = sizing?.unit ?? "요소";
                if (sizing)
                    return `${issue.origin ?? "값"}이 너무 큽니다: ${issue.maximum.toString()}${unit} ${adj}${suffix}`;
                return `${issue.origin ?? "값"}이 너무 큽니다: ${issue.maximum.toString()} ${adj}${suffix}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? "이상" : "초과";
                const suffix = adj === "이상" ? "이어야 합니다" : "여야 합니다";
                const sizing = getSizing(issue.origin);
                const unit = sizing?.unit ?? "요소";
                if (sizing) {
                    return `${issue.origin ?? "값"}이 너무 작습니다: ${issue.minimum.toString()}${unit} ${adj}${suffix}`;
                }
                return `${issue.origin ?? "값"}이 너무 작습니다: ${issue.minimum.toString()} ${adj}${suffix}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `잘못된 문자열: "${_issue.prefix}"(으)로 시작해야 합니다`;
                }
                if (_issue.format === "ends_with")
                    return `잘못된 문자열: "${_issue.suffix}"(으)로 끝나야 합니다`;
                if (_issue.format === "includes")
                    return `잘못된 문자열: "${_issue.includes}"을(를) 포함해야 합니다`;
                if (_issue.format === "regex")
                    return `잘못된 문자열: 정규식 ${_issue.pattern} 패턴과 일치해야 합니다`;
                return `잘못된 ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `잘못된 숫자: ${issue.divisor}의 배수여야 합니다`;
            case "unrecognized_keys":
                return `인식할 수 없는 키: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `잘못된 키: ${issue.origin}`;
            case "invalid_union":
                return `잘못된 입력`;
            case "invalid_element":
                return `잘못된 값: ${issue.origin}`;
            default:
                return `잘못된 입력`;
        }
    };
};
function ko$1 () {
    return {
        localeError: error$10(),
    };
}

const error$$ = () => {
    const Sizable = {
        string: { unit: "знаци", verb: "да имаат" },
        file: { unit: "бајти", verb: "да имаат" },
        array: { unit: "ставки", verb: "да имаат" },
        set: { unit: "ставки", verb: "да имаат" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "број";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "низа";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "внес",
        email: "адреса на е-пошта",
        url: "URL",
        emoji: "емоџи",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO датум и време",
        date: "ISO датум",
        time: "ISO време",
        duration: "ISO времетраење",
        ipv4: "IPv4 адреса",
        ipv6: "IPv6 адреса",
        cidrv4: "IPv4 опсег",
        cidrv6: "IPv6 опсег",
        base64: "base64-енкодирана низа",
        base64url: "base64url-енкодирана низа",
        json_string: "JSON низа",
        e164: "E.164 број",
        jwt: "JWT",
        template_literal: "внес",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Грешен внес: се очекува ${issue.expected}, примено ${parsedType(issue.input)}`;
            // return `Invalid input: expected ${issue.expected}, received ${util.getParsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Invalid input: expected ${stringifyPrimitive$1(issue.values[0])}`;
                return `Грешана опција: се очекува една ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Премногу голем: се очекува ${issue.origin ?? "вредноста"} да има ${adj}${issue.maximum.toString()} ${sizing.unit ?? "елементи"}`;
                return `Премногу голем: се очекува ${issue.origin ?? "вредноста"} да биде ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Премногу мал: се очекува ${issue.origin} да има ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Премногу мал: се очекува ${issue.origin} да биде ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `Неважечка низа: мора да започнува со "${_issue.prefix}"`;
                }
                if (_issue.format === "ends_with")
                    return `Неважечка низа: мора да завршува со "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Неважечка низа: мора да вклучува "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Неважечка низа: мора да одгоара на патернот ${_issue.pattern}`;
                return `Invalid ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Грешен број: мора да биде делив со ${issue.divisor}`;
            case "unrecognized_keys":
                return `${issue.keys.length > 1 ? "Непрепознаени клучеви" : "Непрепознаен клуч"}: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `Грешен клуч во ${issue.origin}`;
            case "invalid_union":
                return "Грешен внес";
            case "invalid_element":
                return `Грешна вредност во ${issue.origin}`;
            default:
                return `Грешен внес`;
        }
    };
};
function mk$1 () {
    return {
        localeError: error$$(),
    };
}

const error$_ = () => {
    const Sizable = {
        string: { unit: "aksara", verb: "mempunyai" },
        file: { unit: "bait", verb: "mempunyai" },
        array: { unit: "elemen", verb: "mempunyai" },
        set: { unit: "elemen", verb: "mempunyai" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "nombor";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "input",
        email: "alamat e-mel",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "tarikh masa ISO",
        date: "tarikh ISO",
        time: "masa ISO",
        duration: "tempoh ISO",
        ipv4: "alamat IPv4",
        ipv6: "alamat IPv6",
        cidrv4: "julat IPv4",
        cidrv6: "julat IPv6",
        base64: "string dikodkan base64",
        base64url: "string dikodkan base64url",
        json_string: "string JSON",
        e164: "nombor E.164",
        jwt: "JWT",
        template_literal: "input",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Input tidak sah: dijangka ${issue.expected}, diterima ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Input tidak sah: dijangka ${stringifyPrimitive$1(issue.values[0])}`;
                return `Pilihan tidak sah: dijangka salah satu daripada ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Terlalu besar: dijangka ${issue.origin ?? "nilai"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elemen"}`;
                return `Terlalu besar: dijangka ${issue.origin ?? "nilai"} adalah ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Terlalu kecil: dijangka ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Terlalu kecil: dijangka ${issue.origin} adalah ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `String tidak sah: mesti bermula dengan "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `String tidak sah: mesti berakhir dengan "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `String tidak sah: mesti mengandungi "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `String tidak sah: mesti sepadan dengan corak ${_issue.pattern}`;
                return `${Nouns[_issue.format] ?? issue.format} tidak sah`;
            }
            case "not_multiple_of":
                return `Nombor tidak sah: perlu gandaan ${issue.divisor}`;
            case "unrecognized_keys":
                return `Kunci tidak dikenali: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `Kunci tidak sah dalam ${issue.origin}`;
            case "invalid_union":
                return "Input tidak sah";
            case "invalid_element":
                return `Nilai tidak sah dalam ${issue.origin}`;
            default:
                return `Input tidak sah`;
        }
    };
};
function ms$1 () {
    return {
        localeError: error$_(),
    };
}

const error$Z = () => {
    const Sizable = {
        string: { unit: "tekens" },
        file: { unit: "bytes" },
        array: { unit: "elementen" },
        set: { unit: "elementen" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "getal";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "invoer",
        email: "emailadres",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO datum en tijd",
        date: "ISO datum",
        time: "ISO tijd",
        duration: "ISO duur",
        ipv4: "IPv4-adres",
        ipv6: "IPv6-adres",
        cidrv4: "IPv4-bereik",
        cidrv6: "IPv6-bereik",
        base64: "base64-gecodeerde tekst",
        base64url: "base64 URL-gecodeerde tekst",
        json_string: "JSON string",
        e164: "E.164-nummer",
        jwt: "JWT",
        template_literal: "invoer",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Ongeldige invoer: verwacht ${issue.expected}, ontving ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Ongeldige invoer: verwacht ${stringifyPrimitive$1(issue.values[0])}`;
                return `Ongeldige optie: verwacht één van ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Te lang: verwacht dat ${issue.origin ?? "waarde"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementen"} bevat`;
                return `Te lang: verwacht dat ${issue.origin ?? "waarde"} ${adj}${issue.maximum.toString()} is`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Te kort: verwacht dat ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit} bevat`;
                }
                return `Te kort: verwacht dat ${issue.origin} ${adj}${issue.minimum.toString()} is`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `Ongeldige tekst: moet met "${_issue.prefix}" beginnen`;
                }
                if (_issue.format === "ends_with")
                    return `Ongeldige tekst: moet op "${_issue.suffix}" eindigen`;
                if (_issue.format === "includes")
                    return `Ongeldige tekst: moet "${_issue.includes}" bevatten`;
                if (_issue.format === "regex")
                    return `Ongeldige tekst: moet overeenkomen met patroon ${_issue.pattern}`;
                return `Ongeldig: ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Ongeldig getal: moet een veelvoud van ${issue.divisor} zijn`;
            case "unrecognized_keys":
                return `Onbekende key${issue.keys.length > 1 ? "s" : ""}: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `Ongeldige key in ${issue.origin}`;
            case "invalid_union":
                return "Ongeldige invoer";
            case "invalid_element":
                return `Ongeldige waarde in ${issue.origin}`;
            default:
                return `Ongeldige invoer`;
        }
    };
};
function nl$1 () {
    return {
        localeError: error$Z(),
    };
}

const error$Y = () => {
    const Sizable = {
        string: { unit: "tegn", verb: "å ha" },
        file: { unit: "bytes", verb: "å ha" },
        array: { unit: "elementer", verb: "å inneholde" },
        set: { unit: "elementer", verb: "å inneholde" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "tall";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "liste";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "input",
        email: "e-postadresse",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO dato- og klokkeslett",
        date: "ISO-dato",
        time: "ISO-klokkeslett",
        duration: "ISO-varighet",
        ipv4: "IPv4-område",
        ipv6: "IPv6-område",
        cidrv4: "IPv4-spekter",
        cidrv6: "IPv6-spekter",
        base64: "base64-enkodet streng",
        base64url: "base64url-enkodet streng",
        json_string: "JSON-streng",
        e164: "E.164-nummer",
        jwt: "JWT",
        template_literal: "input",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Ugyldig input: forventet ${issue.expected}, fikk ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Ugyldig verdi: forventet ${stringifyPrimitive$1(issue.values[0])}`;
                return `Ugyldig valg: forventet en av ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `For stor(t): forventet ${issue.origin ?? "value"} til å ha ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementer"}`;
                return `For stor(t): forventet ${issue.origin ?? "value"} til å ha ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `For lite(n): forventet ${issue.origin} til å ha ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `For lite(n): forventet ${issue.origin} til å ha ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Ugyldig streng: må starte med "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Ugyldig streng: må ende med "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Ugyldig streng: må inneholde "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Ugyldig streng: må matche mønsteret ${_issue.pattern}`;
                return `Ugyldig ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Ugyldig tall: må være et multiplum av ${issue.divisor}`;
            case "unrecognized_keys":
                return `${issue.keys.length > 1 ? "Ukjente nøkler" : "Ukjent nøkkel"}: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `Ugyldig nøkkel i ${issue.origin}`;
            case "invalid_union":
                return "Ugyldig input";
            case "invalid_element":
                return `Ugyldig verdi i ${issue.origin}`;
            default:
                return `Ugyldig input`;
        }
    };
};
function no$1 () {
    return {
        localeError: error$Y(),
    };
}

const error$X = () => {
    const Sizable = {
        string: { unit: "harf", verb: "olmalıdır" },
        file: { unit: "bayt", verb: "olmalıdır" },
        array: { unit: "unsur", verb: "olmalıdır" },
        set: { unit: "unsur", verb: "olmalıdır" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "numara";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "saf";
                }
                if (data === null) {
                    return "gayb";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "giren",
        email: "epostagâh",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO hengâmı",
        date: "ISO tarihi",
        time: "ISO zamanı",
        duration: "ISO müddeti",
        ipv4: "IPv4 nişânı",
        ipv6: "IPv6 nişânı",
        cidrv4: "IPv4 menzili",
        cidrv6: "IPv6 menzili",
        base64: "base64-şifreli metin",
        base64url: "base64url-şifreli metin",
        json_string: "JSON metin",
        e164: "E.164 sayısı",
        jwt: "JWT",
        template_literal: "giren",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Fâsit giren: umulan ${issue.expected}, alınan ${parsedType(issue.input)}`;
            // return `Fâsit giren: umulan ${issue.expected}, alınan ${util.getParsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Fâsit giren: umulan ${stringifyPrimitive$1(issue.values[0])}`;
                return `Fâsit tercih: mûteberler ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Fazla büyük: ${issue.origin ?? "value"}, ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"} sahip olmalıydı.`;
                return `Fazla büyük: ${issue.origin ?? "value"}, ${adj}${issue.maximum.toString()} olmalıydı.`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Fazla küçük: ${issue.origin}, ${adj}${issue.minimum.toString()} ${sizing.unit} sahip olmalıydı.`;
                }
                return `Fazla küçük: ${issue.origin}, ${adj}${issue.minimum.toString()} olmalıydı.`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Fâsit metin: "${_issue.prefix}" ile başlamalı.`;
                if (_issue.format === "ends_with")
                    return `Fâsit metin: "${_issue.suffix}" ile bitmeli.`;
                if (_issue.format === "includes")
                    return `Fâsit metin: "${_issue.includes}" ihtivâ etmeli.`;
                if (_issue.format === "regex")
                    return `Fâsit metin: ${_issue.pattern} nakşına uymalı.`;
                return `Fâsit ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Fâsit sayı: ${issue.divisor} katı olmalıydı.`;
            case "unrecognized_keys":
                return `Tanınmayan anahtar ${issue.keys.length > 1 ? "s" : ""}: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `${issue.origin} için tanınmayan anahtar var.`;
            case "invalid_union":
                return "Giren tanınamadı.";
            case "invalid_element":
                return `${issue.origin} için tanınmayan kıymet var.`;
            default:
                return `Kıymet tanınamadı.`;
        }
    };
};
function ota$1 () {
    return {
        localeError: error$X(),
    };
}

const error$W = () => {
    const Sizable = {
        string: { unit: "توکي", verb: "ولري" },
        file: { unit: "بایټس", verb: "ولري" },
        array: { unit: "توکي", verb: "ولري" },
        set: { unit: "توکي", verb: "ولري" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "عدد";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "ارې";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "ورودي",
        email: "بریښنالیک",
        url: "یو آر ال",
        emoji: "ایموجي",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "نیټه او وخت",
        date: "نېټه",
        time: "وخت",
        duration: "موده",
        ipv4: "د IPv4 پته",
        ipv6: "د IPv6 پته",
        cidrv4: "د IPv4 ساحه",
        cidrv6: "د IPv6 ساحه",
        base64: "base64-encoded متن",
        base64url: "base64url-encoded متن",
        json_string: "JSON متن",
        e164: "د E.164 شمېره",
        jwt: "JWT",
        template_literal: "ورودي",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `ناسم ورودي: باید ${issue.expected} وای, مګر ${parsedType(issue.input)} ترلاسه شو`;
            case "invalid_value":
                if (issue.values.length === 1) {
                    return `ناسم ورودي: باید ${stringifyPrimitive$1(issue.values[0])} وای`;
                }
                return `ناسم انتخاب: باید یو له ${joinValues$1(issue.values, "|")} څخه وای`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `ډیر لوی: ${issue.origin ?? "ارزښت"} باید ${adj}${issue.maximum.toString()} ${sizing.unit ?? "عنصرونه"} ولري`;
                }
                return `ډیر لوی: ${issue.origin ?? "ارزښت"} باید ${adj}${issue.maximum.toString()} وي`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `ډیر کوچنی: ${issue.origin} باید ${adj}${issue.minimum.toString()} ${sizing.unit} ولري`;
                }
                return `ډیر کوچنی: ${issue.origin} باید ${adj}${issue.minimum.toString()} وي`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `ناسم متن: باید د "${_issue.prefix}" سره پیل شي`;
                }
                if (_issue.format === "ends_with") {
                    return `ناسم متن: باید د "${_issue.suffix}" سره پای ته ورسيږي`;
                }
                if (_issue.format === "includes") {
                    return `ناسم متن: باید "${_issue.includes}" ولري`;
                }
                if (_issue.format === "regex") {
                    return `ناسم متن: باید د ${_issue.pattern} سره مطابقت ولري`;
                }
                return `${Nouns[_issue.format] ?? issue.format} ناسم دی`;
            }
            case "not_multiple_of":
                return `ناسم عدد: باید د ${issue.divisor} مضرب وي`;
            case "unrecognized_keys":
                return `ناسم ${issue.keys.length > 1 ? "کلیډونه" : "کلیډ"}: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `ناسم کلیډ په ${issue.origin} کې`;
            case "invalid_union":
                return `ناسمه ورودي`;
            case "invalid_element":
                return `ناسم عنصر په ${issue.origin} کې`;
            default:
                return `ناسمه ورودي`;
        }
    };
};
function ps$1 () {
    return {
        localeError: error$W(),
    };
}

const error$V = () => {
    const Sizable = {
        string: { unit: "znaków", verb: "mieć" },
        file: { unit: "bajtów", verb: "mieć" },
        array: { unit: "elementów", verb: "mieć" },
        set: { unit: "elementów", verb: "mieć" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "liczba";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "tablica";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "wyrażenie",
        email: "adres email",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "data i godzina w formacie ISO",
        date: "data w formacie ISO",
        time: "godzina w formacie ISO",
        duration: "czas trwania ISO",
        ipv4: "adres IPv4",
        ipv6: "adres IPv6",
        cidrv4: "zakres IPv4",
        cidrv6: "zakres IPv6",
        base64: "ciąg znaków zakodowany w formacie base64",
        base64url: "ciąg znaków zakodowany w formacie base64url",
        json_string: "ciąg znaków w formacie JSON",
        e164: "liczba E.164",
        jwt: "JWT",
        template_literal: "wejście",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Nieprawidłowe dane wejściowe: oczekiwano ${issue.expected}, otrzymano ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Nieprawidłowe dane wejściowe: oczekiwano ${stringifyPrimitive$1(issue.values[0])}`;
                return `Nieprawidłowa opcja: oczekiwano jednej z wartości ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Za duża wartość: oczekiwano, że ${issue.origin ?? "wartość"} będzie mieć ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementów"}`;
                }
                return `Zbyt duż(y/a/e): oczekiwano, że ${issue.origin ?? "wartość"} będzie wynosić ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Za mała wartość: oczekiwano, że ${issue.origin ?? "wartość"} będzie mieć ${adj}${issue.minimum.toString()} ${sizing.unit ?? "elementów"}`;
                }
                return `Zbyt mał(y/a/e): oczekiwano, że ${issue.origin ?? "wartość"} będzie wynosić ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Nieprawidłowy ciąg znaków: musi zaczynać się od "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Nieprawidłowy ciąg znaków: musi kończyć się na "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Nieprawidłowy ciąg znaków: musi zawierać "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Nieprawidłowy ciąg znaków: musi odpowiadać wzorcowi ${_issue.pattern}`;
                return `Nieprawidłow(y/a/e) ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Nieprawidłowa liczba: musi być wielokrotnością ${issue.divisor}`;
            case "unrecognized_keys":
                return `Nierozpoznane klucze${issue.keys.length > 1 ? "s" : ""}: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `Nieprawidłowy klucz w ${issue.origin}`;
            case "invalid_union":
                return "Nieprawidłowe dane wejściowe";
            case "invalid_element":
                return `Nieprawidłowa wartość w ${issue.origin}`;
            default:
                return `Nieprawidłowe dane wejściowe`;
        }
    };
};
function pl$1 () {
    return {
        localeError: error$V(),
    };
}

const error$U = () => {
    const Sizable = {
        string: { unit: "caracteres", verb: "ter" },
        file: { unit: "bytes", verb: "ter" },
        array: { unit: "itens", verb: "ter" },
        set: { unit: "itens", verb: "ter" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "número";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "nulo";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "padrão",
        email: "endereço de e-mail",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "data e hora ISO",
        date: "data ISO",
        time: "hora ISO",
        duration: "duração ISO",
        ipv4: "endereço IPv4",
        ipv6: "endereço IPv6",
        cidrv4: "faixa de IPv4",
        cidrv6: "faixa de IPv6",
        base64: "texto codificado em base64",
        base64url: "URL codificada em base64",
        json_string: "texto JSON",
        e164: "número E.164",
        jwt: "JWT",
        template_literal: "entrada",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Tipo inválido: esperado ${issue.expected}, recebido ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Entrada inválida: esperado ${stringifyPrimitive$1(issue.values[0])}`;
                return `Opção inválida: esperada uma das ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Muito grande: esperado que ${issue.origin ?? "valor"} tivesse ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementos"}`;
                return `Muito grande: esperado que ${issue.origin ?? "valor"} fosse ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Muito pequeno: esperado que ${issue.origin} tivesse ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Muito pequeno: esperado que ${issue.origin} fosse ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Texto inválido: deve começar com "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Texto inválido: deve terminar com "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Texto inválido: deve incluir "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Texto inválido: deve corresponder ao padrão ${_issue.pattern}`;
                return `${Nouns[_issue.format] ?? issue.format} inválido`;
            }
            case "not_multiple_of":
                return `Número inválido: deve ser múltiplo de ${issue.divisor}`;
            case "unrecognized_keys":
                return `Chave${issue.keys.length > 1 ? "s" : ""} desconhecida${issue.keys.length > 1 ? "s" : ""}: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `Chave inválida em ${issue.origin}`;
            case "invalid_union":
                return "Entrada inválida";
            case "invalid_element":
                return `Valor inválido em ${issue.origin}`;
            default:
                return `Campo inválido`;
        }
    };
};
function pt$1 () {
    return {
        localeError: error$U(),
    };
}

function getRussianPlural$1(count, one, few, many) {
    const absCount = Math.abs(count);
    const lastDigit = absCount % 10;
    const lastTwoDigits = absCount % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return many;
    }
    if (lastDigit === 1) {
        return one;
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
        return few;
    }
    return many;
}
const error$T = () => {
    const Sizable = {
        string: {
            unit: {
                one: "символ",
                few: "символа",
                many: "символов",
            },
            verb: "иметь",
        },
        file: {
            unit: {
                one: "байт",
                few: "байта",
                many: "байт",
            },
            verb: "иметь",
        },
        array: {
            unit: {
                one: "элемент",
                few: "элемента",
                many: "элементов",
            },
            verb: "иметь",
        },
        set: {
            unit: {
                one: "элемент",
                few: "элемента",
                many: "элементов",
            },
            verb: "иметь",
        },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "число";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "массив";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "ввод",
        email: "email адрес",
        url: "URL",
        emoji: "эмодзи",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO дата и время",
        date: "ISO дата",
        time: "ISO время",
        duration: "ISO длительность",
        ipv4: "IPv4 адрес",
        ipv6: "IPv6 адрес",
        cidrv4: "IPv4 диапазон",
        cidrv6: "IPv6 диапазон",
        base64: "строка в формате base64",
        base64url: "строка в формате base64url",
        json_string: "JSON строка",
        e164: "номер E.164",
        jwt: "JWT",
        template_literal: "ввод",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Неверный ввод: ожидалось ${issue.expected}, получено ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Неверный ввод: ожидалось ${stringifyPrimitive$1(issue.values[0])}`;
                return `Неверный вариант: ожидалось одно из ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    const maxValue = Number(issue.maximum);
                    const unit = getRussianPlural$1(maxValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
                    return `Слишком большое значение: ожидалось, что ${issue.origin ?? "значение"} будет иметь ${adj}${issue.maximum.toString()} ${unit}`;
                }
                return `Слишком большое значение: ожидалось, что ${issue.origin ?? "значение"} будет ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    const minValue = Number(issue.minimum);
                    const unit = getRussianPlural$1(minValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
                    return `Слишком маленькое значение: ожидалось, что ${issue.origin} будет иметь ${adj}${issue.minimum.toString()} ${unit}`;
                }
                return `Слишком маленькое значение: ожидалось, что ${issue.origin} будет ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Неверная строка: должна начинаться с "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Неверная строка: должна заканчиваться на "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Неверная строка: должна содержать "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Неверная строка: должна соответствовать шаблону ${_issue.pattern}`;
                return `Неверный ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Неверное число: должно быть кратным ${issue.divisor}`;
            case "unrecognized_keys":
                return `Нераспознанн${issue.keys.length > 1 ? "ые" : "ый"} ключ${issue.keys.length > 1 ? "и" : ""}: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `Неверный ключ в ${issue.origin}`;
            case "invalid_union":
                return "Неверные входные данные";
            case "invalid_element":
                return `Неверное значение в ${issue.origin}`;
            default:
                return `Неверные входные данные`;
        }
    };
};
function ru$1 () {
    return {
        localeError: error$T(),
    };
}

const error$S = () => {
    const Sizable = {
        string: { unit: "znakov", verb: "imeti" },
        file: { unit: "bajtov", verb: "imeti" },
        array: { unit: "elementov", verb: "imeti" },
        set: { unit: "elementov", verb: "imeti" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "število";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "tabela";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "vnos",
        email: "e-poštni naslov",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO datum in čas",
        date: "ISO datum",
        time: "ISO čas",
        duration: "ISO trajanje",
        ipv4: "IPv4 naslov",
        ipv6: "IPv6 naslov",
        cidrv4: "obseg IPv4",
        cidrv6: "obseg IPv6",
        base64: "base64 kodiran niz",
        base64url: "base64url kodiran niz",
        json_string: "JSON niz",
        e164: "E.164 številka",
        jwt: "JWT",
        template_literal: "vnos",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Neveljaven vnos: pričakovano ${issue.expected}, prejeto ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Neveljaven vnos: pričakovano ${stringifyPrimitive$1(issue.values[0])}`;
                return `Neveljavna možnost: pričakovano eno izmed ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Preveliko: pričakovano, da bo ${issue.origin ?? "vrednost"} imelo ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementov"}`;
                return `Preveliko: pričakovano, da bo ${issue.origin ?? "vrednost"} ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Premajhno: pričakovano, da bo ${issue.origin} imelo ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Premajhno: pričakovano, da bo ${issue.origin} ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `Neveljaven niz: mora se začeti z "${_issue.prefix}"`;
                }
                if (_issue.format === "ends_with")
                    return `Neveljaven niz: mora se končati z "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Neveljaven niz: mora vsebovati "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Neveljaven niz: mora ustrezati vzorcu ${_issue.pattern}`;
                return `Neveljaven ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Neveljavno število: mora biti večkratnik ${issue.divisor}`;
            case "unrecognized_keys":
                return `Neprepoznan${issue.keys.length > 1 ? "i ključi" : " ključ"}: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `Neveljaven ključ v ${issue.origin}`;
            case "invalid_union":
                return "Neveljaven vnos";
            case "invalid_element":
                return `Neveljavna vrednost v ${issue.origin}`;
            default:
                return "Neveljaven vnos";
        }
    };
};
function sl$1 () {
    return {
        localeError: error$S(),
    };
}

const error$R = () => {
    const Sizable = {
        string: { unit: "tecken", verb: "att ha" },
        file: { unit: "bytes", verb: "att ha" },
        array: { unit: "objekt", verb: "att innehålla" },
        set: { unit: "objekt", verb: "att innehålla" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "antal";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "lista";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "reguljärt uttryck",
        email: "e-postadress",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO-datum och tid",
        date: "ISO-datum",
        time: "ISO-tid",
        duration: "ISO-varaktighet",
        ipv4: "IPv4-intervall",
        ipv6: "IPv6-intervall",
        cidrv4: "IPv4-spektrum",
        cidrv6: "IPv6-spektrum",
        base64: "base64-kodad sträng",
        base64url: "base64url-kodad sträng",
        json_string: "JSON-sträng",
        e164: "E.164-nummer",
        jwt: "JWT",
        template_literal: "mall-literal",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Ogiltig inmatning: förväntat ${issue.expected}, fick ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Ogiltig inmatning: förväntat ${stringifyPrimitive$1(issue.values[0])}`;
                return `Ogiltigt val: förväntade en av ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `För stor(t): förväntade ${issue.origin ?? "värdet"} att ha ${adj}${issue.maximum.toString()} ${sizing.unit ?? "element"}`;
                }
                return `För stor(t): förväntat ${issue.origin ?? "värdet"} att ha ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `För lite(t): förväntade ${issue.origin ?? "värdet"} att ha ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `För lite(t): förväntade ${issue.origin ?? "värdet"} att ha ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `Ogiltig sträng: måste börja med "${_issue.prefix}"`;
                }
                if (_issue.format === "ends_with")
                    return `Ogiltig sträng: måste sluta med "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Ogiltig sträng: måste innehålla "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Ogiltig sträng: måste matcha mönstret "${_issue.pattern}"`;
                return `Ogiltig(t) ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Ogiltigt tal: måste vara en multipel av ${issue.divisor}`;
            case "unrecognized_keys":
                return `${issue.keys.length > 1 ? "Okända nycklar" : "Okänd nyckel"}: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `Ogiltig nyckel i ${issue.origin ?? "värdet"}`;
            case "invalid_union":
                return "Ogiltig input";
            case "invalid_element":
                return `Ogiltigt värde i ${issue.origin ?? "värdet"}`;
            default:
                return `Ogiltig input`;
        }
    };
};
function sv$1 () {
    return {
        localeError: error$R(),
    };
}

const error$Q = () => {
    const Sizable = {
        string: { unit: "எழுத்துக்கள்", verb: "கொண்டிருக்க வேண்டும்" },
        file: { unit: "பைட்டுகள்", verb: "கொண்டிருக்க வேண்டும்" },
        array: { unit: "உறுப்புகள்", verb: "கொண்டிருக்க வேண்டும்" },
        set: { unit: "உறுப்புகள்", verb: "கொண்டிருக்க வேண்டும்" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "எண் அல்லாதது" : "எண்";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "அணி";
                }
                if (data === null) {
                    return "வெறுமை";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "உள்ளீடு",
        email: "மின்னஞ்சல் முகவரி",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO தேதி நேரம்",
        date: "ISO தேதி",
        time: "ISO நேரம்",
        duration: "ISO கால அளவு",
        ipv4: "IPv4 முகவரி",
        ipv6: "IPv6 முகவரி",
        cidrv4: "IPv4 வரம்பு",
        cidrv6: "IPv6 வரம்பு",
        base64: "base64-encoded சரம்",
        base64url: "base64url-encoded சரம்",
        json_string: "JSON சரம்",
        e164: "E.164 எண்",
        jwt: "JWT",
        template_literal: "input",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${issue.expected}, பெறப்பட்டது ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${stringifyPrimitive$1(issue.values[0])}`;
                return `தவறான விருப்பம்: எதிர்பார்க்கப்பட்டது ${joinValues$1(issue.values, "|")} இல் ஒன்று`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${issue.origin ?? "மதிப்பு"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "உறுப்புகள்"} ஆக இருக்க வேண்டும்`;
                }
                return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${issue.origin ?? "மதிப்பு"} ${adj}${issue.maximum.toString()} ஆக இருக்க வேண்டும்`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit} ஆக இருக்க வேண்டும்`; //
                }
                return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${issue.origin} ${adj}${issue.minimum.toString()} ஆக இருக்க வேண்டும்`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `தவறான சரம்: "${_issue.prefix}" இல் தொடங்க வேண்டும்`;
                if (_issue.format === "ends_with")
                    return `தவறான சரம்: "${_issue.suffix}" இல் முடிவடைய வேண்டும்`;
                if (_issue.format === "includes")
                    return `தவறான சரம்: "${_issue.includes}" ஐ உள்ளடக்க வேண்டும்`;
                if (_issue.format === "regex")
                    return `தவறான சரம்: ${_issue.pattern} முறைபாட்டுடன் பொருந்த வேண்டும்`;
                return `தவறான ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `தவறான எண்: ${issue.divisor} இன் பலமாக இருக்க வேண்டும்`;
            case "unrecognized_keys":
                return `அடையாளம் தெரியாத விசை${issue.keys.length > 1 ? "கள்" : ""}: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `${issue.origin} இல் தவறான விசை`;
            case "invalid_union":
                return "தவறான உள்ளீடு";
            case "invalid_element":
                return `${issue.origin} இல் தவறான மதிப்பு`;
            default:
                return `தவறான உள்ளீடு`;
        }
    };
};
function ta$1 () {
    return {
        localeError: error$Q(),
    };
}

const error$P = () => {
    const Sizable = {
        string: { unit: "ตัวอักษร", verb: "ควรมี" },
        file: { unit: "ไบต์", verb: "ควรมี" },
        array: { unit: "รายการ", verb: "ควรมี" },
        set: { unit: "รายการ", verb: "ควรมี" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "ไม่ใช่ตัวเลข (NaN)" : "ตัวเลข";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "อาร์เรย์ (Array)";
                }
                if (data === null) {
                    return "ไม่มีค่า (null)";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "ข้อมูลที่ป้อน",
        email: "ที่อยู่อีเมล",
        url: "URL",
        emoji: "อิโมจิ",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "วันที่เวลาแบบ ISO",
        date: "วันที่แบบ ISO",
        time: "เวลาแบบ ISO",
        duration: "ช่วงเวลาแบบ ISO",
        ipv4: "ที่อยู่ IPv4",
        ipv6: "ที่อยู่ IPv6",
        cidrv4: "ช่วง IP แบบ IPv4",
        cidrv6: "ช่วง IP แบบ IPv6",
        base64: "ข้อความแบบ Base64",
        base64url: "ข้อความแบบ Base64 สำหรับ URL",
        json_string: "ข้อความแบบ JSON",
        e164: "เบอร์โทรศัพท์ระหว่างประเทศ (E.164)",
        jwt: "โทเคน JWT",
        template_literal: "ข้อมูลที่ป้อน",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น ${issue.expected} แต่ได้รับ ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `ค่าไม่ถูกต้อง: ควรเป็น ${stringifyPrimitive$1(issue.values[0])}`;
                return `ตัวเลือกไม่ถูกต้อง: ควรเป็นหนึ่งใน ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "ไม่เกิน" : "น้อยกว่า";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `เกินกำหนด: ${issue.origin ?? "ค่า"} ควรมี${adj} ${issue.maximum.toString()} ${sizing.unit ?? "รายการ"}`;
                return `เกินกำหนด: ${issue.origin ?? "ค่า"} ควรมี${adj} ${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? "อย่างน้อย" : "มากกว่า";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `น้อยกว่ากำหนด: ${issue.origin} ควรมี${adj} ${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `น้อยกว่ากำหนด: ${issue.origin} ควรมี${adj} ${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `รูปแบบไม่ถูกต้อง: ข้อความต้องขึ้นต้นด้วย "${_issue.prefix}"`;
                }
                if (_issue.format === "ends_with")
                    return `รูปแบบไม่ถูกต้อง: ข้อความต้องลงท้ายด้วย "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `รูปแบบไม่ถูกต้อง: ข้อความต้องมี "${_issue.includes}" อยู่ในข้อความ`;
                if (_issue.format === "regex")
                    return `รูปแบบไม่ถูกต้อง: ต้องตรงกับรูปแบบที่กำหนด ${_issue.pattern}`;
                return `รูปแบบไม่ถูกต้อง: ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `ตัวเลขไม่ถูกต้อง: ต้องเป็นจำนวนที่หารด้วย ${issue.divisor} ได้ลงตัว`;
            case "unrecognized_keys":
                return `พบคีย์ที่ไม่รู้จัก: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `คีย์ไม่ถูกต้องใน ${issue.origin}`;
            case "invalid_union":
                return "ข้อมูลไม่ถูกต้อง: ไม่ตรงกับรูปแบบยูเนียนที่กำหนดไว้";
            case "invalid_element":
                return `ข้อมูลไม่ถูกต้องใน ${issue.origin}`;
            default:
                return `ข้อมูลไม่ถูกต้อง`;
        }
    };
};
function th$1 () {
    return {
        localeError: error$P(),
    };
}

const parsedType$7 = (data) => {
    const t = typeof data;
    switch (t) {
        case "number": {
            return Number.isNaN(data) ? "NaN" : "number";
        }
        case "object": {
            if (Array.isArray(data)) {
                return "array";
            }
            if (data === null) {
                return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                return data.constructor.name;
            }
        }
    }
    return t;
};
const error$O = () => {
    const Sizable = {
        string: { unit: "karakter", verb: "olmalı" },
        file: { unit: "bayt", verb: "olmalı" },
        array: { unit: "öğe", verb: "olmalı" },
        set: { unit: "öğe", verb: "olmalı" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const Nouns = {
        regex: "girdi",
        email: "e-posta adresi",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO tarih ve saat",
        date: "ISO tarih",
        time: "ISO saat",
        duration: "ISO süre",
        ipv4: "IPv4 adresi",
        ipv6: "IPv6 adresi",
        cidrv4: "IPv4 aralığı",
        cidrv6: "IPv6 aralığı",
        base64: "base64 ile şifrelenmiş metin",
        base64url: "base64url ile şifrelenmiş metin",
        json_string: "JSON dizesi",
        e164: "E.164 sayısı",
        jwt: "JWT",
        template_literal: "Şablon dizesi",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Geçersiz değer: beklenen ${issue.expected}, alınan ${parsedType$7(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Geçersiz değer: beklenen ${stringifyPrimitive$1(issue.values[0])}`;
                return `Geçersiz seçenek: aşağıdakilerden biri olmalı: ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Çok büyük: beklenen ${issue.origin ?? "değer"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "öğe"}`;
                return `Çok büyük: beklenen ${issue.origin ?? "değer"} ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Çok küçük: beklenen ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                return `Çok küçük: beklenen ${issue.origin} ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Geçersiz metin: "${_issue.prefix}" ile başlamalı`;
                if (_issue.format === "ends_with")
                    return `Geçersiz metin: "${_issue.suffix}" ile bitmeli`;
                if (_issue.format === "includes")
                    return `Geçersiz metin: "${_issue.includes}" içermeli`;
                if (_issue.format === "regex")
                    return `Geçersiz metin: ${_issue.pattern} desenine uymalı`;
                return `Geçersiz ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Geçersiz sayı: ${issue.divisor} ile tam bölünebilmeli`;
            case "unrecognized_keys":
                return `Tanınmayan anahtar${issue.keys.length > 1 ? "lar" : ""}: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `${issue.origin} içinde geçersiz anahtar`;
            case "invalid_union":
                return "Geçersiz değer";
            case "invalid_element":
                return `${issue.origin} içinde geçersiz değer`;
            default:
                return `Geçersiz değer`;
        }
    };
};
function tr$1 () {
    return {
        localeError: error$O(),
    };
}

const error$N = () => {
    const Sizable = {
        string: { unit: "символів", verb: "матиме" },
        file: { unit: "байтів", verb: "матиме" },
        array: { unit: "елементів", verb: "матиме" },
        set: { unit: "елементів", verb: "матиме" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "число";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "масив";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "вхідні дані",
        email: "адреса електронної пошти",
        url: "URL",
        emoji: "емодзі",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "дата та час ISO",
        date: "дата ISO",
        time: "час ISO",
        duration: "тривалість ISO",
        ipv4: "адреса IPv4",
        ipv6: "адреса IPv6",
        cidrv4: "діапазон IPv4",
        cidrv6: "діапазон IPv6",
        base64: "рядок у кодуванні base64",
        base64url: "рядок у кодуванні base64url",
        json_string: "рядок JSON",
        e164: "номер E.164",
        jwt: "JWT",
        template_literal: "вхідні дані",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Неправильні вхідні дані: очікується ${issue.expected}, отримано ${parsedType(issue.input)}`;
            // return `Неправильні вхідні дані: очікується ${issue.expected}, отримано ${util.getParsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Неправильні вхідні дані: очікується ${stringifyPrimitive$1(issue.values[0])}`;
                return `Неправильна опція: очікується одне з ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Занадто велике: очікується, що ${issue.origin ?? "значення"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "елементів"}`;
                return `Занадто велике: очікується, що ${issue.origin ?? "значення"} буде ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Занадто мале: очікується, що ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Занадто мале: очікується, що ${issue.origin} буде ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Неправильний рядок: повинен починатися з "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Неправильний рядок: повинен закінчуватися на "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Неправильний рядок: повинен містити "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Неправильний рядок: повинен відповідати шаблону ${_issue.pattern}`;
                return `Неправильний ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Неправильне число: повинно бути кратним ${issue.divisor}`;
            case "unrecognized_keys":
                return `Нерозпізнаний ключ${issue.keys.length > 1 ? "і" : ""}: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `Неправильний ключ у ${issue.origin}`;
            case "invalid_union":
                return "Неправильні вхідні дані";
            case "invalid_element":
                return `Неправильне значення у ${issue.origin}`;
            default:
                return `Неправильні вхідні дані`;
        }
    };
};
function ua$1 () {
    return {
        localeError: error$N(),
    };
}

const error$M = () => {
    const Sizable = {
        string: { unit: "حروف", verb: "ہونا" },
        file: { unit: "بائٹس", verb: "ہونا" },
        array: { unit: "آئٹمز", verb: "ہونا" },
        set: { unit: "آئٹمز", verb: "ہونا" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "نمبر";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "آرے";
                }
                if (data === null) {
                    return "نل";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "ان پٹ",
        email: "ای میل ایڈریس",
        url: "یو آر ایل",
        emoji: "ایموجی",
        uuid: "یو یو آئی ڈی",
        uuidv4: "یو یو آئی ڈی وی 4",
        uuidv6: "یو یو آئی ڈی وی 6",
        nanoid: "نینو آئی ڈی",
        guid: "جی یو آئی ڈی",
        cuid: "سی یو آئی ڈی",
        cuid2: "سی یو آئی ڈی 2",
        ulid: "یو ایل آئی ڈی",
        xid: "ایکس آئی ڈی",
        ksuid: "کے ایس یو آئی ڈی",
        datetime: "آئی ایس او ڈیٹ ٹائم",
        date: "آئی ایس او تاریخ",
        time: "آئی ایس او وقت",
        duration: "آئی ایس او مدت",
        ipv4: "آئی پی وی 4 ایڈریس",
        ipv6: "آئی پی وی 6 ایڈریس",
        cidrv4: "آئی پی وی 4 رینج",
        cidrv6: "آئی پی وی 6 رینج",
        base64: "بیس 64 ان کوڈڈ سٹرنگ",
        base64url: "بیس 64 یو آر ایل ان کوڈڈ سٹرنگ",
        json_string: "جے ایس او این سٹرنگ",
        e164: "ای 164 نمبر",
        jwt: "جے ڈبلیو ٹی",
        template_literal: "ان پٹ",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `غلط ان پٹ: ${issue.expected} متوقع تھا، ${parsedType(issue.input)} موصول ہوا`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `غلط ان پٹ: ${stringifyPrimitive$1(issue.values[0])} متوقع تھا`;
                return `غلط آپشن: ${joinValues$1(issue.values, "|")} میں سے ایک متوقع تھا`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `بہت بڑا: ${issue.origin ?? "ویلیو"} کے ${adj}${issue.maximum.toString()} ${sizing.unit ?? "عناصر"} ہونے متوقع تھے`;
                return `بہت بڑا: ${issue.origin ?? "ویلیو"} کا ${adj}${issue.maximum.toString()} ہونا متوقع تھا`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `بہت چھوٹا: ${issue.origin} کے ${adj}${issue.minimum.toString()} ${sizing.unit} ہونے متوقع تھے`;
                }
                return `بہت چھوٹا: ${issue.origin} کا ${adj}${issue.minimum.toString()} ہونا متوقع تھا`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `غلط سٹرنگ: "${_issue.prefix}" سے شروع ہونا چاہیے`;
                }
                if (_issue.format === "ends_with")
                    return `غلط سٹرنگ: "${_issue.suffix}" پر ختم ہونا چاہیے`;
                if (_issue.format === "includes")
                    return `غلط سٹرنگ: "${_issue.includes}" شامل ہونا چاہیے`;
                if (_issue.format === "regex")
                    return `غلط سٹرنگ: پیٹرن ${_issue.pattern} سے میچ ہونا چاہیے`;
                return `غلط ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `غلط نمبر: ${issue.divisor} کا مضاعف ہونا چاہیے`;
            case "unrecognized_keys":
                return `غیر تسلیم شدہ کی${issue.keys.length > 1 ? "ز" : ""}: ${joinValues$1(issue.keys, "، ")}`;
            case "invalid_key":
                return `${issue.origin} میں غلط کی`;
            case "invalid_union":
                return "غلط ان پٹ";
            case "invalid_element":
                return `${issue.origin} میں غلط ویلیو`;
            default:
                return `غلط ان پٹ`;
        }
    };
};
function ur$1 () {
    return {
        localeError: error$M(),
    };
}

const error$L = () => {
    const Sizable = {
        string: { unit: "ký tự", verb: "có" },
        file: { unit: "byte", verb: "có" },
        array: { unit: "phần tử", verb: "có" },
        set: { unit: "phần tử", verb: "có" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "số";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "mảng";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "đầu vào",
        email: "địa chỉ email",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ngày giờ ISO",
        date: "ngày ISO",
        time: "giờ ISO",
        duration: "khoảng thời gian ISO",
        ipv4: "địa chỉ IPv4",
        ipv6: "địa chỉ IPv6",
        cidrv4: "dải IPv4",
        cidrv6: "dải IPv6",
        base64: "chuỗi mã hóa base64",
        base64url: "chuỗi mã hóa base64url",
        json_string: "chuỗi JSON",
        e164: "số E.164",
        jwt: "JWT",
        template_literal: "đầu vào",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Đầu vào không hợp lệ: mong đợi ${issue.expected}, nhận được ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Đầu vào không hợp lệ: mong đợi ${stringifyPrimitive$1(issue.values[0])}`;
                return `Tùy chọn không hợp lệ: mong đợi một trong các giá trị ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Quá lớn: mong đợi ${issue.origin ?? "giá trị"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "phần tử"}`;
                return `Quá lớn: mong đợi ${issue.origin ?? "giá trị"} ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Quá nhỏ: mong đợi ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Quá nhỏ: mong đợi ${issue.origin} ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Chuỗi không hợp lệ: phải bắt đầu bằng "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Chuỗi không hợp lệ: phải kết thúc bằng "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Chuỗi không hợp lệ: phải bao gồm "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Chuỗi không hợp lệ: phải khớp với mẫu ${_issue.pattern}`;
                return `${Nouns[_issue.format] ?? issue.format} không hợp lệ`;
            }
            case "not_multiple_of":
                return `Số không hợp lệ: phải là bội số của ${issue.divisor}`;
            case "unrecognized_keys":
                return `Khóa không được nhận dạng: ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `Khóa không hợp lệ trong ${issue.origin}`;
            case "invalid_union":
                return "Đầu vào không hợp lệ";
            case "invalid_element":
                return `Giá trị không hợp lệ trong ${issue.origin}`;
            default:
                return `Đầu vào không hợp lệ`;
        }
    };
};
function vi$1 () {
    return {
        localeError: error$L(),
    };
}

const error$K = () => {
    const Sizable = {
        string: { unit: "字符", verb: "包含" },
        file: { unit: "字节", verb: "包含" },
        array: { unit: "项", verb: "包含" },
        set: { unit: "项", verb: "包含" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "非数字(NaN)" : "数字";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "数组";
                }
                if (data === null) {
                    return "空值(null)";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "输入",
        email: "电子邮件",
        url: "URL",
        emoji: "表情符号",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO日期时间",
        date: "ISO日期",
        time: "ISO时间",
        duration: "ISO时长",
        ipv4: "IPv4地址",
        ipv6: "IPv6地址",
        cidrv4: "IPv4网段",
        cidrv6: "IPv6网段",
        base64: "base64编码字符串",
        base64url: "base64url编码字符串",
        json_string: "JSON字符串",
        e164: "E.164号码",
        jwt: "JWT",
        template_literal: "输入",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `无效输入：期望 ${issue.expected}，实际接收 ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `无效输入：期望 ${stringifyPrimitive$1(issue.values[0])}`;
                return `无效选项：期望以下之一 ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `数值过大：期望 ${issue.origin ?? "值"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "个元素"}`;
                return `数值过大：期望 ${issue.origin ?? "值"} ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `数值过小：期望 ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `数值过小：期望 ${issue.origin} ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `无效字符串：必须以 "${_issue.prefix}" 开头`;
                if (_issue.format === "ends_with")
                    return `无效字符串：必须以 "${_issue.suffix}" 结尾`;
                if (_issue.format === "includes")
                    return `无效字符串：必须包含 "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `无效字符串：必须满足正则表达式 ${_issue.pattern}`;
                return `无效${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `无效数字：必须是 ${issue.divisor} 的倍数`;
            case "unrecognized_keys":
                return `出现未知的键(key): ${joinValues$1(issue.keys, ", ")}`;
            case "invalid_key":
                return `${issue.origin} 中的键(key)无效`;
            case "invalid_union":
                return "无效输入";
            case "invalid_element":
                return `${issue.origin} 中包含无效值(value)`;
            default:
                return `无效输入`;
        }
    };
};
function zhCN$1 () {
    return {
        localeError: error$K(),
    };
}

const error$J = () => {
    const Sizable = {
        string: { unit: "字元", verb: "擁有" },
        file: { unit: "位元組", verb: "擁有" },
        array: { unit: "項目", verb: "擁有" },
        set: { unit: "項目", verb: "擁有" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "number";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "輸入",
        email: "郵件地址",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO 日期時間",
        date: "ISO 日期",
        time: "ISO 時間",
        duration: "ISO 期間",
        ipv4: "IPv4 位址",
        ipv6: "IPv6 位址",
        cidrv4: "IPv4 範圍",
        cidrv6: "IPv6 範圍",
        base64: "base64 編碼字串",
        base64url: "base64url 編碼字串",
        json_string: "JSON 字串",
        e164: "E.164 數值",
        jwt: "JWT",
        template_literal: "輸入",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `無效的輸入值：預期為 ${issue.expected}，但收到 ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `無效的輸入值：預期為 ${stringifyPrimitive$1(issue.values[0])}`;
                return `無效的選項：預期為以下其中之一 ${joinValues$1(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `數值過大：預期 ${issue.origin ?? "值"} 應為 ${adj}${issue.maximum.toString()} ${sizing.unit ?? "個元素"}`;
                return `數值過大：預期 ${issue.origin ?? "值"} 應為 ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `數值過小：預期 ${issue.origin} 應為 ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `數值過小：預期 ${issue.origin} 應為 ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `無效的字串：必須以 "${_issue.prefix}" 開頭`;
                }
                if (_issue.format === "ends_with")
                    return `無效的字串：必須以 "${_issue.suffix}" 結尾`;
                if (_issue.format === "includes")
                    return `無效的字串：必須包含 "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `無效的字串：必須符合格式 ${_issue.pattern}`;
                return `無效的 ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `無效的數字：必須為 ${issue.divisor} 的倍數`;
            case "unrecognized_keys":
                return `無法識別的鍵值${issue.keys.length > 1 ? "們" : ""}：${joinValues$1(issue.keys, "、")}`;
            case "invalid_key":
                return `${issue.origin} 中有無效的鍵值`;
            case "invalid_union":
                return "無效的輸入值";
            case "invalid_element":
                return `${issue.origin} 中有無效的值`;
            default:
                return `無效的輸入值`;
        }
    };
};
function zhTW$1 () {
    return {
        localeError: error$J(),
    };
}

const index$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ar: ar$1,
  az: az$1,
  be: be$1,
  ca: ca$1,
  cs: cs$1,
  de: de$1,
  en: en$1,
  eo: eo$1,
  es: es$1,
  fa: fa$1,
  fi: fi$1,
  fr: fr$1,
  frCA: frCA$1,
  he: he$1,
  hu: hu$1,
  id: id$1,
  it: it$1,
  ja: ja$1,
  kh: kh$1,
  ko: ko$1,
  mk: mk$1,
  ms: ms$1,
  nl: nl$1,
  no: no$1,
  ota: ota$1,
  pl: pl$1,
  ps: ps$1,
  pt: pt$1,
  ru: ru$1,
  sl: sl$1,
  sv: sv$1,
  ta: ta$1,
  th: th$1,
  tr: tr$1,
  ua: ua$1,
  ur: ur$1,
  vi: vi$1,
  zhCN: zhCN$1,
  zhTW: zhTW$1
}, Symbol.toStringTag, { value: 'Module' }));

const $output$1 = Symbol("ZodOutput");
const $input$1 = Symbol("ZodInput");
let $ZodRegistry$1 = class $ZodRegistry {
    constructor() {
        this._map = new Map();
        this._idmap = new Map();
    }
    add(schema, ..._meta) {
        const meta = _meta[0];
        this._map.set(schema, meta);
        if (meta && typeof meta === "object" && "id" in meta) {
            if (this._idmap.has(meta.id)) {
                throw new Error(`ID ${meta.id} already exists in the registry`);
            }
            this._idmap.set(meta.id, schema);
        }
        return this;
    }
    clear() {
        this._map = new Map();
        this._idmap = new Map();
        return this;
    }
    remove(schema) {
        const meta = this._map.get(schema);
        if (meta && typeof meta === "object" && "id" in meta) {
            this._idmap.delete(meta.id);
        }
        this._map.delete(schema);
        return this;
    }
    get(schema) {
        // return this._map.get(schema) as any;
        // inherit metadata
        const p = schema._zod.parent;
        if (p) {
            const pm = { ...(this.get(p) ?? {}) };
            delete pm.id; // do not inherit id
            return { ...pm, ...this._map.get(schema) };
        }
        return this._map.get(schema);
    }
    has(schema) {
        return this._map.has(schema);
    }
};
// registries
function registry$1() {
    return new $ZodRegistry$1();
}
const globalRegistry$1 = /*@__PURE__*/ registry$1();

function _string$1(Class, params) {
    return new Class({
        type: "string",
        ...normalizeParams$1(params),
    });
}
function _coercedString$1(Class, params) {
    return new Class({
        type: "string",
        coerce: true,
        ...normalizeParams$1(params),
    });
}
function _email$1(Class, params) {
    return new Class({
        type: "string",
        format: "email",
        check: "string_format",
        abort: false,
        ...normalizeParams$1(params),
    });
}
function _guid$1(Class, params) {
    return new Class({
        type: "string",
        format: "guid",
        check: "string_format",
        abort: false,
        ...normalizeParams$1(params),
    });
}
function _uuid$1(Class, params) {
    return new Class({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: false,
        ...normalizeParams$1(params),
    });
}
function _uuidv4$1(Class, params) {
    return new Class({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: false,
        version: "v4",
        ...normalizeParams$1(params),
    });
}
function _uuidv6$1(Class, params) {
    return new Class({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: false,
        version: "v6",
        ...normalizeParams$1(params),
    });
}
function _uuidv7$1(Class, params) {
    return new Class({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: false,
        version: "v7",
        ...normalizeParams$1(params),
    });
}
function _url$1(Class, params) {
    return new Class({
        type: "string",
        format: "url",
        check: "string_format",
        abort: false,
        ...normalizeParams$1(params),
    });
}
function _emoji$2(Class, params) {
    return new Class({
        type: "string",
        format: "emoji",
        check: "string_format",
        abort: false,
        ...normalizeParams$1(params),
    });
}
function _nanoid$1(Class, params) {
    return new Class({
        type: "string",
        format: "nanoid",
        check: "string_format",
        abort: false,
        ...normalizeParams$1(params),
    });
}
function _cuid$1(Class, params) {
    return new Class({
        type: "string",
        format: "cuid",
        check: "string_format",
        abort: false,
        ...normalizeParams$1(params),
    });
}
function _cuid2$1(Class, params) {
    return new Class({
        type: "string",
        format: "cuid2",
        check: "string_format",
        abort: false,
        ...normalizeParams$1(params),
    });
}
function _ulid$1(Class, params) {
    return new Class({
        type: "string",
        format: "ulid",
        check: "string_format",
        abort: false,
        ...normalizeParams$1(params),
    });
}
function _xid$1(Class, params) {
    return new Class({
        type: "string",
        format: "xid",
        check: "string_format",
        abort: false,
        ...normalizeParams$1(params),
    });
}
function _ksuid$1(Class, params) {
    return new Class({
        type: "string",
        format: "ksuid",
        check: "string_format",
        abort: false,
        ...normalizeParams$1(params),
    });
}
function _ipv4$1(Class, params) {
    return new Class({
        type: "string",
        format: "ipv4",
        check: "string_format",
        abort: false,
        ...normalizeParams$1(params),
    });
}
function _ipv6$1(Class, params) {
    return new Class({
        type: "string",
        format: "ipv6",
        check: "string_format",
        abort: false,
        ...normalizeParams$1(params),
    });
}
function _cidrv4$1(Class, params) {
    return new Class({
        type: "string",
        format: "cidrv4",
        check: "string_format",
        abort: false,
        ...normalizeParams$1(params),
    });
}
function _cidrv6$1(Class, params) {
    return new Class({
        type: "string",
        format: "cidrv6",
        check: "string_format",
        abort: false,
        ...normalizeParams$1(params),
    });
}
function _base64$1(Class, params) {
    return new Class({
        type: "string",
        format: "base64",
        check: "string_format",
        abort: false,
        ...normalizeParams$1(params),
    });
}
function _base64url$1(Class, params) {
    return new Class({
        type: "string",
        format: "base64url",
        check: "string_format",
        abort: false,
        ...normalizeParams$1(params),
    });
}
function _e164$1(Class, params) {
    return new Class({
        type: "string",
        format: "e164",
        check: "string_format",
        abort: false,
        ...normalizeParams$1(params),
    });
}
function _jwt$1(Class, params) {
    return new Class({
        type: "string",
        format: "jwt",
        check: "string_format",
        abort: false,
        ...normalizeParams$1(params),
    });
}
const TimePrecision$1 = {
    Any: null,
    Minute: -1,
    Second: 0,
    Millisecond: 3,
    Microsecond: 6,
};
function _isoDateTime$1(Class, params) {
    return new Class({
        type: "string",
        format: "datetime",
        check: "string_format",
        offset: false,
        local: false,
        precision: null,
        ...normalizeParams$1(params),
    });
}
function _isoDate$1(Class, params) {
    return new Class({
        type: "string",
        format: "date",
        check: "string_format",
        ...normalizeParams$1(params),
    });
}
function _isoTime$1(Class, params) {
    return new Class({
        type: "string",
        format: "time",
        check: "string_format",
        precision: null,
        ...normalizeParams$1(params),
    });
}
function _isoDuration$1(Class, params) {
    return new Class({
        type: "string",
        format: "duration",
        check: "string_format",
        ...normalizeParams$1(params),
    });
}
function _number$1(Class, params) {
    return new Class({
        type: "number",
        checks: [],
        ...normalizeParams$1(params),
    });
}
function _coercedNumber$1(Class, params) {
    return new Class({
        type: "number",
        coerce: true,
        checks: [],
        ...normalizeParams$1(params),
    });
}
function _int$1(Class, params) {
    return new Class({
        type: "number",
        check: "number_format",
        abort: false,
        format: "safeint",
        ...normalizeParams$1(params),
    });
}
function _float32$1(Class, params) {
    return new Class({
        type: "number",
        check: "number_format",
        abort: false,
        format: "float32",
        ...normalizeParams$1(params),
    });
}
function _float64$1(Class, params) {
    return new Class({
        type: "number",
        check: "number_format",
        abort: false,
        format: "float64",
        ...normalizeParams$1(params),
    });
}
function _int32$1(Class, params) {
    return new Class({
        type: "number",
        check: "number_format",
        abort: false,
        format: "int32",
        ...normalizeParams$1(params),
    });
}
function _uint32$1(Class, params) {
    return new Class({
        type: "number",
        check: "number_format",
        abort: false,
        format: "uint32",
        ...normalizeParams$1(params),
    });
}
function _boolean$1(Class, params) {
    return new Class({
        type: "boolean",
        ...normalizeParams$1(params),
    });
}
function _coercedBoolean$1(Class, params) {
    return new Class({
        type: "boolean",
        coerce: true,
        ...normalizeParams$1(params),
    });
}
function _bigint$1(Class, params) {
    return new Class({
        type: "bigint",
        ...normalizeParams$1(params),
    });
}
function _coercedBigint$1(Class, params) {
    return new Class({
        type: "bigint",
        coerce: true,
        ...normalizeParams$1(params),
    });
}
function _int64$1(Class, params) {
    return new Class({
        type: "bigint",
        check: "bigint_format",
        abort: false,
        format: "int64",
        ...normalizeParams$1(params),
    });
}
function _uint64$1(Class, params) {
    return new Class({
        type: "bigint",
        check: "bigint_format",
        abort: false,
        format: "uint64",
        ...normalizeParams$1(params),
    });
}
function _symbol$1(Class, params) {
    return new Class({
        type: "symbol",
        ...normalizeParams$1(params),
    });
}
function _undefined$3(Class, params) {
    return new Class({
        type: "undefined",
        ...normalizeParams$1(params),
    });
}
function _null$3(Class, params) {
    return new Class({
        type: "null",
        ...normalizeParams$1(params),
    });
}
function _any$1(Class) {
    return new Class({
        type: "any",
    });
}
function _unknown$1(Class) {
    return new Class({
        type: "unknown",
    });
}
function _never$1(Class, params) {
    return new Class({
        type: "never",
        ...normalizeParams$1(params),
    });
}
function _void$2(Class, params) {
    return new Class({
        type: "void",
        ...normalizeParams$1(params),
    });
}
function _date$1(Class, params) {
    return new Class({
        type: "date",
        ...normalizeParams$1(params),
    });
}
function _coercedDate$1(Class, params) {
    return new Class({
        type: "date",
        coerce: true,
        ...normalizeParams$1(params),
    });
}
function _nan$1(Class, params) {
    return new Class({
        type: "nan",
        ...normalizeParams$1(params),
    });
}
function _lt$1(value, params) {
    return new $ZodCheckLessThan$1({
        check: "less_than",
        ...normalizeParams$1(params),
        value,
        inclusive: false,
    });
}
function _lte$1(value, params) {
    return new $ZodCheckLessThan$1({
        check: "less_than",
        ...normalizeParams$1(params),
        value,
        inclusive: true,
    });
}
function _gt$1(value, params) {
    return new $ZodCheckGreaterThan$1({
        check: "greater_than",
        ...normalizeParams$1(params),
        value,
        inclusive: false,
    });
}
function _gte$1(value, params) {
    return new $ZodCheckGreaterThan$1({
        check: "greater_than",
        ...normalizeParams$1(params),
        value,
        inclusive: true,
    });
}
function _positive$1(params) {
    return _gt$1(0, params);
}
// negative
function _negative$1(params) {
    return _lt$1(0, params);
}
// nonpositive
function _nonpositive$1(params) {
    return _lte$1(0, params);
}
// nonnegative
function _nonnegative$1(params) {
    return _gte$1(0, params);
}
function _multipleOf$1(value, params) {
    return new $ZodCheckMultipleOf$1({
        check: "multiple_of",
        ...normalizeParams$1(params),
        value,
    });
}
function _maxSize$1(maximum, params) {
    return new $ZodCheckMaxSize$1({
        check: "max_size",
        ...normalizeParams$1(params),
        maximum,
    });
}
function _minSize$1(minimum, params) {
    return new $ZodCheckMinSize$1({
        check: "min_size",
        ...normalizeParams$1(params),
        minimum,
    });
}
function _size$1(size, params) {
    return new $ZodCheckSizeEquals$1({
        check: "size_equals",
        ...normalizeParams$1(params),
        size,
    });
}
function _maxLength$1(maximum, params) {
    const ch = new $ZodCheckMaxLength$1({
        check: "max_length",
        ...normalizeParams$1(params),
        maximum,
    });
    return ch;
}
function _minLength$1(minimum, params) {
    return new $ZodCheckMinLength$1({
        check: "min_length",
        ...normalizeParams$1(params),
        minimum,
    });
}
function _length$1(length, params) {
    return new $ZodCheckLengthEquals$1({
        check: "length_equals",
        ...normalizeParams$1(params),
        length,
    });
}
function _regex$1(pattern, params) {
    return new $ZodCheckRegex$1({
        check: "string_format",
        format: "regex",
        ...normalizeParams$1(params),
        pattern,
    });
}
function _lowercase$1(params) {
    return new $ZodCheckLowerCase$1({
        check: "string_format",
        format: "lowercase",
        ...normalizeParams$1(params),
    });
}
function _uppercase$1(params) {
    return new $ZodCheckUpperCase$1({
        check: "string_format",
        format: "uppercase",
        ...normalizeParams$1(params),
    });
}
function _includes$1(includes, params) {
    return new $ZodCheckIncludes$1({
        check: "string_format",
        format: "includes",
        ...normalizeParams$1(params),
        includes,
    });
}
function _startsWith$1(prefix, params) {
    return new $ZodCheckStartsWith$1({
        check: "string_format",
        format: "starts_with",
        ...normalizeParams$1(params),
        prefix,
    });
}
function _endsWith$1(suffix, params) {
    return new $ZodCheckEndsWith$1({
        check: "string_format",
        format: "ends_with",
        ...normalizeParams$1(params),
        suffix,
    });
}
function _property$1(property, schema, params) {
    return new $ZodCheckProperty$1({
        check: "property",
        property,
        schema,
        ...normalizeParams$1(params),
    });
}
function _mime$1(types, params) {
    return new $ZodCheckMimeType$1({
        check: "mime_type",
        mime: types,
        ...normalizeParams$1(params),
    });
}
function _overwrite$1(tx) {
    return new $ZodCheckOverwrite$1({
        check: "overwrite",
        tx,
    });
}
// normalize
function _normalize$1(form) {
    return _overwrite$1((input) => input.normalize(form));
}
// trim
function _trim$1() {
    return _overwrite$1((input) => input.trim());
}
// toLowerCase
function _toLowerCase$1() {
    return _overwrite$1((input) => input.toLowerCase());
}
// toUpperCase
function _toUpperCase$1() {
    return _overwrite$1((input) => input.toUpperCase());
}
function _array$1(Class, element, params) {
    return new Class({
        type: "array",
        element,
        // get element() {
        //   return element;
        // },
        ...normalizeParams$1(params),
    });
}
function _union$1(Class, options, params) {
    return new Class({
        type: "union",
        options,
        ...normalizeParams$1(params),
    });
}
function _discriminatedUnion$1(Class, discriminator, options, params) {
    return new Class({
        type: "union",
        options,
        discriminator,
        ...normalizeParams$1(params),
    });
}
function _intersection$1(Class, left, right) {
    return new Class({
        type: "intersection",
        left,
        right,
    });
}
// export function _tuple(
//   Class: util.SchemaClass<schemas.$ZodTuple>,
//   items: [],
//   params?: string | $ZodTupleParams
// ): schemas.$ZodTuple<[], null>;
function _tuple$1(Class, items, _paramsOrRest, _params) {
    const hasRest = _paramsOrRest instanceof $ZodType$1;
    const params = hasRest ? _params : _paramsOrRest;
    const rest = hasRest ? _paramsOrRest : null;
    return new Class({
        type: "tuple",
        items,
        rest,
        ...normalizeParams$1(params),
    });
}
function _record$1(Class, keyType, valueType, params) {
    return new Class({
        type: "record",
        keyType,
        valueType,
        ...normalizeParams$1(params),
    });
}
function _map$1(Class, keyType, valueType, params) {
    return new Class({
        type: "map",
        keyType,
        valueType,
        ...normalizeParams$1(params),
    });
}
function _set$1(Class, valueType, params) {
    return new Class({
        type: "set",
        valueType,
        ...normalizeParams$1(params),
    });
}
function _enum$2(Class, values, params) {
    const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
    // if (Array.isArray(values)) {
    //   for (const value of values) {
    //     entries[value] = value;
    //   }
    // } else {
    //   Object.assign(entries, values);
    // }
    // const entries: util.EnumLike = {};
    // for (const val of values) {
    //   entries[val] = val;
    // }
    return new Class({
        type: "enum",
        entries,
        ...normalizeParams$1(params),
    });
}
/** @deprecated This API has been merged into `z.enum()`. Use `z.enum()` instead.
 *
 * ```ts
 * enum Colors { red, green, blue }
 * z.enum(Colors);
 * ```
 */
function _nativeEnum$1(Class, entries, params) {
    return new Class({
        type: "enum",
        entries,
        ...normalizeParams$1(params),
    });
}
function _literal$1(Class, value, params) {
    return new Class({
        type: "literal",
        values: Array.isArray(value) ? value : [value],
        ...normalizeParams$1(params),
    });
}
function _file$1(Class, params) {
    return new Class({
        type: "file",
        ...normalizeParams$1(params),
    });
}
function _transform$1(Class, fn) {
    return new Class({
        type: "transform",
        transform: fn,
    });
}
function _optional$1(Class, innerType) {
    return new Class({
        type: "optional",
        innerType,
    });
}
function _nullable$1(Class, innerType) {
    return new Class({
        type: "nullable",
        innerType,
    });
}
function _default$2(Class, innerType, defaultValue) {
    return new Class({
        type: "default",
        innerType,
        get defaultValue() {
            return typeof defaultValue === "function" ? defaultValue() : defaultValue;
        },
    });
}
function _nonoptional$1(Class, innerType, params) {
    return new Class({
        type: "nonoptional",
        innerType,
        ...normalizeParams$1(params),
    });
}
function _success$1(Class, innerType) {
    return new Class({
        type: "success",
        innerType,
    });
}
function _catch$2(Class, innerType, catchValue) {
    return new Class({
        type: "catch",
        innerType,
        catchValue: (typeof catchValue === "function" ? catchValue : () => catchValue),
    });
}
function _pipe$1(Class, in_, out) {
    return new Class({
        type: "pipe",
        in: in_,
        out,
    });
}
function _readonly$1(Class, innerType) {
    return new Class({
        type: "readonly",
        innerType,
    });
}
function _templateLiteral$1(Class, parts, params) {
    return new Class({
        type: "template_literal",
        parts,
        ...normalizeParams$1(params),
    });
}
function _lazy$1(Class, getter) {
    return new Class({
        type: "lazy",
        getter,
    });
}
function _promise$1(Class, innerType) {
    return new Class({
        type: "promise",
        innerType,
    });
}
function _custom$1(Class, fn, _params) {
    const norm = normalizeParams$1(_params);
    norm.abort ?? (norm.abort = true); // default to abort:false
    const schema = new Class({
        type: "custom",
        check: "custom",
        fn: fn,
        ...norm,
    });
    return schema;
}
// export function _refine<T>(
//   Class: util.SchemaClass<schemas.$ZodCustom>,
//   fn: (arg: NoInfer<T>) => util.MaybeAsync<unknown>,
//   _params: string | $ZodCustomParams = {}
// ): checks.$ZodCheck<T> {
//   return _custom(Class, fn, _params);
// }
// same as _custom but defaults to abort:false
function _refine$1(Class, fn, _params) {
    const schema = new Class({
        type: "custom",
        check: "custom",
        fn: fn,
        ...normalizeParams$1(_params),
    });
    return schema;
}
function _stringbool$1(Classes, _params) {
    const params = normalizeParams$1(_params);
    let truthyArray = params.truthy ?? ["true", "1", "yes", "on", "y", "enabled"];
    let falsyArray = params.falsy ?? ["false", "0", "no", "off", "n", "disabled"];
    if (params.case !== "sensitive") {
        truthyArray = truthyArray.map((v) => (typeof v === "string" ? v.toLowerCase() : v));
        falsyArray = falsyArray.map((v) => (typeof v === "string" ? v.toLowerCase() : v));
    }
    const truthySet = new Set(truthyArray);
    const falsySet = new Set(falsyArray);
    const _Pipe = Classes.Pipe ?? $ZodPipe$1;
    const _Boolean = Classes.Boolean ?? $ZodBoolean$1;
    const _String = Classes.String ?? $ZodString$1;
    const _Transform = Classes.Transform ?? $ZodTransform$1;
    const tx = new _Transform({
        type: "transform",
        transform: (input, payload) => {
            let data = input;
            if (params.case !== "sensitive")
                data = data.toLowerCase();
            if (truthySet.has(data)) {
                return true;
            }
            else if (falsySet.has(data)) {
                return false;
            }
            else {
                payload.issues.push({
                    code: "invalid_value",
                    expected: "stringbool",
                    values: [...truthySet, ...falsySet],
                    input: payload.value,
                    inst: tx,
                });
                return {};
            }
        },
        error: params.error,
    });
    // params.error;
    const innerPipe = new _Pipe({
        type: "pipe",
        in: new _String({ type: "string", error: params.error }),
        out: tx,
        error: params.error,
    });
    const outerPipe = new _Pipe({
        type: "pipe",
        in: innerPipe,
        out: new _Boolean({
            type: "boolean",
            error: params.error,
        }),
        error: params.error,
    });
    return outerPipe;
}
function _stringFormat$1(Class, format, fnOrRegex, _params = {}) {
    const params = normalizeParams$1(_params);
    const def = {
        ...normalizeParams$1(_params),
        check: "string_format",
        type: "string",
        format,
        fn: typeof fnOrRegex === "function" ? fnOrRegex : (val) => fnOrRegex.test(val),
        ...params,
    };
    if (fnOrRegex instanceof RegExp) {
        def.pattern = fnOrRegex;
    }
    const inst = new Class(def);
    return inst;
}

let $ZodFunction$1 = class $ZodFunction {
    constructor(def) {
        this._def = def;
        this.def = def;
    }
    implement(func) {
        if (typeof func !== "function") {
            throw new Error("implement() must be called with a function");
        }
        const impl = ((...args) => {
            const parsedArgs = this._def.input ? parse$2(this._def.input, args, undefined, { callee: impl }) : args;
            if (!Array.isArray(parsedArgs)) {
                throw new Error("Invalid arguments schema: not an array or tuple schema.");
            }
            const output = func(...parsedArgs);
            return this._def.output ? parse$2(this._def.output, output, undefined, { callee: impl }) : output;
        });
        return impl;
    }
    implementAsync(func) {
        if (typeof func !== "function") {
            throw new Error("implement() must be called with a function");
        }
        const impl = (async (...args) => {
            const parsedArgs = this._def.input ? await parseAsync$2(this._def.input, args, undefined, { callee: impl }) : args;
            if (!Array.isArray(parsedArgs)) {
                throw new Error("Invalid arguments schema: not an array or tuple schema.");
            }
            const output = await func(...parsedArgs);
            return this._def.output ? parseAsync$2(this._def.output, output, undefined, { callee: impl }) : output;
        });
        return impl;
    }
    input(...args) {
        const F = this.constructor;
        if (Array.isArray(args[0])) {
            return new F({
                type: "function",
                input: new $ZodTuple$1({
                    type: "tuple",
                    items: args[0],
                    rest: args[1],
                }),
                output: this._def.output,
            });
        }
        return new F({
            type: "function",
            input: args[0],
            output: this._def.output,
        });
    }
    output(output) {
        const F = this.constructor;
        return new F({
            type: "function",
            input: this._def.input,
            output,
        });
    }
};
function _function$1(params) {
    return new $ZodFunction$1({
        type: "function",
        input: Array.isArray(params?.input)
            ? _tuple$1($ZodTuple$1, params?.input)
            : (params?.input ?? _array$1($ZodArray$1, _unknown$1($ZodUnknown$1))),
        output: params?.output ?? _unknown$1($ZodUnknown$1),
    });
}

let JSONSchemaGenerator$1 = class JSONSchemaGenerator {
    constructor(params) {
        this.counter = 0;
        this.metadataRegistry = params?.metadata ?? globalRegistry$1;
        this.target = params?.target ?? "draft-2020-12";
        this.unrepresentable = params?.unrepresentable ?? "throw";
        this.override = params?.override ?? (() => { });
        this.io = params?.io ?? "output";
        this.seen = new Map();
    }
    process(schema, _params = { path: [], schemaPath: [] }) {
        var _a;
        const def = schema._zod.def;
        const formatMap = {
            guid: "uuid",
            url: "uri",
            datetime: "date-time",
            json_string: "json-string",
            regex: "", // do not set
        };
        // check for schema in seens
        const seen = this.seen.get(schema);
        if (seen) {
            seen.count++;
            // check if cycle
            const isCycle = _params.schemaPath.includes(schema);
            if (isCycle) {
                seen.cycle = _params.path;
            }
            return seen.schema;
        }
        // initialize
        const result = { schema: {}, count: 1, cycle: undefined, path: _params.path };
        this.seen.set(schema, result);
        // custom method overrides default behavior
        const overrideSchema = schema._zod.toJSONSchema?.();
        if (overrideSchema) {
            result.schema = overrideSchema;
        }
        else {
            const params = {
                ..._params,
                schemaPath: [..._params.schemaPath, schema],
                path: _params.path,
            };
            const parent = schema._zod.parent;
            if (parent) {
                // schema was cloned from another schema
                result.ref = parent;
                this.process(parent, params);
                this.seen.get(parent).isParent = true;
            }
            else {
                const _json = result.schema;
                switch (def.type) {
                    case "string": {
                        const json = _json;
                        json.type = "string";
                        const { minimum, maximum, format, patterns, contentEncoding } = schema._zod
                            .bag;
                        if (typeof minimum === "number")
                            json.minLength = minimum;
                        if (typeof maximum === "number")
                            json.maxLength = maximum;
                        // custom pattern overrides format
                        if (format) {
                            json.format = formatMap[format] ?? format;
                            if (json.format === "")
                                delete json.format; // empty format is not valid
                        }
                        if (contentEncoding)
                            json.contentEncoding = contentEncoding;
                        if (patterns && patterns.size > 0) {
                            const regexes = [...patterns];
                            if (regexes.length === 1)
                                json.pattern = regexes[0].source;
                            else if (regexes.length > 1) {
                                result.schema.allOf = [
                                    ...regexes.map((regex) => ({
                                        ...(this.target === "draft-7" ? { type: "string" } : {}),
                                        pattern: regex.source,
                                    })),
                                ];
                            }
                        }
                        break;
                    }
                    case "number": {
                        const json = _json;
                        const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
                        if (typeof format === "string" && format.includes("int"))
                            json.type = "integer";
                        else
                            json.type = "number";
                        if (typeof exclusiveMinimum === "number")
                            json.exclusiveMinimum = exclusiveMinimum;
                        if (typeof minimum === "number") {
                            json.minimum = minimum;
                            if (typeof exclusiveMinimum === "number") {
                                if (exclusiveMinimum >= minimum)
                                    delete json.minimum;
                                else
                                    delete json.exclusiveMinimum;
                            }
                        }
                        if (typeof exclusiveMaximum === "number")
                            json.exclusiveMaximum = exclusiveMaximum;
                        if (typeof maximum === "number") {
                            json.maximum = maximum;
                            if (typeof exclusiveMaximum === "number") {
                                if (exclusiveMaximum <= maximum)
                                    delete json.maximum;
                                else
                                    delete json.exclusiveMaximum;
                            }
                        }
                        if (typeof multipleOf === "number")
                            json.multipleOf = multipleOf;
                        break;
                    }
                    case "boolean": {
                        const json = _json;
                        json.type = "boolean";
                        break;
                    }
                    case "bigint": {
                        if (this.unrepresentable === "throw") {
                            throw new Error("BigInt cannot be represented in JSON Schema");
                        }
                        break;
                    }
                    case "symbol": {
                        if (this.unrepresentable === "throw") {
                            throw new Error("Symbols cannot be represented in JSON Schema");
                        }
                        break;
                    }
                    case "null": {
                        _json.type = "null";
                        break;
                    }
                    case "any": {
                        break;
                    }
                    case "unknown": {
                        break;
                    }
                    case "undefined": {
                        if (this.unrepresentable === "throw") {
                            throw new Error("Undefined cannot be represented in JSON Schema");
                        }
                        break;
                    }
                    case "void": {
                        if (this.unrepresentable === "throw") {
                            throw new Error("Void cannot be represented in JSON Schema");
                        }
                        break;
                    }
                    case "never": {
                        _json.not = {};
                        break;
                    }
                    case "date": {
                        if (this.unrepresentable === "throw") {
                            throw new Error("Date cannot be represented in JSON Schema");
                        }
                        break;
                    }
                    case "array": {
                        const json = _json;
                        const { minimum, maximum } = schema._zod.bag;
                        if (typeof minimum === "number")
                            json.minItems = minimum;
                        if (typeof maximum === "number")
                            json.maxItems = maximum;
                        json.type = "array";
                        json.items = this.process(def.element, { ...params, path: [...params.path, "items"] });
                        break;
                    }
                    case "object": {
                        const json = _json;
                        json.type = "object";
                        json.properties = {};
                        const shape = def.shape; // params.shapeCache.get(schema)!;
                        for (const key in shape) {
                            json.properties[key] = this.process(shape[key], {
                                ...params,
                                path: [...params.path, "properties", key],
                            });
                        }
                        // required keys
                        const allKeys = new Set(Object.keys(shape));
                        // const optionalKeys = new Set(def.optional);
                        const requiredKeys = new Set([...allKeys].filter((key) => {
                            const v = def.shape[key]._zod;
                            if (this.io === "input") {
                                return v.optin === undefined;
                            }
                            else {
                                return v.optout === undefined;
                            }
                        }));
                        if (requiredKeys.size > 0) {
                            json.required = Array.from(requiredKeys);
                        }
                        // catchall
                        if (def.catchall?._zod.def.type === "never") {
                            // strict
                            json.additionalProperties = false;
                        }
                        else if (!def.catchall) {
                            // regular
                            if (this.io === "output")
                                json.additionalProperties = false;
                        }
                        else if (def.catchall) {
                            json.additionalProperties = this.process(def.catchall, {
                                ...params,
                                path: [...params.path, "additionalProperties"],
                            });
                        }
                        break;
                    }
                    case "union": {
                        const json = _json;
                        json.anyOf = def.options.map((x, i) => this.process(x, {
                            ...params,
                            path: [...params.path, "anyOf", i],
                        }));
                        break;
                    }
                    case "intersection": {
                        const json = _json;
                        const a = this.process(def.left, {
                            ...params,
                            path: [...params.path, "allOf", 0],
                        });
                        const b = this.process(def.right, {
                            ...params,
                            path: [...params.path, "allOf", 1],
                        });
                        const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
                        const allOf = [
                            ...(isSimpleIntersection(a) ? a.allOf : [a]),
                            ...(isSimpleIntersection(b) ? b.allOf : [b]),
                        ];
                        json.allOf = allOf;
                        break;
                    }
                    case "tuple": {
                        const json = _json;
                        json.type = "array";
                        const prefixItems = def.items.map((x, i) => this.process(x, { ...params, path: [...params.path, "prefixItems", i] }));
                        if (this.target === "draft-2020-12") {
                            json.prefixItems = prefixItems;
                        }
                        else {
                            json.items = prefixItems;
                        }
                        if (def.rest) {
                            const rest = this.process(def.rest, {
                                ...params,
                                path: [...params.path, "items"],
                            });
                            if (this.target === "draft-2020-12") {
                                json.items = rest;
                            }
                            else {
                                json.additionalItems = rest;
                            }
                        }
                        // additionalItems
                        if (def.rest) {
                            json.items = this.process(def.rest, {
                                ...params,
                                path: [...params.path, "items"],
                            });
                        }
                        // length
                        const { minimum, maximum } = schema._zod.bag;
                        if (typeof minimum === "number")
                            json.minItems = minimum;
                        if (typeof maximum === "number")
                            json.maxItems = maximum;
                        break;
                    }
                    case "record": {
                        const json = _json;
                        json.type = "object";
                        json.propertyNames = this.process(def.keyType, { ...params, path: [...params.path, "propertyNames"] });
                        json.additionalProperties = this.process(def.valueType, {
                            ...params,
                            path: [...params.path, "additionalProperties"],
                        });
                        break;
                    }
                    case "map": {
                        if (this.unrepresentable === "throw") {
                            throw new Error("Map cannot be represented in JSON Schema");
                        }
                        break;
                    }
                    case "set": {
                        if (this.unrepresentable === "throw") {
                            throw new Error("Set cannot be represented in JSON Schema");
                        }
                        break;
                    }
                    case "enum": {
                        const json = _json;
                        const values = getEnumValues$1(def.entries);
                        // Number enums can have both string and number values
                        if (values.every((v) => typeof v === "number"))
                            json.type = "number";
                        if (values.every((v) => typeof v === "string"))
                            json.type = "string";
                        json.enum = values;
                        break;
                    }
                    case "literal": {
                        const json = _json;
                        const vals = [];
                        for (const val of def.values) {
                            if (val === undefined) {
                                if (this.unrepresentable === "throw") {
                                    throw new Error("Literal `undefined` cannot be represented in JSON Schema");
                                }
                                else {
                                    // do not add to vals
                                }
                            }
                            else if (typeof val === "bigint") {
                                if (this.unrepresentable === "throw") {
                                    throw new Error("BigInt literals cannot be represented in JSON Schema");
                                }
                                else {
                                    vals.push(Number(val));
                                }
                            }
                            else {
                                vals.push(val);
                            }
                        }
                        if (vals.length === 0) {
                            // do nothing (an undefined literal was stripped)
                        }
                        else if (vals.length === 1) {
                            const val = vals[0];
                            json.type = val === null ? "null" : typeof val;
                            json.const = val;
                        }
                        else {
                            if (vals.every((v) => typeof v === "number"))
                                json.type = "number";
                            if (vals.every((v) => typeof v === "string"))
                                json.type = "string";
                            if (vals.every((v) => typeof v === "boolean"))
                                json.type = "string";
                            if (vals.every((v) => v === null))
                                json.type = "null";
                            json.enum = vals;
                        }
                        break;
                    }
                    case "file": {
                        const json = _json;
                        const file = {
                            type: "string",
                            format: "binary",
                            contentEncoding: "binary",
                        };
                        const { minimum, maximum, mime } = schema._zod.bag;
                        if (minimum !== undefined)
                            file.minLength = minimum;
                        if (maximum !== undefined)
                            file.maxLength = maximum;
                        if (mime) {
                            if (mime.length === 1) {
                                file.contentMediaType = mime[0];
                                Object.assign(json, file);
                            }
                            else {
                                json.anyOf = mime.map((m) => {
                                    const mFile = { ...file, contentMediaType: m };
                                    return mFile;
                                });
                            }
                        }
                        else {
                            Object.assign(json, file);
                        }
                        // if (this.unrepresentable === "throw") {
                        //   throw new Error("File cannot be represented in JSON Schema");
                        // }
                        break;
                    }
                    case "transform": {
                        if (this.unrepresentable === "throw") {
                            throw new Error("Transforms cannot be represented in JSON Schema");
                        }
                        break;
                    }
                    case "nullable": {
                        const inner = this.process(def.innerType, params);
                        _json.anyOf = [inner, { type: "null" }];
                        break;
                    }
                    case "nonoptional": {
                        this.process(def.innerType, params);
                        result.ref = def.innerType;
                        break;
                    }
                    case "success": {
                        const json = _json;
                        json.type = "boolean";
                        break;
                    }
                    case "default": {
                        this.process(def.innerType, params);
                        result.ref = def.innerType;
                        _json.default = JSON.parse(JSON.stringify(def.defaultValue));
                        break;
                    }
                    case "prefault": {
                        this.process(def.innerType, params);
                        result.ref = def.innerType;
                        if (this.io === "input")
                            _json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
                        break;
                    }
                    case "catch": {
                        // use conditionals
                        this.process(def.innerType, params);
                        result.ref = def.innerType;
                        let catchValue;
                        try {
                            catchValue = def.catchValue(undefined);
                        }
                        catch {
                            throw new Error("Dynamic catch values are not supported in JSON Schema");
                        }
                        _json.default = catchValue;
                        break;
                    }
                    case "nan": {
                        if (this.unrepresentable === "throw") {
                            throw new Error("NaN cannot be represented in JSON Schema");
                        }
                        break;
                    }
                    case "template_literal": {
                        const json = _json;
                        const pattern = schema._zod.pattern;
                        if (!pattern)
                            throw new Error("Pattern not found in template literal");
                        json.type = "string";
                        json.pattern = pattern.source;
                        break;
                    }
                    case "pipe": {
                        const innerType = this.io === "input" ? (def.in._zod.def.type === "transform" ? def.out : def.in) : def.out;
                        this.process(innerType, params);
                        result.ref = innerType;
                        break;
                    }
                    case "readonly": {
                        this.process(def.innerType, params);
                        result.ref = def.innerType;
                        _json.readOnly = true;
                        break;
                    }
                    // passthrough types
                    case "promise": {
                        this.process(def.innerType, params);
                        result.ref = def.innerType;
                        break;
                    }
                    case "optional": {
                        this.process(def.innerType, params);
                        result.ref = def.innerType;
                        break;
                    }
                    case "lazy": {
                        const innerType = schema._zod.innerType;
                        this.process(innerType, params);
                        result.ref = innerType;
                        break;
                    }
                    case "custom": {
                        if (this.unrepresentable === "throw") {
                            throw new Error("Custom types cannot be represented in JSON Schema");
                        }
                        break;
                    }
                    default: {
                        def;
                    }
                }
            }
        }
        // metadata
        const meta = this.metadataRegistry.get(schema);
        if (meta)
            Object.assign(result.schema, meta);
        if (this.io === "input" && isTransforming$1(schema)) {
            // examples/defaults only apply to output type of pipe
            delete result.schema.examples;
            delete result.schema.default;
        }
        // set prefault as default
        if (this.io === "input" && result.schema._prefault)
            (_a = result.schema).default ?? (_a.default = result.schema._prefault);
        delete result.schema._prefault;
        // pulling fresh from this.seen in case it was overwritten
        const _result = this.seen.get(schema);
        return _result.schema;
    }
    emit(schema, _params) {
        const params = {
            cycles: _params?.cycles ?? "ref",
            reused: _params?.reused ?? "inline",
            // unrepresentable: _params?.unrepresentable ?? "throw",
            // uri: _params?.uri ?? ((id) => `${id}`),
            external: _params?.external ?? undefined,
        };
        // iterate over seen map;
        const root = this.seen.get(schema);
        if (!root)
            throw new Error("Unprocessed schema. This is a bug in Zod.");
        // initialize result with root schema fields
        // Object.assign(result, seen.cached);
        // returns a ref to the schema
        // defId will be empty if the ref points to an external schema (or #)
        const makeURI = (entry) => {
            // comparing the seen objects because sometimes
            // multiple schemas map to the same seen object.
            // e.g. lazy
            // external is configured
            const defsSegment = this.target === "draft-2020-12" ? "$defs" : "definitions";
            if (params.external) {
                const externalId = params.external.registry.get(entry[0])?.id; // ?? "__shared";// `__schema${this.counter++}`;
                // check if schema is in the external registry
                const uriGenerator = params.external.uri ?? ((id) => id);
                if (externalId) {
                    return { ref: uriGenerator(externalId) };
                }
                // otherwise, add to __shared
                const id = entry[1].defId ?? entry[1].schema.id ?? `schema${this.counter++}`;
                entry[1].defId = id; // set defId so it will be reused if needed
                return { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}` };
            }
            if (entry[1] === root) {
                return { ref: "#" };
            }
            // self-contained schema
            const uriPrefix = `#`;
            const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
            const defId = entry[1].schema.id ?? `__schema${this.counter++}`;
            return { defId, ref: defUriPrefix + defId };
        };
        // stored cached version in `def` property
        // remove all properties, set $ref
        const extractToDef = (entry) => {
            // if the schema is already a reference, do not extract it
            if (entry[1].schema.$ref) {
                return;
            }
            const seen = entry[1];
            const { ref, defId } = makeURI(entry);
            seen.def = { ...seen.schema };
            // defId won't be set if the schema is a reference to an external schema
            if (defId)
                seen.defId = defId;
            // wipe away all properties except $ref
            const schema = seen.schema;
            for (const key in schema) {
                delete schema[key];
            }
            schema.$ref = ref;
        };
        // throw on cycles
        // break cycles
        if (params.cycles === "throw") {
            for (const entry of this.seen.entries()) {
                const seen = entry[1];
                if (seen.cycle) {
                    throw new Error("Cycle detected: " +
                        `#/${seen.cycle?.join("/")}/<root>` +
                        '\n\nSet the `cycles` parameter to `"ref"` to resolve cyclical schemas with defs.');
                }
            }
        }
        // extract schemas into $defs
        for (const entry of this.seen.entries()) {
            const seen = entry[1];
            // convert root schema to # $ref
            if (schema === entry[0]) {
                extractToDef(entry); // this has special handling for the root schema
                continue;
            }
            // extract schemas that are in the external registry
            if (params.external) {
                const ext = params.external.registry.get(entry[0])?.id;
                if (schema !== entry[0] && ext) {
                    extractToDef(entry);
                    continue;
                }
            }
            // extract schemas with `id` meta
            const id = this.metadataRegistry.get(entry[0])?.id;
            if (id) {
                extractToDef(entry);
                continue;
            }
            // break cycles
            if (seen.cycle) {
                // any
                extractToDef(entry);
                continue;
            }
            // extract reused schemas
            if (seen.count > 1) {
                if (params.reused === "ref") {
                    extractToDef(entry);
                    // biome-ignore lint:
                    continue;
                }
            }
        }
        // flatten _refs
        const flattenRef = (zodSchema, params) => {
            const seen = this.seen.get(zodSchema);
            const schema = seen.def ?? seen.schema;
            const _cached = { ...schema };
            // already seen
            if (seen.ref === null) {
                return;
            }
            // flatten ref if defined
            const ref = seen.ref;
            seen.ref = null; // prevent recursion
            if (ref) {
                flattenRef(ref, params);
                // merge referenced schema into current
                const refSchema = this.seen.get(ref).schema;
                if (refSchema.$ref && params.target === "draft-7") {
                    schema.allOf = schema.allOf ?? [];
                    schema.allOf.push(refSchema);
                }
                else {
                    Object.assign(schema, refSchema);
                    Object.assign(schema, _cached); // prevent overwriting any fields in the original schema
                }
            }
            // execute overrides
            if (!seen.isParent)
                this.override({
                    zodSchema: zodSchema,
                    jsonSchema: schema,
                    path: seen.path ?? [],
                });
        };
        for (const entry of [...this.seen.entries()].reverse()) {
            flattenRef(entry[0], { target: this.target });
        }
        const result = {};
        if (this.target === "draft-2020-12") {
            result.$schema = "https://json-schema.org/draft/2020-12/schema";
        }
        else if (this.target === "draft-7") {
            result.$schema = "http://json-schema.org/draft-07/schema#";
        }
        else {
            console.warn(`Invalid target: ${this.target}`);
        }
        if (params.external?.uri) {
            const id = params.external.registry.get(schema)?.id;
            if (!id)
                throw new Error("Schema is missing an `id` property");
            result.$id = params.external.uri(id);
        }
        Object.assign(result, root.def);
        // build defs object
        const defs = params.external?.defs ?? {};
        for (const entry of this.seen.entries()) {
            const seen = entry[1];
            if (seen.def && seen.defId) {
                defs[seen.defId] = seen.def;
            }
        }
        // set definitions in result
        if (params.external) {
        }
        else {
            if (Object.keys(defs).length > 0) {
                if (this.target === "draft-2020-12") {
                    result.$defs = defs;
                }
                else {
                    result.definitions = defs;
                }
            }
        }
        try {
            // this "finalizes" this schema and ensures all cycles are removed
            // each call to .emit() is functionally independent
            // though the seen map is shared
            return JSON.parse(JSON.stringify(result));
        }
        catch (_err) {
            throw new Error("Error converting schema to JSON.");
        }
    }
};
function toJSONSchema$1(input, _params) {
    if (input instanceof $ZodRegistry$1) {
        const gen = new JSONSchemaGenerator$1(_params);
        const defs = {};
        for (const entry of input._idmap.entries()) {
            const [_, schema] = entry;
            gen.process(schema);
        }
        const schemas = {};
        const external = {
            registry: input,
            uri: _params?.uri,
            defs,
        };
        for (const entry of input._idmap.entries()) {
            const [key, schema] = entry;
            schemas[key] = gen.emit(schema, {
                ..._params,
                external,
            });
        }
        if (Object.keys(defs).length > 0) {
            const defsSegment = gen.target === "draft-2020-12" ? "$defs" : "definitions";
            schemas.__shared = {
                [defsSegment]: defs,
            };
        }
        return { schemas };
    }
    const gen = new JSONSchemaGenerator$1(_params);
    gen.process(input);
    return gen.emit(input, _params);
}
function isTransforming$1(_schema, _ctx) {
    const ctx = _ctx ?? { seen: new Set() };
    if (ctx.seen.has(_schema))
        return false;
    ctx.seen.add(_schema);
    const schema = _schema;
    const def = schema._zod.def;
    switch (def.type) {
        case "string":
        case "number":
        case "bigint":
        case "boolean":
        case "date":
        case "symbol":
        case "undefined":
        case "null":
        case "any":
        case "unknown":
        case "never":
        case "void":
        case "literal":
        case "enum":
        case "nan":
        case "file":
        case "template_literal":
            return false;
        case "array": {
            return isTransforming$1(def.element, ctx);
        }
        case "object": {
            for (const key in def.shape) {
                if (isTransforming$1(def.shape[key], ctx))
                    return true;
            }
            return false;
        }
        case "union": {
            for (const option of def.options) {
                if (isTransforming$1(option, ctx))
                    return true;
            }
            return false;
        }
        case "intersection": {
            return isTransforming$1(def.left, ctx) || isTransforming$1(def.right, ctx);
        }
        case "tuple": {
            for (const item of def.items) {
                if (isTransforming$1(item, ctx))
                    return true;
            }
            if (def.rest && isTransforming$1(def.rest, ctx))
                return true;
            return false;
        }
        case "record": {
            return isTransforming$1(def.keyType, ctx) || isTransforming$1(def.valueType, ctx);
        }
        case "map": {
            return isTransforming$1(def.keyType, ctx) || isTransforming$1(def.valueType, ctx);
        }
        case "set": {
            return isTransforming$1(def.valueType, ctx);
        }
        // inner types
        case "promise":
        case "optional":
        case "nonoptional":
        case "nullable":
        case "readonly":
            return isTransforming$1(def.innerType, ctx);
        case "lazy":
            return isTransforming$1(def.getter(), ctx);
        case "default": {
            return isTransforming$1(def.innerType, ctx);
        }
        case "prefault": {
            return isTransforming$1(def.innerType, ctx);
        }
        case "custom": {
            return false;
        }
        case "transform": {
            return true;
        }
        case "pipe": {
            return isTransforming$1(def.in, ctx) || isTransforming$1(def.out, ctx);
        }
        case "success": {
            return false;
        }
        case "catch": {
            return false;
        }
        default:
            def;
    }
    throw new Error(`Unknown schema type: ${def.type}`);
}

const jsonSchema$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: 'Module' }));

function t(r,e){try{var o=r();}catch(r){return e(r)}return o&&o.then?o.then(void 0,e):o}function s(r,e){for(var n={};r.length;){var t=r[0],s=t.code,i=t.message,a=t.path.join(".");if(!n[a])if("unionErrors"in t){var u=t.unionErrors[0].errors[0];n[a]={message:u.message,type:u.code};}else n[a]={message:i,type:s};if("unionErrors"in t&&t.unionErrors.forEach(function(e){return e.errors.forEach(function(e){return r.push(e)})}),e){var c=n[a].types,f=c&&c[t.code];n[a]=appendErrors(a,e,n,s,f?[].concat(f,t.message):t.message);}r.shift();}return n}function i(r,e){for(var n={};r.length;){var t=r[0],s=t.code,i=t.message,a=t.path.join(".");if(!n[a])if("invalid_union"===t.code&&t.errors.length>0){var u=t.errors[0][0];n[a]={message:u.message,type:u.code};}else n[a]={message:i,type:s};if("invalid_union"===t.code&&t.errors.forEach(function(e){return e.forEach(function(e){return r.push(e)})}),e){var c=n[a].types,f=c&&c[t.code];n[a]=appendErrors(a,e,n,s,f?[].concat(f,t.message):t.message);}r.shift();}return n}function a(o$1,a,u){if(void 0===u&&(u={}),function(r){return "_def"in r&&"object"==typeof r._def&&"typeName"in r._def}(o$1))return function(n,i,c){try{return Promise.resolve(t(function(){return Promise.resolve(o$1["sync"===u.mode?"parse":"parseAsync"](n,a)).then(function(e){return c.shouldUseNativeValidation&&o({},c),{errors:{},values:u.raw?Object.assign({},n):e}})},function(r){if(function(r){return Array.isArray(null==r?void 0:r.issues)}(r))return {values:{},errors:s$1(s(r.errors,!c.shouldUseNativeValidation&&"all"===c.criteriaMode),c)};throw r}))}catch(r){return Promise.reject(r)}};if(function(r){return "_zod"in r&&"object"==typeof r._zod}(o$1))return function(s,c,f){try{return Promise.resolve(t(function(){return Promise.resolve(("sync"===u.mode?parse$2:parseAsync$2)(o$1,s,a)).then(function(e){return f.shouldUseNativeValidation&&o({},f),{errors:{},values:u.raw?Object.assign({},s):e}})},function(r){if(function(r){return r instanceof $ZodError$1}(r))return {values:{},errors:s$1(i(r.issues,!f.shouldUseNativeValidation&&"all"===f.criteriaMode),f)};throw r}))}catch(r){return Promise.reject(r)}};throw new Error("Invalid input: not a Zod schema")}

/** A special constant with type `never` */
const NEVER = Object.freeze({
    status: "aborted",
});
function $constructor(name, initializer, params) {
    function init(inst, def) {
        var _a;
        Object.defineProperty(inst, "_zod", {
            value: inst._zod ?? {},
            enumerable: false,
        });
        (_a = inst._zod).traits ?? (_a.traits = new Set());
        inst._zod.traits.add(name);
        initializer(inst, def);
        // support prototype modifications
        for (const k in _.prototype) {
            if (!(k in inst))
                Object.defineProperty(inst, k, { value: _.prototype[k].bind(inst) });
        }
        inst._zod.constr = _;
        inst._zod.def = def;
    }
    // doesn't work if Parent has a constructor with arguments
    const Parent = params?.Parent ?? Object;
    class Definition extends Parent {
    }
    Object.defineProperty(Definition, "name", { value: name });
    function _(def) {
        var _a;
        const inst = params?.Parent ? new Definition() : this;
        init(inst, def);
        (_a = inst._zod).deferred ?? (_a.deferred = []);
        for (const fn of inst._zod.deferred) {
            fn();
        }
        return inst;
    }
    Object.defineProperty(_, "init", { value: init });
    Object.defineProperty(_, Symbol.hasInstance, {
        value: (inst) => {
            if (params?.Parent && inst instanceof params.Parent)
                return true;
            return inst?._zod?.traits?.has(name);
        },
    });
    Object.defineProperty(_, "name", { value: name });
    return _;
}
//////////////////////////////   UTILITIES   ///////////////////////////////////////
const $brand = Symbol("zod_brand");
class $ZodAsyncError extends Error {
    constructor() {
        super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
    }
}
class $ZodEncodeError extends Error {
    constructor(name) {
        super(`Encountered unidirectional transform during encode: ${name}`);
        this.name = "ZodEncodeError";
    }
}
const globalConfig = {};
function config(newConfig) {
    if (newConfig)
        Object.assign(globalConfig, newConfig);
    return globalConfig;
}

// functions
function assertEqual(val) {
    return val;
}
function assertNotEqual(val) {
    return val;
}
function assertIs(_arg) { }
function assertNever(_x) {
    throw new Error();
}
function assert(_) { }
function getEnumValues(entries) {
    const numericValues = Object.values(entries).filter((v) => typeof v === "number");
    const values = Object.entries(entries)
        .filter(([k, _]) => numericValues.indexOf(+k) === -1)
        .map(([_, v]) => v);
    return values;
}
function joinValues(array, separator = "|") {
    return array.map((val) => stringifyPrimitive(val)).join(separator);
}
function jsonStringifyReplacer(_, value) {
    if (typeof value === "bigint")
        return value.toString();
    return value;
}
function cached(getter) {
    const set = false;
    return {
        get value() {
            if (!set) {
                const value = getter();
                Object.defineProperty(this, "value", { value });
                return value;
            }
            throw new Error("cached value already set");
        },
    };
}
function nullish$1(input) {
    return input === null || input === undefined;
}
function cleanRegex(source) {
    const start = source.startsWith("^") ? 1 : 0;
    const end = source.endsWith("$") ? source.length - 1 : source.length;
    return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
    const valDecCount = (val.toString().split(".")[1] || "").length;
    const stepString = step.toString();
    let stepDecCount = (stepString.split(".")[1] || "").length;
    if (stepDecCount === 0 && /\d?e-\d?/.test(stepString)) {
        const match = stepString.match(/\d?e-(\d?)/);
        if (match?.[1]) {
            stepDecCount = Number.parseInt(match[1]);
        }
    }
    const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
    const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
    return (valInt % stepInt) / 10 ** decCount;
}
const EVALUATING = Symbol("evaluating");
function defineLazy(object, key, getter) {
    let value = undefined;
    Object.defineProperty(object, key, {
        get() {
            if (value === EVALUATING) {
                // Circular reference detected, return undefined to break the cycle
                return undefined;
            }
            if (value === undefined) {
                value = EVALUATING;
                value = getter();
            }
            return value;
        },
        set(v) {
            Object.defineProperty(object, key, {
                value: v,
                // configurable: true,
            });
            // object[key] = v;
        },
        configurable: true,
    });
}
function objectClone(obj) {
    return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
}
function assignProp(target, prop, value) {
    Object.defineProperty(target, prop, {
        value,
        writable: true,
        enumerable: true,
        configurable: true,
    });
}
function mergeDefs(...defs) {
    const mergedDescriptors = {};
    for (const def of defs) {
        const descriptors = Object.getOwnPropertyDescriptors(def);
        Object.assign(mergedDescriptors, descriptors);
    }
    return Object.defineProperties({}, mergedDescriptors);
}
function cloneDef(schema) {
    return mergeDefs(schema._zod.def);
}
function getElementAtPath(obj, path) {
    if (!path)
        return obj;
    return path.reduce((acc, key) => acc?.[key], obj);
}
function promiseAllObject(promisesObj) {
    const keys = Object.keys(promisesObj);
    const promises = keys.map((key) => promisesObj[key]);
    return Promise.all(promises).then((results) => {
        const resolvedObj = {};
        for (let i = 0; i < keys.length; i++) {
            resolvedObj[keys[i]] = results[i];
        }
        return resolvedObj;
    });
}
function randomString(length = 10) {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    let str = "";
    for (let i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}
function esc(str) {
    return JSON.stringify(str);
}
const captureStackTrace = ("captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => { });
function isObject(data) {
    return typeof data === "object" && data !== null && !Array.isArray(data);
}
const allowsEval = cached(() => {
    // @ts-ignore
    if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
        return false;
    }
    try {
        const F = Function;
        new F("");
        return true;
    }
    catch (_) {
        return false;
    }
});
function isPlainObject(o) {
    if (isObject(o) === false)
        return false;
    // modified constructor
    const ctor = o.constructor;
    if (ctor === undefined)
        return true;
    // modified prototype
    const prot = ctor.prototype;
    if (isObject(prot) === false)
        return false;
    // ctor doesn't have static `isPrototypeOf`
    if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
        return false;
    }
    return true;
}
function shallowClone(o) {
    if (isPlainObject(o))
        return { ...o };
    if (Array.isArray(o))
        return [...o];
    return o;
}
function numKeys(data) {
    let keyCount = 0;
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            keyCount++;
        }
    }
    return keyCount;
}
const getParsedType = (data) => {
    const t = typeof data;
    switch (t) {
        case "undefined":
            return "undefined";
        case "string":
            return "string";
        case "number":
            return Number.isNaN(data) ? "nan" : "number";
        case "boolean":
            return "boolean";
        case "function":
            return "function";
        case "bigint":
            return "bigint";
        case "symbol":
            return "symbol";
        case "object":
            if (Array.isArray(data)) {
                return "array";
            }
            if (data === null) {
                return "null";
            }
            if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
                return "promise";
            }
            if (typeof Map !== "undefined" && data instanceof Map) {
                return "map";
            }
            if (typeof Set !== "undefined" && data instanceof Set) {
                return "set";
            }
            if (typeof Date !== "undefined" && data instanceof Date) {
                return "date";
            }
            // @ts-ignore
            if (typeof File !== "undefined" && data instanceof File) {
                return "file";
            }
            return "object";
        default:
            throw new Error(`Unknown data type: ${t}`);
    }
};
const propertyKeyTypes = new Set(["string", "number", "symbol"]);
const primitiveTypes = new Set(["string", "number", "bigint", "boolean", "symbol", "undefined"]);
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
// zod-specific utils
function clone(inst, def, params) {
    const cl = new inst._zod.constr(def ?? inst._zod.def);
    if (!def || params?.parent)
        cl._zod.parent = inst;
    return cl;
}
function normalizeParams(_params) {
    const params = _params;
    if (!params)
        return {};
    if (typeof params === "string")
        return { error: () => params };
    if (params?.message !== undefined) {
        if (params?.error !== undefined)
            throw new Error("Cannot specify both `message` and `error` params");
        params.error = params.message;
    }
    delete params.message;
    if (typeof params.error === "string")
        return { ...params, error: () => params.error };
    return params;
}
function createTransparentProxy(getter) {
    let target;
    return new Proxy({}, {
        get(_, prop, receiver) {
            target ?? (target = getter());
            return Reflect.get(target, prop, receiver);
        },
        set(_, prop, value, receiver) {
            target ?? (target = getter());
            return Reflect.set(target, prop, value, receiver);
        },
        has(_, prop) {
            target ?? (target = getter());
            return Reflect.has(target, prop);
        },
        deleteProperty(_, prop) {
            target ?? (target = getter());
            return Reflect.deleteProperty(target, prop);
        },
        ownKeys(_) {
            target ?? (target = getter());
            return Reflect.ownKeys(target);
        },
        getOwnPropertyDescriptor(_, prop) {
            target ?? (target = getter());
            return Reflect.getOwnPropertyDescriptor(target, prop);
        },
        defineProperty(_, prop, descriptor) {
            target ?? (target = getter());
            return Reflect.defineProperty(target, prop, descriptor);
        },
    });
}
function stringifyPrimitive(value) {
    if (typeof value === "bigint")
        return value.toString() + "n";
    if (typeof value === "string")
        return `"${value}"`;
    return `${value}`;
}
function optionalKeys(shape) {
    return Object.keys(shape).filter((k) => {
        return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
    });
}
const NUMBER_FORMAT_RANGES = {
    safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
    int32: [-2147483648, 2147483647],
    uint32: [0, 4294967295],
    float32: [-3.4028234663852886e38, 3.4028234663852886e38],
    float64: [-Number.MAX_VALUE, Number.MAX_VALUE],
};
const BIGINT_FORMAT_RANGES = {
    int64: [/* @__PURE__*/ BigInt("-9223372036854775808"), /* @__PURE__*/ BigInt("9223372036854775807")],
    uint64: [/* @__PURE__*/ BigInt(0), /* @__PURE__*/ BigInt("18446744073709551615")],
};
function pick(schema, mask) {
    const currDef = schema._zod.def;
    const def = mergeDefs(schema._zod.def, {
        get shape() {
            const newShape = {};
            for (const key in mask) {
                if (!(key in currDef.shape)) {
                    throw new Error(`Unrecognized key: "${key}"`);
                }
                if (!mask[key])
                    continue;
                newShape[key] = currDef.shape[key];
            }
            assignProp(this, "shape", newShape); // self-caching
            return newShape;
        },
        checks: [],
    });
    return clone(schema, def);
}
function omit(schema, mask) {
    const currDef = schema._zod.def;
    const def = mergeDefs(schema._zod.def, {
        get shape() {
            const newShape = { ...schema._zod.def.shape };
            for (const key in mask) {
                if (!(key in currDef.shape)) {
                    throw new Error(`Unrecognized key: "${key}"`);
                }
                if (!mask[key])
                    continue;
                delete newShape[key];
            }
            assignProp(this, "shape", newShape); // self-caching
            return newShape;
        },
        checks: [],
    });
    return clone(schema, def);
}
function extend(schema, shape) {
    if (!isPlainObject(shape)) {
        throw new Error("Invalid input to extend: expected a plain object");
    }
    const checks = schema._zod.def.checks;
    const hasChecks = checks && checks.length > 0;
    if (hasChecks) {
        throw new Error("Object schemas containing refinements cannot be extended. Use `.safeExtend()` instead.");
    }
    const def = mergeDefs(schema._zod.def, {
        get shape() {
            const _shape = { ...schema._zod.def.shape, ...shape };
            assignProp(this, "shape", _shape); // self-caching
            return _shape;
        },
        checks: [],
    });
    return clone(schema, def);
}
function safeExtend(schema, shape) {
    if (!isPlainObject(shape)) {
        throw new Error("Invalid input to safeExtend: expected a plain object");
    }
    const def = {
        ...schema._zod.def,
        get shape() {
            const _shape = { ...schema._zod.def.shape, ...shape };
            assignProp(this, "shape", _shape); // self-caching
            return _shape;
        },
        checks: schema._zod.def.checks,
    };
    return clone(schema, def);
}
function merge(a, b) {
    const def = mergeDefs(a._zod.def, {
        get shape() {
            const _shape = { ...a._zod.def.shape, ...b._zod.def.shape };
            assignProp(this, "shape", _shape); // self-caching
            return _shape;
        },
        get catchall() {
            return b._zod.def.catchall;
        },
        checks: [], // delete existing checks
    });
    return clone(a, def);
}
function partial(Class, schema, mask) {
    const def = mergeDefs(schema._zod.def, {
        get shape() {
            const oldShape = schema._zod.def.shape;
            const shape = { ...oldShape };
            if (mask) {
                for (const key in mask) {
                    if (!(key in oldShape)) {
                        throw new Error(`Unrecognized key: "${key}"`);
                    }
                    if (!mask[key])
                        continue;
                    // if (oldShape[key]!._zod.optin === "optional") continue;
                    shape[key] = Class
                        ? new Class({
                            type: "optional",
                            innerType: oldShape[key],
                        })
                        : oldShape[key];
                }
            }
            else {
                for (const key in oldShape) {
                    // if (oldShape[key]!._zod.optin === "optional") continue;
                    shape[key] = Class
                        ? new Class({
                            type: "optional",
                            innerType: oldShape[key],
                        })
                        : oldShape[key];
                }
            }
            assignProp(this, "shape", shape); // self-caching
            return shape;
        },
        checks: [],
    });
    return clone(schema, def);
}
function required(Class, schema, mask) {
    const def = mergeDefs(schema._zod.def, {
        get shape() {
            const oldShape = schema._zod.def.shape;
            const shape = { ...oldShape };
            if (mask) {
                for (const key in mask) {
                    if (!(key in shape)) {
                        throw new Error(`Unrecognized key: "${key}"`);
                    }
                    if (!mask[key])
                        continue;
                    // overwrite with non-optional
                    shape[key] = new Class({
                        type: "nonoptional",
                        innerType: oldShape[key],
                    });
                }
            }
            else {
                for (const key in oldShape) {
                    // overwrite with non-optional
                    shape[key] = new Class({
                        type: "nonoptional",
                        innerType: oldShape[key],
                    });
                }
            }
            assignProp(this, "shape", shape); // self-caching
            return shape;
        },
        checks: [],
    });
    return clone(schema, def);
}
// invalid_type | too_big | too_small | invalid_format | not_multiple_of | unrecognized_keys | invalid_union | invalid_key | invalid_element | invalid_value | custom
function aborted(x, startIndex = 0) {
    if (x.aborted === true)
        return true;
    for (let i = startIndex; i < x.issues.length; i++) {
        if (x.issues[i]?.continue !== true) {
            return true;
        }
    }
    return false;
}
function prefixIssues(path, issues) {
    return issues.map((iss) => {
        var _a;
        (_a = iss).path ?? (_a.path = []);
        iss.path.unshift(path);
        return iss;
    });
}
function unwrapMessage(message) {
    return typeof message === "string" ? message : message?.message;
}
function finalizeIssue(iss, ctx, config) {
    const full = { ...iss, path: iss.path ?? [] };
    // for backwards compatibility
    if (!iss.message) {
        const message = unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ??
            unwrapMessage(ctx?.error?.(iss)) ??
            unwrapMessage(config.customError?.(iss)) ??
            unwrapMessage(config.localeError?.(iss)) ??
            "Invalid input";
        full.message = message;
    }
    // delete (full as any).def;
    delete full.inst;
    delete full.continue;
    if (!ctx?.reportInput) {
        delete full.input;
    }
    return full;
}
function getSizableOrigin(input) {
    if (input instanceof Set)
        return "set";
    if (input instanceof Map)
        return "map";
    // @ts-ignore
    if (input instanceof File)
        return "file";
    return "unknown";
}
function getLengthableOrigin(input) {
    if (Array.isArray(input))
        return "array";
    if (typeof input === "string")
        return "string";
    return "unknown";
}
function issue(...args) {
    const [iss, input, inst] = args;
    if (typeof iss === "string") {
        return {
            message: iss,
            code: "custom",
            input,
            inst,
        };
    }
    return { ...iss };
}
function cleanEnum(obj) {
    return Object.entries(obj)
        .filter(([k, _]) => {
        // return true if NaN, meaning it's not a number, thus a string key
        return Number.isNaN(Number.parseInt(k, 10));
    })
        .map((el) => el[1]);
}
// Codec utility functions
function base64ToUint8Array(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}
function uint8ArrayToBase64(bytes) {
    let binaryString = "";
    for (let i = 0; i < bytes.length; i++) {
        binaryString += String.fromCharCode(bytes[i]);
    }
    return btoa(binaryString);
}
function base64urlToUint8Array(base64url) {
    const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (base64.length % 4)) % 4);
    return base64ToUint8Array(base64 + padding);
}
function uint8ArrayToBase64url(bytes) {
    return uint8ArrayToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function hexToUint8Array(hex) {
    const cleanHex = hex.replace(/^0x/, "");
    if (cleanHex.length % 2 !== 0) {
        throw new Error("Invalid hex string length");
    }
    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < cleanHex.length; i += 2) {
        bytes[i / 2] = Number.parseInt(cleanHex.slice(i, i + 2), 16);
    }
    return bytes;
}
function uint8ArrayToHex(bytes) {
    return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}
// instanceof
class Class {
    constructor(..._args) { }
}

const util$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  BIGINT_FORMAT_RANGES,
  Class,
  NUMBER_FORMAT_RANGES,
  aborted,
  allowsEval,
  assert,
  assertEqual,
  assertIs,
  assertNever,
  assertNotEqual,
  assignProp,
  base64ToUint8Array,
  base64urlToUint8Array,
  cached,
  captureStackTrace,
  cleanEnum,
  cleanRegex,
  clone,
  cloneDef,
  createTransparentProxy,
  defineLazy,
  esc,
  escapeRegex,
  extend,
  finalizeIssue,
  floatSafeRemainder,
  getElementAtPath,
  getEnumValues,
  getLengthableOrigin,
  getParsedType,
  getSizableOrigin,
  hexToUint8Array,
  isObject,
  isPlainObject,
  issue,
  joinValues,
  jsonStringifyReplacer,
  merge,
  mergeDefs,
  normalizeParams,
  nullish: nullish$1,
  numKeys,
  objectClone,
  omit,
  optionalKeys,
  partial,
  pick,
  prefixIssues,
  primitiveTypes,
  promiseAllObject,
  propertyKeyTypes,
  randomString,
  required,
  safeExtend,
  shallowClone,
  stringifyPrimitive,
  uint8ArrayToBase64,
  uint8ArrayToBase64url,
  uint8ArrayToHex,
  unwrapMessage
}, Symbol.toStringTag, { value: 'Module' }));

const initializer$1 = (inst, def) => {
    inst.name = "$ZodError";
    Object.defineProperty(inst, "_zod", {
        value: inst._zod,
        enumerable: false,
    });
    Object.defineProperty(inst, "issues", {
        value: def,
        enumerable: false,
    });
    inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
    Object.defineProperty(inst, "toString", {
        value: () => inst.message,
        enumerable: false,
    });
};
const $ZodError = $constructor("$ZodError", initializer$1);
const $ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
function flattenError(error, mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of error.issues) {
        if (sub.path.length > 0) {
            fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
            fieldErrors[sub.path[0]].push(mapper(sub));
        }
        else {
            formErrors.push(mapper(sub));
        }
    }
    return { formErrors, fieldErrors };
}
function formatError(error, mapper = (issue) => issue.message) {
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
        for (const issue of error.issues) {
            if (issue.code === "invalid_union" && issue.errors.length) {
                issue.errors.map((issues) => processError({ issues }));
            }
            else if (issue.code === "invalid_key") {
                processError({ issues: issue.issues });
            }
            else if (issue.code === "invalid_element") {
                processError({ issues: issue.issues });
            }
            else if (issue.path.length === 0) {
                fieldErrors._errors.push(mapper(issue));
            }
            else {
                let curr = fieldErrors;
                let i = 0;
                while (i < issue.path.length) {
                    const el = issue.path[i];
                    const terminal = i === issue.path.length - 1;
                    if (!terminal) {
                        curr[el] = curr[el] || { _errors: [] };
                    }
                    else {
                        curr[el] = curr[el] || { _errors: [] };
                        curr[el]._errors.push(mapper(issue));
                    }
                    curr = curr[el];
                    i++;
                }
            }
        }
    };
    processError(error);
    return fieldErrors;
}
function treeifyError(error, mapper = (issue) => issue.message) {
    const result = { errors: [] };
    const processError = (error, path = []) => {
        var _a, _b;
        for (const issue of error.issues) {
            if (issue.code === "invalid_union" && issue.errors.length) {
                // regular union error
                issue.errors.map((issues) => processError({ issues }, issue.path));
            }
            else if (issue.code === "invalid_key") {
                processError({ issues: issue.issues }, issue.path);
            }
            else if (issue.code === "invalid_element") {
                processError({ issues: issue.issues }, issue.path);
            }
            else {
                const fullpath = [...path, ...issue.path];
                if (fullpath.length === 0) {
                    result.errors.push(mapper(issue));
                    continue;
                }
                let curr = result;
                let i = 0;
                while (i < fullpath.length) {
                    const el = fullpath[i];
                    const terminal = i === fullpath.length - 1;
                    if (typeof el === "string") {
                        curr.properties ?? (curr.properties = {});
                        (_a = curr.properties)[el] ?? (_a[el] = { errors: [] });
                        curr = curr.properties[el];
                    }
                    else {
                        curr.items ?? (curr.items = []);
                        (_b = curr.items)[el] ?? (_b[el] = { errors: [] });
                        curr = curr.items[el];
                    }
                    if (terminal) {
                        curr.errors.push(mapper(issue));
                    }
                    i++;
                }
            }
        }
    };
    processError(error);
    return result;
}
/** Format a ZodError as a human-readable string in the following form.
 *
 * From
 *
 * ```ts
 * ZodError {
 *   issues: [
 *     {
 *       expected: 'string',
 *       code: 'invalid_type',
 *       path: [ 'username' ],
 *       message: 'Invalid input: expected string'
 *     },
 *     {
 *       expected: 'number',
 *       code: 'invalid_type',
 *       path: [ 'favoriteNumbers', 1 ],
 *       message: 'Invalid input: expected number'
 *     }
 *   ];
 * }
 * ```
 *
 * to
 *
 * ```
 * username
 *   ✖ Expected number, received string at "username
 * favoriteNumbers[0]
 *   ✖ Invalid input: expected number
 * ```
 */
function toDotPath(_path) {
    const segs = [];
    const path = _path.map((seg) => (typeof seg === "object" ? seg.key : seg));
    for (const seg of path) {
        if (typeof seg === "number")
            segs.push(`[${seg}]`);
        else if (typeof seg === "symbol")
            segs.push(`[${JSON.stringify(String(seg))}]`);
        else if (/[^\w$]/.test(seg))
            segs.push(`[${JSON.stringify(seg)}]`);
        else {
            if (segs.length)
                segs.push(".");
            segs.push(seg);
        }
    }
    return segs.join("");
}
function prettifyError(error) {
    const lines = [];
    // sort by path length
    const issues = [...error.issues].sort((a, b) => (a.path ?? []).length - (b.path ?? []).length);
    // Process each issue
    for (const issue of issues) {
        lines.push(`✖ ${issue.message}`);
        if (issue.path?.length)
            lines.push(`  → at ${toDotPath(issue.path)}`);
    }
    // Convert Map to formatted string
    return lines.join("\n");
}

const _parse = (_Err) => (schema, value, _ctx, _params) => {
    const ctx = _ctx ? Object.assign(_ctx, { async: false }) : { async: false };
    const result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise) {
        throw new $ZodAsyncError();
    }
    if (result.issues.length) {
        const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
        captureStackTrace(e, _params?.callee);
        throw e;
    }
    return result.value;
};
const parse$1 = /* @__PURE__*/ _parse($ZodRealError);
const _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
    const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
    let result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise)
        result = await result;
    if (result.issues.length) {
        const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
        captureStackTrace(e, params?.callee);
        throw e;
    }
    return result.value;
};
const parseAsync$1 = /* @__PURE__*/ _parseAsync($ZodRealError);
const _safeParse = (_Err) => (schema, value, _ctx) => {
    const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
    const result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise) {
        throw new $ZodAsyncError();
    }
    return result.issues.length
        ? {
            success: false,
            error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config()))),
        }
        : { success: true, data: result.value };
};
const safeParse$1 = /* @__PURE__*/ _safeParse($ZodRealError);
const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
    const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
    let result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise)
        result = await result;
    return result.issues.length
        ? {
            success: false,
            error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config()))),
        }
        : { success: true, data: result.value };
};
const safeParseAsync$1 = /* @__PURE__*/ _safeParseAsync($ZodRealError);
const _encode = (_Err) => (schema, value, _ctx) => {
    const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
    return _parse(_Err)(schema, value, ctx);
};
const encode$1 = /* @__PURE__*/ _encode($ZodRealError);
const _decode = (_Err) => (schema, value, _ctx) => {
    return _parse(_Err)(schema, value, _ctx);
};
const decode$1 = /* @__PURE__*/ _decode($ZodRealError);
const _encodeAsync = (_Err) => async (schema, value, _ctx) => {
    const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
    return _parseAsync(_Err)(schema, value, ctx);
};
const encodeAsync$1 = /* @__PURE__*/ _encodeAsync($ZodRealError);
const _decodeAsync = (_Err) => async (schema, value, _ctx) => {
    return _parseAsync(_Err)(schema, value, _ctx);
};
const decodeAsync$1 = /* @__PURE__*/ _decodeAsync($ZodRealError);
const _safeEncode = (_Err) => (schema, value, _ctx) => {
    const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
    return _safeParse(_Err)(schema, value, ctx);
};
const safeEncode$1 = /* @__PURE__*/ _safeEncode($ZodRealError);
const _safeDecode = (_Err) => (schema, value, _ctx) => {
    return _safeParse(_Err)(schema, value, _ctx);
};
const safeDecode$1 = /* @__PURE__*/ _safeDecode($ZodRealError);
const _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
    const ctx = _ctx ? Object.assign(_ctx, { direction: "backward" }) : { direction: "backward" };
    return _safeParseAsync(_Err)(schema, value, ctx);
};
const safeEncodeAsync$1 = /* @__PURE__*/ _safeEncodeAsync($ZodRealError);
const _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
    return _safeParseAsync(_Err)(schema, value, _ctx);
};
const safeDecodeAsync$1 = /* @__PURE__*/ _safeDecodeAsync($ZodRealError);

const cuid$1 = /^[cC][^\s-]{8,}$/;
const cuid2$1 = /^[0-9a-z]+$/;
const ulid$1 = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
const xid$1 = /^[0-9a-vA-V]{20}$/;
const ksuid$1 = /^[A-Za-z0-9]{27}$/;
const nanoid$1 = /^[a-zA-Z0-9_-]{21}$/;
/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
const duration$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
/** Implements ISO 8601-2 extensions like explicit +- prefixes, mixing weeks with other units, and fractional/negative components. */
const extendedDuration = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
const guid$1 = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
/** Returns a regex for validating an RFC 9562/4122 UUID.
 *
 * @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
const uuid$1 = (version) => {
    if (!version)
        return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
    return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
const uuid4 = /*@__PURE__*/ uuid$1(4);
const uuid6 = /*@__PURE__*/ uuid$1(6);
const uuid7 = /*@__PURE__*/ uuid$1(7);
/** Practical email validation */
const email$1 = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
/** Equivalent to the HTML5 input[type=email] validation implemented by browsers. Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email */
const html5Email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
/** The classic emailregex.com regex for RFC 5322-compliant emails */
const rfc5322Email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
/** A loose regex that allows Unicode characters, enforces length limits, and that's about it. */
const unicodeEmail = /^[^\s@"]{1,64}@[^\s@]{1,255}$/u;
const idnEmail = unicodeEmail;
const browserEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
// from https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression
const _emoji$1 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
function emoji$1() {
    return new RegExp(_emoji$1, "u");
}
const ipv4$1 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv6$1 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
const cidrv4$1 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
const cidrv6$1 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
// https://stackoverflow.com/questions/7860392/determine-if-string-is-in-base64-using-javascript
const base64$1 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
const base64url$1 = /^[A-Za-z0-9_-]*$/;
// based on https://stackoverflow.com/questions/106179/regular-expression-to-match-dns-hostname-or-ip-address
// export const hostname: RegExp = /^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+$/;
const hostname$1 = /^(?=.{1,253}\.?$)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[-0-9a-zA-Z]{0,61}[0-9a-zA-Z])?)*\.?$/;
const domain = /^([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
// https://blog.stevenlevithan.com/archives/validate-phone-number#r4-3 (regex sans spaces)
const e164$1 = /^\+(?:[0-9]){6,14}[0-9]$/;
// const dateSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
const date$3 = /*@__PURE__*/ new RegExp(`^${dateSource}$`);
function timeSource(args) {
    const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
    const regex = typeof args.precision === "number"
        ? args.precision === -1
            ? `${hhmm}`
            : args.precision === 0
                ? `${hhmm}:[0-5]\\d`
                : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}`
        : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
    return regex;
}
function time$1(args) {
    return new RegExp(`^${timeSource(args)}$`);
}
// Adapted from https://stackoverflow.com/a/3143231
function datetime$1(args) {
    const time = timeSource({ precision: args.precision });
    const opts = ["Z"];
    if (args.local)
        opts.push("");
    // if (args.offset) opts.push(`([+-]\\d{2}:\\d{2})`);
    if (args.offset)
        opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
    const timeRegex = `${time}(?:${opts.join("|")})`;
    return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
const string$2 = (params) => {
    const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
    return new RegExp(`^${regex}$`);
};
const bigint$2 = /^-?\d+n?$/;
const integer = /^-?\d+$/;
const number$2 = /^-?\d+(?:\.\d+)?/;
const boolean$2 = /^(?:true|false)$/i;
const _null$2 = /^null$/i;
const _undefined$2 = /^undefined$/i;
// regex for string with no uppercase letters
const lowercase = /^[^A-Z]*$/;
// regex for string with no lowercase letters
const uppercase = /^[^a-z]*$/;
// regex for hexadecimal strings (any length)
const hex$1 = /^[0-9a-fA-F]*$/;
// Hash regexes for different algorithms and encodings
// Helper function to create base64 regex with exact length and padding
function fixedBase64(bodyLength, padding) {
    return new RegExp(`^[A-Za-z0-9+/]{${bodyLength}}${padding}$`);
}
// Helper function to create base64url regex with exact length (no padding)
function fixedBase64url(length) {
    return new RegExp(`^[A-Za-z0-9_-]{${length}}$`);
}
// MD5 (16 bytes): base64 = 24 chars total (22 + "==")
const md5_hex = /^[0-9a-fA-F]{32}$/;
const md5_base64 = /*@__PURE__*/ fixedBase64(22, "==");
const md5_base64url = /*@__PURE__*/ fixedBase64url(22);
// SHA1 (20 bytes): base64 = 28 chars total (27 + "=")
const sha1_hex = /^[0-9a-fA-F]{40}$/;
const sha1_base64 = /*@__PURE__*/ fixedBase64(27, "=");
const sha1_base64url = /*@__PURE__*/ fixedBase64url(27);
// SHA256 (32 bytes): base64 = 44 chars total (43 + "=")
const sha256_hex = /^[0-9a-fA-F]{64}$/;
const sha256_base64 = /*@__PURE__*/ fixedBase64(43, "=");
const sha256_base64url = /*@__PURE__*/ fixedBase64url(43);
// SHA384 (48 bytes): base64 = 64 chars total (no padding)
const sha384_hex = /^[0-9a-fA-F]{96}$/;
const sha384_base64 = /*@__PURE__*/ fixedBase64(64, "");
const sha384_base64url = /*@__PURE__*/ fixedBase64url(64);
// SHA512 (64 bytes): base64 = 88 chars total (86 + "==")
const sha512_hex = /^[0-9a-fA-F]{128}$/;
const sha512_base64 = /*@__PURE__*/ fixedBase64(86, "==");
const sha512_base64url = /*@__PURE__*/ fixedBase64url(86);

const regexes$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  base64: base64$1,
  base64url: base64url$1,
  bigint: bigint$2,
  boolean: boolean$2,
  browserEmail,
  cidrv4: cidrv4$1,
  cidrv6: cidrv6$1,
  cuid: cuid$1,
  cuid2: cuid2$1,
  date: date$3,
  datetime: datetime$1,
  domain,
  duration: duration$1,
  e164: e164$1,
  email: email$1,
  emoji: emoji$1,
  extendedDuration,
  guid: guid$1,
  hex: hex$1,
  hostname: hostname$1,
  html5Email,
  idnEmail,
  integer,
  ipv4: ipv4$1,
  ipv6: ipv6$1,
  ksuid: ksuid$1,
  lowercase,
  md5_base64,
  md5_base64url,
  md5_hex,
  nanoid: nanoid$1,
  null: _null$2,
  number: number$2,
  rfc5322Email,
  sha1_base64,
  sha1_base64url,
  sha1_hex,
  sha256_base64,
  sha256_base64url,
  sha256_hex,
  sha384_base64,
  sha384_base64url,
  sha384_hex,
  sha512_base64,
  sha512_base64url,
  sha512_hex,
  string: string$2,
  time: time$1,
  ulid: ulid$1,
  undefined: _undefined$2,
  unicodeEmail,
  uppercase,
  uuid: uuid$1,
  uuid4,
  uuid6,
  uuid7,
  xid: xid$1
}, Symbol.toStringTag, { value: 'Module' }));

// import { $ZodType } from "./schemas.js";
const $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
    var _a;
    inst._zod ?? (inst._zod = {});
    inst._zod.def = def;
    (_a = inst._zod).onattach ?? (_a.onattach = []);
});
const numericOriginMap = {
    number: "number",
    bigint: "bigint",
    object: "date",
};
const $ZodCheckLessThan = /*@__PURE__*/ $constructor("$ZodCheckLessThan", (inst, def) => {
    $ZodCheck.init(inst, def);
    const origin = numericOriginMap[typeof def.value];
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
        if (def.value < curr) {
            if (def.inclusive)
                bag.maximum = def.value;
            else
                bag.exclusiveMaximum = def.value;
        }
    });
    inst._zod.check = (payload) => {
        if (def.inclusive ? payload.value <= def.value : payload.value < def.value) {
            return;
        }
        payload.issues.push({
            origin,
            code: "too_big",
            maximum: def.value,
            input: payload.value,
            inclusive: def.inclusive,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckGreaterThan = /*@__PURE__*/ $constructor("$ZodCheckGreaterThan", (inst, def) => {
    $ZodCheck.init(inst, def);
    const origin = numericOriginMap[typeof def.value];
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
        if (def.value > curr) {
            if (def.inclusive)
                bag.minimum = def.value;
            else
                bag.exclusiveMinimum = def.value;
        }
    });
    inst._zod.check = (payload) => {
        if (def.inclusive ? payload.value >= def.value : payload.value > def.value) {
            return;
        }
        payload.issues.push({
            origin,
            code: "too_small",
            minimum: def.value,
            input: payload.value,
            inclusive: def.inclusive,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckMultipleOf = 
/*@__PURE__*/ $constructor("$ZodCheckMultipleOf", (inst, def) => {
    $ZodCheck.init(inst, def);
    inst._zod.onattach.push((inst) => {
        var _a;
        (_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
    });
    inst._zod.check = (payload) => {
        if (typeof payload.value !== typeof def.value)
            throw new Error("Cannot mix number and bigint in multiple_of check.");
        const isMultiple = typeof payload.value === "bigint"
            ? payload.value % def.value === BigInt(0)
            : floatSafeRemainder(payload.value, def.value) === 0;
        if (isMultiple)
            return;
        payload.issues.push({
            origin: typeof payload.value,
            code: "not_multiple_of",
            divisor: def.value,
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckNumberFormat = /*@__PURE__*/ $constructor("$ZodCheckNumberFormat", (inst, def) => {
    $ZodCheck.init(inst, def); // no format checks
    def.format = def.format || "float64";
    const isInt = def.format?.includes("int");
    const origin = isInt ? "int" : "number";
    const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.format = def.format;
        bag.minimum = minimum;
        bag.maximum = maximum;
        if (isInt)
            bag.pattern = integer;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        if (isInt) {
            if (!Number.isInteger(input)) {
                // invalid_format issue
                // payload.issues.push({
                //   expected: def.format,
                //   format: def.format,
                //   code: "invalid_format",
                //   input,
                //   inst,
                // });
                // invalid_type issue
                payload.issues.push({
                    expected: origin,
                    format: def.format,
                    code: "invalid_type",
                    continue: false,
                    input,
                    inst,
                });
                return;
                // not_multiple_of issue
                // payload.issues.push({
                //   code: "not_multiple_of",
                //   origin: "number",
                //   input,
                //   inst,
                //   divisor: 1,
                // });
            }
            if (!Number.isSafeInteger(input)) {
                if (input > 0) {
                    // too_big
                    payload.issues.push({
                        input,
                        code: "too_big",
                        maximum: Number.MAX_SAFE_INTEGER,
                        note: "Integers must be within the safe integer range.",
                        inst,
                        origin,
                        continue: !def.abort,
                    });
                }
                else {
                    // too_small
                    payload.issues.push({
                        input,
                        code: "too_small",
                        minimum: Number.MIN_SAFE_INTEGER,
                        note: "Integers must be within the safe integer range.",
                        inst,
                        origin,
                        continue: !def.abort,
                    });
                }
                return;
            }
        }
        if (input < minimum) {
            payload.issues.push({
                origin: "number",
                input,
                code: "too_small",
                minimum,
                inclusive: true,
                inst,
                continue: !def.abort,
            });
        }
        if (input > maximum) {
            payload.issues.push({
                origin: "number",
                input,
                code: "too_big",
                maximum,
                inst,
            });
        }
    };
});
const $ZodCheckBigIntFormat = /*@__PURE__*/ $constructor("$ZodCheckBigIntFormat", (inst, def) => {
    $ZodCheck.init(inst, def); // no format checks
    const [minimum, maximum] = BIGINT_FORMAT_RANGES[def.format];
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.format = def.format;
        bag.minimum = minimum;
        bag.maximum = maximum;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        if (input < minimum) {
            payload.issues.push({
                origin: "bigint",
                input,
                code: "too_small",
                minimum: minimum,
                inclusive: true,
                inst,
                continue: !def.abort,
            });
        }
        if (input > maximum) {
            payload.issues.push({
                origin: "bigint",
                input,
                code: "too_big",
                maximum,
                inst,
            });
        }
    };
});
const $ZodCheckMaxSize = /*@__PURE__*/ $constructor("$ZodCheckMaxSize", (inst, def) => {
    var _a;
    $ZodCheck.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !nullish$1(val) && val.size !== undefined;
    });
    inst._zod.onattach.push((inst) => {
        const curr = (inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY);
        if (def.maximum < curr)
            inst._zod.bag.maximum = def.maximum;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        const size = input.size;
        if (size <= def.maximum)
            return;
        payload.issues.push({
            origin: getSizableOrigin(input),
            code: "too_big",
            maximum: def.maximum,
            inclusive: true,
            input,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckMinSize = /*@__PURE__*/ $constructor("$ZodCheckMinSize", (inst, def) => {
    var _a;
    $ZodCheck.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !nullish$1(val) && val.size !== undefined;
    });
    inst._zod.onattach.push((inst) => {
        const curr = (inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY);
        if (def.minimum > curr)
            inst._zod.bag.minimum = def.minimum;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        const size = input.size;
        if (size >= def.minimum)
            return;
        payload.issues.push({
            origin: getSizableOrigin(input),
            code: "too_small",
            minimum: def.minimum,
            inclusive: true,
            input,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckSizeEquals = /*@__PURE__*/ $constructor("$ZodCheckSizeEquals", (inst, def) => {
    var _a;
    $ZodCheck.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !nullish$1(val) && val.size !== undefined;
    });
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.minimum = def.size;
        bag.maximum = def.size;
        bag.size = def.size;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        const size = input.size;
        if (size === def.size)
            return;
        const tooBig = size > def.size;
        payload.issues.push({
            origin: getSizableOrigin(input),
            ...(tooBig ? { code: "too_big", maximum: def.size } : { code: "too_small", minimum: def.size }),
            inclusive: true,
            exact: true,
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckMaxLength = /*@__PURE__*/ $constructor("$ZodCheckMaxLength", (inst, def) => {
    var _a;
    $ZodCheck.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !nullish$1(val) && val.length !== undefined;
    });
    inst._zod.onattach.push((inst) => {
        const curr = (inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY);
        if (def.maximum < curr)
            inst._zod.bag.maximum = def.maximum;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        const length = input.length;
        if (length <= def.maximum)
            return;
        const origin = getLengthableOrigin(input);
        payload.issues.push({
            origin,
            code: "too_big",
            maximum: def.maximum,
            inclusive: true,
            input,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckMinLength = /*@__PURE__*/ $constructor("$ZodCheckMinLength", (inst, def) => {
    var _a;
    $ZodCheck.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !nullish$1(val) && val.length !== undefined;
    });
    inst._zod.onattach.push((inst) => {
        const curr = (inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY);
        if (def.minimum > curr)
            inst._zod.bag.minimum = def.minimum;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        const length = input.length;
        if (length >= def.minimum)
            return;
        const origin = getLengthableOrigin(input);
        payload.issues.push({
            origin,
            code: "too_small",
            minimum: def.minimum,
            inclusive: true,
            input,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckLengthEquals = /*@__PURE__*/ $constructor("$ZodCheckLengthEquals", (inst, def) => {
    var _a;
    $ZodCheck.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
        const val = payload.value;
        return !nullish$1(val) && val.length !== undefined;
    });
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.minimum = def.length;
        bag.maximum = def.length;
        bag.length = def.length;
    });
    inst._zod.check = (payload) => {
        const input = payload.value;
        const length = input.length;
        if (length === def.length)
            return;
        const origin = getLengthableOrigin(input);
        const tooBig = length > def.length;
        payload.issues.push({
            origin,
            ...(tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length }),
            inclusive: true,
            exact: true,
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckStringFormat = /*@__PURE__*/ $constructor("$ZodCheckStringFormat", (inst, def) => {
    var _a, _b;
    $ZodCheck.init(inst, def);
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.format = def.format;
        if (def.pattern) {
            bag.patterns ?? (bag.patterns = new Set());
            bag.patterns.add(def.pattern);
        }
    });
    if (def.pattern)
        (_a = inst._zod).check ?? (_a.check = (payload) => {
            def.pattern.lastIndex = 0;
            if (def.pattern.test(payload.value))
                return;
            payload.issues.push({
                origin: "string",
                code: "invalid_format",
                format: def.format,
                input: payload.value,
                ...(def.pattern ? { pattern: def.pattern.toString() } : {}),
                inst,
                continue: !def.abort,
            });
        });
    else
        (_b = inst._zod).check ?? (_b.check = () => { });
});
const $ZodCheckRegex = /*@__PURE__*/ $constructor("$ZodCheckRegex", (inst, def) => {
    $ZodCheckStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
        def.pattern.lastIndex = 0;
        if (def.pattern.test(payload.value))
            return;
        payload.issues.push({
            origin: "string",
            code: "invalid_format",
            format: "regex",
            input: payload.value,
            pattern: def.pattern.toString(),
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckLowerCase = /*@__PURE__*/ $constructor("$ZodCheckLowerCase", (inst, def) => {
    def.pattern ?? (def.pattern = lowercase);
    $ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckUpperCase = /*@__PURE__*/ $constructor("$ZodCheckUpperCase", (inst, def) => {
    def.pattern ?? (def.pattern = uppercase);
    $ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckIncludes = /*@__PURE__*/ $constructor("$ZodCheckIncludes", (inst, def) => {
    $ZodCheck.init(inst, def);
    const escapedRegex = escapeRegex(def.includes);
    const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
    def.pattern = pattern;
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.patterns ?? (bag.patterns = new Set());
        bag.patterns.add(pattern);
    });
    inst._zod.check = (payload) => {
        if (payload.value.includes(def.includes, def.position))
            return;
        payload.issues.push({
            origin: "string",
            code: "invalid_format",
            format: "includes",
            includes: def.includes,
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckStartsWith = /*@__PURE__*/ $constructor("$ZodCheckStartsWith", (inst, def) => {
    $ZodCheck.init(inst, def);
    const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
    def.pattern ?? (def.pattern = pattern);
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.patterns ?? (bag.patterns = new Set());
        bag.patterns.add(pattern);
    });
    inst._zod.check = (payload) => {
        if (payload.value.startsWith(def.prefix))
            return;
        payload.issues.push({
            origin: "string",
            code: "invalid_format",
            format: "starts_with",
            prefix: def.prefix,
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckEndsWith = /*@__PURE__*/ $constructor("$ZodCheckEndsWith", (inst, def) => {
    $ZodCheck.init(inst, def);
    const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
    def.pattern ?? (def.pattern = pattern);
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.patterns ?? (bag.patterns = new Set());
        bag.patterns.add(pattern);
    });
    inst._zod.check = (payload) => {
        if (payload.value.endsWith(def.suffix))
            return;
        payload.issues.push({
            origin: "string",
            code: "invalid_format",
            format: "ends_with",
            suffix: def.suffix,
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
///////////////////////////////////
/////    $ZodCheckProperty    /////
///////////////////////////////////
function handleCheckPropertyResult(result, payload, property) {
    if (result.issues.length) {
        payload.issues.push(...prefixIssues(property, result.issues));
    }
}
const $ZodCheckProperty = /*@__PURE__*/ $constructor("$ZodCheckProperty", (inst, def) => {
    $ZodCheck.init(inst, def);
    inst._zod.check = (payload) => {
        const result = def.schema._zod.run({
            value: payload.value[def.property],
            issues: [],
        }, {});
        if (result instanceof Promise) {
            return result.then((result) => handleCheckPropertyResult(result, payload, def.property));
        }
        handleCheckPropertyResult(result, payload, def.property);
        return;
    };
});
const $ZodCheckMimeType = /*@__PURE__*/ $constructor("$ZodCheckMimeType", (inst, def) => {
    $ZodCheck.init(inst, def);
    const mimeSet = new Set(def.mime);
    inst._zod.onattach.push((inst) => {
        inst._zod.bag.mime = def.mime;
    });
    inst._zod.check = (payload) => {
        if (mimeSet.has(payload.value.type))
            return;
        payload.issues.push({
            code: "invalid_value",
            values: def.mime,
            input: payload.value.type,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCheckOverwrite = /*@__PURE__*/ $constructor("$ZodCheckOverwrite", (inst, def) => {
    $ZodCheck.init(inst, def);
    inst._zod.check = (payload) => {
        payload.value = def.tx(payload.value);
    };
});

class Doc {
    constructor(args = []) {
        this.content = [];
        this.indent = 0;
        if (this)
            this.args = args;
    }
    indented(fn) {
        this.indent += 1;
        fn(this);
        this.indent -= 1;
    }
    write(arg) {
        if (typeof arg === "function") {
            arg(this, { execution: "sync" });
            arg(this, { execution: "async" });
            return;
        }
        const content = arg;
        const lines = content.split("\n").filter((x) => x);
        const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
        const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
        for (const line of dedented) {
            this.content.push(line);
        }
    }
    compile() {
        const F = Function;
        const args = this?.args;
        const content = this?.content ?? [``];
        const lines = [...content.map((x) => `  ${x}`)];
        // console.log(lines.join("\n"));
        return new F(...args, lines.join("\n"));
    }
}

const version = {
    major: 4,
    minor: 1,
    patch: 12,
};

const $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
    var _a;
    inst ?? (inst = {});
    inst._zod.def = def; // set _def property
    inst._zod.bag = inst._zod.bag || {}; // initialize _bag object
    inst._zod.version = version;
    const checks = [...(inst._zod.def.checks ?? [])];
    // if inst is itself a checks.$ZodCheck, run it as a check
    if (inst._zod.traits.has("$ZodCheck")) {
        checks.unshift(inst);
    }
    for (const ch of checks) {
        for (const fn of ch._zod.onattach) {
            fn(inst);
        }
    }
    if (checks.length === 0) {
        // deferred initializer
        // inst._zod.parse is not yet defined
        (_a = inst._zod).deferred ?? (_a.deferred = []);
        inst._zod.deferred?.push(() => {
            inst._zod.run = inst._zod.parse;
        });
    }
    else {
        const runChecks = (payload, checks, ctx) => {
            let isAborted = aborted(payload);
            let asyncResult;
            for (const ch of checks) {
                if (ch._zod.def.when) {
                    const shouldRun = ch._zod.def.when(payload);
                    if (!shouldRun)
                        continue;
                }
                else if (isAborted) {
                    continue;
                }
                const currLen = payload.issues.length;
                const _ = ch._zod.check(payload);
                if (_ instanceof Promise && ctx?.async === false) {
                    throw new $ZodAsyncError();
                }
                if (asyncResult || _ instanceof Promise) {
                    asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
                        await _;
                        const nextLen = payload.issues.length;
                        if (nextLen === currLen)
                            return;
                        if (!isAborted)
                            isAborted = aborted(payload, currLen);
                    });
                }
                else {
                    const nextLen = payload.issues.length;
                    if (nextLen === currLen)
                        continue;
                    if (!isAborted)
                        isAborted = aborted(payload, currLen);
                }
            }
            if (asyncResult) {
                return asyncResult.then(() => {
                    return payload;
                });
            }
            return payload;
        };
        // const handleChecksResult = (
        //   checkResult: ParsePayload,
        //   originalResult: ParsePayload,
        //   ctx: ParseContextInternal
        // ): util.MaybeAsync<ParsePayload> => {
        //   // if the checks mutated the value && there are no issues, re-parse the result
        //   if (checkResult.value !== originalResult.value && !checkResult.issues.length)
        //     return inst._zod.parse(checkResult, ctx);
        //   return originalResult;
        // };
        const handleCanaryResult = (canary, payload, ctx) => {
            // abort if the canary is aborted
            if (aborted(canary)) {
                canary.aborted = true;
                return canary;
            }
            // run checks first, then
            const checkResult = runChecks(payload, checks, ctx);
            if (checkResult instanceof Promise) {
                if (ctx.async === false)
                    throw new $ZodAsyncError();
                return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
            }
            return inst._zod.parse(checkResult, ctx);
        };
        inst._zod.run = (payload, ctx) => {
            if (ctx.skipChecks) {
                return inst._zod.parse(payload, ctx);
            }
            if (ctx.direction === "backward") {
                // run canary
                // initial pass (no checks)
                const canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: true });
                if (canary instanceof Promise) {
                    return canary.then((canary) => {
                        return handleCanaryResult(canary, payload, ctx);
                    });
                }
                return handleCanaryResult(canary, payload, ctx);
            }
            // forward
            const result = inst._zod.parse(payload, ctx);
            if (result instanceof Promise) {
                if (ctx.async === false)
                    throw new $ZodAsyncError();
                return result.then((result) => runChecks(result, checks, ctx));
            }
            return runChecks(result, checks, ctx);
        };
    }
    inst["~standard"] = {
        validate: (value) => {
            try {
                const r = safeParse$1(inst, value);
                return r.success ? { value: r.data } : { issues: r.error?.issues };
            }
            catch (_) {
                return safeParseAsync$1(inst, value).then((r) => (r.success ? { value: r.data } : { issues: r.error?.issues }));
            }
        },
        vendor: "zod",
        version: 1,
    };
});
const $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = [...(inst?._zod.bag?.patterns ?? [])].pop() ?? string$2(inst._zod.bag);
    inst._zod.parse = (payload, _) => {
        if (def.coerce)
            try {
                payload.value = String(payload.value);
            }
            catch (_) { }
        if (typeof payload.value === "string")
            return payload;
        payload.issues.push({
            expected: "string",
            code: "invalid_type",
            input: payload.value,
            inst,
        });
        return payload;
    };
});
const $ZodStringFormat = /*@__PURE__*/ $constructor("$ZodStringFormat", (inst, def) => {
    // check initialization must come first
    $ZodCheckStringFormat.init(inst, def);
    $ZodString.init(inst, def);
});
const $ZodGUID = /*@__PURE__*/ $constructor("$ZodGUID", (inst, def) => {
    def.pattern ?? (def.pattern = guid$1);
    $ZodStringFormat.init(inst, def);
});
const $ZodUUID = /*@__PURE__*/ $constructor("$ZodUUID", (inst, def) => {
    if (def.version) {
        const versionMap = {
            v1: 1,
            v2: 2,
            v3: 3,
            v4: 4,
            v5: 5,
            v6: 6,
            v7: 7,
            v8: 8,
        };
        const v = versionMap[def.version];
        if (v === undefined)
            throw new Error(`Invalid UUID version: "${def.version}"`);
        def.pattern ?? (def.pattern = uuid$1(v));
    }
    else
        def.pattern ?? (def.pattern = uuid$1());
    $ZodStringFormat.init(inst, def);
});
const $ZodEmail = /*@__PURE__*/ $constructor("$ZodEmail", (inst, def) => {
    def.pattern ?? (def.pattern = email$1);
    $ZodStringFormat.init(inst, def);
});
const $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
    $ZodStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
        try {
            // Trim whitespace from input
            const trimmed = payload.value.trim();
            // @ts-ignore
            const url = new URL(trimmed);
            if (def.hostname) {
                def.hostname.lastIndex = 0;
                if (!def.hostname.test(url.hostname)) {
                    payload.issues.push({
                        code: "invalid_format",
                        format: "url",
                        note: "Invalid hostname",
                        pattern: hostname$1.source,
                        input: payload.value,
                        inst,
                        continue: !def.abort,
                    });
                }
            }
            if (def.protocol) {
                def.protocol.lastIndex = 0;
                if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) {
                    payload.issues.push({
                        code: "invalid_format",
                        format: "url",
                        note: "Invalid protocol",
                        pattern: def.protocol.source,
                        input: payload.value,
                        inst,
                        continue: !def.abort,
                    });
                }
            }
            // Set the output value based on normalize flag
            if (def.normalize) {
                // Use normalized URL
                payload.value = url.href;
            }
            else {
                // Preserve the original input (trimmed)
                payload.value = trimmed;
            }
            return;
        }
        catch (_) {
            payload.issues.push({
                code: "invalid_format",
                format: "url",
                input: payload.value,
                inst,
                continue: !def.abort,
            });
        }
    };
});
const $ZodEmoji = /*@__PURE__*/ $constructor("$ZodEmoji", (inst, def) => {
    def.pattern ?? (def.pattern = emoji$1());
    $ZodStringFormat.init(inst, def);
});
const $ZodNanoID = /*@__PURE__*/ $constructor("$ZodNanoID", (inst, def) => {
    def.pattern ?? (def.pattern = nanoid$1);
    $ZodStringFormat.init(inst, def);
});
const $ZodCUID = /*@__PURE__*/ $constructor("$ZodCUID", (inst, def) => {
    def.pattern ?? (def.pattern = cuid$1);
    $ZodStringFormat.init(inst, def);
});
const $ZodCUID2 = /*@__PURE__*/ $constructor("$ZodCUID2", (inst, def) => {
    def.pattern ?? (def.pattern = cuid2$1);
    $ZodStringFormat.init(inst, def);
});
const $ZodULID = /*@__PURE__*/ $constructor("$ZodULID", (inst, def) => {
    def.pattern ?? (def.pattern = ulid$1);
    $ZodStringFormat.init(inst, def);
});
const $ZodXID = /*@__PURE__*/ $constructor("$ZodXID", (inst, def) => {
    def.pattern ?? (def.pattern = xid$1);
    $ZodStringFormat.init(inst, def);
});
const $ZodKSUID = /*@__PURE__*/ $constructor("$ZodKSUID", (inst, def) => {
    def.pattern ?? (def.pattern = ksuid$1);
    $ZodStringFormat.init(inst, def);
});
const $ZodISODateTime = /*@__PURE__*/ $constructor("$ZodISODateTime", (inst, def) => {
    def.pattern ?? (def.pattern = datetime$1(def));
    $ZodStringFormat.init(inst, def);
});
const $ZodISODate = /*@__PURE__*/ $constructor("$ZodISODate", (inst, def) => {
    def.pattern ?? (def.pattern = date$3);
    $ZodStringFormat.init(inst, def);
});
const $ZodISOTime = /*@__PURE__*/ $constructor("$ZodISOTime", (inst, def) => {
    def.pattern ?? (def.pattern = time$1(def));
    $ZodStringFormat.init(inst, def);
});
const $ZodISODuration = /*@__PURE__*/ $constructor("$ZodISODuration", (inst, def) => {
    def.pattern ?? (def.pattern = duration$1);
    $ZodStringFormat.init(inst, def);
});
const $ZodIPv4 = /*@__PURE__*/ $constructor("$ZodIPv4", (inst, def) => {
    def.pattern ?? (def.pattern = ipv4$1);
    $ZodStringFormat.init(inst, def);
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.format = `ipv4`;
    });
});
const $ZodIPv6 = /*@__PURE__*/ $constructor("$ZodIPv6", (inst, def) => {
    def.pattern ?? (def.pattern = ipv6$1);
    $ZodStringFormat.init(inst, def);
    inst._zod.onattach.push((inst) => {
        const bag = inst._zod.bag;
        bag.format = `ipv6`;
    });
    inst._zod.check = (payload) => {
        try {
            // @ts-ignore
            new URL(`http://[${payload.value}]`);
            // return;
        }
        catch {
            payload.issues.push({
                code: "invalid_format",
                format: "ipv6",
                input: payload.value,
                inst,
                continue: !def.abort,
            });
        }
    };
});
const $ZodCIDRv4 = /*@__PURE__*/ $constructor("$ZodCIDRv4", (inst, def) => {
    def.pattern ?? (def.pattern = cidrv4$1);
    $ZodStringFormat.init(inst, def);
});
const $ZodCIDRv6 = /*@__PURE__*/ $constructor("$ZodCIDRv6", (inst, def) => {
    def.pattern ?? (def.pattern = cidrv6$1); // not used for validation
    $ZodStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
        const parts = payload.value.split("/");
        try {
            if (parts.length !== 2)
                throw new Error();
            const [address, prefix] = parts;
            if (!prefix)
                throw new Error();
            const prefixNum = Number(prefix);
            if (`${prefixNum}` !== prefix)
                throw new Error();
            if (prefixNum < 0 || prefixNum > 128)
                throw new Error();
            // @ts-ignore
            new URL(`http://[${address}]`);
        }
        catch {
            payload.issues.push({
                code: "invalid_format",
                format: "cidrv6",
                input: payload.value,
                inst,
                continue: !def.abort,
            });
        }
    };
});
//////////////////////////////   ZodBase64   //////////////////////////////
function isValidBase64(data) {
    if (data === "")
        return true;
    if (data.length % 4 !== 0)
        return false;
    try {
        // @ts-ignore
        atob(data);
        return true;
    }
    catch {
        return false;
    }
}
const $ZodBase64 = /*@__PURE__*/ $constructor("$ZodBase64", (inst, def) => {
    def.pattern ?? (def.pattern = base64$1);
    $ZodStringFormat.init(inst, def);
    inst._zod.onattach.push((inst) => {
        inst._zod.bag.contentEncoding = "base64";
    });
    inst._zod.check = (payload) => {
        if (isValidBase64(payload.value))
            return;
        payload.issues.push({
            code: "invalid_format",
            format: "base64",
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
//////////////////////////////   ZodBase64   //////////////////////////////
function isValidBase64URL(data) {
    if (!base64url$1.test(data))
        return false;
    const base64 = data.replace(/[-_]/g, (c) => (c === "-" ? "+" : "/"));
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    return isValidBase64(padded);
}
const $ZodBase64URL = /*@__PURE__*/ $constructor("$ZodBase64URL", (inst, def) => {
    def.pattern ?? (def.pattern = base64url$1);
    $ZodStringFormat.init(inst, def);
    inst._zod.onattach.push((inst) => {
        inst._zod.bag.contentEncoding = "base64url";
    });
    inst._zod.check = (payload) => {
        if (isValidBase64URL(payload.value))
            return;
        payload.issues.push({
            code: "invalid_format",
            format: "base64url",
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodE164 = /*@__PURE__*/ $constructor("$ZodE164", (inst, def) => {
    def.pattern ?? (def.pattern = e164$1);
    $ZodStringFormat.init(inst, def);
});
//////////////////////////////   ZodJWT   //////////////////////////////
function isValidJWT(token, algorithm = null) {
    try {
        const tokensParts = token.split(".");
        if (tokensParts.length !== 3)
            return false;
        const [header] = tokensParts;
        if (!header)
            return false;
        // @ts-ignore
        const parsedHeader = JSON.parse(atob(header));
        if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
            return false;
        if (!parsedHeader.alg)
            return false;
        if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
            return false;
        return true;
    }
    catch {
        return false;
    }
}
const $ZodJWT = /*@__PURE__*/ $constructor("$ZodJWT", (inst, def) => {
    $ZodStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
        if (isValidJWT(payload.value, def.alg))
            return;
        payload.issues.push({
            code: "invalid_format",
            format: "jwt",
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodCustomStringFormat = /*@__PURE__*/ $constructor("$ZodCustomStringFormat", (inst, def) => {
    $ZodStringFormat.init(inst, def);
    inst._zod.check = (payload) => {
        if (def.fn(payload.value))
            return;
        payload.issues.push({
            code: "invalid_format",
            format: def.format,
            input: payload.value,
            inst,
            continue: !def.abort,
        });
    };
});
const $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = inst._zod.bag.pattern ?? number$2;
    inst._zod.parse = (payload, _ctx) => {
        if (def.coerce)
            try {
                payload.value = Number(payload.value);
            }
            catch (_) { }
        const input = payload.value;
        if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) {
            return payload;
        }
        const received = typeof input === "number"
            ? Number.isNaN(input)
                ? "NaN"
                : !Number.isFinite(input)
                    ? "Infinity"
                    : undefined
            : undefined;
        payload.issues.push({
            expected: "number",
            code: "invalid_type",
            input,
            inst,
            ...(received ? { received } : {}),
        });
        return payload;
    };
});
const $ZodNumberFormat = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
    $ZodCheckNumberFormat.init(inst, def);
    $ZodNumber.init(inst, def); // no format checksp
});
const $ZodBoolean = /*@__PURE__*/ $constructor("$ZodBoolean", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = boolean$2;
    inst._zod.parse = (payload, _ctx) => {
        if (def.coerce)
            try {
                payload.value = Boolean(payload.value);
            }
            catch (_) { }
        const input = payload.value;
        if (typeof input === "boolean")
            return payload;
        payload.issues.push({
            expected: "boolean",
            code: "invalid_type",
            input,
            inst,
        });
        return payload;
    };
});
const $ZodBigInt = /*@__PURE__*/ $constructor("$ZodBigInt", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = bigint$2;
    inst._zod.parse = (payload, _ctx) => {
        if (def.coerce)
            try {
                payload.value = BigInt(payload.value);
            }
            catch (_) { }
        if (typeof payload.value === "bigint")
            return payload;
        payload.issues.push({
            expected: "bigint",
            code: "invalid_type",
            input: payload.value,
            inst,
        });
        return payload;
    };
});
const $ZodBigIntFormat = /*@__PURE__*/ $constructor("$ZodBigInt", (inst, def) => {
    $ZodCheckBigIntFormat.init(inst, def);
    $ZodBigInt.init(inst, def); // no format checks
});
const $ZodSymbol = /*@__PURE__*/ $constructor("$ZodSymbol", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (typeof input === "symbol")
            return payload;
        payload.issues.push({
            expected: "symbol",
            code: "invalid_type",
            input,
            inst,
        });
        return payload;
    };
});
const $ZodUndefined = /*@__PURE__*/ $constructor("$ZodUndefined", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = _undefined$2;
    inst._zod.values = new Set([undefined]);
    inst._zod.optin = "optional";
    inst._zod.optout = "optional";
    inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (typeof input === "undefined")
            return payload;
        payload.issues.push({
            expected: "undefined",
            code: "invalid_type",
            input,
            inst,
        });
        return payload;
    };
});
const $ZodNull = /*@__PURE__*/ $constructor("$ZodNull", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = _null$2;
    inst._zod.values = new Set([null]);
    inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (input === null)
            return payload;
        payload.issues.push({
            expected: "null",
            code: "invalid_type",
            input,
            inst,
        });
        return payload;
    };
});
const $ZodAny = /*@__PURE__*/ $constructor("$ZodAny", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload) => payload;
});
const $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload) => payload;
});
const $ZodNever = /*@__PURE__*/ $constructor("$ZodNever", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
        payload.issues.push({
            expected: "never",
            code: "invalid_type",
            input: payload.value,
            inst,
        });
        return payload;
    };
});
const $ZodVoid = /*@__PURE__*/ $constructor("$ZodVoid", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (typeof input === "undefined")
            return payload;
        payload.issues.push({
            expected: "void",
            code: "invalid_type",
            input,
            inst,
        });
        return payload;
    };
});
const $ZodDate = /*@__PURE__*/ $constructor("$ZodDate", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
        if (def.coerce) {
            try {
                payload.value = new Date(payload.value);
            }
            catch (_err) { }
        }
        const input = payload.value;
        const isDate = input instanceof Date;
        const isValidDate = isDate && !Number.isNaN(input.getTime());
        if (isValidDate)
            return payload;
        payload.issues.push({
            expected: "date",
            code: "invalid_type",
            input,
            ...(isDate ? { received: "Invalid Date" } : {}),
            inst,
        });
        return payload;
    };
});
function handleArrayResult(result, final, index) {
    if (result.issues.length) {
        final.issues.push(...prefixIssues(index, result.issues));
    }
    final.value[index] = result.value;
}
const $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!Array.isArray(input)) {
            payload.issues.push({
                expected: "array",
                code: "invalid_type",
                input,
                inst,
            });
            return payload;
        }
        payload.value = Array(input.length);
        const proms = [];
        for (let i = 0; i < input.length; i++) {
            const item = input[i];
            const result = def.element._zod.run({
                value: item,
                issues: [],
            }, ctx);
            if (result instanceof Promise) {
                proms.push(result.then((result) => handleArrayResult(result, payload, i)));
            }
            else {
                handleArrayResult(result, payload, i);
            }
        }
        if (proms.length) {
            return Promise.all(proms).then(() => payload);
        }
        return payload; //handleArrayResultsAsync(parseResults, final);
    };
});
function handlePropertyResult(result, final, key, input) {
    if (result.issues.length) {
        final.issues.push(...prefixIssues(key, result.issues));
    }
    if (result.value === undefined) {
        if (key in input) {
            final.value[key] = undefined;
        }
    }
    else {
        final.value[key] = result.value;
    }
}
function normalizeDef(def) {
    const keys = Object.keys(def.shape);
    for (const k of keys) {
        if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) {
            throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
        }
    }
    const okeys = optionalKeys(def.shape);
    return {
        ...def,
        keys,
        keySet: new Set(keys),
        numKeys: keys.length,
        optionalKeys: new Set(okeys),
    };
}
function handleCatchall(proms, input, payload, ctx, def, inst) {
    const unrecognized = [];
    // iterate over input keys
    const keySet = def.keySet;
    const _catchall = def.catchall._zod;
    const t = _catchall.def.type;
    for (const key of Object.keys(input)) {
        if (keySet.has(key))
            continue;
        if (t === "never") {
            unrecognized.push(key);
            continue;
        }
        const r = _catchall.run({ value: input[key], issues: [] }, ctx);
        if (r instanceof Promise) {
            proms.push(r.then((r) => handlePropertyResult(r, payload, key, input)));
        }
        else {
            handlePropertyResult(r, payload, key, input);
        }
    }
    if (unrecognized.length) {
        payload.issues.push({
            code: "unrecognized_keys",
            keys: unrecognized,
            input,
            inst,
        });
    }
    if (!proms.length)
        return payload;
    return Promise.all(proms).then(() => {
        return payload;
    });
}
const $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
    // requires cast because technically $ZodObject doesn't extend
    $ZodType.init(inst, def);
    // const sh = def.shape;
    const desc = Object.getOwnPropertyDescriptor(def, "shape");
    if (!desc?.get) {
        const sh = def.shape;
        Object.defineProperty(def, "shape", {
            get: () => {
                const newSh = { ...sh };
                Object.defineProperty(def, "shape", {
                    value: newSh,
                });
                return newSh;
            },
        });
    }
    const _normalized = cached(() => normalizeDef(def));
    defineLazy(inst._zod, "propValues", () => {
        const shape = def.shape;
        const propValues = {};
        for (const key in shape) {
            const field = shape[key]._zod;
            if (field.values) {
                propValues[key] ?? (propValues[key] = new Set());
                for (const v of field.values)
                    propValues[key].add(v);
            }
        }
        return propValues;
    });
    const isObject$1 = isObject;
    const catchall = def.catchall;
    let value;
    inst._zod.parse = (payload, ctx) => {
        value ?? (value = _normalized.value);
        const input = payload.value;
        if (!isObject$1(input)) {
            payload.issues.push({
                expected: "object",
                code: "invalid_type",
                input,
                inst,
            });
            return payload;
        }
        payload.value = {};
        const proms = [];
        const shape = value.shape;
        for (const key of value.keys) {
            const el = shape[key];
            const r = el._zod.run({ value: input[key], issues: [] }, ctx);
            if (r instanceof Promise) {
                proms.push(r.then((r) => handlePropertyResult(r, payload, key, input)));
            }
            else {
                handlePropertyResult(r, payload, key, input);
            }
        }
        if (!catchall) {
            return proms.length ? Promise.all(proms).then(() => payload) : payload;
        }
        return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
    };
});
const $ZodObjectJIT = /*@__PURE__*/ $constructor("$ZodObjectJIT", (inst, def) => {
    // requires cast because technically $ZodObject doesn't extend
    $ZodObject.init(inst, def);
    const superParse = inst._zod.parse;
    const _normalized = cached(() => normalizeDef(def));
    const generateFastpass = (shape) => {
        const doc = new Doc(["shape", "payload", "ctx"]);
        const normalized = _normalized.value;
        const parseStr = (key) => {
            const k = esc(key);
            return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
        };
        doc.write(`const input = payload.value;`);
        const ids = Object.create(null);
        let counter = 0;
        for (const key of normalized.keys) {
            ids[key] = `key_${counter++}`;
        }
        // A: preserve key order {
        doc.write(`const newResult = {};`);
        for (const key of normalized.keys) {
            const id = ids[key];
            const k = esc(key);
            doc.write(`const ${id} = ${parseStr(key)};`);
            doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        
        
        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }
        
      `);
        }
        doc.write(`payload.value = newResult;`);
        doc.write(`return payload;`);
        const fn = doc.compile();
        return (payload, ctx) => fn(shape, payload, ctx);
    };
    let fastpass;
    const isObject$1 = isObject;
    const jit = !globalConfig.jitless;
    const allowsEval$1 = allowsEval;
    const fastEnabled = jit && allowsEval$1.value; // && !def.catchall;
    const catchall = def.catchall;
    let value;
    inst._zod.parse = (payload, ctx) => {
        value ?? (value = _normalized.value);
        const input = payload.value;
        if (!isObject$1(input)) {
            payload.issues.push({
                expected: "object",
                code: "invalid_type",
                input,
                inst,
            });
            return payload;
        }
        if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
            // always synchronous
            if (!fastpass)
                fastpass = generateFastpass(def.shape);
            payload = fastpass(payload, ctx);
            if (!catchall)
                return payload;
            return handleCatchall([], input, payload, ctx, value, inst);
        }
        return superParse(payload, ctx);
    };
});
function handleUnionResults(results, final, inst, ctx) {
    for (const result of results) {
        if (result.issues.length === 0) {
            final.value = result.value;
            return final;
        }
    }
    const nonaborted = results.filter((r) => !aborted(r));
    if (nonaborted.length === 1) {
        final.value = nonaborted[0].value;
        return nonaborted[0];
    }
    final.issues.push({
        code: "invalid_union",
        input: final.value,
        inst,
        errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config()))),
    });
    return final;
}
const $ZodUnion = /*@__PURE__*/ $constructor("$ZodUnion", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : undefined);
    defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : undefined);
    defineLazy(inst._zod, "values", () => {
        if (def.options.every((o) => o._zod.values)) {
            return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
        }
        return undefined;
    });
    defineLazy(inst._zod, "pattern", () => {
        if (def.options.every((o) => o._zod.pattern)) {
            const patterns = def.options.map((o) => o._zod.pattern);
            return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
        }
        return undefined;
    });
    const single = def.options.length === 1;
    const first = def.options[0]._zod.run;
    inst._zod.parse = (payload, ctx) => {
        if (single) {
            return first(payload, ctx);
        }
        let async = false;
        const results = [];
        for (const option of def.options) {
            const result = option._zod.run({
                value: payload.value,
                issues: [],
            }, ctx);
            if (result instanceof Promise) {
                results.push(result);
                async = true;
            }
            else {
                if (result.issues.length === 0)
                    return result;
                results.push(result);
            }
        }
        if (!async)
            return handleUnionResults(results, payload, inst, ctx);
        return Promise.all(results).then((results) => {
            return handleUnionResults(results, payload, inst, ctx);
        });
    };
});
const $ZodDiscriminatedUnion = 
/*@__PURE__*/
$constructor("$ZodDiscriminatedUnion", (inst, def) => {
    $ZodUnion.init(inst, def);
    const _super = inst._zod.parse;
    defineLazy(inst._zod, "propValues", () => {
        const propValues = {};
        for (const option of def.options) {
            const pv = option._zod.propValues;
            if (!pv || Object.keys(pv).length === 0)
                throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(option)}"`);
            for (const [k, v] of Object.entries(pv)) {
                if (!propValues[k])
                    propValues[k] = new Set();
                for (const val of v) {
                    propValues[k].add(val);
                }
            }
        }
        return propValues;
    });
    const disc = cached(() => {
        const opts = def.options;
        const map = new Map();
        for (const o of opts) {
            const values = o._zod.propValues?.[def.discriminator];
            if (!values || values.size === 0)
                throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(o)}"`);
            for (const v of values) {
                if (map.has(v)) {
                    throw new Error(`Duplicate discriminator value "${String(v)}"`);
                }
                map.set(v, o);
            }
        }
        return map;
    });
    inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!isObject(input)) {
            payload.issues.push({
                code: "invalid_type",
                expected: "object",
                input,
                inst,
            });
            return payload;
        }
        const opt = disc.value.get(input?.[def.discriminator]);
        if (opt) {
            return opt._zod.run(payload, ctx);
        }
        if (def.unionFallback) {
            return _super(payload, ctx);
        }
        // no matching discriminator
        payload.issues.push({
            code: "invalid_union",
            errors: [],
            note: "No matching discriminator",
            discriminator: def.discriminator,
            input,
            path: [def.discriminator],
            inst,
        });
        return payload;
    };
});
const $ZodIntersection = /*@__PURE__*/ $constructor("$ZodIntersection", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        const left = def.left._zod.run({ value: input, issues: [] }, ctx);
        const right = def.right._zod.run({ value: input, issues: [] }, ctx);
        const async = left instanceof Promise || right instanceof Promise;
        if (async) {
            return Promise.all([left, right]).then(([left, right]) => {
                return handleIntersectionResults(payload, left, right);
            });
        }
        return handleIntersectionResults(payload, left, right);
    };
});
function mergeValues(a, b) {
    // const aType = parse.t(a);
    // const bType = parse.t(b);
    if (a === b) {
        return { valid: true, data: a };
    }
    if (a instanceof Date && b instanceof Date && +a === +b) {
        return { valid: true, data: a };
    }
    if (isPlainObject(a) && isPlainObject(b)) {
        const bKeys = Object.keys(b);
        const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
        const newObj = { ...a, ...b };
        for (const key of sharedKeys) {
            const sharedValue = mergeValues(a[key], b[key]);
            if (!sharedValue.valid) {
                return {
                    valid: false,
                    mergeErrorPath: [key, ...sharedValue.mergeErrorPath],
                };
            }
            newObj[key] = sharedValue.data;
        }
        return { valid: true, data: newObj };
    }
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return { valid: false, mergeErrorPath: [] };
        }
        const newArray = [];
        for (let index = 0; index < a.length; index++) {
            const itemA = a[index];
            const itemB = b[index];
            const sharedValue = mergeValues(itemA, itemB);
            if (!sharedValue.valid) {
                return {
                    valid: false,
                    mergeErrorPath: [index, ...sharedValue.mergeErrorPath],
                };
            }
            newArray.push(sharedValue.data);
        }
        return { valid: true, data: newArray };
    }
    return { valid: false, mergeErrorPath: [] };
}
function handleIntersectionResults(result, left, right) {
    if (left.issues.length) {
        result.issues.push(...left.issues);
    }
    if (right.issues.length) {
        result.issues.push(...right.issues);
    }
    if (aborted(result))
        return result;
    const merged = mergeValues(left.value, right.value);
    if (!merged.valid) {
        throw new Error(`Unmergable intersection. Error path: ` + `${JSON.stringify(merged.mergeErrorPath)}`);
    }
    result.value = merged.data;
    return result;
}
const $ZodTuple = /*@__PURE__*/ $constructor("$ZodTuple", (inst, def) => {
    $ZodType.init(inst, def);
    const items = def.items;
    const optStart = items.length - [...items].reverse().findIndex((item) => item._zod.optin !== "optional");
    inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!Array.isArray(input)) {
            payload.issues.push({
                input,
                inst,
                expected: "tuple",
                code: "invalid_type",
            });
            return payload;
        }
        payload.value = [];
        const proms = [];
        if (!def.rest) {
            const tooBig = input.length > items.length;
            const tooSmall = input.length < optStart - 1;
            if (tooBig || tooSmall) {
                payload.issues.push({
                    ...(tooBig ? { code: "too_big", maximum: items.length } : { code: "too_small", minimum: items.length }),
                    input,
                    inst,
                    origin: "array",
                });
                return payload;
            }
        }
        let i = -1;
        for (const item of items) {
            i++;
            if (i >= input.length)
                if (i >= optStart)
                    continue;
            const result = item._zod.run({
                value: input[i],
                issues: [],
            }, ctx);
            if (result instanceof Promise) {
                proms.push(result.then((result) => handleTupleResult(result, payload, i)));
            }
            else {
                handleTupleResult(result, payload, i);
            }
        }
        if (def.rest) {
            const rest = input.slice(items.length);
            for (const el of rest) {
                i++;
                const result = def.rest._zod.run({
                    value: el,
                    issues: [],
                }, ctx);
                if (result instanceof Promise) {
                    proms.push(result.then((result) => handleTupleResult(result, payload, i)));
                }
                else {
                    handleTupleResult(result, payload, i);
                }
            }
        }
        if (proms.length)
            return Promise.all(proms).then(() => payload);
        return payload;
    };
});
function handleTupleResult(result, final, index) {
    if (result.issues.length) {
        final.issues.push(...prefixIssues(index, result.issues));
    }
    final.value[index] = result.value;
}
const $ZodRecord = /*@__PURE__*/ $constructor("$ZodRecord", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!isPlainObject(input)) {
            payload.issues.push({
                expected: "record",
                code: "invalid_type",
                input,
                inst,
            });
            return payload;
        }
        const proms = [];
        if (def.keyType._zod.values) {
            const values = def.keyType._zod.values;
            payload.value = {};
            for (const key of values) {
                if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
                    const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
                    if (result instanceof Promise) {
                        proms.push(result.then((result) => {
                            if (result.issues.length) {
                                payload.issues.push(...prefixIssues(key, result.issues));
                            }
                            payload.value[key] = result.value;
                        }));
                    }
                    else {
                        if (result.issues.length) {
                            payload.issues.push(...prefixIssues(key, result.issues));
                        }
                        payload.value[key] = result.value;
                    }
                }
            }
            let unrecognized;
            for (const key in input) {
                if (!values.has(key)) {
                    unrecognized = unrecognized ?? [];
                    unrecognized.push(key);
                }
            }
            if (unrecognized && unrecognized.length > 0) {
                payload.issues.push({
                    code: "unrecognized_keys",
                    input,
                    inst,
                    keys: unrecognized,
                });
            }
        }
        else {
            payload.value = {};
            for (const key of Reflect.ownKeys(input)) {
                if (key === "__proto__")
                    continue;
                const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
                if (keyResult instanceof Promise) {
                    throw new Error("Async schemas not supported in object keys currently");
                }
                if (keyResult.issues.length) {
                    payload.issues.push({
                        code: "invalid_key",
                        origin: "record",
                        issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
                        input: key,
                        path: [key],
                        inst,
                    });
                    payload.value[keyResult.value] = keyResult.value;
                    continue;
                }
                const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
                if (result instanceof Promise) {
                    proms.push(result.then((result) => {
                        if (result.issues.length) {
                            payload.issues.push(...prefixIssues(key, result.issues));
                        }
                        payload.value[keyResult.value] = result.value;
                    }));
                }
                else {
                    if (result.issues.length) {
                        payload.issues.push(...prefixIssues(key, result.issues));
                    }
                    payload.value[keyResult.value] = result.value;
                }
            }
        }
        if (proms.length) {
            return Promise.all(proms).then(() => payload);
        }
        return payload;
    };
});
const $ZodMap = /*@__PURE__*/ $constructor("$ZodMap", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!(input instanceof Map)) {
            payload.issues.push({
                expected: "map",
                code: "invalid_type",
                input,
                inst,
            });
            return payload;
        }
        const proms = [];
        payload.value = new Map();
        for (const [key, value] of input) {
            const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
            const valueResult = def.valueType._zod.run({ value: value, issues: [] }, ctx);
            if (keyResult instanceof Promise || valueResult instanceof Promise) {
                proms.push(Promise.all([keyResult, valueResult]).then(([keyResult, valueResult]) => {
                    handleMapResult(keyResult, valueResult, payload, key, input, inst, ctx);
                }));
            }
            else {
                handleMapResult(keyResult, valueResult, payload, key, input, inst, ctx);
            }
        }
        if (proms.length)
            return Promise.all(proms).then(() => payload);
        return payload;
    };
});
function handleMapResult(keyResult, valueResult, final, key, input, inst, ctx) {
    if (keyResult.issues.length) {
        if (propertyKeyTypes.has(typeof key)) {
            final.issues.push(...prefixIssues(key, keyResult.issues));
        }
        else {
            final.issues.push({
                code: "invalid_key",
                origin: "map",
                input,
                inst,
                issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
            });
        }
    }
    if (valueResult.issues.length) {
        if (propertyKeyTypes.has(typeof key)) {
            final.issues.push(...prefixIssues(key, valueResult.issues));
        }
        else {
            final.issues.push({
                origin: "map",
                code: "invalid_element",
                input,
                inst,
                key: key,
                issues: valueResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
            });
        }
    }
    final.value.set(keyResult.value, valueResult.value);
}
const $ZodSet = /*@__PURE__*/ $constructor("$ZodSet", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!(input instanceof Set)) {
            payload.issues.push({
                input,
                inst,
                expected: "set",
                code: "invalid_type",
            });
            return payload;
        }
        const proms = [];
        payload.value = new Set();
        for (const item of input) {
            const result = def.valueType._zod.run({ value: item, issues: [] }, ctx);
            if (result instanceof Promise) {
                proms.push(result.then((result) => handleSetResult(result, payload)));
            }
            else
                handleSetResult(result, payload);
        }
        if (proms.length)
            return Promise.all(proms).then(() => payload);
        return payload;
    };
});
function handleSetResult(result, final) {
    if (result.issues.length) {
        final.issues.push(...result.issues);
    }
    final.value.add(result.value);
}
const $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
    $ZodType.init(inst, def);
    const values = getEnumValues(def.entries);
    const valuesSet = new Set(values);
    inst._zod.values = valuesSet;
    inst._zod.pattern = new RegExp(`^(${values
        .filter((k) => propertyKeyTypes.has(typeof k))
        .map((o) => (typeof o === "string" ? escapeRegex(o) : o.toString()))
        .join("|")})$`);
    inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (valuesSet.has(input)) {
            return payload;
        }
        payload.issues.push({
            code: "invalid_value",
            values,
            input,
            inst,
        });
        return payload;
    };
});
const $ZodLiteral = /*@__PURE__*/ $constructor("$ZodLiteral", (inst, def) => {
    $ZodType.init(inst, def);
    if (def.values.length === 0) {
        throw new Error("Cannot create literal schema with no valid values");
    }
    inst._zod.values = new Set(def.values);
    inst._zod.pattern = new RegExp(`^(${def.values
        .map((o) => (typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)))
        .join("|")})$`);
    inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (inst._zod.values.has(input)) {
            return payload;
        }
        payload.issues.push({
            code: "invalid_value",
            values: def.values,
            input,
            inst,
        });
        return payload;
    };
});
const $ZodFile = /*@__PURE__*/ $constructor("$ZodFile", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        // @ts-ignore
        if (input instanceof File)
            return payload;
        payload.issues.push({
            expected: "file",
            code: "invalid_type",
            input,
            inst,
        });
        return payload;
    };
});
const $ZodTransform = /*@__PURE__*/ $constructor("$ZodTransform", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
            throw new $ZodEncodeError(inst.constructor.name);
        }
        const _out = def.transform(payload.value, payload);
        if (ctx.async) {
            const output = _out instanceof Promise ? _out : Promise.resolve(_out);
            return output.then((output) => {
                payload.value = output;
                return payload;
            });
        }
        if (_out instanceof Promise) {
            throw new $ZodAsyncError();
        }
        payload.value = _out;
        return payload;
    };
});
function handleOptionalResult(result, input) {
    if (result.issues.length && input === undefined) {
        return { issues: [], value: undefined };
    }
    return result;
}
const $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.optin = "optional";
    inst._zod.optout = "optional";
    defineLazy(inst._zod, "values", () => {
        return def.innerType._zod.values ? new Set([...def.innerType._zod.values, undefined]) : undefined;
    });
    defineLazy(inst._zod, "pattern", () => {
        const pattern = def.innerType._zod.pattern;
        return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : undefined;
    });
    inst._zod.parse = (payload, ctx) => {
        if (def.innerType._zod.optin === "optional") {
            const result = def.innerType._zod.run(payload, ctx);
            if (result instanceof Promise)
                return result.then((r) => handleOptionalResult(r, payload.value));
            return handleOptionalResult(result, payload.value);
        }
        if (payload.value === undefined) {
            return payload;
        }
        return def.innerType._zod.run(payload, ctx);
    };
});
const $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
    defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
    defineLazy(inst._zod, "pattern", () => {
        const pattern = def.innerType._zod.pattern;
        return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : undefined;
    });
    defineLazy(inst._zod, "values", () => {
        return def.innerType._zod.values ? new Set([...def.innerType._zod.values, null]) : undefined;
    });
    inst._zod.parse = (payload, ctx) => {
        // Forward direction (decode): allow null to pass through
        if (payload.value === null)
            return payload;
        return def.innerType._zod.run(payload, ctx);
    };
});
const $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
    $ZodType.init(inst, def);
    // inst._zod.qin = "true";
    inst._zod.optin = "optional";
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
            return def.innerType._zod.run(payload, ctx);
        }
        // Forward direction (decode): apply defaults for undefined input
        if (payload.value === undefined) {
            payload.value = def.defaultValue;
            /**
             * $ZodDefault returns the default value immediately in forward direction.
             * It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
            return payload;
        }
        // Forward direction: continue with default handling
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
            return result.then((result) => handleDefaultResult(result, def));
        }
        return handleDefaultResult(result, def);
    };
});
function handleDefaultResult(payload, def) {
    if (payload.value === undefined) {
        payload.value = def.defaultValue;
    }
    return payload;
}
const $ZodPrefault = /*@__PURE__*/ $constructor("$ZodPrefault", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.optin = "optional";
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
            return def.innerType._zod.run(payload, ctx);
        }
        // Forward direction (decode): apply prefault for undefined input
        if (payload.value === undefined) {
            payload.value = def.defaultValue;
        }
        return def.innerType._zod.run(payload, ctx);
    };
});
const $ZodNonOptional = /*@__PURE__*/ $constructor("$ZodNonOptional", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "values", () => {
        const v = def.innerType._zod.values;
        return v ? new Set([...v].filter((x) => x !== undefined)) : undefined;
    });
    inst._zod.parse = (payload, ctx) => {
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
            return result.then((result) => handleNonOptionalResult(result, inst));
        }
        return handleNonOptionalResult(result, inst);
    };
});
function handleNonOptionalResult(payload, inst) {
    if (!payload.issues.length && payload.value === undefined) {
        payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: payload.value,
            inst,
        });
    }
    return payload;
}
const $ZodSuccess = /*@__PURE__*/ $constructor("$ZodSuccess", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
            throw new $ZodEncodeError("ZodSuccess");
        }
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
            return result.then((result) => {
                payload.value = result.issues.length === 0;
                return payload;
            });
        }
        payload.value = result.issues.length === 0;
        return payload;
    };
});
const $ZodCatch = /*@__PURE__*/ $constructor("$ZodCatch", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
    defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
            return def.innerType._zod.run(payload, ctx);
        }
        // Forward direction (decode): apply catch logic
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
            return result.then((result) => {
                payload.value = result.value;
                if (result.issues.length) {
                    payload.value = def.catchValue({
                        ...payload,
                        error: {
                            issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())),
                        },
                        input: payload.value,
                    });
                    payload.issues = [];
                }
                return payload;
            });
        }
        payload.value = result.value;
        if (result.issues.length) {
            payload.value = def.catchValue({
                ...payload,
                error: {
                    issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())),
                },
                input: payload.value,
            });
            payload.issues = [];
        }
        return payload;
    };
});
const $ZodNaN = /*@__PURE__*/ $constructor("$ZodNaN", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
        if (typeof payload.value !== "number" || !Number.isNaN(payload.value)) {
            payload.issues.push({
                input: payload.value,
                inst,
                expected: "nan",
                code: "invalid_type",
            });
            return payload;
        }
        return payload;
    };
});
const $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "values", () => def.in._zod.values);
    defineLazy(inst._zod, "optin", () => def.in._zod.optin);
    defineLazy(inst._zod, "optout", () => def.out._zod.optout);
    defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
    inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
            const right = def.out._zod.run(payload, ctx);
            if (right instanceof Promise) {
                return right.then((right) => handlePipeResult(right, def.in, ctx));
            }
            return handlePipeResult(right, def.in, ctx);
        }
        const left = def.in._zod.run(payload, ctx);
        if (left instanceof Promise) {
            return left.then((left) => handlePipeResult(left, def.out, ctx));
        }
        return handlePipeResult(left, def.out, ctx);
    };
});
function handlePipeResult(left, next, ctx) {
    if (left.issues.length) {
        // prevent further checks
        left.aborted = true;
        return left;
    }
    return next._zod.run({ value: left.value, issues: left.issues }, ctx);
}
const $ZodCodec = /*@__PURE__*/ $constructor("$ZodCodec", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "values", () => def.in._zod.values);
    defineLazy(inst._zod, "optin", () => def.in._zod.optin);
    defineLazy(inst._zod, "optout", () => def.out._zod.optout);
    defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
    inst._zod.parse = (payload, ctx) => {
        const direction = ctx.direction || "forward";
        if (direction === "forward") {
            const left = def.in._zod.run(payload, ctx);
            if (left instanceof Promise) {
                return left.then((left) => handleCodecAResult(left, def, ctx));
            }
            return handleCodecAResult(left, def, ctx);
        }
        else {
            const right = def.out._zod.run(payload, ctx);
            if (right instanceof Promise) {
                return right.then((right) => handleCodecAResult(right, def, ctx));
            }
            return handleCodecAResult(right, def, ctx);
        }
    };
});
function handleCodecAResult(result, def, ctx) {
    if (result.issues.length) {
        // prevent further checks
        result.aborted = true;
        return result;
    }
    const direction = ctx.direction || "forward";
    if (direction === "forward") {
        const transformed = def.transform(result.value, result);
        if (transformed instanceof Promise) {
            return transformed.then((value) => handleCodecTxResult(result, value, def.out, ctx));
        }
        return handleCodecTxResult(result, transformed, def.out, ctx);
    }
    else {
        const transformed = def.reverseTransform(result.value, result);
        if (transformed instanceof Promise) {
            return transformed.then((value) => handleCodecTxResult(result, value, def.in, ctx));
        }
        return handleCodecTxResult(result, transformed, def.in, ctx);
    }
}
function handleCodecTxResult(left, value, nextSchema, ctx) {
    // Check if transform added any issues
    if (left.issues.length) {
        left.aborted = true;
        return left;
    }
    return nextSchema._zod.run({ value, issues: left.issues }, ctx);
}
const $ZodReadonly = /*@__PURE__*/ $constructor("$ZodReadonly", (inst, def) => {
    $ZodType.init(inst, def);
    defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
    defineLazy(inst._zod, "values", () => def.innerType._zod.values);
    defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
    defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
    inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
            return def.innerType._zod.run(payload, ctx);
        }
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
            return result.then(handleReadonlyResult);
        }
        return handleReadonlyResult(result);
    };
});
function handleReadonlyResult(payload) {
    payload.value = Object.freeze(payload.value);
    return payload;
}
const $ZodTemplateLiteral = /*@__PURE__*/ $constructor("$ZodTemplateLiteral", (inst, def) => {
    $ZodType.init(inst, def);
    const regexParts = [];
    for (const part of def.parts) {
        if (typeof part === "object" && part !== null) {
            // is Zod schema
            if (!part._zod.pattern) {
                // if (!source)
                throw new Error(`Invalid template literal part, no pattern found: ${[...part._zod.traits].shift()}`);
            }
            const source = part._zod.pattern instanceof RegExp ? part._zod.pattern.source : part._zod.pattern;
            if (!source)
                throw new Error(`Invalid template literal part: ${part._zod.traits}`);
            const start = source.startsWith("^") ? 1 : 0;
            const end = source.endsWith("$") ? source.length - 1 : source.length;
            regexParts.push(source.slice(start, end));
        }
        else if (part === null || primitiveTypes.has(typeof part)) {
            regexParts.push(escapeRegex(`${part}`));
        }
        else {
            throw new Error(`Invalid template literal part: ${part}`);
        }
    }
    inst._zod.pattern = new RegExp(`^${regexParts.join("")}$`);
    inst._zod.parse = (payload, _ctx) => {
        if (typeof payload.value !== "string") {
            payload.issues.push({
                input: payload.value,
                inst,
                expected: "template_literal",
                code: "invalid_type",
            });
            return payload;
        }
        inst._zod.pattern.lastIndex = 0;
        if (!inst._zod.pattern.test(payload.value)) {
            payload.issues.push({
                input: payload.value,
                inst,
                code: "invalid_format",
                format: def.format ?? "template_literal",
                pattern: inst._zod.pattern.source,
            });
            return payload;
        }
        return payload;
    };
});
const $ZodFunction = /*@__PURE__*/ $constructor("$ZodFunction", (inst, def) => {
    $ZodType.init(inst, def);
    inst._def = def;
    inst._zod.def = def;
    inst.implement = (func) => {
        if (typeof func !== "function") {
            throw new Error("implement() must be called with a function");
        }
        return function (...args) {
            const parsedArgs = inst._def.input ? parse$1(inst._def.input, args) : args;
            const result = Reflect.apply(func, this, parsedArgs);
            if (inst._def.output) {
                return parse$1(inst._def.output, result);
            }
            return result;
        };
    };
    inst.implementAsync = (func) => {
        if (typeof func !== "function") {
            throw new Error("implementAsync() must be called with a function");
        }
        return async function (...args) {
            const parsedArgs = inst._def.input ? await parseAsync$1(inst._def.input, args) : args;
            const result = await Reflect.apply(func, this, parsedArgs);
            if (inst._def.output) {
                return await parseAsync$1(inst._def.output, result);
            }
            return result;
        };
    };
    inst._zod.parse = (payload, _ctx) => {
        if (typeof payload.value !== "function") {
            payload.issues.push({
                code: "invalid_type",
                expected: "function",
                input: payload.value,
                inst,
            });
            return payload;
        }
        // Check if output is a promise type to determine if we should use async implementation
        const hasPromiseOutput = inst._def.output && inst._def.output._zod.def.type === "promise";
        if (hasPromiseOutput) {
            payload.value = inst.implementAsync(payload.value);
        }
        else {
            payload.value = inst.implement(payload.value);
        }
        return payload;
    };
    inst.input = (...args) => {
        const F = inst.constructor;
        if (Array.isArray(args[0])) {
            return new F({
                type: "function",
                input: new $ZodTuple({
                    type: "tuple",
                    items: args[0],
                    rest: args[1],
                }),
                output: inst._def.output,
            });
        }
        return new F({
            type: "function",
            input: args[0],
            output: inst._def.output,
        });
    };
    inst.output = (output) => {
        const F = inst.constructor;
        return new F({
            type: "function",
            input: inst._def.input,
            output,
        });
    };
    return inst;
});
const $ZodPromise = /*@__PURE__*/ $constructor("$ZodPromise", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, ctx) => {
        return Promise.resolve(payload.value).then((inner) => def.innerType._zod.run({ value: inner, issues: [] }, ctx));
    };
});
const $ZodLazy = /*@__PURE__*/ $constructor("$ZodLazy", (inst, def) => {
    $ZodType.init(inst, def);
    // let _innerType!: any;
    // util.defineLazy(def, "getter", () => {
    //   if (!_innerType) {
    //     _innerType = def.getter();
    //   }
    //   return () => _innerType;
    // });
    defineLazy(inst._zod, "innerType", () => def.getter());
    defineLazy(inst._zod, "pattern", () => inst._zod.innerType._zod.pattern);
    defineLazy(inst._zod, "propValues", () => inst._zod.innerType._zod.propValues);
    defineLazy(inst._zod, "optin", () => inst._zod.innerType._zod.optin ?? undefined);
    defineLazy(inst._zod, "optout", () => inst._zod.innerType._zod.optout ?? undefined);
    inst._zod.parse = (payload, ctx) => {
        const inner = inst._zod.innerType;
        return inner._zod.run(payload, ctx);
    };
});
const $ZodCustom = /*@__PURE__*/ $constructor("$ZodCustom", (inst, def) => {
    $ZodCheck.init(inst, def);
    $ZodType.init(inst, def);
    inst._zod.parse = (payload, _) => {
        return payload;
    };
    inst._zod.check = (payload) => {
        const input = payload.value;
        const r = def.fn(input);
        if (r instanceof Promise) {
            return r.then((r) => handleRefineResult(r, payload, input, inst));
        }
        handleRefineResult(r, payload, input, inst);
        return;
    };
});
function handleRefineResult(result, payload, input, inst) {
    if (!result) {
        const _iss = {
            code: "custom",
            input,
            inst, // incorporates params.error into issue reporting
            path: [...(inst._zod.def.path ?? [])], // incorporates params.error into issue reporting
            continue: !inst._zod.def.abort,
            // params: inst._zod.def.params,
        };
        if (inst._zod.def.params)
            _iss.params = inst._zod.def.params;
        payload.issues.push(issue(_iss));
    }
}

const error$I = () => {
    const Sizable = {
        string: { unit: "حرف", verb: "أن يحوي" },
        file: { unit: "بايت", verb: "أن يحوي" },
        array: { unit: "عنصر", verb: "أن يحوي" },
        set: { unit: "عنصر", verb: "أن يحوي" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "number";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "مدخل",
        email: "بريد إلكتروني",
        url: "رابط",
        emoji: "إيموجي",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "تاريخ ووقت بمعيار ISO",
        date: "تاريخ بمعيار ISO",
        time: "وقت بمعيار ISO",
        duration: "مدة بمعيار ISO",
        ipv4: "عنوان IPv4",
        ipv6: "عنوان IPv6",
        cidrv4: "مدى عناوين بصيغة IPv4",
        cidrv6: "مدى عناوين بصيغة IPv6",
        base64: "نَص بترميز base64-encoded",
        base64url: "نَص بترميز base64url-encoded",
        json_string: "نَص على هيئة JSON",
        e164: "رقم هاتف بمعيار E.164",
        jwt: "JWT",
        template_literal: "مدخل",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `مدخلات غير مقبولة: يفترض إدخال ${issue.expected}، ولكن تم إدخال ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `مدخلات غير مقبولة: يفترض إدخال ${stringifyPrimitive(issue.values[0])}`;
                return `اختيار غير مقبول: يتوقع انتقاء أحد هذه الخيارات: ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return ` أكبر من اللازم: يفترض أن تكون ${issue.origin ?? "القيمة"} ${adj} ${issue.maximum.toString()} ${sizing.unit ?? "عنصر"}`;
                return `أكبر من اللازم: يفترض أن تكون ${issue.origin ?? "القيمة"} ${adj} ${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `أصغر من اللازم: يفترض لـ ${issue.origin} أن يكون ${adj} ${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `أصغر من اللازم: يفترض لـ ${issue.origin} أن يكون ${adj} ${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `نَص غير مقبول: يجب أن يبدأ بـ "${issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `نَص غير مقبول: يجب أن ينتهي بـ "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `نَص غير مقبول: يجب أن يتضمَّن "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `نَص غير مقبول: يجب أن يطابق النمط ${_issue.pattern}`;
                return `${Nouns[_issue.format] ?? issue.format} غير مقبول`;
            }
            case "not_multiple_of":
                return `رقم غير مقبول: يجب أن يكون من مضاعفات ${issue.divisor}`;
            case "unrecognized_keys":
                return `معرف${issue.keys.length > 1 ? "ات" : ""} غريب${issue.keys.length > 1 ? "ة" : ""}: ${joinValues(issue.keys, "، ")}`;
            case "invalid_key":
                return `معرف غير مقبول في ${issue.origin}`;
            case "invalid_union":
                return "مدخل غير مقبول";
            case "invalid_element":
                return `مدخل غير مقبول في ${issue.origin}`;
            default:
                return "مدخل غير مقبول";
        }
    };
};
function ar () {
    return {
        localeError: error$I(),
    };
}

const error$H = () => {
    const Sizable = {
        string: { unit: "simvol", verb: "olmalıdır" },
        file: { unit: "bayt", verb: "olmalıdır" },
        array: { unit: "element", verb: "olmalıdır" },
        set: { unit: "element", verb: "olmalıdır" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "number";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "input",
        email: "email address",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO datetime",
        date: "ISO date",
        time: "ISO time",
        duration: "ISO duration",
        ipv4: "IPv4 address",
        ipv6: "IPv6 address",
        cidrv4: "IPv4 range",
        cidrv6: "IPv6 range",
        base64: "base64-encoded string",
        base64url: "base64url-encoded string",
        json_string: "JSON string",
        e164: "E.164 number",
        jwt: "JWT",
        template_literal: "input",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Yanlış dəyər: gözlənilən ${issue.expected}, daxil olan ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Yanlış dəyər: gözlənilən ${stringifyPrimitive(issue.values[0])}`;
                return `Yanlış seçim: aşağıdakılardan biri olmalıdır: ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Çox böyük: gözlənilən ${issue.origin ?? "dəyər"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "element"}`;
                return `Çox böyük: gözlənilən ${issue.origin ?? "dəyər"} ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Çox kiçik: gözlənilən ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                return `Çox kiçik: gözlənilən ${issue.origin} ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Yanlış mətn: "${_issue.prefix}" ilə başlamalıdır`;
                if (_issue.format === "ends_with")
                    return `Yanlış mətn: "${_issue.suffix}" ilə bitməlidir`;
                if (_issue.format === "includes")
                    return `Yanlış mətn: "${_issue.includes}" daxil olmalıdır`;
                if (_issue.format === "regex")
                    return `Yanlış mətn: ${_issue.pattern} şablonuna uyğun olmalıdır`;
                return `Yanlış ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Yanlış ədəd: ${issue.divisor} ilə bölünə bilən olmalıdır`;
            case "unrecognized_keys":
                return `Tanınmayan açar${issue.keys.length > 1 ? "lar" : ""}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `${issue.origin} daxilində yanlış açar`;
            case "invalid_union":
                return "Yanlış dəyər";
            case "invalid_element":
                return `${issue.origin} daxilində yanlış dəyər`;
            default:
                return `Yanlış dəyər`;
        }
    };
};
function az () {
    return {
        localeError: error$H(),
    };
}

function getBelarusianPlural(count, one, few, many) {
    const absCount = Math.abs(count);
    const lastDigit = absCount % 10;
    const lastTwoDigits = absCount % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return many;
    }
    if (lastDigit === 1) {
        return one;
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
        return few;
    }
    return many;
}
const error$G = () => {
    const Sizable = {
        string: {
            unit: {
                one: "сімвал",
                few: "сімвалы",
                many: "сімвалаў",
            },
            verb: "мець",
        },
        array: {
            unit: {
                one: "элемент",
                few: "элементы",
                many: "элементаў",
            },
            verb: "мець",
        },
        set: {
            unit: {
                one: "элемент",
                few: "элементы",
                many: "элементаў",
            },
            verb: "мець",
        },
        file: {
            unit: {
                one: "байт",
                few: "байты",
                many: "байтаў",
            },
            verb: "мець",
        },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "лік";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "масіў";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "увод",
        email: "email адрас",
        url: "URL",
        emoji: "эмодзі",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO дата і час",
        date: "ISO дата",
        time: "ISO час",
        duration: "ISO працягласць",
        ipv4: "IPv4 адрас",
        ipv6: "IPv6 адрас",
        cidrv4: "IPv4 дыяпазон",
        cidrv6: "IPv6 дыяпазон",
        base64: "радок у фармаце base64",
        base64url: "радок у фармаце base64url",
        json_string: "JSON радок",
        e164: "нумар E.164",
        jwt: "JWT",
        template_literal: "увод",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Няправільны ўвод: чакаўся ${issue.expected}, атрымана ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Няправільны ўвод: чакалася ${stringifyPrimitive(issue.values[0])}`;
                return `Няправільны варыянт: чакаўся адзін з ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    const maxValue = Number(issue.maximum);
                    const unit = getBelarusianPlural(maxValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
                    return `Занадта вялікі: чакалася, што ${issue.origin ?? "значэнне"} павінна ${sizing.verb} ${adj}${issue.maximum.toString()} ${unit}`;
                }
                return `Занадта вялікі: чакалася, што ${issue.origin ?? "значэнне"} павінна быць ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    const minValue = Number(issue.minimum);
                    const unit = getBelarusianPlural(minValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
                    return `Занадта малы: чакалася, што ${issue.origin} павінна ${sizing.verb} ${adj}${issue.minimum.toString()} ${unit}`;
                }
                return `Занадта малы: чакалася, што ${issue.origin} павінна быць ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Няправільны радок: павінен пачынацца з "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Няправільны радок: павінен заканчвацца на "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Няправільны радок: павінен змяшчаць "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Няправільны радок: павінен адпавядаць шаблону ${_issue.pattern}`;
                return `Няправільны ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Няправільны лік: павінен быць кратным ${issue.divisor}`;
            case "unrecognized_keys":
                return `Нераспазнаны ${issue.keys.length > 1 ? "ключы" : "ключ"}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Няправільны ключ у ${issue.origin}`;
            case "invalid_union":
                return "Няправільны ўвод";
            case "invalid_element":
                return `Няправільнае значэнне ў ${issue.origin}`;
            default:
                return `Няправільны ўвод`;
        }
    };
};
function be () {
    return {
        localeError: error$G(),
    };
}

const parsedType$6 = (data) => {
    const t = typeof data;
    switch (t) {
        case "number": {
            return Number.isNaN(data) ? "NaN" : "число";
        }
        case "object": {
            if (Array.isArray(data)) {
                return "масив";
            }
            if (data === null) {
                return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                return data.constructor.name;
            }
        }
    }
    return t;
};
const error$F = () => {
    const Sizable = {
        string: { unit: "символа", verb: "да съдържа" },
        file: { unit: "байта", verb: "да съдържа" },
        array: { unit: "елемента", verb: "да съдържа" },
        set: { unit: "елемента", verb: "да съдържа" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const Nouns = {
        regex: "вход",
        email: "имейл адрес",
        url: "URL",
        emoji: "емоджи",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO време",
        date: "ISO дата",
        time: "ISO време",
        duration: "ISO продължителност",
        ipv4: "IPv4 адрес",
        ipv6: "IPv6 адрес",
        cidrv4: "IPv4 диапазон",
        cidrv6: "IPv6 диапазон",
        base64: "base64-кодиран низ",
        base64url: "base64url-кодиран низ",
        json_string: "JSON низ",
        e164: "E.164 номер",
        jwt: "JWT",
        template_literal: "вход",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Невалиден вход: очакван ${issue.expected}, получен ${parsedType$6(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Невалиден вход: очакван ${stringifyPrimitive(issue.values[0])}`;
                return `Невалидна опция: очаквано едно от ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Твърде голямо: очаква се ${issue.origin ?? "стойност"} да съдържа ${adj}${issue.maximum.toString()} ${sizing.unit ?? "елемента"}`;
                return `Твърде голямо: очаква се ${issue.origin ?? "стойност"} да бъде ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Твърде малко: очаква се ${issue.origin} да съдържа ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Твърде малко: очаква се ${issue.origin} да бъде ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `Невалиден низ: трябва да започва с "${_issue.prefix}"`;
                }
                if (_issue.format === "ends_with")
                    return `Невалиден низ: трябва да завършва с "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Невалиден низ: трябва да включва "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Невалиден низ: трябва да съвпада с ${_issue.pattern}`;
                let invalid_adj = "Невалиден";
                if (_issue.format === "emoji")
                    invalid_adj = "Невалидно";
                if (_issue.format === "datetime")
                    invalid_adj = "Невалидно";
                if (_issue.format === "date")
                    invalid_adj = "Невалидна";
                if (_issue.format === "time")
                    invalid_adj = "Невалидно";
                if (_issue.format === "duration")
                    invalid_adj = "Невалидна";
                return `${invalid_adj} ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Невалидно число: трябва да бъде кратно на ${issue.divisor}`;
            case "unrecognized_keys":
                return `Неразпознат${issue.keys.length > 1 ? "и" : ""} ключ${issue.keys.length > 1 ? "ове" : ""}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Невалиден ключ в ${issue.origin}`;
            case "invalid_union":
                return "Невалиден вход";
            case "invalid_element":
                return `Невалидна стойност в ${issue.origin}`;
            default:
                return `Невалиден вход`;
        }
    };
};
function bg () {
    return {
        localeError: error$F(),
    };
}

const error$E = () => {
    const Sizable = {
        string: { unit: "caràcters", verb: "contenir" },
        file: { unit: "bytes", verb: "contenir" },
        array: { unit: "elements", verb: "contenir" },
        set: { unit: "elements", verb: "contenir" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "number";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "entrada",
        email: "adreça electrònica",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "data i hora ISO",
        date: "data ISO",
        time: "hora ISO",
        duration: "durada ISO",
        ipv4: "adreça IPv4",
        ipv6: "adreça IPv6",
        cidrv4: "rang IPv4",
        cidrv6: "rang IPv6",
        base64: "cadena codificada en base64",
        base64url: "cadena codificada en base64url",
        json_string: "cadena JSON",
        e164: "número E.164",
        jwt: "JWT",
        template_literal: "entrada",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Tipus invàlid: s'esperava ${issue.expected}, s'ha rebut ${parsedType(issue.input)}`;
            // return `Tipus invàlid: s'esperava ${issue.expected}, s'ha rebut ${util.getParsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Valor invàlid: s'esperava ${stringifyPrimitive(issue.values[0])}`;
                return `Opció invàlida: s'esperava una de ${joinValues(issue.values, " o ")}`;
            case "too_big": {
                const adj = issue.inclusive ? "com a màxim" : "menys de";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Massa gran: s'esperava que ${issue.origin ?? "el valor"} contingués ${adj} ${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
                return `Massa gran: s'esperava que ${issue.origin ?? "el valor"} fos ${adj} ${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? "com a mínim" : "més de";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Massa petit: s'esperava que ${issue.origin} contingués ${adj} ${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Massa petit: s'esperava que ${issue.origin} fos ${adj} ${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `Format invàlid: ha de començar amb "${_issue.prefix}"`;
                }
                if (_issue.format === "ends_with")
                    return `Format invàlid: ha d'acabar amb "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Format invàlid: ha d'incloure "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Format invàlid: ha de coincidir amb el patró ${_issue.pattern}`;
                return `Format invàlid per a ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Número invàlid: ha de ser múltiple de ${issue.divisor}`;
            case "unrecognized_keys":
                return `Clau${issue.keys.length > 1 ? "s" : ""} no reconeguda${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Clau invàlida a ${issue.origin}`;
            case "invalid_union":
                return "Entrada invàlida"; // Could also be "Tipus d'unió invàlid" but "Entrada invàlida" is more general
            case "invalid_element":
                return `Element invàlid a ${issue.origin}`;
            default:
                return `Entrada invàlida`;
        }
    };
};
function ca () {
    return {
        localeError: error$E(),
    };
}

const error$D = () => {
    const Sizable = {
        string: { unit: "znaků", verb: "mít" },
        file: { unit: "bajtů", verb: "mít" },
        array: { unit: "prvků", verb: "mít" },
        set: { unit: "prvků", verb: "mít" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "číslo";
            }
            case "string": {
                return "řetězec";
            }
            case "boolean": {
                return "boolean";
            }
            case "bigint": {
                return "bigint";
            }
            case "function": {
                return "funkce";
            }
            case "symbol": {
                return "symbol";
            }
            case "undefined": {
                return "undefined";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "pole";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "regulární výraz",
        email: "e-mailová adresa",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "datum a čas ve formátu ISO",
        date: "datum ve formátu ISO",
        time: "čas ve formátu ISO",
        duration: "doba trvání ISO",
        ipv4: "IPv4 adresa",
        ipv6: "IPv6 adresa",
        cidrv4: "rozsah IPv4",
        cidrv6: "rozsah IPv6",
        base64: "řetězec zakódovaný ve formátu base64",
        base64url: "řetězec zakódovaný ve formátu base64url",
        json_string: "řetězec ve formátu JSON",
        e164: "číslo E.164",
        jwt: "JWT",
        template_literal: "vstup",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Neplatný vstup: očekáváno ${issue.expected}, obdrženo ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Neplatný vstup: očekáváno ${stringifyPrimitive(issue.values[0])}`;
                return `Neplatná možnost: očekávána jedna z hodnot ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Hodnota je příliš velká: ${issue.origin ?? "hodnota"} musí mít ${adj}${issue.maximum.toString()} ${sizing.unit ?? "prvků"}`;
                }
                return `Hodnota je příliš velká: ${issue.origin ?? "hodnota"} musí být ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Hodnota je příliš malá: ${issue.origin ?? "hodnota"} musí mít ${adj}${issue.minimum.toString()} ${sizing.unit ?? "prvků"}`;
                }
                return `Hodnota je příliš malá: ${issue.origin ?? "hodnota"} musí být ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Neplatný řetězec: musí začínat na "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Neplatný řetězec: musí končit na "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Neplatný řetězec: musí obsahovat "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Neplatný řetězec: musí odpovídat vzoru ${_issue.pattern}`;
                return `Neplatný formát ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Neplatné číslo: musí být násobkem ${issue.divisor}`;
            case "unrecognized_keys":
                return `Neznámé klíče: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Neplatný klíč v ${issue.origin}`;
            case "invalid_union":
                return "Neplatný vstup";
            case "invalid_element":
                return `Neplatná hodnota v ${issue.origin}`;
            default:
                return `Neplatný vstup`;
        }
    };
};
function cs () {
    return {
        localeError: error$D(),
    };
}

const error$C = () => {
    const Sizable = {
        string: { unit: "tegn", verb: "havde" },
        file: { unit: "bytes", verb: "havde" },
        array: { unit: "elementer", verb: "indeholdt" },
        set: { unit: "elementer", verb: "indeholdt" },
    };
    const TypeNames = {
        string: "streng",
        number: "tal",
        boolean: "boolean",
        array: "liste",
        object: "objekt",
        set: "sæt",
        file: "fil",
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    function getTypeName(type) {
        return TypeNames[type] ?? type;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "tal";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "liste";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
                return "objekt";
            }
        }
        return t;
    };
    const Nouns = {
        regex: "input",
        email: "e-mailadresse",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO dato- og klokkeslæt",
        date: "ISO-dato",
        time: "ISO-klokkeslæt",
        duration: "ISO-varighed",
        ipv4: "IPv4-område",
        ipv6: "IPv6-område",
        cidrv4: "IPv4-spektrum",
        cidrv6: "IPv6-spektrum",
        base64: "base64-kodet streng",
        base64url: "base64url-kodet streng",
        json_string: "JSON-streng",
        e164: "E.164-nummer",
        jwt: "JWT",
        template_literal: "input",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Ugyldigt input: forventede ${getTypeName(issue.expected)}, fik ${getTypeName(parsedType(issue.input))}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Ugyldig værdi: forventede ${stringifyPrimitive(issue.values[0])}`;
                return `Ugyldigt valg: forventede en af følgende ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                const origin = getTypeName(issue.origin);
                if (sizing)
                    return `For stor: forventede ${origin ?? "value"} ${sizing.verb} ${adj} ${issue.maximum.toString()} ${sizing.unit ?? "elementer"}`;
                return `For stor: forventede ${origin ?? "value"} havde ${adj} ${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                const origin = getTypeName(issue.origin);
                if (sizing) {
                    return `For lille: forventede ${origin} ${sizing.verb} ${adj} ${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `For lille: forventede ${origin} havde ${adj} ${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Ugyldig streng: skal starte med "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Ugyldig streng: skal ende med "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Ugyldig streng: skal indeholde "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Ugyldig streng: skal matche mønsteret ${_issue.pattern}`;
                return `Ugyldig ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Ugyldigt tal: skal være deleligt med ${issue.divisor}`;
            case "unrecognized_keys":
                return `${issue.keys.length > 1 ? "Ukendte nøgler" : "Ukendt nøgle"}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Ugyldig nøgle i ${issue.origin}`;
            case "invalid_union":
                return "Ugyldigt input: matcher ingen af de tilladte typer";
            case "invalid_element":
                return `Ugyldig værdi i ${issue.origin}`;
            default:
                return `Ugyldigt input`;
        }
    };
};
function da () {
    return {
        localeError: error$C(),
    };
}

const error$B = () => {
    const Sizable = {
        string: { unit: "Zeichen", verb: "zu haben" },
        file: { unit: "Bytes", verb: "zu haben" },
        array: { unit: "Elemente", verb: "zu haben" },
        set: { unit: "Elemente", verb: "zu haben" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "Zahl";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "Array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "Eingabe",
        email: "E-Mail-Adresse",
        url: "URL",
        emoji: "Emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO-Datum und -Uhrzeit",
        date: "ISO-Datum",
        time: "ISO-Uhrzeit",
        duration: "ISO-Dauer",
        ipv4: "IPv4-Adresse",
        ipv6: "IPv6-Adresse",
        cidrv4: "IPv4-Bereich",
        cidrv6: "IPv6-Bereich",
        base64: "Base64-codierter String",
        base64url: "Base64-URL-codierter String",
        json_string: "JSON-String",
        e164: "E.164-Nummer",
        jwt: "JWT",
        template_literal: "Eingabe",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Ungültige Eingabe: erwartet ${issue.expected}, erhalten ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Ungültige Eingabe: erwartet ${stringifyPrimitive(issue.values[0])}`;
                return `Ungültige Option: erwartet eine von ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Zu groß: erwartet, dass ${issue.origin ?? "Wert"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "Elemente"} hat`;
                return `Zu groß: erwartet, dass ${issue.origin ?? "Wert"} ${adj}${issue.maximum.toString()} ist`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Zu klein: erwartet, dass ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit} hat`;
                }
                return `Zu klein: erwartet, dass ${issue.origin} ${adj}${issue.minimum.toString()} ist`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Ungültiger String: muss mit "${_issue.prefix}" beginnen`;
                if (_issue.format === "ends_with")
                    return `Ungültiger String: muss mit "${_issue.suffix}" enden`;
                if (_issue.format === "includes")
                    return `Ungültiger String: muss "${_issue.includes}" enthalten`;
                if (_issue.format === "regex")
                    return `Ungültiger String: muss dem Muster ${_issue.pattern} entsprechen`;
                return `Ungültig: ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Ungültige Zahl: muss ein Vielfaches von ${issue.divisor} sein`;
            case "unrecognized_keys":
                return `${issue.keys.length > 1 ? "Unbekannte Schlüssel" : "Unbekannter Schlüssel"}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Ungültiger Schlüssel in ${issue.origin}`;
            case "invalid_union":
                return "Ungültige Eingabe";
            case "invalid_element":
                return `Ungültiger Wert in ${issue.origin}`;
            default:
                return `Ungültige Eingabe`;
        }
    };
};
function de () {
    return {
        localeError: error$B(),
    };
}

const parsedType$5 = (data) => {
    const t = typeof data;
    switch (t) {
        case "number": {
            return Number.isNaN(data) ? "NaN" : "number";
        }
        case "object": {
            if (Array.isArray(data)) {
                return "array";
            }
            if (data === null) {
                return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                return data.constructor.name;
            }
        }
    }
    return t;
};
const error$A = () => {
    const Sizable = {
        string: { unit: "characters", verb: "to have" },
        file: { unit: "bytes", verb: "to have" },
        array: { unit: "items", verb: "to have" },
        set: { unit: "items", verb: "to have" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const Nouns = {
        regex: "input",
        email: "email address",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO datetime",
        date: "ISO date",
        time: "ISO time",
        duration: "ISO duration",
        ipv4: "IPv4 address",
        ipv6: "IPv6 address",
        cidrv4: "IPv4 range",
        cidrv6: "IPv6 range",
        base64: "base64-encoded string",
        base64url: "base64url-encoded string",
        json_string: "JSON string",
        e164: "E.164 number",
        jwt: "JWT",
        template_literal: "input",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Invalid input: expected ${issue.expected}, received ${parsedType$5(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Invalid input: expected ${stringifyPrimitive(issue.values[0])}`;
                return `Invalid option: expected one of ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Too big: expected ${issue.origin ?? "value"} to have ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
                return `Too big: expected ${issue.origin ?? "value"} to be ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Too small: expected ${issue.origin} to have ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Too small: expected ${issue.origin} to be ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `Invalid string: must start with "${_issue.prefix}"`;
                }
                if (_issue.format === "ends_with")
                    return `Invalid string: must end with "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Invalid string: must include "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Invalid string: must match pattern ${_issue.pattern}`;
                return `Invalid ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Invalid number: must be a multiple of ${issue.divisor}`;
            case "unrecognized_keys":
                return `Unrecognized key${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Invalid key in ${issue.origin}`;
            case "invalid_union":
                return "Invalid input";
            case "invalid_element":
                return `Invalid value in ${issue.origin}`;
            default:
                return `Invalid input`;
        }
    };
};
function en () {
    return {
        localeError: error$A(),
    };
}

const parsedType$4 = (data) => {
    const t = typeof data;
    switch (t) {
        case "number": {
            return Number.isNaN(data) ? "NaN" : "nombro";
        }
        case "object": {
            if (Array.isArray(data)) {
                return "tabelo";
            }
            if (data === null) {
                return "senvalora";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                return data.constructor.name;
            }
        }
    }
    return t;
};
const error$z = () => {
    const Sizable = {
        string: { unit: "karaktrojn", verb: "havi" },
        file: { unit: "bajtojn", verb: "havi" },
        array: { unit: "elementojn", verb: "havi" },
        set: { unit: "elementojn", verb: "havi" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const Nouns = {
        regex: "enigo",
        email: "retadreso",
        url: "URL",
        emoji: "emoĝio",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO-datotempo",
        date: "ISO-dato",
        time: "ISO-tempo",
        duration: "ISO-daŭro",
        ipv4: "IPv4-adreso",
        ipv6: "IPv6-adreso",
        cidrv4: "IPv4-rango",
        cidrv6: "IPv6-rango",
        base64: "64-ume kodita karaktraro",
        base64url: "URL-64-ume kodita karaktraro",
        json_string: "JSON-karaktraro",
        e164: "E.164-nombro",
        jwt: "JWT",
        template_literal: "enigo",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Nevalida enigo: atendiĝis ${issue.expected}, riceviĝis ${parsedType$4(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Nevalida enigo: atendiĝis ${stringifyPrimitive(issue.values[0])}`;
                return `Nevalida opcio: atendiĝis unu el ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Tro granda: atendiĝis ke ${issue.origin ?? "valoro"} havu ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementojn"}`;
                return `Tro granda: atendiĝis ke ${issue.origin ?? "valoro"} havu ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Tro malgranda: atendiĝis ke ${issue.origin} havu ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Tro malgranda: atendiĝis ke ${issue.origin} estu ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Nevalida karaktraro: devas komenciĝi per "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Nevalida karaktraro: devas finiĝi per "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Nevalida karaktraro: devas inkluzivi "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Nevalida karaktraro: devas kongrui kun la modelo ${_issue.pattern}`;
                return `Nevalida ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Nevalida nombro: devas esti oblo de ${issue.divisor}`;
            case "unrecognized_keys":
                return `Nekonata${issue.keys.length > 1 ? "j" : ""} ŝlosilo${issue.keys.length > 1 ? "j" : ""}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Nevalida ŝlosilo en ${issue.origin}`;
            case "invalid_union":
                return "Nevalida enigo";
            case "invalid_element":
                return `Nevalida valoro en ${issue.origin}`;
            default:
                return `Nevalida enigo`;
        }
    };
};
function eo () {
    return {
        localeError: error$z(),
    };
}

const error$y = () => {
    const Sizable = {
        string: { unit: "caracteres", verb: "tener" },
        file: { unit: "bytes", verb: "tener" },
        array: { unit: "elementos", verb: "tener" },
        set: { unit: "elementos", verb: "tener" },
    };
    const TypeNames = {
        string: "texto",
        number: "número",
        boolean: "booleano",
        array: "arreglo",
        object: "objeto",
        set: "conjunto",
        file: "archivo",
        date: "fecha",
        bigint: "número grande",
        symbol: "símbolo",
        undefined: "indefinido",
        null: "nulo",
        function: "función",
        map: "mapa",
        record: "registro",
        tuple: "tupla",
        enum: "enumeración",
        union: "unión",
        literal: "literal",
        promise: "promesa",
        void: "vacío",
        never: "nunca",
        unknown: "desconocido",
        any: "cualquiera",
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    function getTypeName(type) {
        return TypeNames[type] ?? type;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "number";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype) {
                    return data.constructor.name;
                }
                return "object";
            }
        }
        return t;
    };
    const Nouns = {
        regex: "entrada",
        email: "dirección de correo electrónico",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "fecha y hora ISO",
        date: "fecha ISO",
        time: "hora ISO",
        duration: "duración ISO",
        ipv4: "dirección IPv4",
        ipv6: "dirección IPv6",
        cidrv4: "rango IPv4",
        cidrv6: "rango IPv6",
        base64: "cadena codificada en base64",
        base64url: "URL codificada en base64",
        json_string: "cadena JSON",
        e164: "número E.164",
        jwt: "JWT",
        template_literal: "entrada",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Entrada inválida: se esperaba ${getTypeName(issue.expected)}, recibido ${getTypeName(parsedType(issue.input))}`;
            // return `Entrada inválida: se esperaba ${issue.expected}, recibido ${util.getParsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Entrada inválida: se esperaba ${stringifyPrimitive(issue.values[0])}`;
                return `Opción inválida: se esperaba una de ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                const origin = getTypeName(issue.origin);
                if (sizing)
                    return `Demasiado grande: se esperaba que ${origin ?? "valor"} tuviera ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementos"}`;
                return `Demasiado grande: se esperaba que ${origin ?? "valor"} fuera ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                const origin = getTypeName(issue.origin);
                if (sizing) {
                    return `Demasiado pequeño: se esperaba que ${origin} tuviera ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Demasiado pequeño: se esperaba que ${origin} fuera ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Cadena inválida: debe comenzar con "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Cadena inválida: debe terminar en "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Cadena inválida: debe incluir "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Cadena inválida: debe coincidir con el patrón ${_issue.pattern}`;
                return `Inválido ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Número inválido: debe ser múltiplo de ${issue.divisor}`;
            case "unrecognized_keys":
                return `Llave${issue.keys.length > 1 ? "s" : ""} desconocida${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Llave inválida en ${getTypeName(issue.origin)}`;
            case "invalid_union":
                return "Entrada inválida";
            case "invalid_element":
                return `Valor inválido en ${getTypeName(issue.origin)}`;
            default:
                return `Entrada inválida`;
        }
    };
};
function es () {
    return {
        localeError: error$y(),
    };
}

const error$x = () => {
    const Sizable = {
        string: { unit: "کاراکتر", verb: "داشته باشد" },
        file: { unit: "بایت", verb: "داشته باشد" },
        array: { unit: "آیتم", verb: "داشته باشد" },
        set: { unit: "آیتم", verb: "داشته باشد" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "عدد";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "آرایه";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "ورودی",
        email: "آدرس ایمیل",
        url: "URL",
        emoji: "ایموجی",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "تاریخ و زمان ایزو",
        date: "تاریخ ایزو",
        time: "زمان ایزو",
        duration: "مدت زمان ایزو",
        ipv4: "IPv4 آدرس",
        ipv6: "IPv6 آدرس",
        cidrv4: "IPv4 دامنه",
        cidrv6: "IPv6 دامنه",
        base64: "base64-encoded رشته",
        base64url: "base64url-encoded رشته",
        json_string: "JSON رشته",
        e164: "E.164 عدد",
        jwt: "JWT",
        template_literal: "ورودی",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `ورودی نامعتبر: می‌بایست ${issue.expected} می‌بود، ${parsedType(issue.input)} دریافت شد`;
            case "invalid_value":
                if (issue.values.length === 1) {
                    return `ورودی نامعتبر: می‌بایست ${stringifyPrimitive(issue.values[0])} می‌بود`;
                }
                return `گزینه نامعتبر: می‌بایست یکی از ${joinValues(issue.values, "|")} می‌بود`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `خیلی بزرگ: ${issue.origin ?? "مقدار"} باید ${adj}${issue.maximum.toString()} ${sizing.unit ?? "عنصر"} باشد`;
                }
                return `خیلی بزرگ: ${issue.origin ?? "مقدار"} باید ${adj}${issue.maximum.toString()} باشد`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `خیلی کوچک: ${issue.origin} باید ${adj}${issue.minimum.toString()} ${sizing.unit} باشد`;
                }
                return `خیلی کوچک: ${issue.origin} باید ${adj}${issue.minimum.toString()} باشد`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `رشته نامعتبر: باید با "${_issue.prefix}" شروع شود`;
                }
                if (_issue.format === "ends_with") {
                    return `رشته نامعتبر: باید با "${_issue.suffix}" تمام شود`;
                }
                if (_issue.format === "includes") {
                    return `رشته نامعتبر: باید شامل "${_issue.includes}" باشد`;
                }
                if (_issue.format === "regex") {
                    return `رشته نامعتبر: باید با الگوی ${_issue.pattern} مطابقت داشته باشد`;
                }
                return `${Nouns[_issue.format] ?? issue.format} نامعتبر`;
            }
            case "not_multiple_of":
                return `عدد نامعتبر: باید مضرب ${issue.divisor} باشد`;
            case "unrecognized_keys":
                return `کلید${issue.keys.length > 1 ? "های" : ""} ناشناس: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `کلید ناشناس در ${issue.origin}`;
            case "invalid_union":
                return `ورودی نامعتبر`;
            case "invalid_element":
                return `مقدار نامعتبر در ${issue.origin}`;
            default:
                return `ورودی نامعتبر`;
        }
    };
};
function fa () {
    return {
        localeError: error$x(),
    };
}

const error$w = () => {
    const Sizable = {
        string: { unit: "merkkiä", subject: "merkkijonon" },
        file: { unit: "tavua", subject: "tiedoston" },
        array: { unit: "alkiota", subject: "listan" },
        set: { unit: "alkiota", subject: "joukon" },
        number: { unit: "", subject: "luvun" },
        bigint: { unit: "", subject: "suuren kokonaisluvun" },
        int: { unit: "", subject: "kokonaisluvun" },
        date: { unit: "", subject: "päivämäärän" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "number";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "säännöllinen lauseke",
        email: "sähköpostiosoite",
        url: "URL-osoite",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO-aikaleima",
        date: "ISO-päivämäärä",
        time: "ISO-aika",
        duration: "ISO-kesto",
        ipv4: "IPv4-osoite",
        ipv6: "IPv6-osoite",
        cidrv4: "IPv4-alue",
        cidrv6: "IPv6-alue",
        base64: "base64-koodattu merkkijono",
        base64url: "base64url-koodattu merkkijono",
        json_string: "JSON-merkkijono",
        e164: "E.164-luku",
        jwt: "JWT",
        template_literal: "templaattimerkkijono",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Virheellinen tyyppi: odotettiin ${issue.expected}, oli ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Virheellinen syöte: täytyy olla ${stringifyPrimitive(issue.values[0])}`;
                return `Virheellinen valinta: täytyy olla yksi seuraavista: ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Liian suuri: ${sizing.subject} täytyy olla ${adj}${issue.maximum.toString()} ${sizing.unit}`.trim();
                }
                return `Liian suuri: arvon täytyy olla ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Liian pieni: ${sizing.subject} täytyy olla ${adj}${issue.minimum.toString()} ${sizing.unit}`.trim();
                }
                return `Liian pieni: arvon täytyy olla ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Virheellinen syöte: täytyy alkaa "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Virheellinen syöte: täytyy loppua "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Virheellinen syöte: täytyy sisältää "${_issue.includes}"`;
                if (_issue.format === "regex") {
                    return `Virheellinen syöte: täytyy vastata säännöllistä lauseketta ${_issue.pattern}`;
                }
                return `Virheellinen ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Virheellinen luku: täytyy olla luvun ${issue.divisor} monikerta`;
            case "unrecognized_keys":
                return `${issue.keys.length > 1 ? "Tuntemattomat avaimet" : "Tuntematon avain"}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return "Virheellinen avain tietueessa";
            case "invalid_union":
                return "Virheellinen unioni";
            case "invalid_element":
                return "Virheellinen arvo joukossa";
            default:
                return `Virheellinen syöte`;
        }
    };
};
function fi () {
    return {
        localeError: error$w(),
    };
}

const error$v = () => {
    const Sizable = {
        string: { unit: "caractères", verb: "avoir" },
        file: { unit: "octets", verb: "avoir" },
        array: { unit: "éléments", verb: "avoir" },
        set: { unit: "éléments", verb: "avoir" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "nombre";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "tableau";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "entrée",
        email: "adresse e-mail",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "date et heure ISO",
        date: "date ISO",
        time: "heure ISO",
        duration: "durée ISO",
        ipv4: "adresse IPv4",
        ipv6: "adresse IPv6",
        cidrv4: "plage IPv4",
        cidrv6: "plage IPv6",
        base64: "chaîne encodée en base64",
        base64url: "chaîne encodée en base64url",
        json_string: "chaîne JSON",
        e164: "numéro E.164",
        jwt: "JWT",
        template_literal: "entrée",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Entrée invalide : ${issue.expected} attendu, ${parsedType(issue.input)} reçu`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Entrée invalide : ${stringifyPrimitive(issue.values[0])} attendu`;
                return `Option invalide : une valeur parmi ${joinValues(issue.values, "|")} attendue`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Trop grand : ${issue.origin ?? "valeur"} doit ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "élément(s)"}`;
                return `Trop grand : ${issue.origin ?? "valeur"} doit être ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Trop petit : ${issue.origin} doit ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Trop petit : ${issue.origin} doit être ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Chaîne invalide : doit commencer par "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Chaîne invalide : doit se terminer par "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Chaîne invalide : doit inclure "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Chaîne invalide : doit correspondre au modèle ${_issue.pattern}`;
                return `${Nouns[_issue.format] ?? issue.format} invalide`;
            }
            case "not_multiple_of":
                return `Nombre invalide : doit être un multiple de ${issue.divisor}`;
            case "unrecognized_keys":
                return `Clé${issue.keys.length > 1 ? "s" : ""} non reconnue${issue.keys.length > 1 ? "s" : ""} : ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Clé invalide dans ${issue.origin}`;
            case "invalid_union":
                return "Entrée invalide";
            case "invalid_element":
                return `Valeur invalide dans ${issue.origin}`;
            default:
                return `Entrée invalide`;
        }
    };
};
function fr () {
    return {
        localeError: error$v(),
    };
}

const error$u = () => {
    const Sizable = {
        string: { unit: "caractères", verb: "avoir" },
        file: { unit: "octets", verb: "avoir" },
        array: { unit: "éléments", verb: "avoir" },
        set: { unit: "éléments", verb: "avoir" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "number";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "entrée",
        email: "adresse courriel",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "date-heure ISO",
        date: "date ISO",
        time: "heure ISO",
        duration: "durée ISO",
        ipv4: "adresse IPv4",
        ipv6: "adresse IPv6",
        cidrv4: "plage IPv4",
        cidrv6: "plage IPv6",
        base64: "chaîne encodée en base64",
        base64url: "chaîne encodée en base64url",
        json_string: "chaîne JSON",
        e164: "numéro E.164",
        jwt: "JWT",
        template_literal: "entrée",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Entrée invalide : attendu ${issue.expected}, reçu ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Entrée invalide : attendu ${stringifyPrimitive(issue.values[0])}`;
                return `Option invalide : attendu l'une des valeurs suivantes ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "≤" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Trop grand : attendu que ${issue.origin ?? "la valeur"} ait ${adj}${issue.maximum.toString()} ${sizing.unit}`;
                return `Trop grand : attendu que ${issue.origin ?? "la valeur"} soit ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? "≥" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Trop petit : attendu que ${issue.origin} ait ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Trop petit : attendu que ${issue.origin} soit ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `Chaîne invalide : doit commencer par "${_issue.prefix}"`;
                }
                if (_issue.format === "ends_with")
                    return `Chaîne invalide : doit se terminer par "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Chaîne invalide : doit inclure "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Chaîne invalide : doit correspondre au motif ${_issue.pattern}`;
                return `${Nouns[_issue.format] ?? issue.format} invalide`;
            }
            case "not_multiple_of":
                return `Nombre invalide : doit être un multiple de ${issue.divisor}`;
            case "unrecognized_keys":
                return `Clé${issue.keys.length > 1 ? "s" : ""} non reconnue${issue.keys.length > 1 ? "s" : ""} : ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Clé invalide dans ${issue.origin}`;
            case "invalid_union":
                return "Entrée invalide";
            case "invalid_element":
                return `Valeur invalide dans ${issue.origin}`;
            default:
                return `Entrée invalide`;
        }
    };
};
function frCA () {
    return {
        localeError: error$u(),
    };
}

const error$t = () => {
    const Sizable = {
        string: { unit: "אותיות", verb: "לכלול" },
        file: { unit: "בייטים", verb: "לכלול" },
        array: { unit: "פריטים", verb: "לכלול" },
        set: { unit: "פריטים", verb: "לכלול" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "number";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "קלט",
        email: "כתובת אימייל",
        url: "כתובת רשת",
        emoji: "אימוג'י",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "תאריך וזמן ISO",
        date: "תאריך ISO",
        time: "זמן ISO",
        duration: "משך זמן ISO",
        ipv4: "כתובת IPv4",
        ipv6: "כתובת IPv6",
        cidrv4: "טווח IPv4",
        cidrv6: "טווח IPv6",
        base64: "מחרוזת בבסיס 64",
        base64url: "מחרוזת בבסיס 64 לכתובות רשת",
        json_string: "מחרוזת JSON",
        e164: "מספר E.164",
        jwt: "JWT",
        template_literal: "קלט",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `קלט לא תקין: צריך ${issue.expected}, התקבל ${parsedType(issue.input)}`;
            // return `Invalid input: expected ${issue.expected}, received ${util.getParsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `קלט לא תקין: צריך ${stringifyPrimitive(issue.values[0])}`;
                return `קלט לא תקין: צריך אחת מהאפשרויות  ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `גדול מדי: ${issue.origin ?? "value"} צריך להיות ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
                return `גדול מדי: ${issue.origin ?? "value"} צריך להיות ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `קטן מדי: ${issue.origin} צריך להיות ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `קטן מדי: ${issue.origin} צריך להיות ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `מחרוזת לא תקינה: חייבת להתחיל ב"${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `מחרוזת לא תקינה: חייבת להסתיים ב "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `מחרוזת לא תקינה: חייבת לכלול "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `מחרוזת לא תקינה: חייבת להתאים לתבנית ${_issue.pattern}`;
                return `${Nouns[_issue.format] ?? issue.format} לא תקין`;
            }
            case "not_multiple_of":
                return `מספר לא תקין: חייב להיות מכפלה של ${issue.divisor}`;
            case "unrecognized_keys":
                return `מפתח${issue.keys.length > 1 ? "ות" : ""} לא מזוה${issue.keys.length > 1 ? "ים" : "ה"}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `מפתח לא תקין ב${issue.origin}`;
            case "invalid_union":
                return "קלט לא תקין";
            case "invalid_element":
                return `ערך לא תקין ב${issue.origin}`;
            default:
                return `קלט לא תקין`;
        }
    };
};
function he () {
    return {
        localeError: error$t(),
    };
}

const error$s = () => {
    const Sizable = {
        string: { unit: "karakter", verb: "legyen" },
        file: { unit: "byte", verb: "legyen" },
        array: { unit: "elem", verb: "legyen" },
        set: { unit: "elem", verb: "legyen" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "szám";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "tömb";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "bemenet",
        email: "email cím",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO időbélyeg",
        date: "ISO dátum",
        time: "ISO idő",
        duration: "ISO időintervallum",
        ipv4: "IPv4 cím",
        ipv6: "IPv6 cím",
        cidrv4: "IPv4 tartomány",
        cidrv6: "IPv6 tartomány",
        base64: "base64-kódolt string",
        base64url: "base64url-kódolt string",
        json_string: "JSON string",
        e164: "E.164 szám",
        jwt: "JWT",
        template_literal: "bemenet",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Érvénytelen bemenet: a várt érték ${issue.expected}, a kapott érték ${parsedType(issue.input)}`;
            // return `Invalid input: expected ${issue.expected}, received ${util.getParsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Érvénytelen bemenet: a várt érték ${stringifyPrimitive(issue.values[0])}`;
                return `Érvénytelen opció: valamelyik érték várt ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Túl nagy: ${issue.origin ?? "érték"} mérete túl nagy ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elem"}`;
                return `Túl nagy: a bemeneti érték ${issue.origin ?? "érték"} túl nagy: ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Túl kicsi: a bemeneti érték ${issue.origin} mérete túl kicsi ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Túl kicsi: a bemeneti érték ${issue.origin} túl kicsi ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Érvénytelen string: "${_issue.prefix}" értékkel kell kezdődnie`;
                if (_issue.format === "ends_with")
                    return `Érvénytelen string: "${_issue.suffix}" értékkel kell végződnie`;
                if (_issue.format === "includes")
                    return `Érvénytelen string: "${_issue.includes}" értéket kell tartalmaznia`;
                if (_issue.format === "regex")
                    return `Érvénytelen string: ${_issue.pattern} mintának kell megfelelnie`;
                return `Érvénytelen ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Érvénytelen szám: ${issue.divisor} többszörösének kell lennie`;
            case "unrecognized_keys":
                return `Ismeretlen kulcs${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Érvénytelen kulcs ${issue.origin}`;
            case "invalid_union":
                return "Érvénytelen bemenet";
            case "invalid_element":
                return `Érvénytelen érték: ${issue.origin}`;
            default:
                return `Érvénytelen bemenet`;
        }
    };
};
function hu () {
    return {
        localeError: error$s(),
    };
}

const error$r = () => {
    const Sizable = {
        string: { unit: "karakter", verb: "memiliki" },
        file: { unit: "byte", verb: "memiliki" },
        array: { unit: "item", verb: "memiliki" },
        set: { unit: "item", verb: "memiliki" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "number";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "input",
        email: "alamat email",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "tanggal dan waktu format ISO",
        date: "tanggal format ISO",
        time: "jam format ISO",
        duration: "durasi format ISO",
        ipv4: "alamat IPv4",
        ipv6: "alamat IPv6",
        cidrv4: "rentang alamat IPv4",
        cidrv6: "rentang alamat IPv6",
        base64: "string dengan enkode base64",
        base64url: "string dengan enkode base64url",
        json_string: "string JSON",
        e164: "angka E.164",
        jwt: "JWT",
        template_literal: "input",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Input tidak valid: diharapkan ${issue.expected}, diterima ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Input tidak valid: diharapkan ${stringifyPrimitive(issue.values[0])}`;
                return `Pilihan tidak valid: diharapkan salah satu dari ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Terlalu besar: diharapkan ${issue.origin ?? "value"} memiliki ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elemen"}`;
                return `Terlalu besar: diharapkan ${issue.origin ?? "value"} menjadi ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Terlalu kecil: diharapkan ${issue.origin} memiliki ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Terlalu kecil: diharapkan ${issue.origin} menjadi ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `String tidak valid: harus dimulai dengan "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `String tidak valid: harus berakhir dengan "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `String tidak valid: harus menyertakan "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `String tidak valid: harus sesuai pola ${_issue.pattern}`;
                return `${Nouns[_issue.format] ?? issue.format} tidak valid`;
            }
            case "not_multiple_of":
                return `Angka tidak valid: harus kelipatan dari ${issue.divisor}`;
            case "unrecognized_keys":
                return `Kunci tidak dikenali ${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Kunci tidak valid di ${issue.origin}`;
            case "invalid_union":
                return "Input tidak valid";
            case "invalid_element":
                return `Nilai tidak valid di ${issue.origin}`;
            default:
                return `Input tidak valid`;
        }
    };
};
function id () {
    return {
        localeError: error$r(),
    };
}

const parsedType$3 = (data) => {
    const t = typeof data;
    switch (t) {
        case "number": {
            return Number.isNaN(data) ? "NaN" : "númer";
        }
        case "object": {
            if (Array.isArray(data)) {
                return "fylki";
            }
            if (data === null) {
                return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                return data.constructor.name;
            }
        }
    }
    return t;
};
const error$q = () => {
    const Sizable = {
        string: { unit: "stafi", verb: "að hafa" },
        file: { unit: "bæti", verb: "að hafa" },
        array: { unit: "hluti", verb: "að hafa" },
        set: { unit: "hluti", verb: "að hafa" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const Nouns = {
        regex: "gildi",
        email: "netfang",
        url: "vefslóð",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO dagsetning og tími",
        date: "ISO dagsetning",
        time: "ISO tími",
        duration: "ISO tímalengd",
        ipv4: "IPv4 address",
        ipv6: "IPv6 address",
        cidrv4: "IPv4 range",
        cidrv6: "IPv6 range",
        base64: "base64-encoded strengur",
        base64url: "base64url-encoded strengur",
        json_string: "JSON strengur",
        e164: "E.164 tölugildi",
        jwt: "JWT",
        template_literal: "gildi",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Rangt gildi: Þú slóst inn ${parsedType$3(issue.input)} þar sem á að vera ${issue.expected}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Rangt gildi: gert ráð fyrir ${stringifyPrimitive(issue.values[0])}`;
                return `Ógilt val: má vera eitt af eftirfarandi ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Of stórt: gert er ráð fyrir að ${issue.origin ?? "gildi"} hafi ${adj}${issue.maximum.toString()} ${sizing.unit ?? "hluti"}`;
                return `Of stórt: gert er ráð fyrir að ${issue.origin ?? "gildi"} sé ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Of lítið: gert er ráð fyrir að ${issue.origin} hafi ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Of lítið: gert er ráð fyrir að ${issue.origin} sé ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `Ógildur strengur: verður að byrja á "${_issue.prefix}"`;
                }
                if (_issue.format === "ends_with")
                    return `Ógildur strengur: verður að enda á "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Ógildur strengur: verður að innihalda "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Ógildur strengur: verður að fylgja mynstri ${_issue.pattern}`;
                return `Rangt ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Röng tala: verður að vera margfeldi af ${issue.divisor}`;
            case "unrecognized_keys":
                return `Óþekkt ${issue.keys.length > 1 ? "ir lyklar" : "ur lykill"}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Rangur lykill í ${issue.origin}`;
            case "invalid_union":
                return "Rangt gildi";
            case "invalid_element":
                return `Rangt gildi í ${issue.origin}`;
            default:
                return `Rangt gildi`;
        }
    };
};
function is () {
    return {
        localeError: error$q(),
    };
}

const error$p = () => {
    const Sizable = {
        string: { unit: "caratteri", verb: "avere" },
        file: { unit: "byte", verb: "avere" },
        array: { unit: "elementi", verb: "avere" },
        set: { unit: "elementi", verb: "avere" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "numero";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "vettore";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "input",
        email: "indirizzo email",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "data e ora ISO",
        date: "data ISO",
        time: "ora ISO",
        duration: "durata ISO",
        ipv4: "indirizzo IPv4",
        ipv6: "indirizzo IPv6",
        cidrv4: "intervallo IPv4",
        cidrv6: "intervallo IPv6",
        base64: "stringa codificata in base64",
        base64url: "URL codificata in base64",
        json_string: "stringa JSON",
        e164: "numero E.164",
        jwt: "JWT",
        template_literal: "input",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Input non valido: atteso ${issue.expected}, ricevuto ${parsedType(issue.input)}`;
            // return `Input non valido: atteso ${issue.expected}, ricevuto ${util.getParsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Input non valido: atteso ${stringifyPrimitive(issue.values[0])}`;
                return `Opzione non valida: atteso uno tra ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Troppo grande: ${issue.origin ?? "valore"} deve avere ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementi"}`;
                return `Troppo grande: ${issue.origin ?? "valore"} deve essere ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Troppo piccolo: ${issue.origin} deve avere ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Troppo piccolo: ${issue.origin} deve essere ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Stringa non valida: deve iniziare con "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Stringa non valida: deve terminare con "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Stringa non valida: deve includere "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Stringa non valida: deve corrispondere al pattern ${_issue.pattern}`;
                return `Invalid ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Numero non valido: deve essere un multiplo di ${issue.divisor}`;
            case "unrecognized_keys":
                return `Chiav${issue.keys.length > 1 ? "i" : "e"} non riconosciut${issue.keys.length > 1 ? "e" : "a"}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Chiave non valida in ${issue.origin}`;
            case "invalid_union":
                return "Input non valido";
            case "invalid_element":
                return `Valore non valido in ${issue.origin}`;
            default:
                return `Input non valido`;
        }
    };
};
function it () {
    return {
        localeError: error$p(),
    };
}

const error$o = () => {
    const Sizable = {
        string: { unit: "文字", verb: "である" },
        file: { unit: "バイト", verb: "である" },
        array: { unit: "要素", verb: "である" },
        set: { unit: "要素", verb: "である" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "数値";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "配列";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "入力値",
        email: "メールアドレス",
        url: "URL",
        emoji: "絵文字",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO日時",
        date: "ISO日付",
        time: "ISO時刻",
        duration: "ISO期間",
        ipv4: "IPv4アドレス",
        ipv6: "IPv6アドレス",
        cidrv4: "IPv4範囲",
        cidrv6: "IPv6範囲",
        base64: "base64エンコード文字列",
        base64url: "base64urlエンコード文字列",
        json_string: "JSON文字列",
        e164: "E.164番号",
        jwt: "JWT",
        template_literal: "入力値",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `無効な入力: ${issue.expected}が期待されましたが、${parsedType(issue.input)}が入力されました`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `無効な入力: ${stringifyPrimitive(issue.values[0])}が期待されました`;
                return `無効な選択: ${joinValues(issue.values, "、")}のいずれかである必要があります`;
            case "too_big": {
                const adj = issue.inclusive ? "以下である" : "より小さい";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `大きすぎる値: ${issue.origin ?? "値"}は${issue.maximum.toString()}${sizing.unit ?? "要素"}${adj}必要があります`;
                return `大きすぎる値: ${issue.origin ?? "値"}は${issue.maximum.toString()}${adj}必要があります`;
            }
            case "too_small": {
                const adj = issue.inclusive ? "以上である" : "より大きい";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `小さすぎる値: ${issue.origin}は${issue.minimum.toString()}${sizing.unit}${adj}必要があります`;
                return `小さすぎる値: ${issue.origin}は${issue.minimum.toString()}${adj}必要があります`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `無効な文字列: "${_issue.prefix}"で始まる必要があります`;
                if (_issue.format === "ends_with")
                    return `無効な文字列: "${_issue.suffix}"で終わる必要があります`;
                if (_issue.format === "includes")
                    return `無効な文字列: "${_issue.includes}"を含む必要があります`;
                if (_issue.format === "regex")
                    return `無効な文字列: パターン${_issue.pattern}に一致する必要があります`;
                return `無効な${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `無効な数値: ${issue.divisor}の倍数である必要があります`;
            case "unrecognized_keys":
                return `認識されていないキー${issue.keys.length > 1 ? "群" : ""}: ${joinValues(issue.keys, "、")}`;
            case "invalid_key":
                return `${issue.origin}内の無効なキー`;
            case "invalid_union":
                return "無効な入力";
            case "invalid_element":
                return `${issue.origin}内の無効な値`;
            default:
                return `無効な入力`;
        }
    };
};
function ja () {
    return {
        localeError: error$o(),
    };
}

const parsedType$2 = (data) => {
    const t = typeof data;
    switch (t) {
        case "number": {
            return Number.isNaN(data) ? "NaN" : "რიცხვი";
        }
        case "object": {
            if (Array.isArray(data)) {
                return "მასივი";
            }
            if (data === null) {
                return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                return data.constructor.name;
            }
        }
    }
    const typeMap = {
        string: "სტრინგი",
        boolean: "ბულეანი",
        undefined: "undefined",
        bigint: "bigint",
        symbol: "symbol",
        function: "ფუნქცია",
    };
    return typeMap[t] ?? t;
};
const error$n = () => {
    const Sizable = {
        string: { unit: "სიმბოლო", verb: "უნდა შეიცავდეს" },
        file: { unit: "ბაიტი", verb: "უნდა შეიცავდეს" },
        array: { unit: "ელემენტი", verb: "უნდა შეიცავდეს" },
        set: { unit: "ელემენტი", verb: "უნდა შეიცავდეს" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const Nouns = {
        regex: "შეყვანა",
        email: "ელ-ფოსტის მისამართი",
        url: "URL",
        emoji: "ემოჯი",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "თარიღი-დრო",
        date: "თარიღი",
        time: "დრო",
        duration: "ხანგრძლივობა",
        ipv4: "IPv4 მისამართი",
        ipv6: "IPv6 მისამართი",
        cidrv4: "IPv4 დიაპაზონი",
        cidrv6: "IPv6 დიაპაზონი",
        base64: "base64-კოდირებული სტრინგი",
        base64url: "base64url-კოდირებული სტრინგი",
        json_string: "JSON სტრინგი",
        e164: "E.164 ნომერი",
        jwt: "JWT",
        template_literal: "შეყვანა",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `არასწორი შეყვანა: მოსალოდნელი ${issue.expected}, მიღებული ${parsedType$2(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `არასწორი შეყვანა: მოსალოდნელი ${stringifyPrimitive(issue.values[0])}`;
                return `არასწორი ვარიანტი: მოსალოდნელია ერთ-ერთი ${joinValues(issue.values, "|")}-დან`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `ზედმეტად დიდი: მოსალოდნელი ${issue.origin ?? "მნიშვნელობა"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit}`;
                return `ზედმეტად დიდი: მოსალოდნელი ${issue.origin ?? "მნიშვნელობა"} იყოს ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `ზედმეტად პატარა: მოსალოდნელი ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `ზედმეტად პატარა: მოსალოდნელი ${issue.origin} იყოს ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `არასწორი სტრინგი: უნდა იწყებოდეს "${_issue.prefix}"-ით`;
                }
                if (_issue.format === "ends_with")
                    return `არასწორი სტრინგი: უნდა მთავრდებოდეს "${_issue.suffix}"-ით`;
                if (_issue.format === "includes")
                    return `არასწორი სტრინგი: უნდა შეიცავდეს "${_issue.includes}"-ს`;
                if (_issue.format === "regex")
                    return `არასწორი სტრინგი: უნდა შეესაბამებოდეს შაბლონს ${_issue.pattern}`;
                return `არასწორი ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `არასწორი რიცხვი: უნდა იყოს ${issue.divisor}-ის ჯერადი`;
            case "unrecognized_keys":
                return `უცნობი გასაღებ${issue.keys.length > 1 ? "ები" : "ი"}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `არასწორი გასაღები ${issue.origin}-ში`;
            case "invalid_union":
                return "არასწორი შეყვანა";
            case "invalid_element":
                return `არასწორი მნიშვნელობა ${issue.origin}-ში`;
            default:
                return `არასწორი შეყვანა`;
        }
    };
};
function ka () {
    return {
        localeError: error$n(),
    };
}

const error$m = () => {
    const Sizable = {
        string: { unit: "តួអក្សរ", verb: "គួរមាន" },
        file: { unit: "បៃ", verb: "គួរមាន" },
        array: { unit: "ធាតុ", verb: "គួរមាន" },
        set: { unit: "ធាតុ", verb: "គួរមាន" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "មិនមែនជាលេខ (NaN)" : "លេខ";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "អារេ (Array)";
                }
                if (data === null) {
                    return "គ្មានតម្លៃ (null)";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "ទិន្នន័យបញ្ចូល",
        email: "អាសយដ្ឋានអ៊ីមែល",
        url: "URL",
        emoji: "សញ្ញាអារម្មណ៍",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "កាលបរិច្ឆេទ និងម៉ោង ISO",
        date: "កាលបរិច្ឆេទ ISO",
        time: "ម៉ោង ISO",
        duration: "រយៈពេល ISO",
        ipv4: "អាសយដ្ឋាន IPv4",
        ipv6: "អាសយដ្ឋាន IPv6",
        cidrv4: "ដែនអាសយដ្ឋាន IPv4",
        cidrv6: "ដែនអាសយដ្ឋាន IPv6",
        base64: "ខ្សែអក្សរអ៊ិកូដ base64",
        base64url: "ខ្សែអក្សរអ៊ិកូដ base64url",
        json_string: "ខ្សែអក្សរ JSON",
        e164: "លេខ E.164",
        jwt: "JWT",
        template_literal: "ទិន្នន័យបញ្ចូល",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${issue.expected} ប៉ុន្តែទទួលបាន ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `ទិន្នន័យបញ្ចូលមិនត្រឹមត្រូវ៖ ត្រូវការ ${stringifyPrimitive(issue.values[0])}`;
                return `ជម្រើសមិនត្រឹមត្រូវ៖ ត្រូវជាមួយក្នុងចំណោម ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `ធំពេក៖ ត្រូវការ ${issue.origin ?? "តម្លៃ"} ${adj} ${issue.maximum.toString()} ${sizing.unit ?? "ធាតុ"}`;
                return `ធំពេក៖ ត្រូវការ ${issue.origin ?? "តម្លៃ"} ${adj} ${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `តូចពេក៖ ត្រូវការ ${issue.origin} ${adj} ${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `តូចពេក៖ ត្រូវការ ${issue.origin} ${adj} ${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវចាប់ផ្តើមដោយ "${_issue.prefix}"`;
                }
                if (_issue.format === "ends_with")
                    return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវបញ្ចប់ដោយ "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវមាន "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `ខ្សែអក្សរមិនត្រឹមត្រូវ៖ ត្រូវតែផ្គូផ្គងនឹងទម្រង់ដែលបានកំណត់ ${_issue.pattern}`;
                return `មិនត្រឹមត្រូវ៖ ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `លេខមិនត្រឹមត្រូវ៖ ត្រូវតែជាពហុគុណនៃ ${issue.divisor}`;
            case "unrecognized_keys":
                return `រកឃើញសោមិនស្គាល់៖ ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `សោមិនត្រឹមត្រូវនៅក្នុង ${issue.origin}`;
            case "invalid_union":
                return `ទិន្នន័យមិនត្រឹមត្រូវ`;
            case "invalid_element":
                return `ទិន្នន័យមិនត្រឹមត្រូវនៅក្នុង ${issue.origin}`;
            default:
                return `ទិន្នន័យមិនត្រឹមត្រូវ`;
        }
    };
};
function km () {
    return {
        localeError: error$m(),
    };
}

/** @deprecated Use `km` instead. */
function kh () {
    return km();
}

const error$l = () => {
    const Sizable = {
        string: { unit: "문자", verb: "to have" },
        file: { unit: "바이트", verb: "to have" },
        array: { unit: "개", verb: "to have" },
        set: { unit: "개", verb: "to have" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "number";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "입력",
        email: "이메일 주소",
        url: "URL",
        emoji: "이모지",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO 날짜시간",
        date: "ISO 날짜",
        time: "ISO 시간",
        duration: "ISO 기간",
        ipv4: "IPv4 주소",
        ipv6: "IPv6 주소",
        cidrv4: "IPv4 범위",
        cidrv6: "IPv6 범위",
        base64: "base64 인코딩 문자열",
        base64url: "base64url 인코딩 문자열",
        json_string: "JSON 문자열",
        e164: "E.164 번호",
        jwt: "JWT",
        template_literal: "입력",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `잘못된 입력: 예상 타입은 ${issue.expected}, 받은 타입은 ${parsedType(issue.input)}입니다`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `잘못된 입력: 값은 ${stringifyPrimitive(issue.values[0])} 이어야 합니다`;
                return `잘못된 옵션: ${joinValues(issue.values, "또는 ")} 중 하나여야 합니다`;
            case "too_big": {
                const adj = issue.inclusive ? "이하" : "미만";
                const suffix = adj === "미만" ? "이어야 합니다" : "여야 합니다";
                const sizing = getSizing(issue.origin);
                const unit = sizing?.unit ?? "요소";
                if (sizing)
                    return `${issue.origin ?? "값"}이 너무 큽니다: ${issue.maximum.toString()}${unit} ${adj}${suffix}`;
                return `${issue.origin ?? "값"}이 너무 큽니다: ${issue.maximum.toString()} ${adj}${suffix}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? "이상" : "초과";
                const suffix = adj === "이상" ? "이어야 합니다" : "여야 합니다";
                const sizing = getSizing(issue.origin);
                const unit = sizing?.unit ?? "요소";
                if (sizing) {
                    return `${issue.origin ?? "값"}이 너무 작습니다: ${issue.minimum.toString()}${unit} ${adj}${suffix}`;
                }
                return `${issue.origin ?? "값"}이 너무 작습니다: ${issue.minimum.toString()} ${adj}${suffix}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `잘못된 문자열: "${_issue.prefix}"(으)로 시작해야 합니다`;
                }
                if (_issue.format === "ends_with")
                    return `잘못된 문자열: "${_issue.suffix}"(으)로 끝나야 합니다`;
                if (_issue.format === "includes")
                    return `잘못된 문자열: "${_issue.includes}"을(를) 포함해야 합니다`;
                if (_issue.format === "regex")
                    return `잘못된 문자열: 정규식 ${_issue.pattern} 패턴과 일치해야 합니다`;
                return `잘못된 ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `잘못된 숫자: ${issue.divisor}의 배수여야 합니다`;
            case "unrecognized_keys":
                return `인식할 수 없는 키: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `잘못된 키: ${issue.origin}`;
            case "invalid_union":
                return `잘못된 입력`;
            case "invalid_element":
                return `잘못된 값: ${issue.origin}`;
            default:
                return `잘못된 입력`;
        }
    };
};
function ko () {
    return {
        localeError: error$l(),
    };
}

const parsedType$1 = (data) => {
    const t = typeof data;
    return parsedTypeFromType(t, data);
};
const parsedTypeFromType = (t, data = undefined) => {
    switch (t) {
        case "number": {
            return Number.isNaN(data) ? "NaN" : "skaičius";
        }
        case "bigint": {
            return "sveikasis skaičius";
        }
        case "string": {
            return "eilutė";
        }
        case "boolean": {
            return "loginė reikšmė";
        }
        case "undefined":
        case "void": {
            return "neapibrėžta reikšmė";
        }
        case "function": {
            return "funkcija";
        }
        case "symbol": {
            return "simbolis";
        }
        case "object": {
            if (data === undefined)
                return "nežinomas objektas";
            if (data === null)
                return "nulinė reikšmė";
            if (Array.isArray(data))
                return "masyvas";
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                return data.constructor.name;
            }
            return "objektas";
        }
        //Zod types below
        case "null": {
            return "nulinė reikšmė";
        }
    }
    return t;
};
const capitalizeFirstCharacter = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
};
function getUnitTypeFromNumber(number) {
    const abs = Math.abs(number);
    const last = abs % 10;
    const last2 = abs % 100;
    if ((last2 >= 11 && last2 <= 19) || last === 0)
        return "many";
    if (last === 1)
        return "one";
    return "few";
}
const error$k = () => {
    const Sizable = {
        string: {
            unit: {
                one: "simbolis",
                few: "simboliai",
                many: "simbolių",
            },
            verb: {
                smaller: {
                    inclusive: "turi būti ne ilgesnė kaip",
                    notInclusive: "turi būti trumpesnė kaip",
                },
                bigger: {
                    inclusive: "turi būti ne trumpesnė kaip",
                    notInclusive: "turi būti ilgesnė kaip",
                },
            },
        },
        file: {
            unit: {
                one: "baitas",
                few: "baitai",
                many: "baitų",
            },
            verb: {
                smaller: {
                    inclusive: "turi būti ne didesnis kaip",
                    notInclusive: "turi būti mažesnis kaip",
                },
                bigger: {
                    inclusive: "turi būti ne mažesnis kaip",
                    notInclusive: "turi būti didesnis kaip",
                },
            },
        },
        array: {
            unit: {
                one: "elementą",
                few: "elementus",
                many: "elementų",
            },
            verb: {
                smaller: {
                    inclusive: "turi turėti ne daugiau kaip",
                    notInclusive: "turi turėti mažiau kaip",
                },
                bigger: {
                    inclusive: "turi turėti ne mažiau kaip",
                    notInclusive: "turi turėti daugiau kaip",
                },
            },
        },
        set: {
            unit: {
                one: "elementą",
                few: "elementus",
                many: "elementų",
            },
            verb: {
                smaller: {
                    inclusive: "turi turėti ne daugiau kaip",
                    notInclusive: "turi turėti mažiau kaip",
                },
                bigger: {
                    inclusive: "turi turėti ne mažiau kaip",
                    notInclusive: "turi turėti daugiau kaip",
                },
            },
        },
    };
    function getSizing(origin, unitType, inclusive, targetShouldBe) {
        const result = Sizable[origin] ?? null;
        if (result === null)
            return result;
        return {
            unit: result.unit[unitType],
            verb: result.verb[targetShouldBe][inclusive ? "inclusive" : "notInclusive"],
        };
    }
    const Nouns = {
        regex: "įvestis",
        email: "el. pašto adresas",
        url: "URL",
        emoji: "jaustukas",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO data ir laikas",
        date: "ISO data",
        time: "ISO laikas",
        duration: "ISO trukmė",
        ipv4: "IPv4 adresas",
        ipv6: "IPv6 adresas",
        cidrv4: "IPv4 tinklo prefiksas (CIDR)",
        cidrv6: "IPv6 tinklo prefiksas (CIDR)",
        base64: "base64 užkoduota eilutė",
        base64url: "base64url užkoduota eilutė",
        json_string: "JSON eilutė",
        e164: "E.164 numeris",
        jwt: "JWT",
        template_literal: "įvestis",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Gautas tipas ${parsedType$1(issue.input)}, o tikėtasi - ${parsedTypeFromType(issue.expected)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Privalo būti ${stringifyPrimitive(issue.values[0])}`;
                return `Privalo būti vienas iš ${joinValues(issue.values, "|")} pasirinkimų`;
            case "too_big": {
                const origin = parsedTypeFromType(issue.origin);
                const sizing = getSizing(issue.origin, getUnitTypeFromNumber(Number(issue.maximum)), issue.inclusive ?? false, "smaller");
                if (sizing?.verb)
                    return `${capitalizeFirstCharacter(origin ?? issue.origin ?? "reikšmė")} ${sizing.verb} ${issue.maximum.toString()} ${sizing.unit ?? "elementų"}`;
                const adj = issue.inclusive ? "ne didesnis kaip" : "mažesnis kaip";
                return `${capitalizeFirstCharacter(origin ?? issue.origin ?? "reikšmė")} turi būti ${adj} ${issue.maximum.toString()} ${sizing?.unit}`;
            }
            case "too_small": {
                const origin = parsedTypeFromType(issue.origin);
                const sizing = getSizing(issue.origin, getUnitTypeFromNumber(Number(issue.minimum)), issue.inclusive ?? false, "bigger");
                if (sizing?.verb)
                    return `${capitalizeFirstCharacter(origin ?? issue.origin ?? "reikšmė")} ${sizing.verb} ${issue.minimum.toString()} ${sizing.unit ?? "elementų"}`;
                const adj = issue.inclusive ? "ne mažesnis kaip" : "didesnis kaip";
                return `${capitalizeFirstCharacter(origin ?? issue.origin ?? "reikšmė")} turi būti ${adj} ${issue.minimum.toString()} ${sizing?.unit}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `Eilutė privalo prasidėti "${_issue.prefix}"`;
                }
                if (_issue.format === "ends_with")
                    return `Eilutė privalo pasibaigti "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Eilutė privalo įtraukti "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Eilutė privalo atitikti ${_issue.pattern}`;
                return `Neteisingas ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Skaičius privalo būti ${issue.divisor} kartotinis.`;
            case "unrecognized_keys":
                return `Neatpažint${issue.keys.length > 1 ? "i" : "as"} rakt${issue.keys.length > 1 ? "ai" : "as"}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return "Rastas klaidingas raktas";
            case "invalid_union":
                return "Klaidinga įvestis";
            case "invalid_element": {
                const origin = parsedTypeFromType(issue.origin);
                return `${capitalizeFirstCharacter(origin ?? issue.origin ?? "reikšmė")} turi klaidingą įvestį`;
            }
            default:
                return "Klaidinga įvestis";
        }
    };
};
function lt () {
    return {
        localeError: error$k(),
    };
}

const error$j = () => {
    const Sizable = {
        string: { unit: "знаци", verb: "да имаат" },
        file: { unit: "бајти", verb: "да имаат" },
        array: { unit: "ставки", verb: "да имаат" },
        set: { unit: "ставки", verb: "да имаат" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "број";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "низа";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "внес",
        email: "адреса на е-пошта",
        url: "URL",
        emoji: "емоџи",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO датум и време",
        date: "ISO датум",
        time: "ISO време",
        duration: "ISO времетраење",
        ipv4: "IPv4 адреса",
        ipv6: "IPv6 адреса",
        cidrv4: "IPv4 опсег",
        cidrv6: "IPv6 опсег",
        base64: "base64-енкодирана низа",
        base64url: "base64url-енкодирана низа",
        json_string: "JSON низа",
        e164: "E.164 број",
        jwt: "JWT",
        template_literal: "внес",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Грешен внес: се очекува ${issue.expected}, примено ${parsedType(issue.input)}`;
            // return `Invalid input: expected ${issue.expected}, received ${util.getParsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Invalid input: expected ${stringifyPrimitive(issue.values[0])}`;
                return `Грешана опција: се очекува една ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Премногу голем: се очекува ${issue.origin ?? "вредноста"} да има ${adj}${issue.maximum.toString()} ${sizing.unit ?? "елементи"}`;
                return `Премногу голем: се очекува ${issue.origin ?? "вредноста"} да биде ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Премногу мал: се очекува ${issue.origin} да има ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Премногу мал: се очекува ${issue.origin} да биде ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `Неважечка низа: мора да започнува со "${_issue.prefix}"`;
                }
                if (_issue.format === "ends_with")
                    return `Неважечка низа: мора да завршува со "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Неважечка низа: мора да вклучува "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Неважечка низа: мора да одгоара на патернот ${_issue.pattern}`;
                return `Invalid ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Грешен број: мора да биде делив со ${issue.divisor}`;
            case "unrecognized_keys":
                return `${issue.keys.length > 1 ? "Непрепознаени клучеви" : "Непрепознаен клуч"}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Грешен клуч во ${issue.origin}`;
            case "invalid_union":
                return "Грешен внес";
            case "invalid_element":
                return `Грешна вредност во ${issue.origin}`;
            default:
                return `Грешен внес`;
        }
    };
};
function mk () {
    return {
        localeError: error$j(),
    };
}

const error$i = () => {
    const Sizable = {
        string: { unit: "aksara", verb: "mempunyai" },
        file: { unit: "bait", verb: "mempunyai" },
        array: { unit: "elemen", verb: "mempunyai" },
        set: { unit: "elemen", verb: "mempunyai" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "nombor";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "input",
        email: "alamat e-mel",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "tarikh masa ISO",
        date: "tarikh ISO",
        time: "masa ISO",
        duration: "tempoh ISO",
        ipv4: "alamat IPv4",
        ipv6: "alamat IPv6",
        cidrv4: "julat IPv4",
        cidrv6: "julat IPv6",
        base64: "string dikodkan base64",
        base64url: "string dikodkan base64url",
        json_string: "string JSON",
        e164: "nombor E.164",
        jwt: "JWT",
        template_literal: "input",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Input tidak sah: dijangka ${issue.expected}, diterima ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Input tidak sah: dijangka ${stringifyPrimitive(issue.values[0])}`;
                return `Pilihan tidak sah: dijangka salah satu daripada ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Terlalu besar: dijangka ${issue.origin ?? "nilai"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elemen"}`;
                return `Terlalu besar: dijangka ${issue.origin ?? "nilai"} adalah ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Terlalu kecil: dijangka ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Terlalu kecil: dijangka ${issue.origin} adalah ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `String tidak sah: mesti bermula dengan "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `String tidak sah: mesti berakhir dengan "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `String tidak sah: mesti mengandungi "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `String tidak sah: mesti sepadan dengan corak ${_issue.pattern}`;
                return `${Nouns[_issue.format] ?? issue.format} tidak sah`;
            }
            case "not_multiple_of":
                return `Nombor tidak sah: perlu gandaan ${issue.divisor}`;
            case "unrecognized_keys":
                return `Kunci tidak dikenali: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Kunci tidak sah dalam ${issue.origin}`;
            case "invalid_union":
                return "Input tidak sah";
            case "invalid_element":
                return `Nilai tidak sah dalam ${issue.origin}`;
            default:
                return `Input tidak sah`;
        }
    };
};
function ms () {
    return {
        localeError: error$i(),
    };
}

const error$h = () => {
    const Sizable = {
        string: { unit: "tekens" },
        file: { unit: "bytes" },
        array: { unit: "elementen" },
        set: { unit: "elementen" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "getal";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "invoer",
        email: "emailadres",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO datum en tijd",
        date: "ISO datum",
        time: "ISO tijd",
        duration: "ISO duur",
        ipv4: "IPv4-adres",
        ipv6: "IPv6-adres",
        cidrv4: "IPv4-bereik",
        cidrv6: "IPv6-bereik",
        base64: "base64-gecodeerde tekst",
        base64url: "base64 URL-gecodeerde tekst",
        json_string: "JSON string",
        e164: "E.164-nummer",
        jwt: "JWT",
        template_literal: "invoer",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Ongeldige invoer: verwacht ${issue.expected}, ontving ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Ongeldige invoer: verwacht ${stringifyPrimitive(issue.values[0])}`;
                return `Ongeldige optie: verwacht één van ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Te lang: verwacht dat ${issue.origin ?? "waarde"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementen"} bevat`;
                return `Te lang: verwacht dat ${issue.origin ?? "waarde"} ${adj}${issue.maximum.toString()} is`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Te kort: verwacht dat ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit} bevat`;
                }
                return `Te kort: verwacht dat ${issue.origin} ${adj}${issue.minimum.toString()} is`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `Ongeldige tekst: moet met "${_issue.prefix}" beginnen`;
                }
                if (_issue.format === "ends_with")
                    return `Ongeldige tekst: moet op "${_issue.suffix}" eindigen`;
                if (_issue.format === "includes")
                    return `Ongeldige tekst: moet "${_issue.includes}" bevatten`;
                if (_issue.format === "regex")
                    return `Ongeldige tekst: moet overeenkomen met patroon ${_issue.pattern}`;
                return `Ongeldig: ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Ongeldig getal: moet een veelvoud van ${issue.divisor} zijn`;
            case "unrecognized_keys":
                return `Onbekende key${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Ongeldige key in ${issue.origin}`;
            case "invalid_union":
                return "Ongeldige invoer";
            case "invalid_element":
                return `Ongeldige waarde in ${issue.origin}`;
            default:
                return `Ongeldige invoer`;
        }
    };
};
function nl () {
    return {
        localeError: error$h(),
    };
}

const error$g = () => {
    const Sizable = {
        string: { unit: "tegn", verb: "å ha" },
        file: { unit: "bytes", verb: "å ha" },
        array: { unit: "elementer", verb: "å inneholde" },
        set: { unit: "elementer", verb: "å inneholde" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "tall";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "liste";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "input",
        email: "e-postadresse",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO dato- og klokkeslett",
        date: "ISO-dato",
        time: "ISO-klokkeslett",
        duration: "ISO-varighet",
        ipv4: "IPv4-område",
        ipv6: "IPv6-område",
        cidrv4: "IPv4-spekter",
        cidrv6: "IPv6-spekter",
        base64: "base64-enkodet streng",
        base64url: "base64url-enkodet streng",
        json_string: "JSON-streng",
        e164: "E.164-nummer",
        jwt: "JWT",
        template_literal: "input",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Ugyldig input: forventet ${issue.expected}, fikk ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Ugyldig verdi: forventet ${stringifyPrimitive(issue.values[0])}`;
                return `Ugyldig valg: forventet en av ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `For stor(t): forventet ${issue.origin ?? "value"} til å ha ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementer"}`;
                return `For stor(t): forventet ${issue.origin ?? "value"} til å ha ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `For lite(n): forventet ${issue.origin} til å ha ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `For lite(n): forventet ${issue.origin} til å ha ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Ugyldig streng: må starte med "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Ugyldig streng: må ende med "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Ugyldig streng: må inneholde "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Ugyldig streng: må matche mønsteret ${_issue.pattern}`;
                return `Ugyldig ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Ugyldig tall: må være et multiplum av ${issue.divisor}`;
            case "unrecognized_keys":
                return `${issue.keys.length > 1 ? "Ukjente nøkler" : "Ukjent nøkkel"}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Ugyldig nøkkel i ${issue.origin}`;
            case "invalid_union":
                return "Ugyldig input";
            case "invalid_element":
                return `Ugyldig verdi i ${issue.origin}`;
            default:
                return `Ugyldig input`;
        }
    };
};
function no () {
    return {
        localeError: error$g(),
    };
}

const error$f = () => {
    const Sizable = {
        string: { unit: "harf", verb: "olmalıdır" },
        file: { unit: "bayt", verb: "olmalıdır" },
        array: { unit: "unsur", verb: "olmalıdır" },
        set: { unit: "unsur", verb: "olmalıdır" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "numara";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "saf";
                }
                if (data === null) {
                    return "gayb";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "giren",
        email: "epostagâh",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO hengâmı",
        date: "ISO tarihi",
        time: "ISO zamanı",
        duration: "ISO müddeti",
        ipv4: "IPv4 nişânı",
        ipv6: "IPv6 nişânı",
        cidrv4: "IPv4 menzili",
        cidrv6: "IPv6 menzili",
        base64: "base64-şifreli metin",
        base64url: "base64url-şifreli metin",
        json_string: "JSON metin",
        e164: "E.164 sayısı",
        jwt: "JWT",
        template_literal: "giren",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Fâsit giren: umulan ${issue.expected}, alınan ${parsedType(issue.input)}`;
            // return `Fâsit giren: umulan ${issue.expected}, alınan ${util.getParsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Fâsit giren: umulan ${stringifyPrimitive(issue.values[0])}`;
                return `Fâsit tercih: mûteberler ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Fazla büyük: ${issue.origin ?? "value"}, ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"} sahip olmalıydı.`;
                return `Fazla büyük: ${issue.origin ?? "value"}, ${adj}${issue.maximum.toString()} olmalıydı.`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Fazla küçük: ${issue.origin}, ${adj}${issue.minimum.toString()} ${sizing.unit} sahip olmalıydı.`;
                }
                return `Fazla küçük: ${issue.origin}, ${adj}${issue.minimum.toString()} olmalıydı.`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Fâsit metin: "${_issue.prefix}" ile başlamalı.`;
                if (_issue.format === "ends_with")
                    return `Fâsit metin: "${_issue.suffix}" ile bitmeli.`;
                if (_issue.format === "includes")
                    return `Fâsit metin: "${_issue.includes}" ihtivâ etmeli.`;
                if (_issue.format === "regex")
                    return `Fâsit metin: ${_issue.pattern} nakşına uymalı.`;
                return `Fâsit ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Fâsit sayı: ${issue.divisor} katı olmalıydı.`;
            case "unrecognized_keys":
                return `Tanınmayan anahtar ${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `${issue.origin} için tanınmayan anahtar var.`;
            case "invalid_union":
                return "Giren tanınamadı.";
            case "invalid_element":
                return `${issue.origin} için tanınmayan kıymet var.`;
            default:
                return `Kıymet tanınamadı.`;
        }
    };
};
function ota () {
    return {
        localeError: error$f(),
    };
}

const error$e = () => {
    const Sizable = {
        string: { unit: "توکي", verb: "ولري" },
        file: { unit: "بایټس", verb: "ولري" },
        array: { unit: "توکي", verb: "ولري" },
        set: { unit: "توکي", verb: "ولري" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "عدد";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "ارې";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "ورودي",
        email: "بریښنالیک",
        url: "یو آر ال",
        emoji: "ایموجي",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "نیټه او وخت",
        date: "نېټه",
        time: "وخت",
        duration: "موده",
        ipv4: "د IPv4 پته",
        ipv6: "د IPv6 پته",
        cidrv4: "د IPv4 ساحه",
        cidrv6: "د IPv6 ساحه",
        base64: "base64-encoded متن",
        base64url: "base64url-encoded متن",
        json_string: "JSON متن",
        e164: "د E.164 شمېره",
        jwt: "JWT",
        template_literal: "ورودي",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `ناسم ورودي: باید ${issue.expected} وای, مګر ${parsedType(issue.input)} ترلاسه شو`;
            case "invalid_value":
                if (issue.values.length === 1) {
                    return `ناسم ورودي: باید ${stringifyPrimitive(issue.values[0])} وای`;
                }
                return `ناسم انتخاب: باید یو له ${joinValues(issue.values, "|")} څخه وای`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `ډیر لوی: ${issue.origin ?? "ارزښت"} باید ${adj}${issue.maximum.toString()} ${sizing.unit ?? "عنصرونه"} ولري`;
                }
                return `ډیر لوی: ${issue.origin ?? "ارزښت"} باید ${adj}${issue.maximum.toString()} وي`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `ډیر کوچنی: ${issue.origin} باید ${adj}${issue.minimum.toString()} ${sizing.unit} ولري`;
                }
                return `ډیر کوچنی: ${issue.origin} باید ${adj}${issue.minimum.toString()} وي`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `ناسم متن: باید د "${_issue.prefix}" سره پیل شي`;
                }
                if (_issue.format === "ends_with") {
                    return `ناسم متن: باید د "${_issue.suffix}" سره پای ته ورسيږي`;
                }
                if (_issue.format === "includes") {
                    return `ناسم متن: باید "${_issue.includes}" ولري`;
                }
                if (_issue.format === "regex") {
                    return `ناسم متن: باید د ${_issue.pattern} سره مطابقت ولري`;
                }
                return `${Nouns[_issue.format] ?? issue.format} ناسم دی`;
            }
            case "not_multiple_of":
                return `ناسم عدد: باید د ${issue.divisor} مضرب وي`;
            case "unrecognized_keys":
                return `ناسم ${issue.keys.length > 1 ? "کلیډونه" : "کلیډ"}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `ناسم کلیډ په ${issue.origin} کې`;
            case "invalid_union":
                return `ناسمه ورودي`;
            case "invalid_element":
                return `ناسم عنصر په ${issue.origin} کې`;
            default:
                return `ناسمه ورودي`;
        }
    };
};
function ps () {
    return {
        localeError: error$e(),
    };
}

const error$d = () => {
    const Sizable = {
        string: { unit: "znaków", verb: "mieć" },
        file: { unit: "bajtów", verb: "mieć" },
        array: { unit: "elementów", verb: "mieć" },
        set: { unit: "elementów", verb: "mieć" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "liczba";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "tablica";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "wyrażenie",
        email: "adres email",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "data i godzina w formacie ISO",
        date: "data w formacie ISO",
        time: "godzina w formacie ISO",
        duration: "czas trwania ISO",
        ipv4: "adres IPv4",
        ipv6: "adres IPv6",
        cidrv4: "zakres IPv4",
        cidrv6: "zakres IPv6",
        base64: "ciąg znaków zakodowany w formacie base64",
        base64url: "ciąg znaków zakodowany w formacie base64url",
        json_string: "ciąg znaków w formacie JSON",
        e164: "liczba E.164",
        jwt: "JWT",
        template_literal: "wejście",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Nieprawidłowe dane wejściowe: oczekiwano ${issue.expected}, otrzymano ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Nieprawidłowe dane wejściowe: oczekiwano ${stringifyPrimitive(issue.values[0])}`;
                return `Nieprawidłowa opcja: oczekiwano jednej z wartości ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Za duża wartość: oczekiwano, że ${issue.origin ?? "wartość"} będzie mieć ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementów"}`;
                }
                return `Zbyt duż(y/a/e): oczekiwano, że ${issue.origin ?? "wartość"} będzie wynosić ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Za mała wartość: oczekiwano, że ${issue.origin ?? "wartość"} będzie mieć ${adj}${issue.minimum.toString()} ${sizing.unit ?? "elementów"}`;
                }
                return `Zbyt mał(y/a/e): oczekiwano, że ${issue.origin ?? "wartość"} będzie wynosić ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Nieprawidłowy ciąg znaków: musi zaczynać się od "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Nieprawidłowy ciąg znaków: musi kończyć się na "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Nieprawidłowy ciąg znaków: musi zawierać "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Nieprawidłowy ciąg znaków: musi odpowiadać wzorcowi ${_issue.pattern}`;
                return `Nieprawidłow(y/a/e) ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Nieprawidłowa liczba: musi być wielokrotnością ${issue.divisor}`;
            case "unrecognized_keys":
                return `Nierozpoznane klucze${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Nieprawidłowy klucz w ${issue.origin}`;
            case "invalid_union":
                return "Nieprawidłowe dane wejściowe";
            case "invalid_element":
                return `Nieprawidłowa wartość w ${issue.origin}`;
            default:
                return `Nieprawidłowe dane wejściowe`;
        }
    };
};
function pl () {
    return {
        localeError: error$d(),
    };
}

const error$c = () => {
    const Sizable = {
        string: { unit: "caracteres", verb: "ter" },
        file: { unit: "bytes", verb: "ter" },
        array: { unit: "itens", verb: "ter" },
        set: { unit: "itens", verb: "ter" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "número";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "nulo";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "padrão",
        email: "endereço de e-mail",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "data e hora ISO",
        date: "data ISO",
        time: "hora ISO",
        duration: "duração ISO",
        ipv4: "endereço IPv4",
        ipv6: "endereço IPv6",
        cidrv4: "faixa de IPv4",
        cidrv6: "faixa de IPv6",
        base64: "texto codificado em base64",
        base64url: "URL codificada em base64",
        json_string: "texto JSON",
        e164: "número E.164",
        jwt: "JWT",
        template_literal: "entrada",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Tipo inválido: esperado ${issue.expected}, recebido ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Entrada inválida: esperado ${stringifyPrimitive(issue.values[0])}`;
                return `Opção inválida: esperada uma das ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Muito grande: esperado que ${issue.origin ?? "valor"} tivesse ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementos"}`;
                return `Muito grande: esperado que ${issue.origin ?? "valor"} fosse ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Muito pequeno: esperado que ${issue.origin} tivesse ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Muito pequeno: esperado que ${issue.origin} fosse ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Texto inválido: deve começar com "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Texto inválido: deve terminar com "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Texto inválido: deve incluir "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Texto inválido: deve corresponder ao padrão ${_issue.pattern}`;
                return `${Nouns[_issue.format] ?? issue.format} inválido`;
            }
            case "not_multiple_of":
                return `Número inválido: deve ser múltiplo de ${issue.divisor}`;
            case "unrecognized_keys":
                return `Chave${issue.keys.length > 1 ? "s" : ""} desconhecida${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Chave inválida em ${issue.origin}`;
            case "invalid_union":
                return "Entrada inválida";
            case "invalid_element":
                return `Valor inválido em ${issue.origin}`;
            default:
                return `Campo inválido`;
        }
    };
};
function pt () {
    return {
        localeError: error$c(),
    };
}

function getRussianPlural(count, one, few, many) {
    const absCount = Math.abs(count);
    const lastDigit = absCount % 10;
    const lastTwoDigits = absCount % 100;
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return many;
    }
    if (lastDigit === 1) {
        return one;
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
        return few;
    }
    return many;
}
const error$b = () => {
    const Sizable = {
        string: {
            unit: {
                one: "символ",
                few: "символа",
                many: "символов",
            },
            verb: "иметь",
        },
        file: {
            unit: {
                one: "байт",
                few: "байта",
                many: "байт",
            },
            verb: "иметь",
        },
        array: {
            unit: {
                one: "элемент",
                few: "элемента",
                many: "элементов",
            },
            verb: "иметь",
        },
        set: {
            unit: {
                one: "элемент",
                few: "элемента",
                many: "элементов",
            },
            verb: "иметь",
        },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "число";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "массив";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "ввод",
        email: "email адрес",
        url: "URL",
        emoji: "эмодзи",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO дата и время",
        date: "ISO дата",
        time: "ISO время",
        duration: "ISO длительность",
        ipv4: "IPv4 адрес",
        ipv6: "IPv6 адрес",
        cidrv4: "IPv4 диапазон",
        cidrv6: "IPv6 диапазон",
        base64: "строка в формате base64",
        base64url: "строка в формате base64url",
        json_string: "JSON строка",
        e164: "номер E.164",
        jwt: "JWT",
        template_literal: "ввод",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Неверный ввод: ожидалось ${issue.expected}, получено ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Неверный ввод: ожидалось ${stringifyPrimitive(issue.values[0])}`;
                return `Неверный вариант: ожидалось одно из ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    const maxValue = Number(issue.maximum);
                    const unit = getRussianPlural(maxValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
                    return `Слишком большое значение: ожидалось, что ${issue.origin ?? "значение"} будет иметь ${adj}${issue.maximum.toString()} ${unit}`;
                }
                return `Слишком большое значение: ожидалось, что ${issue.origin ?? "значение"} будет ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    const minValue = Number(issue.minimum);
                    const unit = getRussianPlural(minValue, sizing.unit.one, sizing.unit.few, sizing.unit.many);
                    return `Слишком маленькое значение: ожидалось, что ${issue.origin} будет иметь ${adj}${issue.minimum.toString()} ${unit}`;
                }
                return `Слишком маленькое значение: ожидалось, что ${issue.origin} будет ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Неверная строка: должна начинаться с "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Неверная строка: должна заканчиваться на "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Неверная строка: должна содержать "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Неверная строка: должна соответствовать шаблону ${_issue.pattern}`;
                return `Неверный ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Неверное число: должно быть кратным ${issue.divisor}`;
            case "unrecognized_keys":
                return `Нераспознанн${issue.keys.length > 1 ? "ые" : "ый"} ключ${issue.keys.length > 1 ? "и" : ""}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Неверный ключ в ${issue.origin}`;
            case "invalid_union":
                return "Неверные входные данные";
            case "invalid_element":
                return `Неверное значение в ${issue.origin}`;
            default:
                return `Неверные входные данные`;
        }
    };
};
function ru () {
    return {
        localeError: error$b(),
    };
}

const error$a = () => {
    const Sizable = {
        string: { unit: "znakov", verb: "imeti" },
        file: { unit: "bajtov", verb: "imeti" },
        array: { unit: "elementov", verb: "imeti" },
        set: { unit: "elementov", verb: "imeti" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "število";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "tabela";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "vnos",
        email: "e-poštni naslov",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO datum in čas",
        date: "ISO datum",
        time: "ISO čas",
        duration: "ISO trajanje",
        ipv4: "IPv4 naslov",
        ipv6: "IPv6 naslov",
        cidrv4: "obseg IPv4",
        cidrv6: "obseg IPv6",
        base64: "base64 kodiran niz",
        base64url: "base64url kodiran niz",
        json_string: "JSON niz",
        e164: "E.164 številka",
        jwt: "JWT",
        template_literal: "vnos",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Neveljaven vnos: pričakovano ${issue.expected}, prejeto ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Neveljaven vnos: pričakovano ${stringifyPrimitive(issue.values[0])}`;
                return `Neveljavna možnost: pričakovano eno izmed ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Preveliko: pričakovano, da bo ${issue.origin ?? "vrednost"} imelo ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elementov"}`;
                return `Preveliko: pričakovano, da bo ${issue.origin ?? "vrednost"} ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Premajhno: pričakovano, da bo ${issue.origin} imelo ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Premajhno: pričakovano, da bo ${issue.origin} ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `Neveljaven niz: mora se začeti z "${_issue.prefix}"`;
                }
                if (_issue.format === "ends_with")
                    return `Neveljaven niz: mora se končati z "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Neveljaven niz: mora vsebovati "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Neveljaven niz: mora ustrezati vzorcu ${_issue.pattern}`;
                return `Neveljaven ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Neveljavno število: mora biti večkratnik ${issue.divisor}`;
            case "unrecognized_keys":
                return `Neprepoznan${issue.keys.length > 1 ? "i ključi" : " ključ"}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Neveljaven ključ v ${issue.origin}`;
            case "invalid_union":
                return "Neveljaven vnos";
            case "invalid_element":
                return `Neveljavna vrednost v ${issue.origin}`;
            default:
                return "Neveljaven vnos";
        }
    };
};
function sl () {
    return {
        localeError: error$a(),
    };
}

const error$9 = () => {
    const Sizable = {
        string: { unit: "tecken", verb: "att ha" },
        file: { unit: "bytes", verb: "att ha" },
        array: { unit: "objekt", verb: "att innehålla" },
        set: { unit: "objekt", verb: "att innehålla" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "antal";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "lista";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "reguljärt uttryck",
        email: "e-postadress",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO-datum och tid",
        date: "ISO-datum",
        time: "ISO-tid",
        duration: "ISO-varaktighet",
        ipv4: "IPv4-intervall",
        ipv6: "IPv6-intervall",
        cidrv4: "IPv4-spektrum",
        cidrv6: "IPv6-spektrum",
        base64: "base64-kodad sträng",
        base64url: "base64url-kodad sträng",
        json_string: "JSON-sträng",
        e164: "E.164-nummer",
        jwt: "JWT",
        template_literal: "mall-literal",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Ogiltig inmatning: förväntat ${issue.expected}, fick ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Ogiltig inmatning: förväntat ${stringifyPrimitive(issue.values[0])}`;
                return `Ogiltigt val: förväntade en av ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `För stor(t): förväntade ${issue.origin ?? "värdet"} att ha ${adj}${issue.maximum.toString()} ${sizing.unit ?? "element"}`;
                }
                return `För stor(t): förväntat ${issue.origin ?? "värdet"} att ha ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `För lite(t): förväntade ${issue.origin ?? "värdet"} att ha ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `För lite(t): förväntade ${issue.origin ?? "värdet"} att ha ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `Ogiltig sträng: måste börja med "${_issue.prefix}"`;
                }
                if (_issue.format === "ends_with")
                    return `Ogiltig sträng: måste sluta med "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Ogiltig sträng: måste innehålla "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Ogiltig sträng: måste matcha mönstret "${_issue.pattern}"`;
                return `Ogiltig(t) ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Ogiltigt tal: måste vara en multipel av ${issue.divisor}`;
            case "unrecognized_keys":
                return `${issue.keys.length > 1 ? "Okända nycklar" : "Okänd nyckel"}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Ogiltig nyckel i ${issue.origin ?? "värdet"}`;
            case "invalid_union":
                return "Ogiltig input";
            case "invalid_element":
                return `Ogiltigt värde i ${issue.origin ?? "värdet"}`;
            default:
                return `Ogiltig input`;
        }
    };
};
function sv () {
    return {
        localeError: error$9(),
    };
}

const error$8 = () => {
    const Sizable = {
        string: { unit: "எழுத்துக்கள்", verb: "கொண்டிருக்க வேண்டும்" },
        file: { unit: "பைட்டுகள்", verb: "கொண்டிருக்க வேண்டும்" },
        array: { unit: "உறுப்புகள்", verb: "கொண்டிருக்க வேண்டும்" },
        set: { unit: "உறுப்புகள்", verb: "கொண்டிருக்க வேண்டும்" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "எண் அல்லாதது" : "எண்";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "அணி";
                }
                if (data === null) {
                    return "வெறுமை";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "உள்ளீடு",
        email: "மின்னஞ்சல் முகவரி",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO தேதி நேரம்",
        date: "ISO தேதி",
        time: "ISO நேரம்",
        duration: "ISO கால அளவு",
        ipv4: "IPv4 முகவரி",
        ipv6: "IPv6 முகவரி",
        cidrv4: "IPv4 வரம்பு",
        cidrv6: "IPv6 வரம்பு",
        base64: "base64-encoded சரம்",
        base64url: "base64url-encoded சரம்",
        json_string: "JSON சரம்",
        e164: "E.164 எண்",
        jwt: "JWT",
        template_literal: "input",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${issue.expected}, பெறப்பட்டது ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `தவறான உள்ளீடு: எதிர்பார்க்கப்பட்டது ${stringifyPrimitive(issue.values[0])}`;
                return `தவறான விருப்பம்: எதிர்பார்க்கப்பட்டது ${joinValues(issue.values, "|")} இல் ஒன்று`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${issue.origin ?? "மதிப்பு"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "உறுப்புகள்"} ஆக இருக்க வேண்டும்`;
                }
                return `மிக பெரியது: எதிர்பார்க்கப்பட்டது ${issue.origin ?? "மதிப்பு"} ${adj}${issue.maximum.toString()} ஆக இருக்க வேண்டும்`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit} ஆக இருக்க வேண்டும்`; //
                }
                return `மிகச் சிறியது: எதிர்பார்க்கப்பட்டது ${issue.origin} ${adj}${issue.minimum.toString()} ஆக இருக்க வேண்டும்`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `தவறான சரம்: "${_issue.prefix}" இல் தொடங்க வேண்டும்`;
                if (_issue.format === "ends_with")
                    return `தவறான சரம்: "${_issue.suffix}" இல் முடிவடைய வேண்டும்`;
                if (_issue.format === "includes")
                    return `தவறான சரம்: "${_issue.includes}" ஐ உள்ளடக்க வேண்டும்`;
                if (_issue.format === "regex")
                    return `தவறான சரம்: ${_issue.pattern} முறைபாட்டுடன் பொருந்த வேண்டும்`;
                return `தவறான ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `தவறான எண்: ${issue.divisor} இன் பலமாக இருக்க வேண்டும்`;
            case "unrecognized_keys":
                return `அடையாளம் தெரியாத விசை${issue.keys.length > 1 ? "கள்" : ""}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `${issue.origin} இல் தவறான விசை`;
            case "invalid_union":
                return "தவறான உள்ளீடு";
            case "invalid_element":
                return `${issue.origin} இல் தவறான மதிப்பு`;
            default:
                return `தவறான உள்ளீடு`;
        }
    };
};
function ta () {
    return {
        localeError: error$8(),
    };
}

const error$7 = () => {
    const Sizable = {
        string: { unit: "ตัวอักษร", verb: "ควรมี" },
        file: { unit: "ไบต์", verb: "ควรมี" },
        array: { unit: "รายการ", verb: "ควรมี" },
        set: { unit: "รายการ", verb: "ควรมี" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "ไม่ใช่ตัวเลข (NaN)" : "ตัวเลข";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "อาร์เรย์ (Array)";
                }
                if (data === null) {
                    return "ไม่มีค่า (null)";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "ข้อมูลที่ป้อน",
        email: "ที่อยู่อีเมล",
        url: "URL",
        emoji: "อิโมจิ",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "วันที่เวลาแบบ ISO",
        date: "วันที่แบบ ISO",
        time: "เวลาแบบ ISO",
        duration: "ช่วงเวลาแบบ ISO",
        ipv4: "ที่อยู่ IPv4",
        ipv6: "ที่อยู่ IPv6",
        cidrv4: "ช่วง IP แบบ IPv4",
        cidrv6: "ช่วง IP แบบ IPv6",
        base64: "ข้อความแบบ Base64",
        base64url: "ข้อความแบบ Base64 สำหรับ URL",
        json_string: "ข้อความแบบ JSON",
        e164: "เบอร์โทรศัพท์ระหว่างประเทศ (E.164)",
        jwt: "โทเคน JWT",
        template_literal: "ข้อมูลที่ป้อน",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `ประเภทข้อมูลไม่ถูกต้อง: ควรเป็น ${issue.expected} แต่ได้รับ ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `ค่าไม่ถูกต้อง: ควรเป็น ${stringifyPrimitive(issue.values[0])}`;
                return `ตัวเลือกไม่ถูกต้อง: ควรเป็นหนึ่งใน ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "ไม่เกิน" : "น้อยกว่า";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `เกินกำหนด: ${issue.origin ?? "ค่า"} ควรมี${adj} ${issue.maximum.toString()} ${sizing.unit ?? "รายการ"}`;
                return `เกินกำหนด: ${issue.origin ?? "ค่า"} ควรมี${adj} ${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? "อย่างน้อย" : "มากกว่า";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `น้อยกว่ากำหนด: ${issue.origin} ควรมี${adj} ${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `น้อยกว่ากำหนด: ${issue.origin} ควรมี${adj} ${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `รูปแบบไม่ถูกต้อง: ข้อความต้องขึ้นต้นด้วย "${_issue.prefix}"`;
                }
                if (_issue.format === "ends_with")
                    return `รูปแบบไม่ถูกต้อง: ข้อความต้องลงท้ายด้วย "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `รูปแบบไม่ถูกต้อง: ข้อความต้องมี "${_issue.includes}" อยู่ในข้อความ`;
                if (_issue.format === "regex")
                    return `รูปแบบไม่ถูกต้อง: ต้องตรงกับรูปแบบที่กำหนด ${_issue.pattern}`;
                return `รูปแบบไม่ถูกต้อง: ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `ตัวเลขไม่ถูกต้อง: ต้องเป็นจำนวนที่หารด้วย ${issue.divisor} ได้ลงตัว`;
            case "unrecognized_keys":
                return `พบคีย์ที่ไม่รู้จัก: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `คีย์ไม่ถูกต้องใน ${issue.origin}`;
            case "invalid_union":
                return "ข้อมูลไม่ถูกต้อง: ไม่ตรงกับรูปแบบยูเนียนที่กำหนดไว้";
            case "invalid_element":
                return `ข้อมูลไม่ถูกต้องใน ${issue.origin}`;
            default:
                return `ข้อมูลไม่ถูกต้อง`;
        }
    };
};
function th () {
    return {
        localeError: error$7(),
    };
}

const parsedType = (data) => {
    const t = typeof data;
    switch (t) {
        case "number": {
            return Number.isNaN(data) ? "NaN" : "number";
        }
        case "object": {
            if (Array.isArray(data)) {
                return "array";
            }
            if (data === null) {
                return "null";
            }
            if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                return data.constructor.name;
            }
        }
    }
    return t;
};
const error$6 = () => {
    const Sizable = {
        string: { unit: "karakter", verb: "olmalı" },
        file: { unit: "bayt", verb: "olmalı" },
        array: { unit: "öğe", verb: "olmalı" },
        set: { unit: "öğe", verb: "olmalı" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const Nouns = {
        regex: "girdi",
        email: "e-posta adresi",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO tarih ve saat",
        date: "ISO tarih",
        time: "ISO saat",
        duration: "ISO süre",
        ipv4: "IPv4 adresi",
        ipv6: "IPv6 adresi",
        cidrv4: "IPv4 aralığı",
        cidrv6: "IPv6 aralığı",
        base64: "base64 ile şifrelenmiş metin",
        base64url: "base64url ile şifrelenmiş metin",
        json_string: "JSON dizesi",
        e164: "E.164 sayısı",
        jwt: "JWT",
        template_literal: "Şablon dizesi",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Geçersiz değer: beklenen ${issue.expected}, alınan ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Geçersiz değer: beklenen ${stringifyPrimitive(issue.values[0])}`;
                return `Geçersiz seçenek: aşağıdakilerden biri olmalı: ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Çok büyük: beklenen ${issue.origin ?? "değer"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "öğe"}`;
                return `Çok büyük: beklenen ${issue.origin ?? "değer"} ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Çok küçük: beklenen ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                return `Çok küçük: beklenen ${issue.origin} ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Geçersiz metin: "${_issue.prefix}" ile başlamalı`;
                if (_issue.format === "ends_with")
                    return `Geçersiz metin: "${_issue.suffix}" ile bitmeli`;
                if (_issue.format === "includes")
                    return `Geçersiz metin: "${_issue.includes}" içermeli`;
                if (_issue.format === "regex")
                    return `Geçersiz metin: ${_issue.pattern} desenine uymalı`;
                return `Geçersiz ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Geçersiz sayı: ${issue.divisor} ile tam bölünebilmeli`;
            case "unrecognized_keys":
                return `Tanınmayan anahtar${issue.keys.length > 1 ? "lar" : ""}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `${issue.origin} içinde geçersiz anahtar`;
            case "invalid_union":
                return "Geçersiz değer";
            case "invalid_element":
                return `${issue.origin} içinde geçersiz değer`;
            default:
                return `Geçersiz değer`;
        }
    };
};
function tr () {
    return {
        localeError: error$6(),
    };
}

const error$5 = () => {
    const Sizable = {
        string: { unit: "символів", verb: "матиме" },
        file: { unit: "байтів", verb: "матиме" },
        array: { unit: "елементів", verb: "матиме" },
        set: { unit: "елементів", verb: "матиме" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "число";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "масив";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "вхідні дані",
        email: "адреса електронної пошти",
        url: "URL",
        emoji: "емодзі",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "дата та час ISO",
        date: "дата ISO",
        time: "час ISO",
        duration: "тривалість ISO",
        ipv4: "адреса IPv4",
        ipv6: "адреса IPv6",
        cidrv4: "діапазон IPv4",
        cidrv6: "діапазон IPv6",
        base64: "рядок у кодуванні base64",
        base64url: "рядок у кодуванні base64url",
        json_string: "рядок JSON",
        e164: "номер E.164",
        jwt: "JWT",
        template_literal: "вхідні дані",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Неправильні вхідні дані: очікується ${issue.expected}, отримано ${parsedType(issue.input)}`;
            // return `Неправильні вхідні дані: очікується ${issue.expected}, отримано ${util.getParsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Неправильні вхідні дані: очікується ${stringifyPrimitive(issue.values[0])}`;
                return `Неправильна опція: очікується одне з ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Занадто велике: очікується, що ${issue.origin ?? "значення"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "елементів"}`;
                return `Занадто велике: очікується, що ${issue.origin ?? "значення"} буде ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Занадто мале: очікується, що ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Занадто мале: очікується, що ${issue.origin} буде ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Неправильний рядок: повинен починатися з "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Неправильний рядок: повинен закінчуватися на "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Неправильний рядок: повинен містити "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Неправильний рядок: повинен відповідати шаблону ${_issue.pattern}`;
                return `Неправильний ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Неправильне число: повинно бути кратним ${issue.divisor}`;
            case "unrecognized_keys":
                return `Нерозпізнаний ключ${issue.keys.length > 1 ? "і" : ""}: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Неправильний ключ у ${issue.origin}`;
            case "invalid_union":
                return "Неправильні вхідні дані";
            case "invalid_element":
                return `Неправильне значення у ${issue.origin}`;
            default:
                return `Неправильні вхідні дані`;
        }
    };
};
function uk () {
    return {
        localeError: error$5(),
    };
}

/** @deprecated Use `uk` instead. */
function ua () {
    return uk();
}

const error$4 = () => {
    const Sizable = {
        string: { unit: "حروف", verb: "ہونا" },
        file: { unit: "بائٹس", verb: "ہونا" },
        array: { unit: "آئٹمز", verb: "ہونا" },
        set: { unit: "آئٹمز", verb: "ہونا" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "نمبر";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "آرے";
                }
                if (data === null) {
                    return "نل";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "ان پٹ",
        email: "ای میل ایڈریس",
        url: "یو آر ایل",
        emoji: "ایموجی",
        uuid: "یو یو آئی ڈی",
        uuidv4: "یو یو آئی ڈی وی 4",
        uuidv6: "یو یو آئی ڈی وی 6",
        nanoid: "نینو آئی ڈی",
        guid: "جی یو آئی ڈی",
        cuid: "سی یو آئی ڈی",
        cuid2: "سی یو آئی ڈی 2",
        ulid: "یو ایل آئی ڈی",
        xid: "ایکس آئی ڈی",
        ksuid: "کے ایس یو آئی ڈی",
        datetime: "آئی ایس او ڈیٹ ٹائم",
        date: "آئی ایس او تاریخ",
        time: "آئی ایس او وقت",
        duration: "آئی ایس او مدت",
        ipv4: "آئی پی وی 4 ایڈریس",
        ipv6: "آئی پی وی 6 ایڈریس",
        cidrv4: "آئی پی وی 4 رینج",
        cidrv6: "آئی پی وی 6 رینج",
        base64: "بیس 64 ان کوڈڈ سٹرنگ",
        base64url: "بیس 64 یو آر ایل ان کوڈڈ سٹرنگ",
        json_string: "جے ایس او این سٹرنگ",
        e164: "ای 164 نمبر",
        jwt: "جے ڈبلیو ٹی",
        template_literal: "ان پٹ",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `غلط ان پٹ: ${issue.expected} متوقع تھا، ${parsedType(issue.input)} موصول ہوا`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `غلط ان پٹ: ${stringifyPrimitive(issue.values[0])} متوقع تھا`;
                return `غلط آپشن: ${joinValues(issue.values, "|")} میں سے ایک متوقع تھا`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `بہت بڑا: ${issue.origin ?? "ویلیو"} کے ${adj}${issue.maximum.toString()} ${sizing.unit ?? "عناصر"} ہونے متوقع تھے`;
                return `بہت بڑا: ${issue.origin ?? "ویلیو"} کا ${adj}${issue.maximum.toString()} ہونا متوقع تھا`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `بہت چھوٹا: ${issue.origin} کے ${adj}${issue.minimum.toString()} ${sizing.unit} ہونے متوقع تھے`;
                }
                return `بہت چھوٹا: ${issue.origin} کا ${adj}${issue.minimum.toString()} ہونا متوقع تھا`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `غلط سٹرنگ: "${_issue.prefix}" سے شروع ہونا چاہیے`;
                }
                if (_issue.format === "ends_with")
                    return `غلط سٹرنگ: "${_issue.suffix}" پر ختم ہونا چاہیے`;
                if (_issue.format === "includes")
                    return `غلط سٹرنگ: "${_issue.includes}" شامل ہونا چاہیے`;
                if (_issue.format === "regex")
                    return `غلط سٹرنگ: پیٹرن ${_issue.pattern} سے میچ ہونا چاہیے`;
                return `غلط ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `غلط نمبر: ${issue.divisor} کا مضاعف ہونا چاہیے`;
            case "unrecognized_keys":
                return `غیر تسلیم شدہ کی${issue.keys.length > 1 ? "ز" : ""}: ${joinValues(issue.keys, "، ")}`;
            case "invalid_key":
                return `${issue.origin} میں غلط کی`;
            case "invalid_union":
                return "غلط ان پٹ";
            case "invalid_element":
                return `${issue.origin} میں غلط ویلیو`;
            default:
                return `غلط ان پٹ`;
        }
    };
};
function ur () {
    return {
        localeError: error$4(),
    };
}

const error$3 = () => {
    const Sizable = {
        string: { unit: "ký tự", verb: "có" },
        file: { unit: "byte", verb: "có" },
        array: { unit: "phần tử", verb: "có" },
        set: { unit: "phần tử", verb: "có" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "số";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "mảng";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "đầu vào",
        email: "địa chỉ email",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ngày giờ ISO",
        date: "ngày ISO",
        time: "giờ ISO",
        duration: "khoảng thời gian ISO",
        ipv4: "địa chỉ IPv4",
        ipv6: "địa chỉ IPv6",
        cidrv4: "dải IPv4",
        cidrv6: "dải IPv6",
        base64: "chuỗi mã hóa base64",
        base64url: "chuỗi mã hóa base64url",
        json_string: "chuỗi JSON",
        e164: "số E.164",
        jwt: "JWT",
        template_literal: "đầu vào",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Đầu vào không hợp lệ: mong đợi ${issue.expected}, nhận được ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Đầu vào không hợp lệ: mong đợi ${stringifyPrimitive(issue.values[0])}`;
                return `Tùy chọn không hợp lệ: mong đợi một trong các giá trị ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Quá lớn: mong đợi ${issue.origin ?? "giá trị"} ${sizing.verb} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "phần tử"}`;
                return `Quá lớn: mong đợi ${issue.origin ?? "giá trị"} ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `Quá nhỏ: mong đợi ${issue.origin} ${sizing.verb} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `Quá nhỏ: mong đợi ${issue.origin} ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Chuỗi không hợp lệ: phải bắt đầu bằng "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Chuỗi không hợp lệ: phải kết thúc bằng "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Chuỗi không hợp lệ: phải bao gồm "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Chuỗi không hợp lệ: phải khớp với mẫu ${_issue.pattern}`;
                return `${Nouns[_issue.format] ?? issue.format} không hợp lệ`;
            }
            case "not_multiple_of":
                return `Số không hợp lệ: phải là bội số của ${issue.divisor}`;
            case "unrecognized_keys":
                return `Khóa không được nhận dạng: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Khóa không hợp lệ trong ${issue.origin}`;
            case "invalid_union":
                return "Đầu vào không hợp lệ";
            case "invalid_element":
                return `Giá trị không hợp lệ trong ${issue.origin}`;
            default:
                return `Đầu vào không hợp lệ`;
        }
    };
};
function vi () {
    return {
        localeError: error$3(),
    };
}

const error$2 = () => {
    const Sizable = {
        string: { unit: "字符", verb: "包含" },
        file: { unit: "字节", verb: "包含" },
        array: { unit: "项", verb: "包含" },
        set: { unit: "项", verb: "包含" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "非数字(NaN)" : "数字";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "数组";
                }
                if (data === null) {
                    return "空值(null)";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "输入",
        email: "电子邮件",
        url: "URL",
        emoji: "表情符号",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO日期时间",
        date: "ISO日期",
        time: "ISO时间",
        duration: "ISO时长",
        ipv4: "IPv4地址",
        ipv6: "IPv6地址",
        cidrv4: "IPv4网段",
        cidrv6: "IPv6网段",
        base64: "base64编码字符串",
        base64url: "base64url编码字符串",
        json_string: "JSON字符串",
        e164: "E.164号码",
        jwt: "JWT",
        template_literal: "输入",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `无效输入：期望 ${issue.expected}，实际接收 ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `无效输入：期望 ${stringifyPrimitive(issue.values[0])}`;
                return `无效选项：期望以下之一 ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `数值过大：期望 ${issue.origin ?? "值"} ${adj}${issue.maximum.toString()} ${sizing.unit ?? "个元素"}`;
                return `数值过大：期望 ${issue.origin ?? "值"} ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `数值过小：期望 ${issue.origin} ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `数值过小：期望 ${issue.origin} ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `无效字符串：必须以 "${_issue.prefix}" 开头`;
                if (_issue.format === "ends_with")
                    return `无效字符串：必须以 "${_issue.suffix}" 结尾`;
                if (_issue.format === "includes")
                    return `无效字符串：必须包含 "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `无效字符串：必须满足正则表达式 ${_issue.pattern}`;
                return `无效${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `无效数字：必须是 ${issue.divisor} 的倍数`;
            case "unrecognized_keys":
                return `出现未知的键(key): ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `${issue.origin} 中的键(key)无效`;
            case "invalid_union":
                return "无效输入";
            case "invalid_element":
                return `${issue.origin} 中包含无效值(value)`;
            default:
                return `无效输入`;
        }
    };
};
function zhCN () {
    return {
        localeError: error$2(),
    };
}

const error$1 = () => {
    const Sizable = {
        string: { unit: "字元", verb: "擁有" },
        file: { unit: "位元組", verb: "擁有" },
        array: { unit: "項目", verb: "擁有" },
        set: { unit: "項目", verb: "擁有" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "number";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "array";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "輸入",
        email: "郵件地址",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "ISO 日期時間",
        date: "ISO 日期",
        time: "ISO 時間",
        duration: "ISO 期間",
        ipv4: "IPv4 位址",
        ipv6: "IPv6 位址",
        cidrv4: "IPv4 範圍",
        cidrv6: "IPv6 範圍",
        base64: "base64 編碼字串",
        base64url: "base64url 編碼字串",
        json_string: "JSON 字串",
        e164: "E.164 數值",
        jwt: "JWT",
        template_literal: "輸入",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `無效的輸入值：預期為 ${issue.expected}，但收到 ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `無效的輸入值：預期為 ${stringifyPrimitive(issue.values[0])}`;
                return `無效的選項：預期為以下其中之一 ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `數值過大：預期 ${issue.origin ?? "值"} 應為 ${adj}${issue.maximum.toString()} ${sizing.unit ?? "個元素"}`;
                return `數值過大：預期 ${issue.origin ?? "值"} 應為 ${adj}${issue.maximum.toString()}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing) {
                    return `數值過小：預期 ${issue.origin} 應為 ${adj}${issue.minimum.toString()} ${sizing.unit}`;
                }
                return `數值過小：預期 ${issue.origin} 應為 ${adj}${issue.minimum.toString()}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with") {
                    return `無效的字串：必須以 "${_issue.prefix}" 開頭`;
                }
                if (_issue.format === "ends_with")
                    return `無效的字串：必須以 "${_issue.suffix}" 結尾`;
                if (_issue.format === "includes")
                    return `無效的字串：必須包含 "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `無效的字串：必須符合格式 ${_issue.pattern}`;
                return `無效的 ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `無效的數字：必須為 ${issue.divisor} 的倍數`;
            case "unrecognized_keys":
                return `無法識別的鍵值${issue.keys.length > 1 ? "們" : ""}：${joinValues(issue.keys, "、")}`;
            case "invalid_key":
                return `${issue.origin} 中有無效的鍵值`;
            case "invalid_union":
                return "無效的輸入值";
            case "invalid_element":
                return `${issue.origin} 中有無效的值`;
            default:
                return `無效的輸入值`;
        }
    };
};
function zhTW () {
    return {
        localeError: error$1(),
    };
}

const error = () => {
    const Sizable = {
        string: { unit: "àmi", verb: "ní" },
        file: { unit: "bytes", verb: "ní" },
        array: { unit: "nkan", verb: "ní" },
        set: { unit: "nkan", verb: "ní" },
    };
    function getSizing(origin) {
        return Sizable[origin] ?? null;
    }
    const parsedType = (data) => {
        const t = typeof data;
        switch (t) {
            case "number": {
                return Number.isNaN(data) ? "NaN" : "nọ́mbà";
            }
            case "object": {
                if (Array.isArray(data)) {
                    return "akopọ";
                }
                if (data === null) {
                    return "null";
                }
                if (Object.getPrototypeOf(data) !== Object.prototype && data.constructor) {
                    return data.constructor.name;
                }
            }
        }
        return t;
    };
    const Nouns = {
        regex: "ẹ̀rọ ìbáwọlé",
        email: "àdírẹ́sì ìmẹ́lì",
        url: "URL",
        emoji: "emoji",
        uuid: "UUID",
        uuidv4: "UUIDv4",
        uuidv6: "UUIDv6",
        nanoid: "nanoid",
        guid: "GUID",
        cuid: "cuid",
        cuid2: "cuid2",
        ulid: "ULID",
        xid: "XID",
        ksuid: "KSUID",
        datetime: "àkókò ISO",
        date: "ọjọ́ ISO",
        time: "àkókò ISO",
        duration: "àkókò tó pé ISO",
        ipv4: "àdírẹ́sì IPv4",
        ipv6: "àdírẹ́sì IPv6",
        cidrv4: "àgbègbè IPv4",
        cidrv6: "àgbègbè IPv6",
        base64: "ọ̀rọ̀ tí a kọ́ ní base64",
        base64url: "ọ̀rọ̀ base64url",
        json_string: "ọ̀rọ̀ JSON",
        e164: "nọ́mbà E.164",
        jwt: "JWT",
        template_literal: "ẹ̀rọ ìbáwọlé",
    };
    return (issue) => {
        switch (issue.code) {
            case "invalid_type":
                return `Ìbáwọlé aṣìṣe: a ní láti fi ${issue.expected}, àmọ̀ a rí ${parsedType(issue.input)}`;
            case "invalid_value":
                if (issue.values.length === 1)
                    return `Ìbáwọlé aṣìṣe: a ní láti fi ${stringifyPrimitive(issue.values[0])}`;
                return `Àṣàyàn aṣìṣe: yan ọ̀kan lára ${joinValues(issue.values, "|")}`;
            case "too_big": {
                const adj = issue.inclusive ? "<=" : "<";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Tó pọ̀ jù: a ní láti jẹ́ pé ${issue.origin ?? "iye"} ${sizing.verb} ${adj}${issue.maximum} ${sizing.unit}`;
                return `Tó pọ̀ jù: a ní láti jẹ́ ${adj}${issue.maximum}`;
            }
            case "too_small": {
                const adj = issue.inclusive ? ">=" : ">";
                const sizing = getSizing(issue.origin);
                if (sizing)
                    return `Kéré ju: a ní láti jẹ́ pé ${issue.origin} ${sizing.verb} ${adj}${issue.minimum} ${sizing.unit}`;
                return `Kéré ju: a ní láti jẹ́ ${adj}${issue.minimum}`;
            }
            case "invalid_format": {
                const _issue = issue;
                if (_issue.format === "starts_with")
                    return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ bẹ̀rẹ̀ pẹ̀lú "${_issue.prefix}"`;
                if (_issue.format === "ends_with")
                    return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ parí pẹ̀lú "${_issue.suffix}"`;
                if (_issue.format === "includes")
                    return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ ní "${_issue.includes}"`;
                if (_issue.format === "regex")
                    return `Ọ̀rọ̀ aṣìṣe: gbọ́dọ̀ bá àpẹẹrẹ mu ${_issue.pattern}`;
                return `Aṣìṣe: ${Nouns[_issue.format] ?? issue.format}`;
            }
            case "not_multiple_of":
                return `Nọ́mbà aṣìṣe: gbọ́dọ̀ jẹ́ èyà pípín ti ${issue.divisor}`;
            case "unrecognized_keys":
                return `Bọtìnì àìmọ̀: ${joinValues(issue.keys, ", ")}`;
            case "invalid_key":
                return `Bọtìnì aṣìṣe nínú ${issue.origin}`;
            case "invalid_union":
                return "Ìbáwọlé aṣìṣe";
            case "invalid_element":
                return `Iye aṣìṣe nínú ${issue.origin}`;
            default:
                return "Ìbáwọlé aṣìṣe";
        }
    };
};
function yo () {
    return {
        localeError: error(),
    };
}

const index$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ar,
  az,
  be,
  bg,
  ca,
  cs,
  da,
  de,
  en,
  eo,
  es,
  fa,
  fi,
  fr,
  frCA,
  he,
  hu,
  id,
  is,
  it,
  ja,
  ka,
  kh,
  km,
  ko,
  lt,
  mk,
  ms,
  nl,
  no,
  ota,
  pl,
  ps,
  pt,
  ru,
  sl,
  sv,
  ta,
  th,
  tr,
  ua,
  uk,
  ur,
  vi,
  yo,
  zhCN,
  zhTW
}, Symbol.toStringTag, { value: 'Module' }));

const $output = Symbol("ZodOutput");
const $input = Symbol("ZodInput");
class $ZodRegistry {
    constructor() {
        this._map = new WeakMap();
        this._idmap = new Map();
    }
    add(schema, ..._meta) {
        const meta = _meta[0];
        this._map.set(schema, meta);
        if (meta && typeof meta === "object" && "id" in meta) {
            if (this._idmap.has(meta.id)) {
                throw new Error(`ID ${meta.id} already exists in the registry`);
            }
            this._idmap.set(meta.id, schema);
        }
        return this;
    }
    clear() {
        this._map = new WeakMap();
        this._idmap = new Map();
        return this;
    }
    remove(schema) {
        const meta = this._map.get(schema);
        if (meta && typeof meta === "object" && "id" in meta) {
            this._idmap.delete(meta.id);
        }
        this._map.delete(schema);
        return this;
    }
    get(schema) {
        // return this._map.get(schema) as any;
        // inherit metadata
        const p = schema._zod.parent;
        if (p) {
            const pm = { ...(this.get(p) ?? {}) };
            delete pm.id; // do not inherit id
            const f = { ...pm, ...this._map.get(schema) };
            return Object.keys(f).length ? f : undefined;
        }
        return this._map.get(schema);
    }
    has(schema) {
        return this._map.has(schema);
    }
}
// registries
function registry() {
    return new $ZodRegistry();
}
const globalRegistry = /*@__PURE__*/ registry();

function _string(Class, params) {
    return new Class({
        type: "string",
        ...normalizeParams(params),
    });
}
function _coercedString(Class, params) {
    return new Class({
        type: "string",
        coerce: true,
        ...normalizeParams(params),
    });
}
function _email(Class, params) {
    return new Class({
        type: "string",
        format: "email",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _guid(Class, params) {
    return new Class({
        type: "string",
        format: "guid",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _uuid(Class, params) {
    return new Class({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _uuidv4(Class, params) {
    return new Class({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: false,
        version: "v4",
        ...normalizeParams(params),
    });
}
function _uuidv6(Class, params) {
    return new Class({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: false,
        version: "v6",
        ...normalizeParams(params),
    });
}
function _uuidv7(Class, params) {
    return new Class({
        type: "string",
        format: "uuid",
        check: "string_format",
        abort: false,
        version: "v7",
        ...normalizeParams(params),
    });
}
function _url(Class, params) {
    return new Class({
        type: "string",
        format: "url",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _emoji(Class, params) {
    return new Class({
        type: "string",
        format: "emoji",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _nanoid(Class, params) {
    return new Class({
        type: "string",
        format: "nanoid",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _cuid(Class, params) {
    return new Class({
        type: "string",
        format: "cuid",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _cuid2(Class, params) {
    return new Class({
        type: "string",
        format: "cuid2",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _ulid(Class, params) {
    return new Class({
        type: "string",
        format: "ulid",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _xid(Class, params) {
    return new Class({
        type: "string",
        format: "xid",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _ksuid(Class, params) {
    return new Class({
        type: "string",
        format: "ksuid",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _ipv4(Class, params) {
    return new Class({
        type: "string",
        format: "ipv4",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _ipv6(Class, params) {
    return new Class({
        type: "string",
        format: "ipv6",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _cidrv4(Class, params) {
    return new Class({
        type: "string",
        format: "cidrv4",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _cidrv6(Class, params) {
    return new Class({
        type: "string",
        format: "cidrv6",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _base64(Class, params) {
    return new Class({
        type: "string",
        format: "base64",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _base64url(Class, params) {
    return new Class({
        type: "string",
        format: "base64url",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _e164(Class, params) {
    return new Class({
        type: "string",
        format: "e164",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
function _jwt(Class, params) {
    return new Class({
        type: "string",
        format: "jwt",
        check: "string_format",
        abort: false,
        ...normalizeParams(params),
    });
}
const TimePrecision = {
    Any: null,
    Minute: -1,
    Second: 0,
    Millisecond: 3,
    Microsecond: 6,
};
function _isoDateTime(Class, params) {
    return new Class({
        type: "string",
        format: "datetime",
        check: "string_format",
        offset: false,
        local: false,
        precision: null,
        ...normalizeParams(params),
    });
}
function _isoDate(Class, params) {
    return new Class({
        type: "string",
        format: "date",
        check: "string_format",
        ...normalizeParams(params),
    });
}
function _isoTime(Class, params) {
    return new Class({
        type: "string",
        format: "time",
        check: "string_format",
        precision: null,
        ...normalizeParams(params),
    });
}
function _isoDuration(Class, params) {
    return new Class({
        type: "string",
        format: "duration",
        check: "string_format",
        ...normalizeParams(params),
    });
}
function _number(Class, params) {
    return new Class({
        type: "number",
        checks: [],
        ...normalizeParams(params),
    });
}
function _coercedNumber(Class, params) {
    return new Class({
        type: "number",
        coerce: true,
        checks: [],
        ...normalizeParams(params),
    });
}
function _int(Class, params) {
    return new Class({
        type: "number",
        check: "number_format",
        abort: false,
        format: "safeint",
        ...normalizeParams(params),
    });
}
function _float32(Class, params) {
    return new Class({
        type: "number",
        check: "number_format",
        abort: false,
        format: "float32",
        ...normalizeParams(params),
    });
}
function _float64(Class, params) {
    return new Class({
        type: "number",
        check: "number_format",
        abort: false,
        format: "float64",
        ...normalizeParams(params),
    });
}
function _int32(Class, params) {
    return new Class({
        type: "number",
        check: "number_format",
        abort: false,
        format: "int32",
        ...normalizeParams(params),
    });
}
function _uint32(Class, params) {
    return new Class({
        type: "number",
        check: "number_format",
        abort: false,
        format: "uint32",
        ...normalizeParams(params),
    });
}
function _boolean(Class, params) {
    return new Class({
        type: "boolean",
        ...normalizeParams(params),
    });
}
function _coercedBoolean(Class, params) {
    return new Class({
        type: "boolean",
        coerce: true,
        ...normalizeParams(params),
    });
}
function _bigint(Class, params) {
    return new Class({
        type: "bigint",
        ...normalizeParams(params),
    });
}
function _coercedBigint(Class, params) {
    return new Class({
        type: "bigint",
        coerce: true,
        ...normalizeParams(params),
    });
}
function _int64(Class, params) {
    return new Class({
        type: "bigint",
        check: "bigint_format",
        abort: false,
        format: "int64",
        ...normalizeParams(params),
    });
}
function _uint64(Class, params) {
    return new Class({
        type: "bigint",
        check: "bigint_format",
        abort: false,
        format: "uint64",
        ...normalizeParams(params),
    });
}
function _symbol(Class, params) {
    return new Class({
        type: "symbol",
        ...normalizeParams(params),
    });
}
function _undefined$1(Class, params) {
    return new Class({
        type: "undefined",
        ...normalizeParams(params),
    });
}
function _null$1(Class, params) {
    return new Class({
        type: "null",
        ...normalizeParams(params),
    });
}
function _any(Class) {
    return new Class({
        type: "any",
    });
}
function _unknown(Class) {
    return new Class({
        type: "unknown",
    });
}
function _never(Class, params) {
    return new Class({
        type: "never",
        ...normalizeParams(params),
    });
}
function _void$1(Class, params) {
    return new Class({
        type: "void",
        ...normalizeParams(params),
    });
}
function _date(Class, params) {
    return new Class({
        type: "date",
        ...normalizeParams(params),
    });
}
function _coercedDate(Class, params) {
    return new Class({
        type: "date",
        coerce: true,
        ...normalizeParams(params),
    });
}
function _nan(Class, params) {
    return new Class({
        type: "nan",
        ...normalizeParams(params),
    });
}
function _lt(value, params) {
    return new $ZodCheckLessThan({
        check: "less_than",
        ...normalizeParams(params),
        value,
        inclusive: false,
    });
}
function _lte(value, params) {
    return new $ZodCheckLessThan({
        check: "less_than",
        ...normalizeParams(params),
        value,
        inclusive: true,
    });
}
function _gt(value, params) {
    return new $ZodCheckGreaterThan({
        check: "greater_than",
        ...normalizeParams(params),
        value,
        inclusive: false,
    });
}
function _gte(value, params) {
    return new $ZodCheckGreaterThan({
        check: "greater_than",
        ...normalizeParams(params),
        value,
        inclusive: true,
    });
}
function _positive(params) {
    return _gt(0, params);
}
// negative
function _negative(params) {
    return _lt(0, params);
}
// nonpositive
function _nonpositive(params) {
    return _lte(0, params);
}
// nonnegative
function _nonnegative(params) {
    return _gte(0, params);
}
function _multipleOf(value, params) {
    return new $ZodCheckMultipleOf({
        check: "multiple_of",
        ...normalizeParams(params),
        value,
    });
}
function _maxSize(maximum, params) {
    return new $ZodCheckMaxSize({
        check: "max_size",
        ...normalizeParams(params),
        maximum,
    });
}
function _minSize(minimum, params) {
    return new $ZodCheckMinSize({
        check: "min_size",
        ...normalizeParams(params),
        minimum,
    });
}
function _size(size, params) {
    return new $ZodCheckSizeEquals({
        check: "size_equals",
        ...normalizeParams(params),
        size,
    });
}
function _maxLength(maximum, params) {
    const ch = new $ZodCheckMaxLength({
        check: "max_length",
        ...normalizeParams(params),
        maximum,
    });
    return ch;
}
function _minLength(minimum, params) {
    return new $ZodCheckMinLength({
        check: "min_length",
        ...normalizeParams(params),
        minimum,
    });
}
function _length(length, params) {
    return new $ZodCheckLengthEquals({
        check: "length_equals",
        ...normalizeParams(params),
        length,
    });
}
function _regex(pattern, params) {
    return new $ZodCheckRegex({
        check: "string_format",
        format: "regex",
        ...normalizeParams(params),
        pattern,
    });
}
function _lowercase(params) {
    return new $ZodCheckLowerCase({
        check: "string_format",
        format: "lowercase",
        ...normalizeParams(params),
    });
}
function _uppercase(params) {
    return new $ZodCheckUpperCase({
        check: "string_format",
        format: "uppercase",
        ...normalizeParams(params),
    });
}
function _includes(includes, params) {
    return new $ZodCheckIncludes({
        check: "string_format",
        format: "includes",
        ...normalizeParams(params),
        includes,
    });
}
function _startsWith(prefix, params) {
    return new $ZodCheckStartsWith({
        check: "string_format",
        format: "starts_with",
        ...normalizeParams(params),
        prefix,
    });
}
function _endsWith(suffix, params) {
    return new $ZodCheckEndsWith({
        check: "string_format",
        format: "ends_with",
        ...normalizeParams(params),
        suffix,
    });
}
function _property(property, schema, params) {
    return new $ZodCheckProperty({
        check: "property",
        property,
        schema,
        ...normalizeParams(params),
    });
}
function _mime(types, params) {
    return new $ZodCheckMimeType({
        check: "mime_type",
        mime: types,
        ...normalizeParams(params),
    });
}
function _overwrite(tx) {
    return new $ZodCheckOverwrite({
        check: "overwrite",
        tx,
    });
}
// normalize
function _normalize(form) {
    return _overwrite((input) => input.normalize(form));
}
// trim
function _trim() {
    return _overwrite((input) => input.trim());
}
// toLowerCase
function _toLowerCase() {
    return _overwrite((input) => input.toLowerCase());
}
// toUpperCase
function _toUpperCase() {
    return _overwrite((input) => input.toUpperCase());
}
function _array(Class, element, params) {
    return new Class({
        type: "array",
        element,
        // get element() {
        //   return element;
        // },
        ...normalizeParams(params),
    });
}
function _union(Class, options, params) {
    return new Class({
        type: "union",
        options,
        ...normalizeParams(params),
    });
}
function _discriminatedUnion(Class, discriminator, options, params) {
    return new Class({
        type: "union",
        options,
        discriminator,
        ...normalizeParams(params),
    });
}
function _intersection(Class, left, right) {
    return new Class({
        type: "intersection",
        left,
        right,
    });
}
// export function _tuple(
//   Class: util.SchemaClass<schemas.$ZodTuple>,
//   items: [],
//   params?: string | $ZodTupleParams
// ): schemas.$ZodTuple<[], null>;
function _tuple(Class, items, _paramsOrRest, _params) {
    const hasRest = _paramsOrRest instanceof $ZodType;
    const params = hasRest ? _params : _paramsOrRest;
    const rest = hasRest ? _paramsOrRest : null;
    return new Class({
        type: "tuple",
        items,
        rest,
        ...normalizeParams(params),
    });
}
function _record(Class, keyType, valueType, params) {
    return new Class({
        type: "record",
        keyType,
        valueType,
        ...normalizeParams(params),
    });
}
function _map(Class, keyType, valueType, params) {
    return new Class({
        type: "map",
        keyType,
        valueType,
        ...normalizeParams(params),
    });
}
function _set(Class, valueType, params) {
    return new Class({
        type: "set",
        valueType,
        ...normalizeParams(params),
    });
}
function _enum$1(Class, values, params) {
    const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
    // if (Array.isArray(values)) {
    //   for (const value of values) {
    //     entries[value] = value;
    //   }
    // } else {
    //   Object.assign(entries, values);
    // }
    // const entries: util.EnumLike = {};
    // for (const val of values) {
    //   entries[val] = val;
    // }
    return new Class({
        type: "enum",
        entries,
        ...normalizeParams(params),
    });
}
/** @deprecated This API has been merged into `z.enum()`. Use `z.enum()` instead.
 *
 * ```ts
 * enum Colors { red, green, blue }
 * z.enum(Colors);
 * ```
 */
function _nativeEnum(Class, entries, params) {
    return new Class({
        type: "enum",
        entries,
        ...normalizeParams(params),
    });
}
function _literal(Class, value, params) {
    return new Class({
        type: "literal",
        values: Array.isArray(value) ? value : [value],
        ...normalizeParams(params),
    });
}
function _file(Class, params) {
    return new Class({
        type: "file",
        ...normalizeParams(params),
    });
}
function _transform(Class, fn) {
    return new Class({
        type: "transform",
        transform: fn,
    });
}
function _optional(Class, innerType) {
    return new Class({
        type: "optional",
        innerType,
    });
}
function _nullable(Class, innerType) {
    return new Class({
        type: "nullable",
        innerType,
    });
}
function _default$1(Class, innerType, defaultValue) {
    return new Class({
        type: "default",
        innerType,
        get defaultValue() {
            return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
        },
    });
}
function _nonoptional(Class, innerType, params) {
    return new Class({
        type: "nonoptional",
        innerType,
        ...normalizeParams(params),
    });
}
function _success(Class, innerType) {
    return new Class({
        type: "success",
        innerType,
    });
}
function _catch$1(Class, innerType, catchValue) {
    return new Class({
        type: "catch",
        innerType,
        catchValue: (typeof catchValue === "function" ? catchValue : () => catchValue),
    });
}
function _pipe(Class, in_, out) {
    return new Class({
        type: "pipe",
        in: in_,
        out,
    });
}
function _readonly(Class, innerType) {
    return new Class({
        type: "readonly",
        innerType,
    });
}
function _templateLiteral(Class, parts, params) {
    return new Class({
        type: "template_literal",
        parts,
        ...normalizeParams(params),
    });
}
function _lazy(Class, getter) {
    return new Class({
        type: "lazy",
        getter,
    });
}
function _promise(Class, innerType) {
    return new Class({
        type: "promise",
        innerType,
    });
}
function _custom(Class, fn, _params) {
    const norm = normalizeParams(_params);
    norm.abort ?? (norm.abort = true); // default to abort:false
    const schema = new Class({
        type: "custom",
        check: "custom",
        fn: fn,
        ...norm,
    });
    return schema;
}
// same as _custom but defaults to abort:false
function _refine(Class, fn, _params) {
    const schema = new Class({
        type: "custom",
        check: "custom",
        fn: fn,
        ...normalizeParams(_params),
    });
    return schema;
}
function _superRefine(fn) {
    const ch = _check((payload) => {
        payload.addIssue = (issue$1) => {
            if (typeof issue$1 === "string") {
                payload.issues.push(issue(issue$1, payload.value, ch._zod.def));
            }
            else {
                // for Zod 3 backwards compatibility
                const _issue = issue$1;
                if (_issue.fatal)
                    _issue.continue = false;
                _issue.code ?? (_issue.code = "custom");
                _issue.input ?? (_issue.input = payload.value);
                _issue.inst ?? (_issue.inst = ch);
                _issue.continue ?? (_issue.continue = !ch._zod.def.abort); // abort is always undefined, so this is always true...
                payload.issues.push(issue(_issue));
            }
        };
        return fn(payload.value, payload);
    });
    return ch;
}
function _check(fn, params) {
    const ch = new $ZodCheck({
        check: "custom",
        ...normalizeParams(params),
    });
    ch._zod.check = fn;
    return ch;
}
function _stringbool(Classes, _params) {
    const params = normalizeParams(_params);
    let truthyArray = params.truthy ?? ["true", "1", "yes", "on", "y", "enabled"];
    let falsyArray = params.falsy ?? ["false", "0", "no", "off", "n", "disabled"];
    if (params.case !== "sensitive") {
        truthyArray = truthyArray.map((v) => (typeof v === "string" ? v.toLowerCase() : v));
        falsyArray = falsyArray.map((v) => (typeof v === "string" ? v.toLowerCase() : v));
    }
    const truthySet = new Set(truthyArray);
    const falsySet = new Set(falsyArray);
    const _Codec = Classes.Codec ?? $ZodCodec;
    const _Boolean = Classes.Boolean ?? $ZodBoolean;
    const _String = Classes.String ?? $ZodString;
    const stringSchema = new _String({ type: "string", error: params.error });
    const booleanSchema = new _Boolean({ type: "boolean", error: params.error });
    const codec = new _Codec({
        type: "pipe",
        in: stringSchema,
        out: booleanSchema,
        transform: ((input, payload) => {
            let data = input;
            if (params.case !== "sensitive")
                data = data.toLowerCase();
            if (truthySet.has(data)) {
                return true;
            }
            else if (falsySet.has(data)) {
                return false;
            }
            else {
                payload.issues.push({
                    code: "invalid_value",
                    expected: "stringbool",
                    values: [...truthySet, ...falsySet],
                    input: payload.value,
                    inst: codec,
                    continue: false,
                });
                return {};
            }
        }),
        reverseTransform: ((input, _payload) => {
            if (input === true) {
                return truthyArray[0] || "true";
            }
            else {
                return falsyArray[0] || "false";
            }
        }),
        error: params.error,
    });
    return codec;
}
function _stringFormat(Class, format, fnOrRegex, _params = {}) {
    const params = normalizeParams(_params);
    const def = {
        ...normalizeParams(_params),
        check: "string_format",
        type: "string",
        format,
        fn: typeof fnOrRegex === "function" ? fnOrRegex : (val) => fnOrRegex.test(val),
        ...params,
    };
    if (fnOrRegex instanceof RegExp) {
        def.pattern = fnOrRegex;
    }
    const inst = new Class(def);
    return inst;
}

class JSONSchemaGenerator {
    constructor(params) {
        this.counter = 0;
        this.metadataRegistry = params?.metadata ?? globalRegistry;
        this.target = params?.target ?? "draft-2020-12";
        this.unrepresentable = params?.unrepresentable ?? "throw";
        this.override = params?.override ?? (() => { });
        this.io = params?.io ?? "output";
        this.seen = new Map();
    }
    process(schema, _params = { path: [], schemaPath: [] }) {
        var _a;
        const def = schema._zod.def;
        const formatMap = {
            guid: "uuid",
            url: "uri",
            datetime: "date-time",
            json_string: "json-string",
            regex: "", // do not set
        };
        // check for schema in seens
        const seen = this.seen.get(schema);
        if (seen) {
            seen.count++;
            // check if cycle
            const isCycle = _params.schemaPath.includes(schema);
            if (isCycle) {
                seen.cycle = _params.path;
            }
            return seen.schema;
        }
        // initialize
        const result = { schema: {}, count: 1, cycle: undefined, path: _params.path };
        this.seen.set(schema, result);
        // custom method overrides default behavior
        const overrideSchema = schema._zod.toJSONSchema?.();
        if (overrideSchema) {
            result.schema = overrideSchema;
        }
        else {
            const params = {
                ..._params,
                schemaPath: [..._params.schemaPath, schema],
                path: _params.path,
            };
            const parent = schema._zod.parent;
            if (parent) {
                // schema was cloned from another schema
                result.ref = parent;
                this.process(parent, params);
                this.seen.get(parent).isParent = true;
            }
            else {
                const _json = result.schema;
                switch (def.type) {
                    case "string": {
                        const json = _json;
                        json.type = "string";
                        const { minimum, maximum, format, patterns, contentEncoding } = schema._zod
                            .bag;
                        if (typeof minimum === "number")
                            json.minLength = minimum;
                        if (typeof maximum === "number")
                            json.maxLength = maximum;
                        // custom pattern overrides format
                        if (format) {
                            json.format = formatMap[format] ?? format;
                            if (json.format === "")
                                delete json.format; // empty format is not valid
                        }
                        if (contentEncoding)
                            json.contentEncoding = contentEncoding;
                        if (patterns && patterns.size > 0) {
                            const regexes = [...patterns];
                            if (regexes.length === 1)
                                json.pattern = regexes[0].source;
                            else if (regexes.length > 1) {
                                result.schema.allOf = [
                                    ...regexes.map((regex) => ({
                                        ...(this.target === "draft-7" || this.target === "draft-4" || this.target === "openapi-3.0"
                                            ? { type: "string" }
                                            : {}),
                                        pattern: regex.source,
                                    })),
                                ];
                            }
                        }
                        break;
                    }
                    case "number": {
                        const json = _json;
                        const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
                        if (typeof format === "string" && format.includes("int"))
                            json.type = "integer";
                        else
                            json.type = "number";
                        if (typeof exclusiveMinimum === "number") {
                            if (this.target === "draft-4" || this.target === "openapi-3.0") {
                                json.minimum = exclusiveMinimum;
                                json.exclusiveMinimum = true;
                            }
                            else {
                                json.exclusiveMinimum = exclusiveMinimum;
                            }
                        }
                        if (typeof minimum === "number") {
                            json.minimum = minimum;
                            if (typeof exclusiveMinimum === "number" && this.target !== "draft-4") {
                                if (exclusiveMinimum >= minimum)
                                    delete json.minimum;
                                else
                                    delete json.exclusiveMinimum;
                            }
                        }
                        if (typeof exclusiveMaximum === "number") {
                            if (this.target === "draft-4" || this.target === "openapi-3.0") {
                                json.maximum = exclusiveMaximum;
                                json.exclusiveMaximum = true;
                            }
                            else {
                                json.exclusiveMaximum = exclusiveMaximum;
                            }
                        }
                        if (typeof maximum === "number") {
                            json.maximum = maximum;
                            if (typeof exclusiveMaximum === "number" && this.target !== "draft-4") {
                                if (exclusiveMaximum <= maximum)
                                    delete json.maximum;
                                else
                                    delete json.exclusiveMaximum;
                            }
                        }
                        if (typeof multipleOf === "number")
                            json.multipleOf = multipleOf;
                        break;
                    }
                    case "boolean": {
                        const json = _json;
                        json.type = "boolean";
                        break;
                    }
                    case "bigint": {
                        if (this.unrepresentable === "throw") {
                            throw new Error("BigInt cannot be represented in JSON Schema");
                        }
                        break;
                    }
                    case "symbol": {
                        if (this.unrepresentable === "throw") {
                            throw new Error("Symbols cannot be represented in JSON Schema");
                        }
                        break;
                    }
                    case "null": {
                        if (this.target === "openapi-3.0") {
                            _json.type = "string";
                            _json.nullable = true;
                            _json.enum = [null];
                        }
                        else
                            _json.type = "null";
                        break;
                    }
                    case "any": {
                        break;
                    }
                    case "unknown": {
                        break;
                    }
                    case "undefined": {
                        if (this.unrepresentable === "throw") {
                            throw new Error("Undefined cannot be represented in JSON Schema");
                        }
                        break;
                    }
                    case "void": {
                        if (this.unrepresentable === "throw") {
                            throw new Error("Void cannot be represented in JSON Schema");
                        }
                        break;
                    }
                    case "never": {
                        _json.not = {};
                        break;
                    }
                    case "date": {
                        if (this.unrepresentable === "throw") {
                            throw new Error("Date cannot be represented in JSON Schema");
                        }
                        break;
                    }
                    case "array": {
                        const json = _json;
                        const { minimum, maximum } = schema._zod.bag;
                        if (typeof minimum === "number")
                            json.minItems = minimum;
                        if (typeof maximum === "number")
                            json.maxItems = maximum;
                        json.type = "array";
                        json.items = this.process(def.element, { ...params, path: [...params.path, "items"] });
                        break;
                    }
                    case "object": {
                        const json = _json;
                        json.type = "object";
                        json.properties = {};
                        const shape = def.shape; // params.shapeCache.get(schema)!;
                        for (const key in shape) {
                            json.properties[key] = this.process(shape[key], {
                                ...params,
                                path: [...params.path, "properties", key],
                            });
                        }
                        // required keys
                        const allKeys = new Set(Object.keys(shape));
                        // const optionalKeys = new Set(def.optional);
                        const requiredKeys = new Set([...allKeys].filter((key) => {
                            const v = def.shape[key]._zod;
                            if (this.io === "input") {
                                return v.optin === undefined;
                            }
                            else {
                                return v.optout === undefined;
                            }
                        }));
                        if (requiredKeys.size > 0) {
                            json.required = Array.from(requiredKeys);
                        }
                        // catchall
                        if (def.catchall?._zod.def.type === "never") {
                            // strict
                            json.additionalProperties = false;
                        }
                        else if (!def.catchall) {
                            // regular
                            if (this.io === "output")
                                json.additionalProperties = false;
                        }
                        else if (def.catchall) {
                            json.additionalProperties = this.process(def.catchall, {
                                ...params,
                                path: [...params.path, "additionalProperties"],
                            });
                        }
                        break;
                    }
                    case "union": {
                        const json = _json;
                        const options = def.options.map((x, i) => this.process(x, {
                            ...params,
                            path: [...params.path, "anyOf", i],
                        }));
                        json.anyOf = options;
                        break;
                    }
                    case "intersection": {
                        const json = _json;
                        const a = this.process(def.left, {
                            ...params,
                            path: [...params.path, "allOf", 0],
                        });
                        const b = this.process(def.right, {
                            ...params,
                            path: [...params.path, "allOf", 1],
                        });
                        const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
                        const allOf = [
                            ...(isSimpleIntersection(a) ? a.allOf : [a]),
                            ...(isSimpleIntersection(b) ? b.allOf : [b]),
                        ];
                        json.allOf = allOf;
                        break;
                    }
                    case "tuple": {
                        const json = _json;
                        json.type = "array";
                        const prefixPath = this.target === "draft-2020-12" ? "prefixItems" : "items";
                        const restPath = this.target === "draft-2020-12" ? "items" : this.target === "openapi-3.0" ? "items" : "additionalItems";
                        const prefixItems = def.items.map((x, i) => this.process(x, {
                            ...params,
                            path: [...params.path, prefixPath, i],
                        }));
                        const rest = def.rest
                            ? this.process(def.rest, {
                                ...params,
                                path: [...params.path, restPath, ...(this.target === "openapi-3.0" ? [def.items.length] : [])],
                            })
                            : null;
                        if (this.target === "draft-2020-12") {
                            json.prefixItems = prefixItems;
                            if (rest) {
                                json.items = rest;
                            }
                        }
                        else if (this.target === "openapi-3.0") {
                            json.items = {
                                anyOf: prefixItems,
                            };
                            if (rest) {
                                json.items.anyOf.push(rest);
                            }
                            json.minItems = prefixItems.length;
                            if (!rest) {
                                json.maxItems = prefixItems.length;
                            }
                        }
                        else {
                            json.items = prefixItems;
                            if (rest) {
                                json.additionalItems = rest;
                            }
                        }
                        // length
                        const { minimum, maximum } = schema._zod.bag;
                        if (typeof minimum === "number")
                            json.minItems = minimum;
                        if (typeof maximum === "number")
                            json.maxItems = maximum;
                        break;
                    }
                    case "record": {
                        const json = _json;
                        json.type = "object";
                        if (this.target === "draft-7" || this.target === "draft-2020-12") {
                            json.propertyNames = this.process(def.keyType, {
                                ...params,
                                path: [...params.path, "propertyNames"],
                            });
                        }
                        json.additionalProperties = this.process(def.valueType, {
                            ...params,
                            path: [...params.path, "additionalProperties"],
                        });
                        break;
                    }
                    case "map": {
                        if (this.unrepresentable === "throw") {
                            throw new Error("Map cannot be represented in JSON Schema");
                        }
                        break;
                    }
                    case "set": {
                        if (this.unrepresentable === "throw") {
                            throw new Error("Set cannot be represented in JSON Schema");
                        }
                        break;
                    }
                    case "enum": {
                        const json = _json;
                        const values = getEnumValues(def.entries);
                        // Number enums can have both string and number values
                        if (values.every((v) => typeof v === "number"))
                            json.type = "number";
                        if (values.every((v) => typeof v === "string"))
                            json.type = "string";
                        json.enum = values;
                        break;
                    }
                    case "literal": {
                        const json = _json;
                        const vals = [];
                        for (const val of def.values) {
                            if (val === undefined) {
                                if (this.unrepresentable === "throw") {
                                    throw new Error("Literal `undefined` cannot be represented in JSON Schema");
                                }
                                else {
                                    // do not add to vals
                                }
                            }
                            else if (typeof val === "bigint") {
                                if (this.unrepresentable === "throw") {
                                    throw new Error("BigInt literals cannot be represented in JSON Schema");
                                }
                                else {
                                    vals.push(Number(val));
                                }
                            }
                            else {
                                vals.push(val);
                            }
                        }
                        if (vals.length === 0) {
                            // do nothing (an undefined literal was stripped)
                        }
                        else if (vals.length === 1) {
                            const val = vals[0];
                            json.type = val === null ? "null" : typeof val;
                            if (this.target === "draft-4" || this.target === "openapi-3.0") {
                                json.enum = [val];
                            }
                            else {
                                json.const = val;
                            }
                        }
                        else {
                            if (vals.every((v) => typeof v === "number"))
                                json.type = "number";
                            if (vals.every((v) => typeof v === "string"))
                                json.type = "string";
                            if (vals.every((v) => typeof v === "boolean"))
                                json.type = "string";
                            if (vals.every((v) => v === null))
                                json.type = "null";
                            json.enum = vals;
                        }
                        break;
                    }
                    case "file": {
                        const json = _json;
                        const file = {
                            type: "string",
                            format: "binary",
                            contentEncoding: "binary",
                        };
                        const { minimum, maximum, mime } = schema._zod.bag;
                        if (minimum !== undefined)
                            file.minLength = minimum;
                        if (maximum !== undefined)
                            file.maxLength = maximum;
                        if (mime) {
                            if (mime.length === 1) {
                                file.contentMediaType = mime[0];
                                Object.assign(json, file);
                            }
                            else {
                                json.anyOf = mime.map((m) => {
                                    const mFile = { ...file, contentMediaType: m };
                                    return mFile;
                                });
                            }
                        }
                        else {
                            Object.assign(json, file);
                        }
                        // if (this.unrepresentable === "throw") {
                        //   throw new Error("File cannot be represented in JSON Schema");
                        // }
                        break;
                    }
                    case "transform": {
                        if (this.unrepresentable === "throw") {
                            throw new Error("Transforms cannot be represented in JSON Schema");
                        }
                        break;
                    }
                    case "nullable": {
                        const inner = this.process(def.innerType, params);
                        if (this.target === "openapi-3.0") {
                            result.ref = def.innerType;
                            _json.nullable = true;
                        }
                        else {
                            _json.anyOf = [inner, { type: "null" }];
                        }
                        break;
                    }
                    case "nonoptional": {
                        this.process(def.innerType, params);
                        result.ref = def.innerType;
                        break;
                    }
                    case "success": {
                        const json = _json;
                        json.type = "boolean";
                        break;
                    }
                    case "default": {
                        this.process(def.innerType, params);
                        result.ref = def.innerType;
                        _json.default = JSON.parse(JSON.stringify(def.defaultValue));
                        break;
                    }
                    case "prefault": {
                        this.process(def.innerType, params);
                        result.ref = def.innerType;
                        if (this.io === "input")
                            _json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
                        break;
                    }
                    case "catch": {
                        // use conditionals
                        this.process(def.innerType, params);
                        result.ref = def.innerType;
                        let catchValue;
                        try {
                            catchValue = def.catchValue(undefined);
                        }
                        catch {
                            throw new Error("Dynamic catch values are not supported in JSON Schema");
                        }
                        _json.default = catchValue;
                        break;
                    }
                    case "nan": {
                        if (this.unrepresentable === "throw") {
                            throw new Error("NaN cannot be represented in JSON Schema");
                        }
                        break;
                    }
                    case "template_literal": {
                        const json = _json;
                        const pattern = schema._zod.pattern;
                        if (!pattern)
                            throw new Error("Pattern not found in template literal");
                        json.type = "string";
                        json.pattern = pattern.source;
                        break;
                    }
                    case "pipe": {
                        const innerType = this.io === "input" ? (def.in._zod.def.type === "transform" ? def.out : def.in) : def.out;
                        this.process(innerType, params);
                        result.ref = innerType;
                        break;
                    }
                    case "readonly": {
                        this.process(def.innerType, params);
                        result.ref = def.innerType;
                        _json.readOnly = true;
                        break;
                    }
                    // passthrough types
                    case "promise": {
                        this.process(def.innerType, params);
                        result.ref = def.innerType;
                        break;
                    }
                    case "optional": {
                        this.process(def.innerType, params);
                        result.ref = def.innerType;
                        break;
                    }
                    case "lazy": {
                        const innerType = schema._zod.innerType;
                        this.process(innerType, params);
                        result.ref = innerType;
                        break;
                    }
                    case "custom": {
                        if (this.unrepresentable === "throw") {
                            throw new Error("Custom types cannot be represented in JSON Schema");
                        }
                        break;
                    }
                    case "function": {
                        if (this.unrepresentable === "throw") {
                            throw new Error("Function types cannot be represented in JSON Schema");
                        }
                        break;
                    }
                    default: {
                        def;
                    }
                }
            }
        }
        // metadata
        const meta = this.metadataRegistry.get(schema);
        if (meta)
            Object.assign(result.schema, meta);
        if (this.io === "input" && isTransforming(schema)) {
            // examples/defaults only apply to output type of pipe
            delete result.schema.examples;
            delete result.schema.default;
        }
        // set prefault as default
        if (this.io === "input" && result.schema._prefault)
            (_a = result.schema).default ?? (_a.default = result.schema._prefault);
        delete result.schema._prefault;
        // pulling fresh from this.seen in case it was overwritten
        const _result = this.seen.get(schema);
        return _result.schema;
    }
    emit(schema, _params) {
        const params = {
            cycles: _params?.cycles ?? "ref",
            reused: _params?.reused ?? "inline",
            // unrepresentable: _params?.unrepresentable ?? "throw",
            // uri: _params?.uri ?? ((id) => `${id}`),
            external: _params?.external ?? undefined,
        };
        // iterate over seen map;
        const root = this.seen.get(schema);
        if (!root)
            throw new Error("Unprocessed schema. This is a bug in Zod.");
        // initialize result with root schema fields
        // Object.assign(result, seen.cached);
        // returns a ref to the schema
        // defId will be empty if the ref points to an external schema (or #)
        const makeURI = (entry) => {
            // comparing the seen objects because sometimes
            // multiple schemas map to the same seen object.
            // e.g. lazy
            // external is configured
            const defsSegment = this.target === "draft-2020-12" ? "$defs" : "definitions";
            if (params.external) {
                const externalId = params.external.registry.get(entry[0])?.id; // ?? "__shared";// `__schema${this.counter++}`;
                // check if schema is in the external registry
                const uriGenerator = params.external.uri ?? ((id) => id);
                if (externalId) {
                    return { ref: uriGenerator(externalId) };
                }
                // otherwise, add to __shared
                const id = entry[1].defId ?? entry[1].schema.id ?? `schema${this.counter++}`;
                entry[1].defId = id; // set defId so it will be reused if needed
                return { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}` };
            }
            if (entry[1] === root) {
                return { ref: "#" };
            }
            // self-contained schema
            const uriPrefix = `#`;
            const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
            const defId = entry[1].schema.id ?? `__schema${this.counter++}`;
            return { defId, ref: defUriPrefix + defId };
        };
        // stored cached version in `def` property
        // remove all properties, set $ref
        const extractToDef = (entry) => {
            // if the schema is already a reference, do not extract it
            if (entry[1].schema.$ref) {
                return;
            }
            const seen = entry[1];
            const { ref, defId } = makeURI(entry);
            seen.def = { ...seen.schema };
            // defId won't be set if the schema is a reference to an external schema
            if (defId)
                seen.defId = defId;
            // wipe away all properties except $ref
            const schema = seen.schema;
            for (const key in schema) {
                delete schema[key];
            }
            schema.$ref = ref;
        };
        // throw on cycles
        // break cycles
        if (params.cycles === "throw") {
            for (const entry of this.seen.entries()) {
                const seen = entry[1];
                if (seen.cycle) {
                    throw new Error("Cycle detected: " +
                        `#/${seen.cycle?.join("/")}/<root>` +
                        '\n\nSet the `cycles` parameter to `"ref"` to resolve cyclical schemas with defs.');
                }
            }
        }
        // extract schemas into $defs
        for (const entry of this.seen.entries()) {
            const seen = entry[1];
            // convert root schema to # $ref
            if (schema === entry[0]) {
                extractToDef(entry); // this has special handling for the root schema
                continue;
            }
            // extract schemas that are in the external registry
            if (params.external) {
                const ext = params.external.registry.get(entry[0])?.id;
                if (schema !== entry[0] && ext) {
                    extractToDef(entry);
                    continue;
                }
            }
            // extract schemas with `id` meta
            const id = this.metadataRegistry.get(entry[0])?.id;
            if (id) {
                extractToDef(entry);
                continue;
            }
            // break cycles
            if (seen.cycle) {
                // any
                extractToDef(entry);
                continue;
            }
            // extract reused schemas
            if (seen.count > 1) {
                if (params.reused === "ref") {
                    extractToDef(entry);
                    // biome-ignore lint:
                    continue;
                }
            }
        }
        // flatten _refs
        const flattenRef = (zodSchema, params) => {
            const seen = this.seen.get(zodSchema);
            const schema = seen.def ?? seen.schema;
            const _cached = { ...schema };
            // already seen
            if (seen.ref === null) {
                return;
            }
            // flatten ref if defined
            const ref = seen.ref;
            seen.ref = null; // prevent recursion
            if (ref) {
                flattenRef(ref, params);
                // merge referenced schema into current
                const refSchema = this.seen.get(ref).schema;
                if (refSchema.$ref &&
                    (params.target === "draft-7" || params.target === "draft-4" || params.target === "openapi-3.0")) {
                    schema.allOf = schema.allOf ?? [];
                    schema.allOf.push(refSchema);
                }
                else {
                    Object.assign(schema, refSchema);
                    Object.assign(schema, _cached); // prevent overwriting any fields in the original schema
                }
            }
            // execute overrides
            if (!seen.isParent)
                this.override({
                    zodSchema: zodSchema,
                    jsonSchema: schema,
                    path: seen.path ?? [],
                });
        };
        for (const entry of [...this.seen.entries()].reverse()) {
            flattenRef(entry[0], { target: this.target });
        }
        const result = {};
        if (this.target === "draft-2020-12") {
            result.$schema = "https://json-schema.org/draft/2020-12/schema";
        }
        else if (this.target === "draft-7") {
            result.$schema = "http://json-schema.org/draft-07/schema#";
        }
        else if (this.target === "draft-4") {
            result.$schema = "http://json-schema.org/draft-04/schema#";
        }
        else if (this.target === "openapi-3.0") {
            // OpenAPI 3.0 schema objects should not include a $schema property
        }
        else {
            // @ts-ignore
            console.warn(`Invalid target: ${this.target}`);
        }
        if (params.external?.uri) {
            const id = params.external.registry.get(schema)?.id;
            if (!id)
                throw new Error("Schema is missing an `id` property");
            result.$id = params.external.uri(id);
        }
        Object.assign(result, root.def);
        // build defs object
        const defs = params.external?.defs ?? {};
        for (const entry of this.seen.entries()) {
            const seen = entry[1];
            if (seen.def && seen.defId) {
                defs[seen.defId] = seen.def;
            }
        }
        // set definitions in result
        if (params.external) {
        }
        else {
            if (Object.keys(defs).length > 0) {
                if (this.target === "draft-2020-12") {
                    result.$defs = defs;
                }
                else {
                    result.definitions = defs;
                }
            }
        }
        try {
            // this "finalizes" this schema and ensures all cycles are removed
            // each call to .emit() is functionally independent
            // though the seen map is shared
            return JSON.parse(JSON.stringify(result));
        }
        catch (_err) {
            throw new Error("Error converting schema to JSON.");
        }
    }
}
function toJSONSchema(input, _params) {
    if (input instanceof $ZodRegistry) {
        const gen = new JSONSchemaGenerator(_params);
        const defs = {};
        for (const entry of input._idmap.entries()) {
            const [_, schema] = entry;
            gen.process(schema);
        }
        const schemas = {};
        const external = {
            registry: input,
            uri: _params?.uri,
            defs,
        };
        for (const entry of input._idmap.entries()) {
            const [key, schema] = entry;
            schemas[key] = gen.emit(schema, {
                ..._params,
                external,
            });
        }
        if (Object.keys(defs).length > 0) {
            const defsSegment = gen.target === "draft-2020-12" ? "$defs" : "definitions";
            schemas.__shared = {
                [defsSegment]: defs,
            };
        }
        return { schemas };
    }
    const gen = new JSONSchemaGenerator(_params);
    gen.process(input);
    return gen.emit(input, _params);
}
function isTransforming(_schema, _ctx) {
    const ctx = _ctx ?? { seen: new Set() };
    if (ctx.seen.has(_schema))
        return false;
    ctx.seen.add(_schema);
    const schema = _schema;
    const def = schema._zod.def;
    switch (def.type) {
        case "string":
        case "number":
        case "bigint":
        case "boolean":
        case "date":
        case "symbol":
        case "undefined":
        case "null":
        case "any":
        case "unknown":
        case "never":
        case "void":
        case "literal":
        case "enum":
        case "nan":
        case "file":
        case "template_literal":
            return false;
        case "array": {
            return isTransforming(def.element, ctx);
        }
        case "object": {
            for (const key in def.shape) {
                if (isTransforming(def.shape[key], ctx))
                    return true;
            }
            return false;
        }
        case "union": {
            for (const option of def.options) {
                if (isTransforming(option, ctx))
                    return true;
            }
            return false;
        }
        case "intersection": {
            return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
        }
        case "tuple": {
            for (const item of def.items) {
                if (isTransforming(item, ctx))
                    return true;
            }
            if (def.rest && isTransforming(def.rest, ctx))
                return true;
            return false;
        }
        case "record": {
            return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
        }
        case "map": {
            return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
        }
        case "set": {
            return isTransforming(def.valueType, ctx);
        }
        // inner types
        case "promise":
        case "optional":
        case "nonoptional":
        case "nullable":
        case "readonly":
            return isTransforming(def.innerType, ctx);
        case "lazy":
            return isTransforming(def.getter(), ctx);
        case "default": {
            return isTransforming(def.innerType, ctx);
        }
        case "prefault": {
            return isTransforming(def.innerType, ctx);
        }
        case "custom": {
            return false;
        }
        case "transform": {
            return true;
        }
        case "pipe": {
            return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
        }
        case "success": {
            return false;
        }
        case "catch": {
            return false;
        }
        case "function": {
            return false;
        }
        default:
            def;
    }
    throw new Error(`Unknown schema type: ${def.type}`);
}

const jsonSchema = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: 'Module' }));

const index$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  $ZodAny,
  $ZodArray,
  $ZodAsyncError,
  $ZodBase64,
  $ZodBase64URL,
  $ZodBigInt,
  $ZodBigIntFormat,
  $ZodBoolean,
  $ZodCIDRv4,
  $ZodCIDRv6,
  $ZodCUID,
  $ZodCUID2,
  $ZodCatch,
  $ZodCheck,
  $ZodCheckBigIntFormat,
  $ZodCheckEndsWith,
  $ZodCheckGreaterThan,
  $ZodCheckIncludes,
  $ZodCheckLengthEquals,
  $ZodCheckLessThan,
  $ZodCheckLowerCase,
  $ZodCheckMaxLength,
  $ZodCheckMaxSize,
  $ZodCheckMimeType,
  $ZodCheckMinLength,
  $ZodCheckMinSize,
  $ZodCheckMultipleOf,
  $ZodCheckNumberFormat,
  $ZodCheckOverwrite,
  $ZodCheckProperty,
  $ZodCheckRegex,
  $ZodCheckSizeEquals,
  $ZodCheckStartsWith,
  $ZodCheckStringFormat,
  $ZodCheckUpperCase,
  $ZodCodec,
  $ZodCustom,
  $ZodCustomStringFormat,
  $ZodDate,
  $ZodDefault,
  $ZodDiscriminatedUnion,
  $ZodE164,
  $ZodEmail,
  $ZodEmoji,
  $ZodEncodeError,
  $ZodEnum,
  $ZodError,
  $ZodFile,
  $ZodFunction,
  $ZodGUID,
  $ZodIPv4,
  $ZodIPv6,
  $ZodISODate,
  $ZodISODateTime,
  $ZodISODuration,
  $ZodISOTime,
  $ZodIntersection,
  $ZodJWT,
  $ZodKSUID,
  $ZodLazy,
  $ZodLiteral,
  $ZodMap,
  $ZodNaN,
  $ZodNanoID,
  $ZodNever,
  $ZodNonOptional,
  $ZodNull,
  $ZodNullable,
  $ZodNumber,
  $ZodNumberFormat,
  $ZodObject,
  $ZodObjectJIT,
  $ZodOptional,
  $ZodPipe,
  $ZodPrefault,
  $ZodPromise,
  $ZodReadonly,
  $ZodRealError,
  $ZodRecord,
  $ZodRegistry,
  $ZodSet,
  $ZodString,
  $ZodStringFormat,
  $ZodSuccess,
  $ZodSymbol,
  $ZodTemplateLiteral,
  $ZodTransform,
  $ZodTuple,
  $ZodType,
  $ZodULID,
  $ZodURL,
  $ZodUUID,
  $ZodUndefined,
  $ZodUnion,
  $ZodUnknown,
  $ZodVoid,
  $ZodXID,
  $brand,
  $constructor,
  $input,
  $output,
  Doc,
  JSONSchema: jsonSchema,
  JSONSchemaGenerator,
  NEVER,
  TimePrecision,
  _any,
  _array,
  _base64,
  _base64url,
  _bigint,
  _boolean,
  _catch: _catch$1,
  _check,
  _cidrv4,
  _cidrv6,
  _coercedBigint,
  _coercedBoolean,
  _coercedDate,
  _coercedNumber,
  _coercedString,
  _cuid,
  _cuid2,
  _custom,
  _date,
  _decode,
  _decodeAsync,
  _default: _default$1,
  _discriminatedUnion,
  _e164,
  _email,
  _emoji,
  _encode,
  _encodeAsync,
  _endsWith,
  _enum: _enum$1,
  _file,
  _float32,
  _float64,
  _gt,
  _gte,
  _guid,
  _includes,
  _int,
  _int32,
  _int64,
  _intersection,
  _ipv4,
  _ipv6,
  _isoDate,
  _isoDateTime,
  _isoDuration,
  _isoTime,
  _jwt,
  _ksuid,
  _lazy,
  _length,
  _literal,
  _lowercase,
  _lt,
  _lte,
  _map,
  _max: _lte,
  _maxLength,
  _maxSize,
  _mime,
  _min: _gte,
  _minLength,
  _minSize,
  _multipleOf,
  _nan,
  _nanoid,
  _nativeEnum,
  _negative,
  _never,
  _nonnegative,
  _nonoptional,
  _nonpositive,
  _normalize,
  _null: _null$1,
  _nullable,
  _number,
  _optional,
  _overwrite,
  _parse,
  _parseAsync,
  _pipe,
  _positive,
  _promise,
  _property,
  _readonly,
  _record,
  _refine,
  _regex,
  _safeDecode,
  _safeDecodeAsync,
  _safeEncode,
  _safeEncodeAsync,
  _safeParse,
  _safeParseAsync,
  _set,
  _size,
  _startsWith,
  _string,
  _stringFormat,
  _stringbool,
  _success,
  _superRefine,
  _symbol,
  _templateLiteral,
  _toLowerCase,
  _toUpperCase,
  _transform,
  _trim,
  _tuple,
  _uint32,
  _uint64,
  _ulid,
  _undefined: _undefined$1,
  _union,
  _unknown,
  _uppercase,
  _url,
  _uuid,
  _uuidv4,
  _uuidv6,
  _uuidv7,
  _void: _void$1,
  _xid,
  clone,
  config,
  decode: decode$1,
  decodeAsync: decodeAsync$1,
  encode: encode$1,
  encodeAsync: encodeAsync$1,
  flattenError,
  formatError,
  globalConfig,
  globalRegistry,
  isValidBase64,
  isValidBase64URL,
  isValidJWT,
  locales: index$2,
  parse: parse$1,
  parseAsync: parseAsync$1,
  prettifyError,
  regexes: regexes$1,
  registry,
  safeDecode: safeDecode$1,
  safeDecodeAsync: safeDecodeAsync$1,
  safeEncode: safeEncode$1,
  safeEncodeAsync: safeEncodeAsync$1,
  safeParse: safeParse$1,
  safeParseAsync: safeParseAsync$1,
  toDotPath,
  toJSONSchema,
  treeifyError,
  util: util$1,
  version
}, Symbol.toStringTag, { value: 'Module' }));

const ZodISODateTime = /*@__PURE__*/ $constructor("ZodISODateTime", (inst, def) => {
    $ZodISODateTime.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function datetime(params) {
    return _isoDateTime(ZodISODateTime, params);
}
const ZodISODate = /*@__PURE__*/ $constructor("ZodISODate", (inst, def) => {
    $ZodISODate.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function date$2(params) {
    return _isoDate(ZodISODate, params);
}
const ZodISOTime = /*@__PURE__*/ $constructor("ZodISOTime", (inst, def) => {
    $ZodISOTime.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function time(params) {
    return _isoTime(ZodISOTime, params);
}
const ZodISODuration = /*@__PURE__*/ $constructor("ZodISODuration", (inst, def) => {
    $ZodISODuration.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function duration(params) {
    return _isoDuration(ZodISODuration, params);
}

const iso$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ZodISODate,
  ZodISODateTime,
  ZodISODuration,
  ZodISOTime,
  date: date$2,
  datetime,
  duration,
  time
}, Symbol.toStringTag, { value: 'Module' }));

const initializer = (inst, issues) => {
    $ZodError.init(inst, issues);
    inst.name = "ZodError";
    Object.defineProperties(inst, {
        format: {
            value: (mapper) => formatError(inst, mapper),
            // enumerable: false,
        },
        flatten: {
            value: (mapper) => flattenError(inst, mapper),
            // enumerable: false,
        },
        addIssue: {
            value: (issue) => {
                inst.issues.push(issue);
                inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
            },
            // enumerable: false,
        },
        addIssues: {
            value: (issues) => {
                inst.issues.push(...issues);
                inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
            },
            // enumerable: false,
        },
        isEmpty: {
            get() {
                return inst.issues.length === 0;
            },
            // enumerable: false,
        },
    });
    // Object.defineProperty(inst, "isEmpty", {
    //   get() {
    //     return inst.issues.length === 0;
    //   },
    // });
};
const ZodError = $constructor("ZodError", initializer);
const ZodRealError = $constructor("ZodError", initializer, {
    Parent: Error,
});
// /** @deprecated Use `z.core.$ZodErrorMapCtx` instead. */
// export type ErrorMapCtx = core.$ZodErrorMapCtx;

const parse = /* @__PURE__ */ _parse(ZodRealError);
const parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
const safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
const safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
// Codec functions
const encode = /* @__PURE__ */ _encode(ZodRealError);
const decode = /* @__PURE__ */ _decode(ZodRealError);
const encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
const decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
const safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
const safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
const safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
const safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);

const ZodType = /*@__PURE__*/ $constructor("ZodType", (inst, def) => {
    $ZodType.init(inst, def);
    inst.def = def;
    inst.type = def.type;
    Object.defineProperty(inst, "_def", { value: def });
    // base methods
    inst.check = (...checks) => {
        return inst.clone(mergeDefs(def, {
            checks: [
                ...(def.checks ?? []),
                ...checks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch),
            ],
        }));
    };
    inst.clone = (def, params) => clone(inst, def, params);
    inst.brand = () => inst;
    inst.register = ((reg, meta) => {
        reg.add(inst, meta);
        return inst;
    });
    // parsing
    inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
    inst.safeParse = (data, params) => safeParse(inst, data, params);
    inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
    inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
    inst.spa = inst.safeParseAsync;
    // encoding/decoding
    inst.encode = (data, params) => encode(inst, data, params);
    inst.decode = (data, params) => decode(inst, data, params);
    inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
    inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
    inst.safeEncode = (data, params) => safeEncode(inst, data, params);
    inst.safeDecode = (data, params) => safeDecode(inst, data, params);
    inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
    inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
    // refinements
    inst.refine = (check, params) => inst.check(refine(check, params));
    inst.superRefine = (refinement) => inst.check(superRefine(refinement));
    inst.overwrite = (fn) => inst.check(_overwrite(fn));
    // wrappers
    inst.optional = () => optional(inst);
    inst.nullable = () => nullable(inst);
    inst.nullish = () => optional(nullable(inst));
    inst.nonoptional = (params) => nonoptional(inst, params);
    inst.array = () => array(inst);
    inst.or = (arg) => union([inst, arg]);
    inst.and = (arg) => intersection(inst, arg);
    inst.transform = (tx) => pipe(inst, transform(tx));
    inst.default = (def) => _default(inst, def);
    inst.prefault = (def) => prefault(inst, def);
    // inst.coalesce = (def, params) => coalesce(inst, def, params);
    inst.catch = (params) => _catch(inst, params);
    inst.pipe = (target) => pipe(inst, target);
    inst.readonly = () => readonly(inst);
    // meta
    inst.describe = (description) => {
        const cl = inst.clone();
        globalRegistry.add(cl, { description });
        return cl;
    };
    Object.defineProperty(inst, "description", {
        get() {
            return globalRegistry.get(inst)?.description;
        },
        configurable: true,
    });
    inst.meta = (...args) => {
        if (args.length === 0) {
            return globalRegistry.get(inst);
        }
        const cl = inst.clone();
        globalRegistry.add(cl, args[0]);
        return cl;
    };
    // helpers
    inst.isOptional = () => inst.safeParse(undefined).success;
    inst.isNullable = () => inst.safeParse(null).success;
    return inst;
});
/** @internal */
const _ZodString = /*@__PURE__*/ $constructor("_ZodString", (inst, def) => {
    $ZodString.init(inst, def);
    ZodType.init(inst, def);
    const bag = inst._zod.bag;
    inst.format = bag.format ?? null;
    inst.minLength = bag.minimum ?? null;
    inst.maxLength = bag.maximum ?? null;
    // validations
    inst.regex = (...args) => inst.check(_regex(...args));
    inst.includes = (...args) => inst.check(_includes(...args));
    inst.startsWith = (...args) => inst.check(_startsWith(...args));
    inst.endsWith = (...args) => inst.check(_endsWith(...args));
    inst.min = (...args) => inst.check(_minLength(...args));
    inst.max = (...args) => inst.check(_maxLength(...args));
    inst.length = (...args) => inst.check(_length(...args));
    inst.nonempty = (...args) => inst.check(_minLength(1, ...args));
    inst.lowercase = (params) => inst.check(_lowercase(params));
    inst.uppercase = (params) => inst.check(_uppercase(params));
    // transforms
    inst.trim = () => inst.check(_trim());
    inst.normalize = (...args) => inst.check(_normalize(...args));
    inst.toLowerCase = () => inst.check(_toLowerCase());
    inst.toUpperCase = () => inst.check(_toUpperCase());
});
const ZodString = /*@__PURE__*/ $constructor("ZodString", (inst, def) => {
    $ZodString.init(inst, def);
    _ZodString.init(inst, def);
    inst.email = (params) => inst.check(_email(ZodEmail, params));
    inst.url = (params) => inst.check(_url(ZodURL, params));
    inst.jwt = (params) => inst.check(_jwt(ZodJWT, params));
    inst.emoji = (params) => inst.check(_emoji(ZodEmoji, params));
    inst.guid = (params) => inst.check(_guid(ZodGUID, params));
    inst.uuid = (params) => inst.check(_uuid(ZodUUID, params));
    inst.uuidv4 = (params) => inst.check(_uuidv4(ZodUUID, params));
    inst.uuidv6 = (params) => inst.check(_uuidv6(ZodUUID, params));
    inst.uuidv7 = (params) => inst.check(_uuidv7(ZodUUID, params));
    inst.nanoid = (params) => inst.check(_nanoid(ZodNanoID, params));
    inst.guid = (params) => inst.check(_guid(ZodGUID, params));
    inst.cuid = (params) => inst.check(_cuid(ZodCUID, params));
    inst.cuid2 = (params) => inst.check(_cuid2(ZodCUID2, params));
    inst.ulid = (params) => inst.check(_ulid(ZodULID, params));
    inst.base64 = (params) => inst.check(_base64(ZodBase64, params));
    inst.base64url = (params) => inst.check(_base64url(ZodBase64URL, params));
    inst.xid = (params) => inst.check(_xid(ZodXID, params));
    inst.ksuid = (params) => inst.check(_ksuid(ZodKSUID, params));
    inst.ipv4 = (params) => inst.check(_ipv4(ZodIPv4, params));
    inst.ipv6 = (params) => inst.check(_ipv6(ZodIPv6, params));
    inst.cidrv4 = (params) => inst.check(_cidrv4(ZodCIDRv4, params));
    inst.cidrv6 = (params) => inst.check(_cidrv6(ZodCIDRv6, params));
    inst.e164 = (params) => inst.check(_e164(ZodE164, params));
    // iso
    inst.datetime = (params) => inst.check(datetime(params));
    inst.date = (params) => inst.check(date$2(params));
    inst.time = (params) => inst.check(time(params));
    inst.duration = (params) => inst.check(duration(params));
});
function string$1(params) {
    return _string(ZodString, params);
}
const ZodStringFormat = /*@__PURE__*/ $constructor("ZodStringFormat", (inst, def) => {
    $ZodStringFormat.init(inst, def);
    _ZodString.init(inst, def);
});
const ZodEmail = /*@__PURE__*/ $constructor("ZodEmail", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodEmail.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function email(params) {
    return _email(ZodEmail, params);
}
const ZodGUID = /*@__PURE__*/ $constructor("ZodGUID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodGUID.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function guid(params) {
    return _guid(ZodGUID, params);
}
const ZodUUID = /*@__PURE__*/ $constructor("ZodUUID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodUUID.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function uuid(params) {
    return _uuid(ZodUUID, params);
}
function uuidv4(params) {
    return _uuidv4(ZodUUID, params);
}
// ZodUUIDv6
function uuidv6(params) {
    return _uuidv6(ZodUUID, params);
}
// ZodUUIDv7
function uuidv7(params) {
    return _uuidv7(ZodUUID, params);
}
const ZodURL = /*@__PURE__*/ $constructor("ZodURL", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodURL.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function url(params) {
    return _url(ZodURL, params);
}
function httpUrl(params) {
    return _url(ZodURL, {
        protocol: /^https?$/,
        hostname: domain,
        ...normalizeParams(params),
    });
}
const ZodEmoji = /*@__PURE__*/ $constructor("ZodEmoji", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodEmoji.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function emoji(params) {
    return _emoji(ZodEmoji, params);
}
const ZodNanoID = /*@__PURE__*/ $constructor("ZodNanoID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodNanoID.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function nanoid(params) {
    return _nanoid(ZodNanoID, params);
}
const ZodCUID = /*@__PURE__*/ $constructor("ZodCUID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodCUID.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function cuid(params) {
    return _cuid(ZodCUID, params);
}
const ZodCUID2 = /*@__PURE__*/ $constructor("ZodCUID2", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodCUID2.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function cuid2(params) {
    return _cuid2(ZodCUID2, params);
}
const ZodULID = /*@__PURE__*/ $constructor("ZodULID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodULID.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function ulid(params) {
    return _ulid(ZodULID, params);
}
const ZodXID = /*@__PURE__*/ $constructor("ZodXID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodXID.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function xid(params) {
    return _xid(ZodXID, params);
}
const ZodKSUID = /*@__PURE__*/ $constructor("ZodKSUID", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodKSUID.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function ksuid(params) {
    return _ksuid(ZodKSUID, params);
}
const ZodIPv4 = /*@__PURE__*/ $constructor("ZodIPv4", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodIPv4.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function ipv4(params) {
    return _ipv4(ZodIPv4, params);
}
const ZodIPv6 = /*@__PURE__*/ $constructor("ZodIPv6", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodIPv6.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function ipv6(params) {
    return _ipv6(ZodIPv6, params);
}
const ZodCIDRv4 = /*@__PURE__*/ $constructor("ZodCIDRv4", (inst, def) => {
    $ZodCIDRv4.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function cidrv4(params) {
    return _cidrv4(ZodCIDRv4, params);
}
const ZodCIDRv6 = /*@__PURE__*/ $constructor("ZodCIDRv6", (inst, def) => {
    $ZodCIDRv6.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function cidrv6(params) {
    return _cidrv6(ZodCIDRv6, params);
}
const ZodBase64 = /*@__PURE__*/ $constructor("ZodBase64", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodBase64.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function base64(params) {
    return _base64(ZodBase64, params);
}
const ZodBase64URL = /*@__PURE__*/ $constructor("ZodBase64URL", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodBase64URL.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function base64url(params) {
    return _base64url(ZodBase64URL, params);
}
const ZodE164 = /*@__PURE__*/ $constructor("ZodE164", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodE164.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function e164(params) {
    return _e164(ZodE164, params);
}
const ZodJWT = /*@__PURE__*/ $constructor("ZodJWT", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodJWT.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function jwt(params) {
    return _jwt(ZodJWT, params);
}
const ZodCustomStringFormat = /*@__PURE__*/ $constructor("ZodCustomStringFormat", (inst, def) => {
    // ZodStringFormat.init(inst, def);
    $ZodCustomStringFormat.init(inst, def);
    ZodStringFormat.init(inst, def);
});
function stringFormat(format, fnOrRegex, _params = {}) {
    return _stringFormat(ZodCustomStringFormat, format, fnOrRegex, _params);
}
function hostname(_params) {
    return _stringFormat(ZodCustomStringFormat, "hostname", hostname$1, _params);
}
function hex(_params) {
    return _stringFormat(ZodCustomStringFormat, "hex", hex$1, _params);
}
function hash(alg, params) {
    const enc = params?.enc ?? "hex";
    const format = `${alg}_${enc}`;
    const regex = regexes$1[format];
    if (!regex)
        throw new Error(`Unrecognized hash format: ${format}`);
    return _stringFormat(ZodCustomStringFormat, format, regex, params);
}
const ZodNumber = /*@__PURE__*/ $constructor("ZodNumber", (inst, def) => {
    $ZodNumber.init(inst, def);
    ZodType.init(inst, def);
    inst.gt = (value, params) => inst.check(_gt(value, params));
    inst.gte = (value, params) => inst.check(_gte(value, params));
    inst.min = (value, params) => inst.check(_gte(value, params));
    inst.lt = (value, params) => inst.check(_lt(value, params));
    inst.lte = (value, params) => inst.check(_lte(value, params));
    inst.max = (value, params) => inst.check(_lte(value, params));
    inst.int = (params) => inst.check(int(params));
    inst.safe = (params) => inst.check(int(params));
    inst.positive = (params) => inst.check(_gt(0, params));
    inst.nonnegative = (params) => inst.check(_gte(0, params));
    inst.negative = (params) => inst.check(_lt(0, params));
    inst.nonpositive = (params) => inst.check(_lte(0, params));
    inst.multipleOf = (value, params) => inst.check(_multipleOf(value, params));
    inst.step = (value, params) => inst.check(_multipleOf(value, params));
    // inst.finite = (params) => inst.check(core.finite(params));
    inst.finite = () => inst;
    const bag = inst._zod.bag;
    inst.minValue =
        Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
    inst.maxValue =
        Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
    inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? 0.5);
    inst.isFinite = true;
    inst.format = bag.format ?? null;
});
function number$1(params) {
    return _number(ZodNumber, params);
}
const ZodNumberFormat = /*@__PURE__*/ $constructor("ZodNumberFormat", (inst, def) => {
    $ZodNumberFormat.init(inst, def);
    ZodNumber.init(inst, def);
});
function int(params) {
    return _int(ZodNumberFormat, params);
}
function float32(params) {
    return _float32(ZodNumberFormat, params);
}
function float64(params) {
    return _float64(ZodNumberFormat, params);
}
function int32(params) {
    return _int32(ZodNumberFormat, params);
}
function uint32(params) {
    return _uint32(ZodNumberFormat, params);
}
const ZodBoolean = /*@__PURE__*/ $constructor("ZodBoolean", (inst, def) => {
    $ZodBoolean.init(inst, def);
    ZodType.init(inst, def);
});
function boolean$1(params) {
    return _boolean(ZodBoolean, params);
}
const ZodBigInt = /*@__PURE__*/ $constructor("ZodBigInt", (inst, def) => {
    $ZodBigInt.init(inst, def);
    ZodType.init(inst, def);
    inst.gte = (value, params) => inst.check(_gte(value, params));
    inst.min = (value, params) => inst.check(_gte(value, params));
    inst.gt = (value, params) => inst.check(_gt(value, params));
    inst.gte = (value, params) => inst.check(_gte(value, params));
    inst.min = (value, params) => inst.check(_gte(value, params));
    inst.lt = (value, params) => inst.check(_lt(value, params));
    inst.lte = (value, params) => inst.check(_lte(value, params));
    inst.max = (value, params) => inst.check(_lte(value, params));
    inst.positive = (params) => inst.check(_gt(BigInt(0), params));
    inst.negative = (params) => inst.check(_lt(BigInt(0), params));
    inst.nonpositive = (params) => inst.check(_lte(BigInt(0), params));
    inst.nonnegative = (params) => inst.check(_gte(BigInt(0), params));
    inst.multipleOf = (value, params) => inst.check(_multipleOf(value, params));
    const bag = inst._zod.bag;
    inst.minValue = bag.minimum ?? null;
    inst.maxValue = bag.maximum ?? null;
    inst.format = bag.format ?? null;
});
function bigint$1(params) {
    return _bigint(ZodBigInt, params);
}
const ZodBigIntFormat = /*@__PURE__*/ $constructor("ZodBigIntFormat", (inst, def) => {
    $ZodBigIntFormat.init(inst, def);
    ZodBigInt.init(inst, def);
});
// int64
function int64(params) {
    return _int64(ZodBigIntFormat, params);
}
// uint64
function uint64(params) {
    return _uint64(ZodBigIntFormat, params);
}
const ZodSymbol = /*@__PURE__*/ $constructor("ZodSymbol", (inst, def) => {
    $ZodSymbol.init(inst, def);
    ZodType.init(inst, def);
});
function symbol(params) {
    return _symbol(ZodSymbol, params);
}
const ZodUndefined = /*@__PURE__*/ $constructor("ZodUndefined", (inst, def) => {
    $ZodUndefined.init(inst, def);
    ZodType.init(inst, def);
});
function _undefined(params) {
    return _undefined$1(ZodUndefined, params);
}
const ZodNull = /*@__PURE__*/ $constructor("ZodNull", (inst, def) => {
    $ZodNull.init(inst, def);
    ZodType.init(inst, def);
});
function _null(params) {
    return _null$1(ZodNull, params);
}
const ZodAny = /*@__PURE__*/ $constructor("ZodAny", (inst, def) => {
    $ZodAny.init(inst, def);
    ZodType.init(inst, def);
});
function any() {
    return _any(ZodAny);
}
const ZodUnknown = /*@__PURE__*/ $constructor("ZodUnknown", (inst, def) => {
    $ZodUnknown.init(inst, def);
    ZodType.init(inst, def);
});
function unknown() {
    return _unknown(ZodUnknown);
}
const ZodNever = /*@__PURE__*/ $constructor("ZodNever", (inst, def) => {
    $ZodNever.init(inst, def);
    ZodType.init(inst, def);
});
function never(params) {
    return _never(ZodNever, params);
}
const ZodVoid = /*@__PURE__*/ $constructor("ZodVoid", (inst, def) => {
    $ZodVoid.init(inst, def);
    ZodType.init(inst, def);
});
function _void(params) {
    return _void$1(ZodVoid, params);
}
const ZodDate = /*@__PURE__*/ $constructor("ZodDate", (inst, def) => {
    $ZodDate.init(inst, def);
    ZodType.init(inst, def);
    inst.min = (value, params) => inst.check(_gte(value, params));
    inst.max = (value, params) => inst.check(_lte(value, params));
    const c = inst._zod.bag;
    inst.minDate = c.minimum ? new Date(c.minimum) : null;
    inst.maxDate = c.maximum ? new Date(c.maximum) : null;
});
function date$1(params) {
    return _date(ZodDate, params);
}
const ZodArray = /*@__PURE__*/ $constructor("ZodArray", (inst, def) => {
    $ZodArray.init(inst, def);
    ZodType.init(inst, def);
    inst.element = def.element;
    inst.min = (minLength, params) => inst.check(_minLength(minLength, params));
    inst.nonempty = (params) => inst.check(_minLength(1, params));
    inst.max = (maxLength, params) => inst.check(_maxLength(maxLength, params));
    inst.length = (len, params) => inst.check(_length(len, params));
    inst.unwrap = () => inst.element;
});
function array(element, params) {
    return _array(ZodArray, element, params);
}
// .keyof
function keyof(schema) {
    const shape = schema._zod.def.shape;
    return _enum(Object.keys(shape));
}
const ZodObject = /*@__PURE__*/ $constructor("ZodObject", (inst, def) => {
    $ZodObjectJIT.init(inst, def);
    ZodType.init(inst, def);
    defineLazy(inst, "shape", () => {
        return def.shape;
    });
    inst.keyof = () => _enum(Object.keys(inst._zod.def.shape));
    inst.catchall = (catchall) => inst.clone({ ...inst._zod.def, catchall: catchall });
    inst.passthrough = () => inst.clone({ ...inst._zod.def, catchall: unknown() });
    inst.loose = () => inst.clone({ ...inst._zod.def, catchall: unknown() });
    inst.strict = () => inst.clone({ ...inst._zod.def, catchall: never() });
    inst.strip = () => inst.clone({ ...inst._zod.def, catchall: undefined });
    inst.extend = (incoming) => {
        return extend(inst, incoming);
    };
    inst.safeExtend = (incoming) => {
        return safeExtend(inst, incoming);
    };
    inst.merge = (other) => merge(inst, other);
    inst.pick = (mask) => pick(inst, mask);
    inst.omit = (mask) => omit(inst, mask);
    inst.partial = (...args) => partial(ZodOptional, inst, args[0]);
    inst.required = (...args) => required(ZodNonOptional, inst, args[0]);
});
function object(shape, params) {
    const def = {
        type: "object",
        shape: shape ?? {},
        ...normalizeParams(params),
    };
    return new ZodObject(def);
}
// strictObject
function strictObject(shape, params) {
    return new ZodObject({
        type: "object",
        shape,
        catchall: never(),
        ...normalizeParams(params),
    });
}
// looseObject
function looseObject(shape, params) {
    return new ZodObject({
        type: "object",
        shape,
        catchall: unknown(),
        ...normalizeParams(params),
    });
}
const ZodUnion = /*@__PURE__*/ $constructor("ZodUnion", (inst, def) => {
    $ZodUnion.init(inst, def);
    ZodType.init(inst, def);
    inst.options = def.options;
});
function union(options, params) {
    return new ZodUnion({
        type: "union",
        options: options,
        ...normalizeParams(params),
    });
}
const ZodDiscriminatedUnion = /*@__PURE__*/ $constructor("ZodDiscriminatedUnion", (inst, def) => {
    ZodUnion.init(inst, def);
    $ZodDiscriminatedUnion.init(inst, def);
});
function discriminatedUnion(discriminator, options, params) {
    // const [options, params] = args;
    return new ZodDiscriminatedUnion({
        type: "union",
        options,
        discriminator,
        ...normalizeParams(params),
    });
}
const ZodIntersection = /*@__PURE__*/ $constructor("ZodIntersection", (inst, def) => {
    $ZodIntersection.init(inst, def);
    ZodType.init(inst, def);
});
function intersection(left, right) {
    return new ZodIntersection({
        type: "intersection",
        left: left,
        right: right,
    });
}
const ZodTuple = /*@__PURE__*/ $constructor("ZodTuple", (inst, def) => {
    $ZodTuple.init(inst, def);
    ZodType.init(inst, def);
    inst.rest = (rest) => inst.clone({
        ...inst._zod.def,
        rest: rest,
    });
});
function tuple(items, _paramsOrRest, _params) {
    const hasRest = _paramsOrRest instanceof $ZodType;
    const params = hasRest ? _params : _paramsOrRest;
    const rest = hasRest ? _paramsOrRest : null;
    return new ZodTuple({
        type: "tuple",
        items: items,
        rest,
        ...normalizeParams(params),
    });
}
const ZodRecord = /*@__PURE__*/ $constructor("ZodRecord", (inst, def) => {
    $ZodRecord.init(inst, def);
    ZodType.init(inst, def);
    inst.keyType = def.keyType;
    inst.valueType = def.valueType;
});
function record(keyType, valueType, params) {
    return new ZodRecord({
        type: "record",
        keyType,
        valueType: valueType,
        ...normalizeParams(params),
    });
}
// type alksjf = core.output<core.$ZodRecordKey>;
function partialRecord(keyType, valueType, params) {
    const k = clone(keyType);
    k._zod.values = undefined;
    return new ZodRecord({
        type: "record",
        keyType: k,
        valueType: valueType,
        ...normalizeParams(params),
    });
}
const ZodMap = /*@__PURE__*/ $constructor("ZodMap", (inst, def) => {
    $ZodMap.init(inst, def);
    ZodType.init(inst, def);
    inst.keyType = def.keyType;
    inst.valueType = def.valueType;
});
function map(keyType, valueType, params) {
    return new ZodMap({
        type: "map",
        keyType: keyType,
        valueType: valueType,
        ...normalizeParams(params),
    });
}
const ZodSet = /*@__PURE__*/ $constructor("ZodSet", (inst, def) => {
    $ZodSet.init(inst, def);
    ZodType.init(inst, def);
    inst.min = (...args) => inst.check(_minSize(...args));
    inst.nonempty = (params) => inst.check(_minSize(1, params));
    inst.max = (...args) => inst.check(_maxSize(...args));
    inst.size = (...args) => inst.check(_size(...args));
});
function set(valueType, params) {
    return new ZodSet({
        type: "set",
        valueType: valueType,
        ...normalizeParams(params),
    });
}
const ZodEnum = /*@__PURE__*/ $constructor("ZodEnum", (inst, def) => {
    $ZodEnum.init(inst, def);
    ZodType.init(inst, def);
    inst.enum = def.entries;
    inst.options = Object.values(def.entries);
    const keys = new Set(Object.keys(def.entries));
    inst.extract = (values, params) => {
        const newEntries = {};
        for (const value of values) {
            if (keys.has(value)) {
                newEntries[value] = def.entries[value];
            }
            else
                throw new Error(`Key ${value} not found in enum`);
        }
        return new ZodEnum({
            ...def,
            checks: [],
            ...normalizeParams(params),
            entries: newEntries,
        });
    };
    inst.exclude = (values, params) => {
        const newEntries = { ...def.entries };
        for (const value of values) {
            if (keys.has(value)) {
                delete newEntries[value];
            }
            else
                throw new Error(`Key ${value} not found in enum`);
        }
        return new ZodEnum({
            ...def,
            checks: [],
            ...normalizeParams(params),
            entries: newEntries,
        });
    };
});
function _enum(values, params) {
    const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
    return new ZodEnum({
        type: "enum",
        entries,
        ...normalizeParams(params),
    });
}
/** @deprecated This API has been merged into `z.enum()`. Use `z.enum()` instead.
 *
 * ```ts
 * enum Colors { red, green, blue }
 * z.enum(Colors);
 * ```
 */
function nativeEnum(entries, params) {
    return new ZodEnum({
        type: "enum",
        entries,
        ...normalizeParams(params),
    });
}
const ZodLiteral = /*@__PURE__*/ $constructor("ZodLiteral", (inst, def) => {
    $ZodLiteral.init(inst, def);
    ZodType.init(inst, def);
    inst.values = new Set(def.values);
    Object.defineProperty(inst, "value", {
        get() {
            if (def.values.length > 1) {
                throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
            }
            return def.values[0];
        },
    });
});
function literal(value, params) {
    return new ZodLiteral({
        type: "literal",
        values: Array.isArray(value) ? value : [value],
        ...normalizeParams(params),
    });
}
const ZodFile = /*@__PURE__*/ $constructor("ZodFile", (inst, def) => {
    $ZodFile.init(inst, def);
    ZodType.init(inst, def);
    inst.min = (size, params) => inst.check(_minSize(size, params));
    inst.max = (size, params) => inst.check(_maxSize(size, params));
    inst.mime = (types, params) => inst.check(_mime(Array.isArray(types) ? types : [types], params));
});
function file(params) {
    return _file(ZodFile, params);
}
const ZodTransform = /*@__PURE__*/ $constructor("ZodTransform", (inst, def) => {
    $ZodTransform.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.parse = (payload, _ctx) => {
        if (_ctx.direction === "backward") {
            throw new $ZodEncodeError(inst.constructor.name);
        }
        payload.addIssue = (issue$1) => {
            if (typeof issue$1 === "string") {
                payload.issues.push(issue(issue$1, payload.value, def));
            }
            else {
                // for Zod 3 backwards compatibility
                const _issue = issue$1;
                if (_issue.fatal)
                    _issue.continue = false;
                _issue.code ?? (_issue.code = "custom");
                _issue.input ?? (_issue.input = payload.value);
                _issue.inst ?? (_issue.inst = inst);
                // _issue.continue ??= true;
                payload.issues.push(issue(_issue));
            }
        };
        const output = def.transform(payload.value, payload);
        if (output instanceof Promise) {
            return output.then((output) => {
                payload.value = output;
                return payload;
            });
        }
        payload.value = output;
        return payload;
    };
});
function transform(fn) {
    return new ZodTransform({
        type: "transform",
        transform: fn,
    });
}
const ZodOptional = /*@__PURE__*/ $constructor("ZodOptional", (inst, def) => {
    $ZodOptional.init(inst, def);
    ZodType.init(inst, def);
    inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
    return new ZodOptional({
        type: "optional",
        innerType: innerType,
    });
}
const ZodNullable = /*@__PURE__*/ $constructor("ZodNullable", (inst, def) => {
    $ZodNullable.init(inst, def);
    ZodType.init(inst, def);
    inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
    return new ZodNullable({
        type: "nullable",
        innerType: innerType,
    });
}
// nullish
function nullish(innerType) {
    return optional(nullable(innerType));
}
const ZodDefault = /*@__PURE__*/ $constructor("ZodDefault", (inst, def) => {
    $ZodDefault.init(inst, def);
    ZodType.init(inst, def);
    inst.unwrap = () => inst._zod.def.innerType;
    inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
    return new ZodDefault({
        type: "default",
        innerType: innerType,
        get defaultValue() {
            return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
        },
    });
}
const ZodPrefault = /*@__PURE__*/ $constructor("ZodPrefault", (inst, def) => {
    $ZodPrefault.init(inst, def);
    ZodType.init(inst, def);
    inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
    return new ZodPrefault({
        type: "prefault",
        innerType: innerType,
        get defaultValue() {
            return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
        },
    });
}
const ZodNonOptional = /*@__PURE__*/ $constructor("ZodNonOptional", (inst, def) => {
    $ZodNonOptional.init(inst, def);
    ZodType.init(inst, def);
    inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
    return new ZodNonOptional({
        type: "nonoptional",
        innerType: innerType,
        ...normalizeParams(params),
    });
}
const ZodSuccess = /*@__PURE__*/ $constructor("ZodSuccess", (inst, def) => {
    $ZodSuccess.init(inst, def);
    ZodType.init(inst, def);
    inst.unwrap = () => inst._zod.def.innerType;
});
function success(innerType) {
    return new ZodSuccess({
        type: "success",
        innerType: innerType,
    });
}
const ZodCatch = /*@__PURE__*/ $constructor("ZodCatch", (inst, def) => {
    $ZodCatch.init(inst, def);
    ZodType.init(inst, def);
    inst.unwrap = () => inst._zod.def.innerType;
    inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
    return new ZodCatch({
        type: "catch",
        innerType: innerType,
        catchValue: (typeof catchValue === "function" ? catchValue : () => catchValue),
    });
}
const ZodNaN = /*@__PURE__*/ $constructor("ZodNaN", (inst, def) => {
    $ZodNaN.init(inst, def);
    ZodType.init(inst, def);
});
function nan(params) {
    return _nan(ZodNaN, params);
}
const ZodPipe = /*@__PURE__*/ $constructor("ZodPipe", (inst, def) => {
    $ZodPipe.init(inst, def);
    ZodType.init(inst, def);
    inst.in = def.in;
    inst.out = def.out;
});
function pipe(in_, out) {
    return new ZodPipe({
        type: "pipe",
        in: in_,
        out: out,
        // ...util.normalizeParams(params),
    });
}
const ZodCodec = /*@__PURE__*/ $constructor("ZodCodec", (inst, def) => {
    ZodPipe.init(inst, def);
    $ZodCodec.init(inst, def);
});
function codec(in_, out, params) {
    return new ZodCodec({
        type: "pipe",
        in: in_,
        out: out,
        transform: params.decode,
        reverseTransform: params.encode,
    });
}
const ZodReadonly = /*@__PURE__*/ $constructor("ZodReadonly", (inst, def) => {
    $ZodReadonly.init(inst, def);
    ZodType.init(inst, def);
    inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
    return new ZodReadonly({
        type: "readonly",
        innerType: innerType,
    });
}
const ZodTemplateLiteral = /*@__PURE__*/ $constructor("ZodTemplateLiteral", (inst, def) => {
    $ZodTemplateLiteral.init(inst, def);
    ZodType.init(inst, def);
});
function templateLiteral(parts, params) {
    return new ZodTemplateLiteral({
        type: "template_literal",
        parts,
        ...normalizeParams(params),
    });
}
const ZodLazy = /*@__PURE__*/ $constructor("ZodLazy", (inst, def) => {
    $ZodLazy.init(inst, def);
    ZodType.init(inst, def);
    inst.unwrap = () => inst._zod.def.getter();
});
function lazy(getter) {
    return new ZodLazy({
        type: "lazy",
        getter: getter,
    });
}
const ZodPromise = /*@__PURE__*/ $constructor("ZodPromise", (inst, def) => {
    $ZodPromise.init(inst, def);
    ZodType.init(inst, def);
    inst.unwrap = () => inst._zod.def.innerType;
});
function promise(innerType) {
    return new ZodPromise({
        type: "promise",
        innerType: innerType,
    });
}
const ZodFunction = /*@__PURE__*/ $constructor("ZodFunction", (inst, def) => {
    $ZodFunction.init(inst, def);
    ZodType.init(inst, def);
});
function _function(params) {
    return new ZodFunction({
        type: "function",
        input: Array.isArray(params?.input) ? tuple(params?.input) : (params?.input ?? array(unknown())),
        output: params?.output ?? unknown(),
    });
}
const ZodCustom = /*@__PURE__*/ $constructor("ZodCustom", (inst, def) => {
    $ZodCustom.init(inst, def);
    ZodType.init(inst, def);
});
// custom checks
function check(fn) {
    const ch = new $ZodCheck({
        check: "custom",
        // ...util.normalizeParams(params),
    });
    ch._zod.check = fn;
    return ch;
}
function custom(fn, _params) {
    return _custom(ZodCustom, fn ?? (() => true), _params);
}
function refine(fn, _params = {}) {
    return _refine(ZodCustom, fn, _params);
}
// superRefine
function superRefine(fn) {
    return _superRefine(fn);
}
function _instanceof(cls, params = {
    error: `Input not instance of ${cls.name}`,
}) {
    const inst = new ZodCustom({
        type: "custom",
        check: "custom",
        fn: (data) => data instanceof cls,
        abort: true,
        ...normalizeParams(params),
    });
    inst._zod.bag.Class = cls;
    return inst;
}
// stringbool
const stringbool = (...args) => _stringbool({
    Codec: ZodCodec,
    Boolean: ZodBoolean,
    String: ZodString,
}, ...args);
function json(params) {
    const jsonSchema = lazy(() => {
        return union([string$1(params), number$1(), boolean$1(), _null(), array(jsonSchema), record(string$1(), jsonSchema)]);
    });
    return jsonSchema;
}
// preprocess
// /** @deprecated Use `z.pipe()` and `z.transform()` instead. */
function preprocess(fn, schema) {
    return pipe(transform(fn), schema);
}

// Zod 3 compat layer
/** @deprecated Use the raw string literal codes instead, e.g. "invalid_type". */
const ZodIssueCode = {
    invalid_type: "invalid_type",
    too_big: "too_big",
    too_small: "too_small",
    invalid_format: "invalid_format",
    not_multiple_of: "not_multiple_of",
    unrecognized_keys: "unrecognized_keys",
    invalid_union: "invalid_union",
    invalid_key: "invalid_key",
    invalid_element: "invalid_element",
    invalid_value: "invalid_value",
    custom: "custom",
};
/** @deprecated Use `z.config(params)` instead. */
function setErrorMap(map) {
    config({
        customError: map,
    });
}
/** @deprecated Use `z.config()` instead. */
function getErrorMap() {
    return config().customError;
}
/** @deprecated Do not use. Stub definition, only included for zod-to-json-schema compatibility. */
var ZodFirstPartyTypeKind;
(function (ZodFirstPartyTypeKind) {
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));

function string(params) {
    return _coercedString(ZodString, params);
}
function number(params) {
    return _coercedNumber(ZodNumber, params);
}
function boolean(params) {
    return _coercedBoolean(ZodBoolean, params);
}
function bigint(params) {
    return _coercedBigint(ZodBigInt, params);
}
function date(params) {
    return _coercedDate(ZodDate, params);
}

const coerce$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  bigint,
  boolean,
  date,
  number,
  string
}, Symbol.toStringTag, { value: 'Module' }));

config(en());

const z = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  $brand,
  $input,
  $output,
  NEVER,
  TimePrecision,
  ZodAny,
  ZodArray,
  ZodBase64,
  ZodBase64URL,
  ZodBigInt,
  ZodBigIntFormat,
  ZodBoolean,
  ZodCIDRv4,
  ZodCIDRv6,
  ZodCUID,
  ZodCUID2,
  ZodCatch,
  ZodCodec,
  ZodCustom,
  ZodCustomStringFormat,
  ZodDate,
  ZodDefault,
  ZodDiscriminatedUnion,
  ZodE164,
  ZodEmail,
  ZodEmoji,
  ZodEnum,
  ZodError,
  ZodFile,
  get ZodFirstPartyTypeKind () { return ZodFirstPartyTypeKind; },
  ZodFunction,
  ZodGUID,
  ZodIPv4,
  ZodIPv6,
  ZodISODate,
  ZodISODateTime,
  ZodISODuration,
  ZodISOTime,
  ZodIntersection,
  ZodIssueCode,
  ZodJWT,
  ZodKSUID,
  ZodLazy,
  ZodLiteral,
  ZodMap,
  ZodNaN,
  ZodNanoID,
  ZodNever,
  ZodNonOptional,
  ZodNull,
  ZodNullable,
  ZodNumber,
  ZodNumberFormat,
  ZodObject,
  ZodOptional,
  ZodPipe,
  ZodPrefault,
  ZodPromise,
  ZodReadonly,
  ZodRealError,
  ZodRecord,
  ZodSet,
  ZodString,
  ZodStringFormat,
  ZodSuccess,
  ZodSymbol,
  ZodTemplateLiteral,
  ZodTransform,
  ZodTuple,
  ZodType,
  ZodULID,
  ZodURL,
  ZodUUID,
  ZodUndefined,
  ZodUnion,
  ZodUnknown,
  ZodVoid,
  ZodXID,
  _ZodString,
  _default,
  _function,
  any,
  array,
  base64,
  base64url,
  bigint: bigint$1,
  boolean: boolean$1,
  catch: _catch,
  check,
  cidrv4,
  cidrv6,
  clone,
  codec,
  coerce: coerce$1,
  config,
  core: index$1,
  cuid,
  cuid2,
  custom,
  date: date$1,
  decode,
  decodeAsync,
  discriminatedUnion,
  e164,
  email,
  emoji,
  encode,
  encodeAsync,
  endsWith: _endsWith,
  enum: _enum,
  file,
  flattenError,
  float32,
  float64,
  formatError,
  function: _function,
  getErrorMap,
  globalRegistry,
  gt: _gt,
  gte: _gte,
  guid,
  hash,
  hex,
  hostname,
  httpUrl,
  includes: _includes,
  instanceof: _instanceof,
  int,
  int32,
  int64,
  intersection,
  ipv4,
  ipv6,
  iso: iso$1,
  json,
  jwt,
  keyof,
  ksuid,
  lazy,
  length: _length,
  literal,
  locales: index$2,
  looseObject,
  lowercase: _lowercase,
  lt: _lt,
  lte: _lte,
  map,
  maxLength: _maxLength,
  maxSize: _maxSize,
  mime: _mime,
  minLength: _minLength,
  minSize: _minSize,
  multipleOf: _multipleOf,
  nan,
  nanoid,
  nativeEnum,
  negative: _negative,
  never,
  nonnegative: _nonnegative,
  nonoptional,
  nonpositive: _nonpositive,
  normalize: _normalize,
  null: _null,
  nullable,
  nullish,
  number: number$1,
  object,
  optional,
  overwrite: _overwrite,
  parse,
  parseAsync,
  partialRecord,
  pipe,
  positive: _positive,
  prefault,
  preprocess,
  prettifyError,
  promise,
  property: _property,
  readonly,
  record,
  refine,
  regex: _regex,
  regexes: regexes$1,
  registry,
  safeDecode,
  safeDecodeAsync,
  safeEncode,
  safeEncodeAsync,
  safeParse,
  safeParseAsync,
  set,
  setErrorMap,
  size: _size,
  startsWith: _startsWith,
  strictObject,
  string: string$1,
  stringFormat,
  stringbool,
  success,
  superRefine,
  symbol,
  templateLiteral,
  toJSONSchema,
  toLowerCase: _toLowerCase,
  toUpperCase: _toUpperCase,
  transform,
  treeifyError,
  trim: _trim,
  tuple,
  uint32,
  uint64,
  ulid,
  undefined: _undefined,
  union,
  unknown,
  uppercase: _uppercase,
  url,
  util: util$1,
  uuid,
  uuidv4,
  uuidv6,
  uuidv7,
  void: _void,
  xid
}, Symbol.toStringTag, { value: 'Module' }));

var reactDomExports = requireReactDom();
const index = /*@__PURE__*/getDefaultExportFromCjs(reactDomExports);

"use strict";
function getDialogAriaProps(options) {
  return {
    role: "dialog",
    "aria-modal": options.modal !== false ? "true" : void 0,
    "aria-labelledby": options.labelId,
    "aria-describedby": options.descriptionId,
    "data-state": options.open ? "open" : "closed"
  };
}
function getOverlayAriaProps(options) {
  return {
    "data-state": options.open ? "open" : "closed",
    "aria-hidden": "true"
  };
}
function getTriggerAriaProps(options) {
  return {
    "aria-expanded": options.open,
    "aria-controls": options.controlsId,
    "aria-haspopup": "dialog",
    "data-state": options.open ? "open" : "closed"
  };
}

"use strict";
function onEscapeKeyDown(handler) {
  if (typeof window === "undefined") {
    return () => {
    };
  }
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      handler(event);
    }
  };
  document.addEventListener("keydown", handleKeyDown);
  return () => {
    document.removeEventListener("keydown", handleKeyDown);
  };
}

"use strict";
const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])'
].join(",");
function createFocusTrap(element) {
  if (typeof window === "undefined") {
    return () => {
    };
  }
  const previouslyFocused = document.activeElement;
  const getFocusableElements = () => {
    return Array.from(element.querySelectorAll(FOCUSABLE_SELECTOR));
  };
  const focusableElements = getFocusableElements();
  if (focusableElements.length > 0) {
    focusableElements[0]?.focus();
  }
  const handleKeyDown = (event) => {
    if (event.key !== "Tab") return;
    const focusable = getFocusableElements();
    if (focusable.length === 0) return;
    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  };
  element.addEventListener("keydown", handleKeyDown);
  return () => {
    element.removeEventListener("keydown", handleKeyDown);
    previouslyFocused?.focus();
  };
}
function preventBodyScroll() {
  if (typeof window === "undefined") {
    return () => {
    };
  }
  const originalOverflow = document.body.style.overflow;
  const originalPaddingRight = document.body.style.paddingRight;
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = "hidden";
  document.body.style.paddingRight = `${scrollbarWidth}px`;
  return () => {
    document.body.style.overflow = originalOverflow;
    document.body.style.paddingRight = originalPaddingRight;
  };
}

"use strict";
let idCounter = 0;
function generateId(prefix = "ui") {
  if (typeof window === "undefined") {
    return `${prefix}-ssr-${idCounter++}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
function resetIdCounter() {
  idCounter = 0;
}

"use strict";
function onOutsideClick(element, handler) {
  if (typeof window === "undefined") {
    return () => {
    };
  }
  const handleClick = (event) => {
    const target = event.target;
    if (!element.contains(target)) {
      handler(event);
    }
  };
  document.addEventListener("mousedown", handleClick, true);
  document.addEventListener("touchstart", handleClick, true);
  return () => {
    document.removeEventListener("mousedown", handleClick, true);
    document.removeEventListener("touchstart", handleClick, true);
  };
}
function onPointerDownOutside(element, handler) {
  if (typeof window === "undefined") {
    return () => {
    };
  }
  const handlePointerDown = (event) => {
    const target = event.target;
    if (!element.contains(target)) {
      handler(event);
    }
  };
  document.addEventListener("pointerdown", handlePointerDown, true);
  return () => {
    document.removeEventListener("pointerdown", handlePointerDown, true);
  };
}

"use strict";
function getPortalContainer(options) {
  if (typeof document === "undefined") {
    return null;
  }
  if (options?.enabled === false) {
    return null;
  }
  return options?.container || document.body;
}
function isPortalSupported() {
  return typeof document !== "undefined";
}

"use strict";
const DialogContext = reactExports.createContext(null);
function useDialogContext() {
  const context = reactExports.useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used within Dialog.Root");
  }
  return context;
}
function Dialog({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  modal = true
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = reactExports.useState(defaultOpen);
  const isControlled = controlledOpen !== void 0;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const handleOpenChange = reactExports.useCallback(
    (newOpen) => {
      if (!isControlled) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    },
    [isControlled, onOpenChange]
  );
  const [contentId] = reactExports.useState(() => generateId("dialog-content"));
  const [titleId] = reactExports.useState(() => generateId("dialog-title"));
  const [descriptionId] = reactExports.useState(() => generateId("dialog-description"));
  const contextValue = reactExports.useMemo(
    () => ({
      open,
      onOpenChange: handleOpenChange,
      contentId,
      titleId,
      descriptionId,
      modal
    }),
    [open, handleOpenChange, contentId, titleId, descriptionId, modal]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContext.Provider, { value: contextValue, children });
}
function DialogTrigger({ asChild, onClick, ...props }) {
  const { open, onOpenChange, contentId } = useDialogContext();
  const ariaProps = getTriggerAriaProps({ open, controlsId: contentId });
  const handleClick = (event) => {
    onClick?.(event);
    onOpenChange(!open);
  };
  if (asChild && reactExports.isValidElement(props.children)) {
    return reactExports.cloneElement(props.children, {
      ...ariaProps,
      onClick: handleClick
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleClick, ...ariaProps, ...props });
}
function DialogPortal({ children, container, forceMount }) {
  const { open } = useDialogContext();
  const [mounted, setMounted] = reactExports.useState(false);
  reactExports.useEffect(() => {
    setMounted(true);
  }, []);
  const portalContainer = getPortalContainer(
    container !== void 0 ? { container, enabled: true } : { enabled: true }
  );
  const shouldRender = forceMount || open;
  if (!shouldRender || !mounted || !portalContainer) {
    return null;
  }
  return reactDomExports.createPortal(children, portalContainer);
}
function DialogOverlay({ asChild, forceMount, className, ...props }) {
  const { open } = useDialogContext();
  const ariaProps = getOverlayAriaProps({ open });
  const shouldRender = forceMount || open;
  if (!shouldRender) {
    return null;
  }
  const overlayProps = {
    ...ariaProps,
    className: `fixed inset-0 z-50 bg-black/80 ${className || ""}`.trim(),
    ...props
  };
  if (asChild && reactExports.isValidElement(props.children)) {
    return reactExports.cloneElement(props.children, overlayProps);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ...overlayProps });
}
function DialogContent({
  asChild,
  forceMount,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onEscapeKeyDown: onEscapeKeyDownProp,
  onPointerDownOutside: onPointerDownOutsideProp,
  onInteractOutside,
  className,
  ...props
}) {
  const { open, onOpenChange, contentId, titleId, descriptionId, modal } = useDialogContext();
  const contentRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!open || !modal || !contentRef.current) return;
    const cleanup = createFocusTrap(contentRef.current);
    return cleanup;
  }, [open, modal]);
  reactExports.useEffect(() => {
    if (!open || !modal) return;
    const cleanup = preventBodyScroll();
    return cleanup;
  }, [open, modal]);
  reactExports.useEffect(() => {
    if (!open) return;
    const cleanup = onEscapeKeyDown((event) => {
      onEscapeKeyDownProp?.(event);
      if (!event.defaultPrevented) {
        onOpenChange(false);
      }
    });
    return cleanup;
  }, [open, onOpenChange, onEscapeKeyDownProp]);
  reactExports.useEffect(() => {
    if (!open || !modal || !contentRef.current) return;
    const cleanup = onPointerDownOutside(contentRef.current, (event) => {
      onPointerDownOutsideProp?.(event);
      onInteractOutside?.(event);
      if (!event.defaultPrevented) {
        onOpenChange(false);
      }
    });
    return cleanup;
  }, [open, modal, onOpenChange, onPointerDownOutsideProp, onInteractOutside]);
  const ariaProps = getDialogAriaProps({
    open,
    labelId: titleId,
    descriptionId,
    modal
  });
  const shouldRender = forceMount || open;
  if (!shouldRender) {
    return null;
  }
  const contentProps = {
    ref: contentRef,
    id: contentId,
    ...ariaProps,
    className: `fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] ${className || ""}`.trim(),
    ...props
  };
  if (asChild && reactExports.isValidElement(props.children)) {
    return reactExports.cloneElement(props.children, contentProps);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ...contentProps });
}
function DialogTitle({ asChild, ...props }) {
  const { titleId } = useDialogContext();
  const titleProps = {
    id: titleId,
    ...props
  };
  if (asChild && reactExports.isValidElement(props.children)) {
    return reactExports.cloneElement(props.children, titleProps);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { ...titleProps });
}
function DialogDescription({ asChild, ...props }) {
  const { descriptionId } = useDialogContext();
  const descriptionProps = {
    id: descriptionId,
    ...props
  };
  if (asChild && reactExports.isValidElement(props.children)) {
    return reactExports.cloneElement(props.children, descriptionProps);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { ...descriptionProps });
}
function DialogClose({ asChild, onClick, ...props }) {
  const { onOpenChange } = useDialogContext();
  const handleClick = (event) => {
    onClick?.(event);
    onOpenChange(false);
  };
  if (asChild && reactExports.isValidElement(props.children)) {
    return reactExports.cloneElement(props.children, {
      onClick: handleClick
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: handleClick, ...props });
}
Dialog.Trigger = DialogTrigger;
Dialog.Portal = DialogPortal;
Dialog.Overlay = DialogOverlay;
Dialog.Content = DialogContent;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;
Dialog.Close = DialogClose;

"use strict";
function BasicDialogExample() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { className: "px-4 py-2 bg-blue-500 text-white rounded", children: "Open Dialog" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-white p-6 rounded-lg shadow-xl max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-2xl font-bold mb-2", children: "Welcome" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-gray-600 mb-4", children: "This is a basic dialog built with framework-agnostic primitives." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { className: "px-4 py-2 bg-gray-200 rounded hover:bg-gray-300", children: "Close" })
      ] })
    ] })
  ] });
}
function ControlledDialogExample() {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setOpen(true),
        className: "px-4 py-2 bg-green-500 text-white rounded",
        children: "Open Controlled Dialog"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-white p-6 rounded-lg shadow-xl max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-2xl font-bold mb-2", children: "Controlled Dialog" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-gray-600 mb-4", children: "This dialog's state is managed externally." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setOpen(false),
              className: "px-4 py-2 bg-gray-200 rounded hover:bg-gray-300",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                console.log("Action performed");
                setOpen(false);
              },
              className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
              children: "Confirm"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
const loginSchema = object({
  email: string$1().email("Invalid email address"),
  password: string$1().min(8, "Password must be at least 8 characters")
});
function DialogWithReactHookForm() {
  const [open, setOpen] = reactExports.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: a(loginSchema)
  });
  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    setOpen(false);
    reset();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setOpen(true),
        className: "px-4 py-2 bg-purple-500 text-white rounded",
        children: "Login"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: setOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-white p-6 rounded-lg shadow-xl max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-2xl font-bold mb-2", children: "Login" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-gray-600 mb-4", children: "Enter your credentials to continue." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "email", className: "block text-sm font-medium mb-1", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "email",
                type: "email",
                ...register("email"),
                className: "w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              }
            ),
            errors.email && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.email.message })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "password", className: "block text-sm font-medium mb-1", children: "Password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "password",
                type: "password",
                ...register("password"),
                className: "w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              }
            ),
            errors.password && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.password.message })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setOpen(false),
                className: "flex-1 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "submit",
                className: "flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
                children: "Login"
              }
            )
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
function NonModalDialogExample() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { modal: false, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { className: "px-4 py-2 bg-yellow-500 text-white rounded", children: "Open Non-Modal" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogPortal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-white p-6 rounded-lg shadow-xl max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-2xl font-bold mb-2", children: "Non-Modal Dialog" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-gray-600 mb-4", children: "You can interact with content outside this dialog. No focus trap or background click to close." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { className: "px-4 py-2 bg-gray-200 rounded hover:bg-gray-300", children: "Close" })
    ] }) })
  ] });
}
function CustomStyledDialog() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { className: "px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow", children: "Custom Styled" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, { className: "fixed inset-0 bg-black/50 backdrop-blur-sm" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl shadow-2xl max-w-lg border-2 border-purple-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent", children: "Beautiful Dialog" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-gray-700 mb-6 leading-relaxed", children: "This dialog demonstrates how the primitives enable complete design freedom while maintaining accessibility and behavior." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { className: "flex-1 px-6 py-3 bg-white border-2 border-purple-300 text-purple-700 rounded-lg font-semibold hover:bg-purple-50 transition-colors", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { className: "flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow", children: "Confirm" })
        ] })
      ] })
    ] })
  ] });
}

export { BasicDialogExample, ControlledDialogExample, CustomStyledDialog, DialogWithReactHookForm, NonModalDialogExample };
//# sourceMappingURL=react-dialog-BwQhSUIT.js.map
