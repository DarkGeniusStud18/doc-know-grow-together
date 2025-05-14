
// Types for validation functions
export interface EmailCheckResponse {
  data: Array<{ email: string }> | null;
  error: Error | null;
}
