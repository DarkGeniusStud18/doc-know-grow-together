
/**
 * Type for enriched group messages with sender information
 */
export interface EnrichedGroupMessage {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  sender_name: string;
  sender_avatar?: string;
}

/**
 * Email check response type
 */
export interface EmailCheckResponse {
  exists: boolean;
  message?: string;
}
