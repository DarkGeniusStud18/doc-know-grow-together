
// Types for validation functions
export interface EmailCheckResponse {
  data: { email: string }[] | null;
  error: Error | null;
}
