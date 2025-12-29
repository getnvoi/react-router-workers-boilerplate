import * as React from "react";
import { Fieldset as BaseFieldset } from "@base-ui/react/fieldset";
import styles from "./fieldset.module.css";

/**
 * Fieldset Component - Groups related form fields semantically
 *
 * @example
 * // Basic fieldset with legend
 * <Fieldset.Root>
 *   <Fieldset.Legend>Personal Information</Fieldset.Legend>
 *   <Field.Root name="firstName">
 *     <Field.Label>First Name</Field.Label>
 *     <Field.Control />
 *   </Field.Root>
 *   <Field.Root name="lastName">
 *     <Field.Label>Last Name</Field.Label>
 *     <Field.Control />
 *   </Field.Root>
 * </Fieldset.Root>
 *
 * @example
 * // Radio group in fieldset
 * <Fieldset.Root>
 *   <Fieldset.Legend>Subscription Plan</Fieldset.Legend>
 *   <RadioGroup defaultValue="basic">
 *     <label>
 *       <Radio.Root value="basic">
 *         <Radio.Indicator />
 *       </Radio.Root>
 *       Basic Plan - $9/month
 *     </label>
 *     <label>
 *       <Radio.Root value="pro">
 *         <Radio.Indicator />
 *       </Radio.Root>
 *       Pro Plan - $29/month
 *     </label>
 *     <label>
 *       <Radio.Root value="enterprise">
 *         <Radio.Indicator />
 *       </Radio.Root>
 *       Enterprise - Contact us
 *     </label>
 *   </RadioGroup>
 * </Fieldset.Root>
 *
 * @example
 * // Address form group
 * <Fieldset.Root>
 *   <Fieldset.Legend>Shipping Address</Fieldset.Legend>
 *   <Field.Root name="street">
 *     <Field.Label>Street Address</Field.Label>
 *     <Field.Control required />
 *     <Field.Error match="valueMissing">Street is required</Field.Error>
 *   </Field.Root>
 *   <div className={styles.row}>
 *     <Field.Root name="city">
 *       <Field.Label>City</Field.Label>
 *       <Field.Control required />
 *     </Field.Root>
 *     <Field.Root name="state">
 *       <Field.Label>State</Field.Label>
 *       <Field.Control required />
 *     </Field.Root>
 *     <Field.Root name="zip">
 *       <Field.Label>ZIP Code</Field.Label>
 *       <Field.Control type="text" pattern="[0-9]{5}" required />
 *     </Field.Root>
 *   </div>
 * </Fieldset.Root>
 *
 * @example
 * // Multiple checkbox group
 * <Fieldset.Root>
 *   <Fieldset.Legend>Interests</Fieldset.Legend>
 *   <label>
 *     <Checkbox name="interest-tech" value="tech" />
 *     Technology
 *   </label>
 *   <label>
 *     <Checkbox name="interest-design" value="design" />
 *     Design
 *   </label>
 *   <label>
 *     <Checkbox name="interest-business" value="business" />
 *     Business
 *   </label>
 * </Fieldset.Root>
 *
 * @example
 * // Nested fieldsets for complex forms
 * <Form.Root onFormSubmit={handleSubmit}>
 *   <Fieldset.Root>
 *     <Fieldset.Legend>Account Details</Fieldset.Legend>
 *     <Field.Root name="email">
 *       <Field.Label>Email</Field.Label>
 *       <Field.Control type="email" />
 *     </Field.Root>
 *     <Field.Root name="password">
 *       <Field.Label>Password</Field.Label>
 *       <Field.Control type="password" />
 *     </Field.Root>
 *   </Fieldset.Root>
 *
 *   <Fieldset.Root>
 *     <Fieldset.Legend>Profile</Fieldset.Legend>
 *     <Field.Root name="displayName">
 *       <Field.Label>Display Name</Field.Label>
 *       <Field.Control />
 *     </Field.Root>
 *     <Field.Root name="bio">
 *       <Field.Label>Bio</Field.Label>
 *       <Field.Control render={(props) => <textarea {...props} rows={4} />} />
 *     </Field.Root>
 *   </Fieldset.Root>
 *
 *   <button type="submit">Create Account</button>
 * </Form.Root>
 *
 * @example
 * // With conditional styling
 * <Fieldset.Root
 *   className={({ disabled }) =>
 *     disabled ? styles.fieldsetDisabled : styles.fieldset
 *   }
 * >
 *   <Fieldset.Legend>Payment Method</Fieldset.Legend>
 *   {/* fields */}
 * </Fieldset.Root>
 *
 * @example
 * // With Field.Root for validation
 * <Field.Root name="paymentMethod">
 *   <Fieldset.Root>
 *     <Fieldset.Legend>Payment Method</Fieldset.Legend>
 *     <RadioGroup>
 *       <label>
 *         <Radio.Root value="card">
 *           <Radio.Indicator />
 *         </Radio.Root>
 *         Credit Card
 *       </label>
 *       <label>
 *         <Radio.Root value="paypal">
 *           <Radio.Indicator />
 *         </Radio.Root>
 *         PayPal
 *       </label>
 *     </RadioGroup>
 *   </Fieldset.Root>
 *   <Field.Error match="valueMissing">Please select a payment method</Field.Error>
 * </Field.Root>
 */

interface FieldsetRootProps extends BaseFieldset.Root.Props {
  className?: string;
}

function FieldsetRoot({ className = "", ...props }: FieldsetRootProps) {
  return (
    <BaseFieldset.Root className={`${styles.root} ${className}`} {...props} />
  );
}

interface FieldsetLegendProps extends BaseFieldset.Legend.Props {
  className?: string;
}

function FieldsetLegend({ className = "", ...props }: FieldsetLegendProps) {
  return (
    <BaseFieldset.Legend className={`${styles.legend} ${className}`} {...props} />
  );
}

export const Fieldset = {
  Root: FieldsetRoot,
  Legend: FieldsetLegend,
};
