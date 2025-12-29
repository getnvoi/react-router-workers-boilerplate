import * as React from "react";
import { Field as BaseField } from "@base-ui/react/field";
import styles from "./field.module.css";

/**
 * Field Component - Form field wrapper with label, description, and error handling
 *
 * @example
 * // Basic text field with label
 * <Field.Root name="username">
 *   <Field.Label>Username</Field.Label>
 *   <Field.Control type="text" placeholder="Enter username" required />
 *   <Field.Error match="valueMissing">Username is required</Field.Error>
 * </Field.Root>
 *
 * @example
 * // Email field with description and validation
 * <Field.Root name="email" validationMode="onBlur">
 *   <Field.Label>Email</Field.Label>
 *   <Field.Control type="email" required />
 *   <Field.Error match="valueMissing">Email is required</Field.Error>
 *   <Field.Error match="typeMismatch">Must be a valid email</Field.Error>
 *   <Field.Description>We'll never share your email</Field.Description>
 * </Field.Root>
 *
 * @example
 * // Using with Base UI Input component
 * import { Input } from "~/components";
 * <Field.Root name="password">
 *   <Field.Label>Password</Field.Label>
 *   <Input type="password" required minLength={8} />
 *   <Field.Error match="valueMissing">Password is required</Field.Error>
 *   <Field.Error match="tooShort">Must be at least 8 characters</Field.Error>
 * </Field.Root>
 *
 * @example
 * // URL field with pattern validation
 * <Field.Root name="website">
 *   <Field.Label>Website</Field.Label>
 *   <Field.Control
 *     type="url"
 *     pattern="https?://.*"
 *     placeholder="https://example.com"
 *   />
 *   <Field.Error match="patternMismatch">Must be a valid URL</Field.Error>
 *   <Field.Description>Your personal or company website</Field.Description>
 * </Field.Root>
 *
 * @example
 * // Number field with range validation
 * <Field.Root name="age">
 *   <Field.Label>Age</Field.Label>
 *   <Field.Control type="number" min={18} max={120} required />
 *   <Field.Error match="rangeUnderflow">Must be at least 18</Field.Error>
 *   <Field.Error match="rangeOverflow">Must be less than 120</Field.Error>
 * </Field.Root>
 *
 * @example
 * // Textarea field
 * <Field.Root name="bio">
 *   <Field.Label>Bio</Field.Label>
 *   <Field.Control
 *     render={(props) => <textarea {...props} rows={4} />}
 *     maxLength={500}
 *   />
 *   <Field.Error match="tooLong">Bio must be 500 characters or less</Field.Error>
 *   <Field.Description>Tell us about yourself</Field.Description>
 * </Field.Root>
 *
 * @example
 * // With custom input wrapper (icons, buttons inside)
 * <Field.Root name="search">
 *   <Field.Label>Search</Field.Label>
 *   <div className={styles.inputWrapper}>
 *     <Input placeholder="Search..." />
 *     <SearchIcon className={styles.icon} />
 *   </div>
 *   <Field.Description>Search for users, posts, or tags</Field.Description>
 * </Field.Root>
 *
 * @example
 * // With Select component
 * import { Select } from "~/components";
 * <Field.Root name="country">
 *   <Field.Label>Country</Field.Label>
 *   <Field.Description>Select your country</Field.Description>
 *   <Select.Root>
 *     <Select.Trigger>
 *       <Select.Value placeholder="Choose a country" />
 *     </Select.Trigger>
 *     <Select.Portal>
 *       <Select.Content>
 *         <Select.Item value="us">United States</Select.Item>
 *         <Select.Item value="uk">United Kingdom</Select.Item>
 *       </Select.Content>
 *     </Select.Portal>
 *   </Select.Root>
 * </Field.Root>
 *
 * @example
 * // With Checkbox component
 * import { Checkbox } from "~/components";
 * <Field.Root>
 *   <Field.Label>
 *     <Checkbox name="terms" required />
 *     I agree to the terms and conditions
 *   </Field.Label>
 *   <Field.Error match="valueMissing">You must accept the terms</Field.Error>
 * </Field.Root>
 *
 * @example
 * // Multiple validation modes
 * <Field.Root name="username" validationMode="onChange">
 *   <Field.Label>Username</Field.Label>
 *   <Field.Control
 *     type="text"
 *     pattern="[a-zA-Z0-9_]{3,16}"
 *     required
 *   />
 *   <Field.Error match="valueMissing">Username is required</Field.Error>
 *   <Field.Error match="patternMismatch">
 *     3-16 characters, letters, numbers, and underscores only
 *   </Field.Error>
 *   <Field.Description>This will be your public identifier</Field.Description>
 * </Field.Root>
 *
 * @example
 * // Custom error rendering
 * <Field.Root name="custom">
 *   <Field.Label>Custom Field</Field.Label>
 *   <Field.Control type="text" required />
 *   <Field.Error
 *     render={(props) => (
 *       <div {...props} className={styles.customError}>
 *         <AlertIcon /> {props.children}
 *       </div>
 *     )}
 *     match="valueMissing"
 *   >
 *     This field is required
 *   </Field.Error>
 * </Field.Root>
 */

interface FieldRootProps extends BaseField.Root.Props {
  className?: string;
}

function FieldRoot({ className = "", ...props }: FieldRootProps) {
  return (
    <BaseField.Root className={`${styles.root} ${className}`} {...props} />
  );
}

interface FieldLabelProps extends BaseField.Label.Props {
  className?: string;
}

function FieldLabel({ className = "", ...props }: FieldLabelProps) {
  return (
    <BaseField.Label className={`${styles.label} ${className}`} {...props} />
  );
}

interface FieldControlProps extends BaseField.Control.Props {
  className?: string;
}

function FieldControl({ className = "", ...props }: FieldControlProps) {
  return (
    <BaseField.Control
      className={`${styles.control} ${className}`}
      {...props}
    />
  );
}

interface FieldErrorProps extends BaseField.Error.Props {
  className?: string;
}

function FieldError({ className = "", ...props }: FieldErrorProps) {
  return (
    <BaseField.Error className={`${styles.error} ${className}`} {...props} />
  );
}

interface FieldDescriptionProps extends BaseField.Description.Props {
  className?: string;
}

function FieldDescription({ className = "", ...props }: FieldDescriptionProps) {
  return (
    <BaseField.Description
      className={`${styles.description} ${className}`}
      {...props}
    />
  );
}

export const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Control: FieldControl,
  Error: FieldError,
  Description: FieldDescription,
};
