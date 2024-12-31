import {AddressType} from "@/types/addressType";
import {getDistricts, getProvinces, getWards} from "@/utils/handleAddress";
import {Button, Form, FormInstance, Input, Select} from "antd";
import React, {useEffect, useState} from "react";

const AddAddressForm = ({
  form,
  onSubmit,
}: {
  form: FormInstance;
  onSubmit: (values: AddressType) => void;
}) => {
  const [selectedProvince, setSelectedProvince] = useState<string>();
  const [selectedDistrict, setSelectedDistrict] = useState<string>();
  const [districts, setDistricts] = useState<{label: string; value: string}[]>(
    []
  );
  const [wards, setWards] = useState<{label: string; value: string}[]>([]);

  useEffect(() => {
    if (selectedProvince) {
      setDistricts(getDistricts(selectedProvince) ?? []);
    }
    if (selectedDistrict) {
      setWards(getWards(selectedProvince ?? "", selectedDistrict) ?? []);
    }
  }, [selectedProvince, selectedDistrict]);

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onSubmit}
      style={{marginTop: 20}}
    >
      <Form.Item label="Receiver" name="receiver" rules={[{required: true}]}>
        <Input placeholder="Enter receiver name" />
      </Form.Item>
      <Form.Item label="Phone" name="phone" rules={[{required: true}]}>
        <Input placeholder="Enter phone number" />
      </Form.Item>
      <Form.Item
        label="Province/City"
        name="province"
        rules={[{required: true}]}
      >
        <Select
          options={getProvinces()}
          onChange={(value) => setSelectedProvince(value)}
          placeholder="Select province/city"
        />
      </Form.Item>
      <Form.Item label="District" name="district" rules={[{required: true}]}>
        <Select
          options={districts}
          onChange={(value) => setSelectedDistrict(value)}
          placeholder="Select district"
        />
      </Form.Item>
      <Form.Item label="Commune/Ward" name="ward" rules={[{required: true}]}>
        <Select options={wards} placeholder="Select commune/ward" />
      </Form.Item>
      <Form.Item label="Address" name="address" rules={[{required: true}]}>
        <Input placeholder="Enter address" />
      </Form.Item>
      <Form.Item label="Note (optional)" name="note">
        <Input.TextArea placeholder="Enter note" />
      </Form.Item>
      <Button type="primary" htmlType="submit" style={{width: "100%"}}>
        Add new address
      </Button>
    </Form>
  );
};

export default AddAddressForm;
