
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Upload KYC document to Supabase Storage
export const uploadKYCDocument = async (
  userId: string,
  file: File,
  documentType: string
): Promise<{ path: string | null; error: Error | null }> => {
  try {
    // Create a unique file path for this document
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}_${documentType}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload file to 'kyc_documents' bucket
    const { data, error } = await supabase.storage
      .from('kyc_documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Return the path to the uploaded file
    return { path: data?.path || null, error: null };
  } catch (error) {
    console.error('Error uploading KYC document:', error);
    return { path: null, error: error as Error };
  }
};

// Update user's KYC status and document references
export const updateKYCStatus = async (
  userId: string,
  documentUrls: { [key: string]: string },
  status = 'pending'
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    // First, get the user's profile to retrieve email
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (profileError) throw profileError;
    
    const userEmail = profileData.email || '';

    // Update KYC status in profiles table
    const { error } = await supabase
      .from('profiles')
      .update({
        kyc_status: status,
        kyc_documents: documentUrls,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
    
    // Attempt to send notification about the uploaded documents
    try {
      // In a real app, you would integrate with a notification service or webhook
      console.log(`KYC documents uploaded for user ${userId} (${userEmail}). Status: ${status}`);
      console.log("Document URLs:", documentUrls);
      
      // The WhatsApp notification would be handled by a backend service
      // For demonstration purposes, we'll just log this
      console.log(`WhatsApp notification would be sent to +229 56 12 31 09 about KYC submission from ${userEmail}`);
    } catch (notificationError) {
      console.error("Failed to send notification:", notificationError);
      // Continue with the flow even if notification fails
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating KYC status:', error);
    return { success: false, error: error as Error };
  }
};

// Get the current KYC status for a user
export const getKYCStatus = async (
  userId: string
): Promise<{ status: string | null; documents: any; error: Error | null }> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('kyc_status, kyc_documents')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return {
      status: data?.kyc_status || null,
      documents: data?.kyc_documents || {},
      error: null
    };
  } catch (error) {
    console.error('Error getting KYC status:', error);
    return { status: null, documents: {}, error: error as Error };
  }
};

// Verify a user's KYC (for admin use)
export const verifyKYC = async (
  userId: string,
  approved: boolean,
  notes?: string
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const status = approved ? 'approved' : 'rejected';
    
    const { error } = await supabase
      .from('profiles')
      .update({
        kyc_status: status,
        kyc_verification_notes: notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error) {
    console.error('Error verifying KYC:', error);
    return { success: false, error: error as Error };
  }
};
