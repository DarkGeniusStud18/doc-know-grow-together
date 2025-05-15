
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

// Types pour la vérification KYC
type KYCStatus = 'not_submitted' | 'pending' | 'verified' | 'rejected';
type DocumentType = 'id_card' | 'passport' | 'student_card' | 'medical_license';

interface KYCDocument {
  id: string;
  user_id: string;
  document_type: DocumentType;
  document_url: string;
  status: KYCStatus;
  created_at: string;
  processed_at: string | null;
}

/**
 * Soumet des documents pour la vérification KYC
 * @param files Files à télécharger
 * @param userId ID de l'utilisateur
 * @param documentType Type de document par défaut
 * @returns Succès ou échec de la soumission
 */
export async function submitKycDocuments(
  files: File[],
  userId: string,
  documentType: DocumentType = 'id_card'
): Promise<boolean> {
  try {
    // Traiter chaque fichier
    for (const file of files) {
      // 1. Télécharger le document dans le stockage
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/kyc/${documentType}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('kyc_documents')
        .upload(filePath, file);
        
      if (uploadError) throw new Error(`Erreur de téléchargement: ${uploadError.message}`);
      
      // 2. Obtenir l'URL publique du document
      const { data: urlData } = supabase.storage
        .from('kyc_documents')
        .getPublicUrl(filePath);
        
      if (!urlData || !urlData.publicUrl) throw new Error('Impossible d\'obtenir l\'URL du document');
      
      // 3. Enregistrer les informations du document dans la base de données
      const { error: dbError } = await supabase
        .from('kyc_documents')
        .insert({
          user_id: userId,
          document_type: documentType,
          document_url: urlData.publicUrl,
          status: 'pending'
        });
        
      if (dbError) throw new Error(`Erreur de base de données: ${dbError.message}`);
    }
    
    // 4. Mettre à jour le statut KYC de l'utilisateur
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ kyc_status: 'pending' })
      .eq('id', userId);
      
    if (profileError) throw new Error(`Erreur de profil: ${profileError.message}`);
    
    toast.success('Document(s) soumis avec succès', {
      description: 'Vos documents sont en cours de vérification. Vous serez notifié une fois le processus terminé.'
    });
    
    return true;
  } catch (error: any) {
    console.error('Erreur de vérification KYC:', error);
    toast.error('Échec de la soumission du document', {
      description: error.message || 'Veuillez réessayer ultérieurement.'
    });
    return false;
  }
}

/**
 * Récupère le statut KYC actuel de l'utilisateur
 * @param userId ID de l'utilisateur
 * @returns Statut KYC
 */
export async function getKycStatus(userId: string): Promise<KYCStatus> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('kyc_status')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data.kyc_status as KYCStatus;
  } catch (error) {
    console.error('Erreur lors de la récupération du statut KYC:', error);
    return 'not_submitted';
  }
}

/**
 * Récupère les documents KYC soumis par l'utilisateur
 * @param userId ID de l'utilisateur
 * @returns Liste des documents soumis
 */
export async function getSubmittedDocuments(userId: string): Promise<KYCDocument[]> {
  try {
    const { data, error } = await supabase
      .from('kyc_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as KYCDocument[];
  } catch (error) {
    console.error('Erreur lors de la récupération des documents:', error);
    return [];
  }
}
