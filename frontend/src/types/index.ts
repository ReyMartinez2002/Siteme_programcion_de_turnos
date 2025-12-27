export interface PanpayaStore {
  id: number;
  code: string;
  name: string;
  zone?: string;
  address?: string;
}

export interface PanpayaStoreCreate {
  code: string;
  name: string;
  zone?: string;
  address?: string;
}

export interface Rider {
  id: number;
  full_name: string;
  active: boolean;
  rider_type: string;
}

export interface RiderCreate {
  full_name: string;
  active: boolean;
  rider_type: string;
}
