import {FormInstance} from "antd";

type Rule = {
  required?: boolean;
  message?: string;
};

export type Option = {
  label: string;
  value: string | number | boolean;
  children?: Option[];
  title?: string;
};

export interface TreeNode {
  title: string;
  value: string;
  children?: TreeNode[];
}

export type SelectOption = {
  name: string;
  options: Option[];
};

type BaseField = {
  fieldType: string;
  placeholder?: string;
  allowClear?: boolean;
};

type InputField = BaseField & {
  fieldType: "input";
  type?: string;
};

type SelectField = BaseField & {
  fieldType: "select";
  mode?: "multiple" | "tags";
  maxCount?: number;
  options: Option[];
};

type RadioField = BaseField & {
  fieldType: "radio";
  options: Option[];
  isButton?: boolean;
  isFullWidth?: boolean;
};

type CheckboxField = BaseField & {
  fieldType: "checkbox";
  options: Option[];
  isButton?: boolean;
  isFullWidth?: boolean;
};

type DatePickerField = BaseField & {
  fieldType: "datePicker";
};

type EditorField = BaseField & {
  fieldType: "editor";
  content?: string;
};

type TextAreaField = BaseField & {
  fieldType: "textArea";
};

type TreeSelectField = BaseField & {
  fieldType: "treeSelect";
  placeholder?: string;
  options: TreeNode[];
};

export type Field =
  | InputField
  | SelectField
  | RadioField
  | CheckboxField
  | DatePickerField
  | EditorField
  | TextAreaField
  | TreeSelectField;

export type FormField = {
  name: string;
  label: string;
  rules?: Rule[];
  initialValue?: string | number | boolean | string[];
  dependencies?: string[];
  hidden?: (form: FormInstance) => boolean;
  field: Field;
};

export type FormFields = FormField[];
