
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

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
    
    // Get the user email
    const userEmail = profileData.display_name || 'User';  // Fallback to "User" if email not available

    // Update KYC status in profiles table
    const { error } = await supabase
      .from('profiles')
      .update({
        kyc_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
    
    // Store document URLs in the kyc_documents table
    for (const [docType, docUrl] of Object.entries(documentUrls)) {
      const { error: docError } = await supabase
        .from('kyc_documents')
        .insert({
          user_id: userId,
          document_type: docType,
          document_url: docUrl,
          status: 'pending'
        });
        
      if (docError) {
        console.error(`Error saving document reference for ${docType}:`, docError);
      }
    }
    
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
    // Get the KYC status from profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('kyc_status')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;
    
    // Get the document references from kyc_documents table
    const { data: documents, error: docsError } = await supabase
      .from('kyc_documents')
      .select('*')
      .eq('user_id', userId);
      
    if (docsError) {
      console.error('Error fetching KYC documents:', docsError);
    }

    return {
      status: profileData?.kyc_status || null,
      documents: documents || [],
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

// Submit multiple KYC documents
export const submitKycDocuments = async (
  files: File[],
  userId: string
): Promise<boolean> => {
  try {
    if (!files.length) {
      toast.error('Veuillez importer au moins un document');
      return false;
    }

    const documentUrls: { [key: string]: string } = {};
    
    // Process each file
    for (const [index, file] of files.entries()) {
      const documentType = `document_${index + 1}`;
      
      // Upload the document
      const { path, error } = await uploadKYCDocument(userId, file, documentType);
      
      if (error || !path) {
        toast.error(`Erreur lors de l'envoi du document ${index + 1}`, {
          description: 'Veuillez réessayer.'
        });
        continue;
      }
      
      // Get the public URL for the uploaded file
      const { data } = await supabase.storage
        .from('kyc_documents')
        .getPublicUrl(path);
        
      if (data?.publicUrl) {
        documentUrls[documentType] = data.publicUrl;
      }
    }
    
    // Update the user's KYC status with document references
    const { success, error } = await updateKYCStatus(userId, documentUrls);
    
    if (error) {
      toast.error('Erreur lors de la mise à jour du statut KYC', {
        description: error.message
      });
      return false;
    }
    
    if (success) {
      toast.success('Documents soumis avec succès', {
        description: 'Nous examinerons vos documents sous peu.'
      });
      
      // Update user's KYC status in context if applicable
      // This would typically happen through a context refresh
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error submitting KYC documents:', error);
    toast.error('Erreur lors de la soumission des documents', {
      description: error instanceof Error ? error.message : 'Veuillez réessayer.'
    });
    return false;
  }
};
