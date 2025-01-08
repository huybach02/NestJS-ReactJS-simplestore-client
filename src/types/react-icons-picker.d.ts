/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "react-icons-picker" {
  interface IconPickerProps {
    value?: string;
    onChange?: (value: string) => void;
    [key: string]: any;
  }

  const IconPicker: React.FC<IconPickerProps>;
  export default IconPicker;
}
