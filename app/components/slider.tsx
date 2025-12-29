import * as React from "react";
import { Slider as BaseSlider } from "@base-ui/react/slider";
import styles from "./slider.module.css";

/**
 * Slider Component - Range slider for numeric value selection
 *
 * @example
 * // Basic slider (uncontrolled)
 * <Slider defaultValue={50} />
 *
 * @example
 * // Controlled slider
 * const [volume, setVolume] = useState(75);
 * <Slider value={volume} onValueChange={setVolume} />
 *
 * @example
 * // With min, max, and step
 * <Slider min={0} max={100} step={5} defaultValue={50} />
 *
 * @example
 * // With label and value display
 * const [price, setPrice] = useState(500);
 *
 * <div>
 *   <label>Price: ${price}</label>
 *   <Slider
 *     min={0}
 *     max={1000}
 *     step={50}
 *     value={price}
 *     onValueChange={setPrice}
 *   />
 * </div>
 *
 * @example
 * // Range slider (two thumbs)
 * const [range, setRange] = useState([20, 80]);
 *
 * <Slider
 *   value={range}
 *   onValueChange={setRange}
 *   min={0}
 *   max={100}
 * />
 *
 * @example
 * // In a form with Field
 * <Form.Root onFormSubmit={(values) => {
 *   console.log(values.volume); // Number value
 * }}>
 *   <Field.Root name="volume">
 *     <Field.Label>Volume</Field.Label>
 *     <Slider min={0} max={100} defaultValue={50} />
 *     <Field.Description>Adjust the volume level</Field.Description>
 *   </Field.Root>
 *   <button type="submit">Save</button>
 * </Form.Root>
 *
 * @example
 * // Disabled slider
 * <Slider disabled defaultValue={50} />
 *
 * @example
 * // Vertical slider
 * <Slider orientation="vertical" defaultValue={50} className={styles.vertical} />
 *
 * @example
 * // Price range filter
 * const [priceRange, setPriceRange] = useState([100, 500]);
 *
 * <div>
 *   <label>Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
 *   <Slider
 *     value={priceRange}
 *     onValueChange={setPriceRange}
 *     min={0}
 *     max={1000}
 *     step={10}
 *   />
 * </div>
 *
 * @example
 * // With input field sync
 * const [age, setAge] = useState(25);
 *
 * <div>
 *   <label>
 *     Age:{" "}
 *     <input
 *       type="number"
 *       value={age}
 *       onChange={(e) => setAge(Number(e.target.value))}
 *       min={18}
 *       max={100}
 *     />
 *   </label>
 *   <Slider value={age} onValueChange={setAge} min={18} max={100} />
 * </div>
 *
 * @example
 * // With aria-label for accessibility
 * <Slider
 *   aria-label="Volume control"
 *   min={0}
 *   max={100}
 *   defaultValue={50}
 * />
 *
 * @example
 * // Number field with slider
 * <Field.Root name="temperature">
 *   <Field.Label>Temperature (°C)</Field.Label>
 *   <Slider min={-10} max={40} step={0.5} defaultValue={20} />
 *   <Field.Description>Set your preferred temperature</Field.Description>
 * </Field.Root>
 */

interface SliderProps extends Omit<BaseSlider.Root.Props, "className"> {
  className?: string;
  trackClassName?: string;
  indicatorClassName?: string;
  thumbClassName?: string;
}

export function Slider({
  className = "",
  trackClassName = "",
  indicatorClassName = "",
  thumbClassName = "",
  value,
  ...props
}: SliderProps) {
  // Determine if range slider (array value with length > 1)
  const isRange = Array.isArray(value) && value.length > 1;

  return (
    <BaseSlider.Root
      className={`${styles.root} ${className}`}
      value={value}
      {...props}
    >
      <BaseSlider.Track className={`${styles.track} ${trackClassName}`}>
        <BaseSlider.Indicator
          className={`${styles.indicator} ${indicatorClassName}`}
        />
        <BaseSlider.Thumb className={`${styles.thumb} ${thumbClassName}`} />
        {isRange && (
          <BaseSlider.Thumb className={`${styles.thumb} ${thumbClassName}`} />
        )}
      </BaseSlider.Track>
    </BaseSlider.Root>
  );
}
