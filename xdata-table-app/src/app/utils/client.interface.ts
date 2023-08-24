export interface IClient {
  name: string;
  type: string;
  email: string;
  phoneNo: string;
  companyName: string;
  address: string;
  children: IClient[];
}

export type ClientTableKeys =
  | 'name'
  | 'type'
  | 'email'
  | 'phoneNo'
  | 'companyName'
  | 'address';
