
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

export const submitKycDocuments = async (files: File[], userId: string): Promise<boolean> => {
  try {
    // Upload files to storage
    const uploadPromises = files.map(async (file) => {
      const filePath = `${userId}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('kyc_documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the URL
      const { data } = supabase.storage
        .from('kyc_documents')
        .getPublicUrl(filePath);
      
      // Insert document reference into kyc_documents table
      const { error: insertError } = await supabase
        .from('kyc_documents')
        .insert({
          user_id: userId,
          document_type: file.type,
          document_url: data.publicUrl
        });

      if (insertError) throw insertError;
    });
    
    await Promise.all(uploadPromises);
    
    // Update user KYC status
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ kyc_status: 'pending' })
      .eq('id', userId);
      
    if (updateError) throw updateError;
    
    toast.success("Documents soumis avec succès", {
      description: "Nous examinerons votre demande dans les 48h."
    });
    return true;
  } catch (error) {
    console.error("Error submitting KYC documents:", error);
    toast.error("Erreur lors de l'envoi des documents", {
      description: "Veuillez réessayer plus tard."
    });
    return false;
  }
};
