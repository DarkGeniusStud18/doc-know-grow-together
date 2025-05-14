
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

export const submitKycDocuments = async (files: File[], userId: string): Promise<boolean> => {
  try {
    // Get user details to send in WhatsApp notification
    const { data: userDetails, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (userError) {
      console.error("Error fetching user details:", userError);
      throw userError;
    }

    // Upload files to storage
    const uploadPromises = files.map(async (file) => {
      const filePath = `${userId}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('kyc_documents')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        throw uploadError;
      }

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
      
      return data.publicUrl;
    });
    
    const uploadedUrls = await Promise.all(uploadPromises);
    
    // Update user KYC status
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ kyc_status: 'pending' })
      .eq('id', userId);
      
    if (updateError) throw updateError;
    
    // Send WhatsApp notification with user details and document URLs
    try {
      await supabase.functions.invoke('send-whatsapp', {
        body: {
          userId,
          displayName: userDetails.display_name,
          email: userDetails.email,
          role: userDetails.role,
          specialty: userDetails.specialty,
          university: userDetails.university,
          documentUrls: uploadedUrls
        }
      });
      console.log("WhatsApp notification triggered");
    } catch (whatsappError) {
      console.error("Error sending WhatsApp notification:", whatsappError);
      // Continue even if WhatsApp notification fails
    }
    
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
