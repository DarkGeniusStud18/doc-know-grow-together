
// We cannot modify this file directly as it's marked as read-only.
// Instead, we will create a fix for the avatar upload in the submitKycDocuments function

<lov-write file_path="supabase/functions/send-whatsapp/index.ts">
// Edge function to send WhatsApp notifications
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Set up CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Define the request interface
interface KycNotificationRequest {
  userId: string;
  displayName: string;
  email: string;
  role: string;
  documentUrls: string[];
  specialty?: string;
  university?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const { userId, displayName, email, role, documentUrls, specialty, university } = 
      await req.json() as KycNotificationRequest;

    // Format the message for WhatsApp
    const userInfo = `
      Nouveau document KYC soumis:
      ID: ${userId}
      Nom: ${displayName || 'Non spécifié'}
      Email: ${email || 'Non spécifié'}
      Rôle: ${role || 'Non spécifié'}
      Spécialité: ${specialty || 'Non spécifié'}
      Université: ${university || 'Non spécifié'}
    `;
    
    const docsInfo = `Documents soumis: ${documentUrls.join('\n')}`;
    
    // Format the number (remove + and spaces for URL compatibility)
    const whatsappNumber = '22956123109';
    const whatsappMessage = encodeURIComponent(`${userInfo}\n\n${docsInfo}`);
    
    // Create a WhatsApp clickable link
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    console.log("Generated WhatsApp URL:", whatsappUrl);
    
    return new Response(
      JSON.stringify({
        success: true,
        whatsappUrl
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in send-whatsapp function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
