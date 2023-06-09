import { ColorFieldInput } from "./ui";
import { ReactElement } from "react";

export type BasicFormField<
  ParsedValue extends {} | null,
  ValidatedValue extends ParsedValue = ParsedValue,
  ReaderValue = ValidatedValue
> = {
  kind: "form";
  formKind?: undefined;
  Input(props: FormFieldInputProps<ParsedValue>): ReactElement | null;
  defaultValue(): ParsedValue;
  parse(value: FormFieldStoredValue): ParsedValue;
  /**
   * If undefined is returned, the field will generally not be written,
   * except in array fields where it will be stored as null
   */
  serialize(value: ParsedValue): { value: FormFieldStoredValue };
  validate(value: ParsedValue): ValidatedValue;
  reader: {
    parse(value: FormFieldStoredValue): ReaderValue;
  };
};

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | readonly JsonValue[]
  | { [key: string]: JsonValue };

type JsonValueWithoutNull = JsonValue & {};

export type FormFieldStoredValue = JsonValueWithoutNull | undefined;

export type FormFieldInputProps<Value> = {
  value: Value;
  onChange(value: Value): void;
  autoFocus: boolean;
  /**
   * This will be true when validate has returned false and the user has attempted to close the form
   * or when the form is open and they attempt to save the item
   */
  forceValidation: boolean;
};

export function basicFormFieldWithSimpleReaderParse<
  ParsedValue extends {} | null,
  ValidatedValue extends ParsedValue
>(config: {
  Input(props: FormFieldInputProps<ParsedValue>): ReactElement | null;
  defaultValue(): ParsedValue;
  parse(value: FormFieldStoredValue): ParsedValue;
  /**
   * If undefined is returned, the field will generally not be written,
   * except in array fields where it will be stored as null
   */
  serialize(value: ParsedValue): { value: FormFieldStoredValue };
  validate(value: ParsedValue): ValidatedValue;
}): BasicFormField<ParsedValue, ValidatedValue, ValidatedValue> {
  return {
    kind: "form",
    Input: config.Input,
    defaultValue: config.defaultValue,
    parse: config.parse,
    serialize: config.serialize,
    validate: config.validate,
    reader: {
      parse(value) {
        return config.validate(config.parse(value));
      },
    },
  };
}

const validateField = (validation: any, vaule: any, label: any) => {
  return undefined;
};

export function field({
  label,
  defaultValue = "#000000",
  validation,
  description,
}: any) {
  return basicFormFieldWithSimpleReaderParse({
    Input(props) {
      return (
        <ColorFieldInput
          label={label}
          description={description}
          validation={validation}
          {...props}
        />
      );
    },
    defaultValue() {
      return defaultValue ?? null;
    },
    parse(value) {
      if (value === undefined) {
        return null;
      }
      if (typeof value === "string") {
        return value;
      }
      throw new Error("Must be a hex color");
    },
    validate(value) {
      const message = validateField(validation, value, label);
      if (message !== undefined) {
        throw new Error(message);
      }
      return value;
    },
    serialize(value) {
      return { value: value === null ? "#000000": value };
    },
  });
}
