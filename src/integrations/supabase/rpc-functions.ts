/* eslint-disable @typescript-eslint/no-explicit-any */

import { supabase } from './client';

// Define typed interfaces for RPC parameters
interface SqlRpcParams {
  sql_query: string;
}

export const createGroupMessageRpcFunctions = async () => {
  // Function to get all messages for a group
  try {
    await supabase.rpc('create_get_group_messages_function' as any, {
      sql_query: `
        CREATE OR REPLACE FUNCTION get_group_messages(p_group_id UUID)
        RETURNS SETOF group_messages
        LANGUAGE SQL
        SECURITY DEFINER
        AS $$
          SELECT * FROM group_messages WHERE group_id = p_group_id;
        $$;
      ` 
    } as SqlRpcParams);
  } catch (error) {
    console.error("Error creating get_group_messages function:", error);
  }

  // Function to insert a new message
  try {
    await supabase.rpc('create_insert_group_message_function' as any, {
      sql_query: `
        CREATE OR REPLACE FUNCTION insert_group_message(
          p_content TEXT,
          p_user_id UUID,
          p_group_id UUID
        )
        RETURNS UUID
        LANGUAGE PLPGSQL
        SECURITY DEFINER
        AS $$
        DECLARE
          v_message_id UUID;
        BEGIN
          INSERT INTO group_messages (content, user_id, group_id)
          VALUES (p_content, p_user_id, p_group_id)
          RETURNING id INTO v_message_id;
          
          RETURN v_message_id;
        END;
        $$;
      `
    } as SqlRpcParams);
  } catch (error) {
    console.error("Error creating insert_group_message function:", error);
  }

  // Function to update a message
  try {
    await supabase.rpc('create_update_group_message_function' as any, {
      sql_query: `
        CREATE OR REPLACE FUNCTION update_group_message(
          p_message_id UUID,
          p_content TEXT,
          p_user_id UUID
        )
        RETURNS BOOLEAN
        LANGUAGE PLPGSQL
        SECURITY DEFINER
        AS $$
        BEGIN
          UPDATE group_messages
          SET 
            content = p_content,
            updated_at = now()
          WHERE 
            id = p_message_id
            AND user_id = p_user_id;
          
          RETURN FOUND;
        END;
        $$;
      `
    } as SqlRpcParams);
  } catch (error) {
    console.error("Error creating update_group_message function:", error);
  }

  // Function to delete a message
  try {
    await supabase.rpc('create_delete_group_message_function' as any, {
      sql_query: `
        CREATE OR REPLACE FUNCTION delete_group_message(
          p_message_id UUID,
          p_user_id UUID
        )
        RETURNS BOOLEAN
        LANGUAGE PLPGSQL
        SECURITY DEFINER
        AS $$
        DECLARE
          v_is_admin BOOLEAN;
        BEGIN
          -- Check if user is an admin or moderator
          SELECT EXISTS (
            SELECT 1 FROM study_group_members sgm
            JOIN group_messages gm ON sgm.group_id = gm.group_id
            WHERE gm.id = p_message_id
              AND sgm.user_id = p_user_id
              AND sgm.role IN ('admin', 'moderator')
          ) INTO v_is_admin;
          
          -- Delete if owner or admin/moderator
          DELETE FROM group_messages
          WHERE 
            id = p_message_id
            AND (user_id = p_user_id OR v_is_admin = true);
          
          RETURN FOUND;
        END;
        $$;
      `
    } as SqlRpcParams);
  } catch (error) {
    console.error("Error creating delete_group_message function:", error);
  }
};
