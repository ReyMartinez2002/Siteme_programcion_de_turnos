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
  identification?: string;
  store_id?: number | null;
  observation?: string | null;
}

export interface RiderCreate {
  full_name: string;
  active: boolean;
  rider_type: string;
  identification?: string;
  store_id?: number | null;
  observation?: string | null;
}

export interface ExternalBrand {
  id: number;
  name: string;
}

export interface ExternalBrandCreate {
  name: string;
}

export interface ScheduleAssignment {
  id: number;
  rider_id: number;
  store_id?: number | null;
  external_brand_id?: number | null;
  shift_date: string;
  shift_type: string;
  start_time?: string | null;
  end_time?: string | null;
  manual_override: boolean;
  notes?: string | null;
  rider?: Rider;
  store?: PanpayaStore;
  external_brand?: ExternalBrand;
}

export interface ScheduleAssignmentCreate {
  rider_id: number;
  store_id?: number | null;
  external_brand_id?: number | null;
  shift_date: string;
  shift_type: string;
  start_time?: string | null;
  end_time?: string | null;
  manual_override?: boolean;
  notes?: string | null;
}

export interface ScheduleAssignmentUpdate {
  store_id?: number | null;
  external_brand_id?: number | null;
  shift_type?: string;
  start_time?: string | null;
  end_time?: string | null;
  manual_override?: boolean;
  notes?: string | null;
}
