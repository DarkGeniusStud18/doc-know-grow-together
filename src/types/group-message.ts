
// Define the group message types
export interface GroupMessage {
  id: string;
  group_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface EnrichedGroupMessage extends GroupMessage {
  sender_name: string;
  sender_avatar: string;
}

export interface GroupMessageInsert {
  group_id: string;
  user_id: string;
  content: string;
}
