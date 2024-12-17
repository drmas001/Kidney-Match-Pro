export interface Database {
  public: {
    Tables: {
      donors: {
        Row: {
          id: string;
          created_at: string;
          mrn: string;
          national_id: string;
          full_name: string;
          age: number;
          blood_type: string;
          mobile_number: string;
          hla_typing: {
            hla_a: string;
            hla_b: string;
            hla_c: string;
            hla_dr: string;
            hla_dq: string;
            hla_dp: string;
          };
          high_res_typing: string;
          donor_antibodies: string;
          antigen_mismatch: number;
          crossmatch_result: string;
          serum_creatinine: number;
          egfr: number;
          blood_pressure: string;
          viral_screening: string;
          cmv_status: string;
          medical_conditions: string;
          notes: string;
          status: 'Available' | 'Utilized';
        };
        Insert: Omit<Database['public']['Tables']['donors']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['donors']['Insert']>;
      };
      recipients: {
        Row: {
          id: string;
          created_at: string;
          mrn: string;
          national_id: string;
          full_name: string;
          age: number;
          blood_type: string;
          mobile_number: string;
          hla_typing: {
            hla_a: string;
            hla_b: string;
            hla_c: string;
            hla_dr: string;
            hla_dq: string;
            hla_dp: string;
          };
          preferred_matches: string;
          pra: number;
          crossmatch_requirement: string;
          donor_antibodies: string;
          serum_creatinine: number;
          egfr: number;
          blood_pressure: string;
          viral_screening: string;
          cmv_status: string;
          medical_history: string;
          notes: string;
          unacceptable_antigens: string;
        };
        Insert: Omit<Database['public']['Tables']['recipients']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['recipients']['Insert']>;
      };
      employees: {
        Row: {
          id: string;
          created_at: string;
          full_name: string;
          role: 'Doctor' | 'Nurse' | 'Administrator';
          employee_code: string;
        };
        Insert: Omit<Database['public']['Tables']['employees']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['employees']['Insert']>;
      };
      matching_results: {
        Row: {
          id: string;
          created_at: string;
          recipient_id: string;
          donor_id: string;
          compatibility_score: number;
          match_details: {
            blood_type_match: boolean;
            hla_matches: number;
            crossmatch_compatible: boolean;
          };
          status: 'Pending' | 'Approved' | 'Rejected';
        };
        Insert: Omit<Database['public']['Tables']['matching_results']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['matching_results']['Insert']>;
      };
    };
  };
}