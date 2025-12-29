import * as React from "react";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import styles from "./radio.module.css";

/**
 * Radio Component - Radio button group for single selection
 *
 * @example
 * // Simple mode - with options array
 * <RadioGroup
 *   name="plan"
 *   value={selectedPlan}
 *   onValueChange={setSelectedPlan}
 *   options={[
 *     { value: "basic", label: "Basic Plan" },
 *     { value: "pro", label: "Pro Plan" },
 *     { value: "enterprise", label: "Enterprise Plan" }
 *   ]}
 * />
 *
 * @example
 * // Flexible mode - with children (custom layouts)
 * <RadioGroup name="plan" value={selectedPlan} onValueChange={setSelectedPlan}>
 *   <label>
 *     <Radio value="basic" />
 *     Basic - $9/month
 *   </label>
 *   <label>
 *     <Radio value="pro" />
 *     Pro - $29/month
 *   </label>
 * </RadioGroup>
 *
 * @example
 * // Simple mode - with disabled options
 * <RadioGroup
 *   defaultValue="option1"
 *   options={[
 *     { value: "option1", label: "Available" },
 *     { value: "option2", label: "Disabled", disabled: true }
 *   ]}
 * />
 *
 * @example
 * // Flexible mode - with descriptions and icons
 * <RadioGroup name="tier">
 *   <div className={styles.option}>
 *     <label>
 *       <Radio value="free" />
 *       <div>
 *         <div className={styles.optionTitle}>
 *           <StarIcon /> Free
 *         </div>
 *         <div className={styles.optionDesc}>Perfect for trying out</div>
 *       </div>
 *     </label>
 *   </div>
 *   <div className={styles.option}>
 *     <label>
 *       <Radio value="pro" />
 *       <div>
 *         <div className={styles.optionTitle}>
 *           <CrownIcon /> Pro - $29/mo
 *         </div>
 *         <div className={styles.optionDesc}>For professionals</div>
 *       </div>
 *     </label>
 *   </div>
 * </RadioGroup>
 *
 * @example
 * // Simple mode - in a form
 * <Form.Root onFormSubmit={(values) => console.log(values.paymentMethod)}>
 *   <Field.Root name="paymentMethod">
 *     <Fieldset.Root>
 *       <Fieldset.Legend>Payment Method</Fieldset.Legend>
 *       <RadioGroup
 *         required
 *         options={[
 *           { value: "card", label: "Credit Card" },
 *           { value: "paypal", label: "PayPal" }
 *         ]}
 *       />
 *     </Fieldset.Root>
 *     <Field.Error match="valueMissing">Select a payment method</Field.Error>
 *   </Field.Root>
 * </Form.Root>
 *
 * @example
 * // Flexible mode - custom indicator content
 * import { CheckCircle2 } from "lucide-react";
 *
 * <RadioGroup defaultValue="option1">
 *   <label>
 *     <Radio value="option1" indicatorContent={<CheckCircle2 size={16} />} />
 *     Custom icon option
 *   </label>
 * </RadioGroup>
 */

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioGroupProps extends BaseRadioGroup.Root.Props {
  className?: string;
  options?: RadioOption[];
  children?: React.ReactNode;
}

export function RadioGroup({
  className = "",
  options,
  children,
  ...props
}: RadioGroupProps) {
  return (
    <BaseRadioGroup.Root
      className={`${styles.group} ${className}`}
      {...props}
    >
      {options
        ? options.map((option) => (
            <label key={option.value} className={styles.label}>
              <Radio value={option.value} disabled={option.disabled} />
              {option.label}
            </label>
          ))
        : children}
    </BaseRadioGroup.Root>
  );
}

interface RadioProps extends BaseRadioGroup.Item.Props {
  className?: string;
  indicatorClassName?: string;
  indicatorContent?: React.ReactNode;
}

export function Radio({
  className = "",
  indicatorClassName = "",
  indicatorContent,
  ...props
}: RadioProps) {
  return (
    <BaseRadioGroup.Item className={`${styles.root} ${className}`} {...props}>
      <BaseRadioGroup.Indicator
        className={`${styles.indicator} ${indicatorClassName}`}
      >
        {indicatorContent}
      </BaseRadioGroup.Indicator>
    </BaseRadioGroup.Item>
  );
}
