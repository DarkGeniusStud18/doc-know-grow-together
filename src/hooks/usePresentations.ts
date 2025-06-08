
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { presentationService } from '@/lib/database/presentations';
import { Presentation, PresentationSlide } from '@/types/database';
import { toast } from 'sonner';

export const usePresentations = () => {
  const { user } = useAuth();
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPresentations = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const data = await presentationService.getPresentations(user.id);
      setPresentations(data);
    } catch (error) {
      console.error('Error loading presentations:', error);
      toast.error('Erreur lors du chargement des présentations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPresentations();
  }, [user]);

  const createPresentation = async (presentation: Omit<Presentation, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const newPresentation = await presentationService.createPresentation({ ...presentation, user_id: user.id });
      setPresentations(prev => [newPresentation, ...prev]);
      toast.success('Présentation créée avec succès');
      return newPresentation;
    } catch (error) {
      console.error('Error creating presentation:', error);
      toast.error('Erreur lors de la création de la présentation');
    }
  };

  const updatePresentation = async (id: string, updates: Partial<Presentation>) => {
    try {
      const updatedPresentation = await presentationService.updatePresentation(id, updates);
      setPresentations(prev => prev.map(p => p.id === id ? updatedPresentation : p));
      toast.success('Présentation mise à jour');
      return updatedPresentation;
    } catch (error) {
      console.error('Error updating presentation:', error);
      toast.error('Erreur lors de la mise à jour de la présentation');
    }
  };

  const deletePresentation = async (id: string) => {
    try {
      await presentationService.deletePresentation(id);
      setPresentations(prev => prev.filter(p => p.id !== id));
      toast.success('Présentation supprimée');
    } catch (error) {
      console.error('Error deleting presentation:', error);
      toast.error('Erreur lors de la suppression de la présentation');
    }
  };

  return {
    presentations,
    isLoading,
    createPresentation,
    updatePresentation,
    deletePresentation,
    refreshPresentations: loadPresentations
  };
};

export const usePresentationSlides = (presentationId: string) => {
  const { user } = useAuth();
  const [slides, setSlides] = useState<PresentationSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadSlides = async () => {
    if (!presentationId) return;
    
    try {
      setIsLoading(true);
      const data = await presentationService.getPresentationSlides(presentationId);
      setSlides(data);
    } catch (error) {
      console.error('Error loading slides:', error);
      toast.error('Erreur lors du chargement des diapositives');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSlides();
  }, [presentationId]);

  const createSlide = async (slide: Omit<PresentationSlide, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const newSlide = await presentationService.createSlide({ ...slide, user_id: user.id });
      setSlides(prev => [...prev, newSlide].sort((a, b) => a.slide_order - b.slide_order));
      toast.success('Diapositive créée avec succès');
      return newSlide;
    } catch (error) {
      console.error('Error creating slide:', error);
      toast.error('Erreur lors de la création de la diapositive');
    }
  };

  const updateSlide = async (id: string, updates: Partial<PresentationSlide>) => {
    try {
      const updatedSlide = await presentationService.updateSlide(id, updates);
      setSlides(prev => prev.map(s => s.id === id ? updatedSlide : s));
      toast.success('Diapositive mise à jour');
      return updatedSlide;
    } catch (error) {
      console.error('Error updating slide:', error);
      toast.error('Erreur lors de la mise à jour de la diapositive');
    }
  };

  const deleteSlide = async (id: string) => {
    try {
      await presentationService.deleteSlide(id);
      setSlides(prev => prev.filter(s => s.id !== id));
      toast.success('Diapositive supprimée');
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast.error('Erreur lors de la suppression de la diapositive');
    }
  };

  return {
    slides,
    isLoading,
    createSlide,
    updateSlide,
    deleteSlide,
    refreshSlides: loadSlides
  };
};
