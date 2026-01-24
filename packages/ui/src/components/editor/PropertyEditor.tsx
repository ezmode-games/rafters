/**
 * Schema-driven property editor for block-based editing
 *
 * @cognitive-load 6/10 - Dynamic form generation requires understanding of schema structure
 * @attention-economics Field types are inferred from Zod schema, reducing manual configuration
 * @trust-building Inline validation with clear error messages, required field indicators
 * @accessibility Labels associated with inputs, validation errors announced via aria
 * @semantic-meaning Schema-driven forms: field types determine input rendering
 *
 * @usage-patterns
 * DO: Use Zod schemas to define block properties
 * DO: Provide clear field names that convert well to labels
 * DO: Handle validation errors gracefully
 * NEVER: Use any types in schema definitions
 * NEVER: Ignore validation errors from Zod
 *
 * @example
 * ```tsx
 * const BlockSchema = z.object({
 *   title: z.string(),
 *   count: z.number(),
 *   enabled: z.boolean(),
 *   variant: z.enum(['primary', 'secondary']),
 * });
 *
 * <PropertyEditor
 *   schema={BlockSchema}
 *   values={{ title: 'Hello', count: 5, enabled: true, variant: 'primary' }}
 *   onChange={(values) => console.log(values)}
 * />
 * ```
 */
import * as React from 'react';
import type { ZodObject, ZodRawShape, ZodTypeAny } from 'zod';
import classy from '../../primitives/classy';
import { Checkbox } from '../ui/checkbox';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

// ============================================================================
// Types
// ============================================================================

export interface PropertyEditorProps<T extends ZodRawShape> {
  /** Zod schema defining the properties */
  schema: ZodObject<T>;
  /** Current property values */
  values: Record<string, unknown>;
  /** Callback when values change */
  onChange: (values: Record<string, unknown>) => void;
  /** Optional block type name for display */
  blockType?: string;
  /** Optional title for the editor panel */
  title?: string;
  /** Additional CSS classes */
  className?: string;
}

interface FieldConfig {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'array' | 'unknown';
  enumValues: readonly string[] | undefined;
  isOptional: boolean;
  description: string | undefined;
}

interface FieldState {
  value: unknown;
  error: string | null;
  touched: boolean;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Convert camelCase to Title Case
 * e.g., "firstName" -> "First Name"
 */
function camelToTitleCase(str: string): string {
  const result = str.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
}

/**
 * Get the Zod type name, handling both Zod v3 and v4 APIs
 * Zod v3: _def.typeName (e.g., "ZodString")
 * Zod v4: _def.type (e.g., "string")
 */
function getZodTypeName(zodType: ZodTypeAny): string {
  const def = zodType._def as unknown;
  if (!def || typeof def !== 'object') return 'unknown';
  const defObj = def as Record<string, unknown>;

  // Zod v4: _def.type is a short string like "string", "number", etc.
  const typeV4 = defObj.type;
  if (typeof typeV4 === 'string') return typeV4;

  // Zod v3: _def.typeName is like "ZodString", "ZodNumber", etc.
  const typeV3 = defObj.typeName;
  if (typeof typeV3 === 'string') {
    // Normalize to v4-style: "ZodString" -> "string"
    return typeV3.replace('Zod', '').toLowerCase();
  }

  return 'unknown';
}

/**
 * Get the inner type, unwrapping optionals and defaults
 */
function getInnerType(zodType: ZodTypeAny): ZodTypeAny {
  const typeName = getZodTypeName(zodType);
  const def = zodType._def as unknown;
  const defObj = def && typeof def === 'object' ? (def as Record<string, unknown>) : null;

  if (typeName === 'optional' || typeName === 'nullable') {
    const innerType = defObj?.innerType as ZodTypeAny | undefined;
    return innerType ? getInnerType(innerType) : zodType;
  }

  if (typeName === 'default') {
    const innerType = defObj?.innerType as ZodTypeAny | undefined;
    return innerType ? getInnerType(innerType) : zodType;
  }

  return zodType;
}

/**
 * Check if a Zod type is optional
 */
function isOptional(zodType: ZodTypeAny): boolean {
  const typeName = getZodTypeName(zodType);
  if (typeName === 'optional' || typeName === 'nullable') {
    return true;
  }
  if (typeName === 'default') {
    return true; // Has a default, so effectively optional
  }
  return false;
}

/**
 * Determine the field type from a Zod type
 */
function getFieldType(
  zodType: ZodTypeAny,
): 'string' | 'number' | 'boolean' | 'enum' | 'array' | 'unknown' {
  const inner = getInnerType(zodType);
  const typeName = getZodTypeName(inner);

  switch (typeName) {
    case 'string':
      return 'string';
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'enum':
    case 'nativeenum':
      return 'enum';
    case 'array':
      return 'array';
    default:
      return 'unknown';
  }
}

/**
 * Get enum values from a Zod enum type
 */
function getEnumValues(zodType: ZodTypeAny): readonly string[] | undefined {
  const inner = getInnerType(zodType);
  const typeName = getZodTypeName(inner);
  const def = inner._def as unknown;
  const defObj = def && typeof def === 'object' ? (def as Record<string, unknown>) : null;

  if (typeName === 'enum') {
    // Zod v4: _def.entries is an object { value: value }
    const entries = defObj?.entries as Record<string, string> | undefined;
    if (entries) {
      return Object.values(entries);
    }
    // Zod v3: _def.values is an array
    const values = defObj?.values as readonly string[] | undefined;
    return values;
  }

  if (typeName === 'nativeenum') {
    const enumValues = defObj?.values as Record<string, string | number> | undefined;
    if (enumValues) {
      return Object.values(enumValues).filter((v): v is string => typeof v === 'string');
    }
  }

  return undefined;
}

/**
 * Get description from a Zod type
 */
function getDescription(zodType: ZodTypeAny): string | undefined {
  const def = zodType._def as unknown;
  const defObj = def && typeof def === 'object' ? (def as Record<string, unknown>) : null;
  const description = defObj?.description;
  return typeof description === 'string' ? description : undefined;
}

/**
 * Parse schema into field configurations
 */
function parseSchema<T extends ZodRawShape>(schema: ZodObject<T>): FieldConfig[] {
  const shape = schema.shape;
  const fields: FieldConfig[] = [];

  for (const key of Object.keys(shape)) {
    const zodType = shape[key] as ZodTypeAny;
    const fieldType = getFieldType(zodType);
    const enumValues = fieldType === 'enum' ? getEnumValues(zodType) : undefined;

    fields.push({
      key,
      label: camelToTitleCase(key),
      type: fieldType,
      enumValues,
      isOptional: isOptional(zodType),
      description: getDescription(zodType),
    });
  }

  return fields;
}

/**
 * Validate a single field value against the schema
 */
function validateField<T extends ZodRawShape>(
  schema: ZodObject<T>,
  key: string,
  value: unknown,
): string | null {
  const shape = schema.shape;
  const zodType = shape[key] as ZodTypeAny | undefined;

  if (!zodType) {
    return null;
  }

  const result = zodType.safeParse(value);
  if (result.success) {
    return null;
  }

  // Handle both Zod v3 (errors) and Zod v4 (issues) error structures
  const errorObj = result.error as {
    issues?: Array<{ message: string }>;
    errors?: Array<{ message: string }>;
  };
  const firstError = errorObj.issues?.[0] ?? errorObj.errors?.[0];
  return firstError?.message ?? 'Invalid value';
}

/**
 * Convert array value to comma-separated string
 */
function arrayToString(value: unknown): string {
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  return '';
}

/**
 * Parse comma-separated string to array
 */
function stringToArray(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

// ============================================================================
// Component
// ============================================================================

export function PropertyEditor<T extends ZodRawShape>({
  schema,
  values,
  onChange,
  blockType,
  title,
  className,
}: PropertyEditorProps<T>): React.JSX.Element {
  // Parse schema into field configurations
  const fields = React.useMemo(() => parseSchema(schema), [schema]);

  // Track field states (errors and touched)
  const [fieldStates, setFieldStates] = React.useState<Record<string, FieldState>>(() => {
    const initialStates: Record<string, FieldState> = {};
    for (const field of fields) {
      initialStates[field.key] = {
        value: values[field.key],
        error: null,
        touched: false,
      };
    }
    return initialStates;
  });

  // Update field states when values prop changes
  React.useEffect(() => {
    setFieldStates((prev) => {
      const updated: Record<string, FieldState> = {};
      for (const field of fields) {
        updated[field.key] = {
          value: values[field.key],
          error: prev[field.key]?.error ?? null,
          touched: prev[field.key]?.touched ?? false,
        };
      }
      return updated;
    });
  }, [values, fields]);

  // Handle field value change
  const handleFieldChange = React.useCallback(
    (key: string, newValue: unknown) => {
      const updatedValues = { ...values, [key]: newValue };
      onChange(updatedValues);

      // Clear error on change if field was touched
      setFieldStates((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          value: newValue,
          error: null,
        } as FieldState,
      }));
    },
    [values, onChange],
  );

  // Handle field blur (validation)
  const handleFieldBlur = React.useCallback(
    (key: string) => {
      const currentValue = values[key];
      const error = validateField(schema, key, currentValue);

      setFieldStates((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          touched: true,
          error,
        } as FieldState,
      }));
    },
    [schema, values],
  );

  // Render a text input field
  const renderTextField = (field: FieldConfig): React.JSX.Element => {
    const state = fieldStates[field.key];
    const value = values[field.key];
    const stringValue = typeof value === 'string' ? value : '';

    return (
      <Input
        id={`property-${field.key}`}
        type="text"
        value={stringValue}
        onChange={(e) => handleFieldChange(field.key, e.target.value)}
        onBlur={() => handleFieldBlur(field.key)}
        variant={state?.error ? 'destructive' : 'default'}
        aria-invalid={state?.error ? 'true' : undefined}
        aria-describedby={state?.error ? `property-${field.key}-error` : undefined}
      />
    );
  };

  // Render a number input field
  const renderNumberField = (field: FieldConfig): React.JSX.Element => {
    const state = fieldStates[field.key];
    const value = values[field.key];
    const numValue = typeof value === 'number' ? value : '';

    return (
      <Input
        id={`property-${field.key}`}
        type="number"
        value={numValue}
        onChange={(e) => {
          const parsed = e.target.value === '' ? undefined : Number(e.target.value);
          handleFieldChange(field.key, parsed);
        }}
        onBlur={() => handleFieldBlur(field.key)}
        variant={state?.error ? 'destructive' : 'default'}
        aria-invalid={state?.error ? 'true' : undefined}
        aria-describedby={state?.error ? `property-${field.key}-error` : undefined}
      />
    );
  };

  // Render a checkbox field
  const renderCheckboxField = (field: FieldConfig): React.JSX.Element => {
    const value = values[field.key];
    const boolValue = typeof value === 'boolean' ? value : false;

    return (
      <div className="flex items-center gap-2">
        <Checkbox
          id={`property-${field.key}`}
          checked={boolValue}
          onCheckedChange={(checked) => handleFieldChange(field.key, checked)}
        />
        <Label htmlFor={`property-${field.key}`} className="font-normal">
          {field.label}
          {!field.isOptional && (
            <span className="ml-1 text-destructive" aria-hidden="true">
              *
            </span>
          )}
        </Label>
      </div>
    );
  };

  // Render a select dropdown field
  const renderEnumField = (field: FieldConfig): React.JSX.Element => {
    const state = fieldStates[field.key];
    const value = values[field.key];
    const stringValue = typeof value === 'string' ? value : '';

    return (
      <Select
        value={stringValue}
        onValueChange={(newValue) => handleFieldChange(field.key, newValue)}
      >
        <SelectTrigger
          id={`property-${field.key}`}
          aria-invalid={state?.error ? 'true' : undefined}
          aria-describedby={state?.error ? `property-${field.key}-error` : undefined}
          onBlur={() => handleFieldBlur(field.key)}
        >
          <SelectValue placeholder={`Select ${field.label.toLowerCase()}...`} />
        </SelectTrigger>
        <SelectContent>
          {field.enumValues?.map((option) => (
            <SelectItem key={option} value={option}>
              {camelToTitleCase(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  // Render an array field (comma-separated input)
  const renderArrayField = (field: FieldConfig): React.JSX.Element => {
    const state = fieldStates[field.key];
    const value = values[field.key];
    const stringValue = arrayToString(value);

    return (
      <Input
        id={`property-${field.key}`}
        type="text"
        value={stringValue}
        placeholder="Comma-separated values"
        onChange={(e) => {
          const arrayValue = stringToArray(e.target.value);
          handleFieldChange(field.key, arrayValue);
        }}
        onBlur={() => handleFieldBlur(field.key)}
        variant={state?.error ? 'destructive' : 'default'}
        aria-invalid={state?.error ? 'true' : undefined}
        aria-describedby={state?.error ? `property-${field.key}-error` : undefined}
      />
    );
  };

  // Render an unknown type field (disabled text display)
  const renderUnknownField = (field: FieldConfig): React.JSX.Element => {
    const value = values[field.key];
    const displayValue = value !== undefined && value !== null ? String(value) : '';

    return (
      <Input
        id={`property-${field.key}`}
        type="text"
        value={displayValue}
        disabled
        aria-describedby={`property-${field.key}-hint`}
      />
    );
  };

  // Render a single field based on its type
  const renderField = (field: FieldConfig): React.JSX.Element => {
    const state = fieldStates[field.key];

    // Boolean fields have inline label, skip wrapper label
    if (field.type === 'boolean') {
      return (
        <div key={field.key} className="space-y-1">
          {renderCheckboxField(field)}
          {state?.error && (
            <p id={`property-${field.key}-error`} className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          )}
        </div>
      );
    }

    return (
      <div key={field.key} className="space-y-2">
        <Label htmlFor={`property-${field.key}`}>
          {field.label}
          {!field.isOptional && (
            <span className="ml-1 text-destructive" aria-hidden="true">
              *
            </span>
          )}
        </Label>

        {field.type === 'string' && renderTextField(field)}
        {field.type === 'number' && renderNumberField(field)}
        {field.type === 'enum' && renderEnumField(field)}
        {field.type === 'array' && renderArrayField(field)}
        {field.type === 'unknown' && (
          <>
            {renderUnknownField(field)}
            <p id={`property-${field.key}-hint`} className="text-xs text-muted-foreground">
              Unsupported type - read only
            </p>
          </>
        )}

        {field.description && !state?.error && (
          <p className="text-sm text-muted-foreground">{field.description}</p>
        )}

        {state?.error && (
          <p id={`property-${field.key}-error`} className="text-sm text-destructive" role="alert">
            {state.error}
          </p>
        )}
      </div>
    );
  };

  const containerClasses = classy('flex flex-col gap-4', className);

  return (
    <form
      className={containerClasses}
      aria-label={title ?? 'Property editor'}
      onSubmit={(e) => e.preventDefault()}
    >
      {(title ?? blockType) && (
        <div className="border-b pb-2">
          <h3 className="text-sm font-semibold text-foreground">
            {title ?? `${blockType} Properties`}
          </h3>
        </div>
      )}

      <div className="flex flex-col gap-4">{fields.map(renderField)}</div>
    </form>
  );
}

PropertyEditor.displayName = 'PropertyEditor';

export default PropertyEditor;
