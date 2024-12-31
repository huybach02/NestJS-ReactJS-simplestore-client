import dataAddress from "@/utils/address.json";

export const getProvinces = () => {
  return dataAddress.map((item) => ({
    label: item.name,
    value: item.name,
  }));
};

export const getDistricts = (provinceName: string) => {
  return dataAddress
    .find((item) => item.name === provinceName)
    ?.districts.map((item) => ({
      label: item.name,
      value: item.name,
    }));
};

export const getWards = (provinceName: string, districtName: string) => {
  return dataAddress
    .find((item) => item.name === provinceName)
    ?.districts.find((item) => item.name === districtName)
    ?.wards.map((item) => ({
      label: item.name,
      value: item.name,
    }));
};
