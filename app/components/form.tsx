import * as React from "react";
import { Form as BaseForm } from "@base-ui/react/form";
import styles from "./form.module.css";

/**
 * Form Component - Form wrapper with validation state management
 *
 * @example
 * // Basic form with onFormSubmit
 * <Form.Root onFormSubmit={async (values) => {
 *   console.log(values); // { email: "...", password: "..." }
 *   await submitToAPI(values);
 * }}>
 *   <Field.Root name="email">
 *     <Field.Label>Email</Field.Label>
 *     <Field.Control type="email" required />
 *     <Field.Error match="valueMissing">Email is required</Field.Error>
 *   </Field.Root>
 *   <button type="submit">Submit</button>
 * </Form.Root>
 *
 * @example
 * // With server-side validation errors
 * const [errors, setErrors] = useState({});
 *
 * <Form.Root
 *   errors={errors}
 *   onFormSubmit={async (values) => {
 *     const response = await fetch('/api/register', {
 *       method: 'POST',
 *       body: JSON.stringify(values)
 *     });
 *     if (!response.ok) {
 *       const { errors } = await response.json();
 *       setErrors(errors); // { email: "Already taken", password: "Too weak" }
 *     }
 *   }}
 * >
 *   <Field.Root name="email">
 *     <Field.Label>Email</Field.Label>
 *     <Field.Control type="email" />
 *     <Field.Error /> {/* Shows server error automatically */}
 *   </Field.Root>
 *   <button type="submit">Register</button>
 * </Form.Root>
 *
 * @example
 * // With Zod validation
 * import { z } from "zod";
 *
 * const schema = z.object({
 *   username: z.string().min(3, "At least 3 characters"),
 *   email: z.string().email("Invalid email"),
 *   age: z.number().min(18, "Must be 18 or older")
 * });
 *
 * const [errors, setErrors] = useState({});
 *
 * <Form.Root
 *   errors={errors}
 *   onFormSubmit={(values) => {
 *     const result = schema.safeParse(values);
 *     if (!result.success) {
 *       const flattened = result.error.flatten();
 *       setErrors(flattened.fieldErrors);
 *       return;
 *     }
 *     // Submit valid data
 *     submitToAPI(result.data);
 *   }}
 * >
 *   <Field.Root name="username">
 *     <Field.Label>Username</Field.Label>
 *     <Field.Control />
 *     <Field.Error />
 *   </Field.Root>
 *   <button type="submit">Submit</button>
 * </Form.Root>
 *
 * @example
 * // With validation mode (onBlur, onChange, onSubmit)
 * <Form.Root validationMode="onBlur" onFormSubmit={handleSubmit}>
 *   <Field.Root name="email">
 *     <Field.Label>Email</Field.Label>
 *     <Field.Control type="email" required />
 *     <Field.Error match="valueMissing">Required</Field.Error>
 *     <Field.Error match="typeMismatch">Invalid email</Field.Error>
 *   </Field.Root>
 *   {/* Validation triggers when field loses focus */}
 *   <button type="submit">Submit</button>
 * </Form.Root>
 *
 * @example
 * // With Server Actions (Next.js)
 * import { useActionState } from "react";
 *
 * const [state, formAction] = useActionState(submitFormAction, {
 *   serverErrors: {}
 * });
 *
 * <Form.Root action={formAction} errors={state.serverErrors}>
 *   <Field.Root name="title">
 *     <Field.Label>Title</Field.Label>
 *     <Field.Control required />
 *     <Field.Error />
 *   </Field.Root>
 *   <button type="submit" disabled={state.pending}>
 *     {state.pending ? "Submitting..." : "Submit"}
 *   </button>
 * </Form.Root>
 *
 * @example
 * // Complex form with multiple field types
 * <Form.Root
 *   validationMode="onSubmit"
 *   onFormSubmit={async (values) => {
 *     // values: { name: string, email: string, age: number, plan: string }
 *     await saveUser(values);
 *   }}
 * >
 *   <Field.Root name="name">
 *     <Field.Label>Full Name</Field.Label>
 *     <Field.Control type="text" required minLength={2} />
 *     <Field.Error match="valueMissing">Name is required</Field.Error>
 *     <Field.Error match="tooShort">At least 2 characters</Field.Error>
 *   </Field.Root>
 *
 *   <Field.Root name="email">
 *     <Field.Label>Email</Field.Label>
 *     <Field.Control type="email" required />
 *     <Field.Error match="valueMissing">Email is required</Field.Error>
 *     <Field.Error match="typeMismatch">Invalid email format</Field.Error>
 *   </Field.Root>
 *
 *   <Field.Root name="age">
 *     <Field.Label>Age</Field.Label>
 *     <Field.Control type="number" min={18} max={120} required />
 *     <Field.Error match="rangeUnderflow">Must be 18+</Field.Error>
 *   </Field.Root>
 *
 *   <Fieldset.Root>
 *     <Fieldset.Legend>Plan</Fieldset.Legend>
 *     <Field.Root name="plan">
 *       <RadioGroup defaultValue="basic">
 *         <label>
 *           <Radio.Root value="basic">
 *             <Radio.Indicator />
 *           </Radio.Root>
 *           Basic
 *         </label>
 *         <label>
 *           <Radio.Root value="pro">
 *             <Radio.Indicator />
 *           </Radio.Root>
 *           Pro
 *         </label>
 *       </RadioGroup>
 *     </Field.Root>
 *   </Fieldset.Root>
 *
 *   <button type="submit">Create Account</button>
 * </Form.Root>
 *
 * @example
 * // With loading state
 * const [isSubmitting, setIsSubmitting] = useState(false);
 *
 * <Form.Root
 *   onFormSubmit={async (values) => {
 *     setIsSubmitting(true);
 *     try {
 *       await submitData(values);
 *     } finally {
 *       setIsSubmitting(false);
 *     }
 *   }}
 * >
 *   <Field.Root name="username">
 *     <Field.Label>Username</Field.Label>
 *     <Field.Control disabled={isSubmitting} />
 *   </Field.Root>
 *   <button type="submit" disabled={isSubmitting}>
 *     {isSubmitting ? "Submitting..." : "Submit"}
 *   </button>
 * </Form.Root>
 */

interface FormRootProps extends BaseForm.Root.Props {
  className?: string;
}

function FormRoot({ className = "", ...props }: FormRootProps) {
  return <BaseForm.Root className={`${styles.root} ${className}`} {...props} />;
}

export const Form = {
  Root: FormRoot,
};
