/* eslint-disable @typescript-eslint/no-explicit-any */
import "axios";

declare module "axios" {
  export interface AxiosResponse<T = any> {
    success: boolean;
    data: T;
    total: number;
  }
}
