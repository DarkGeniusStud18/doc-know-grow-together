
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ListMusic, Plus, PlusCircle } from 'lucide-react';
import { MusicTrack } from '@/types/music';
import { createPlaylist, getUserPlaylists, addTrackToPlaylist } from '@/models/Music';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface PlaylistManagerProps {
  currentTrack?: MusicTrack;
}

export const PlaylistManager: React.FC<PlaylistManagerProps> = ({ currentTrack }) => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<{id: string, name: string}[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const loadPlaylists = async () => {
      if (user) {
        setIsLoading(true);
        const userPlaylists = await getUserPlaylists(user.id);
        setPlaylists(userPlaylists);
        setIsLoading(false);
      }
    };

    loadPlaylists();
  }, [user]);

  const handleCreatePlaylist = async () => {
    if (!user || !newPlaylistName.trim()) return;
    
    try {
      setIsLoading(true);
      const playlist = await createPlaylist(newPlaylistName.trim(), user.id);
      
      if (playlist) {
        setPlaylists([...playlists, playlist]);
        setNewPlaylistName('');
        setIsCreatingPlaylist(false);
        toast.success("Playlist créée avec succès");
        
        // If there's a current track, add it to the new playlist
        if (currentTrack) {
          await addTrackToPlaylist(playlist.id, currentTrack.id, 0);
          toast.success(`"${currentTrack.title}" ajoutée à la playlist "${playlist.name}"`);
        }
      }
    } catch (error) {
      toast.error("Erreur lors de la création de la playlist");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToPlaylist = async (playlistId: string, playlistName: string) => {
    if (!currentTrack) return;
    
    try {
      setIsLoading(true);
      const success = await addTrackToPlaylist(playlistId, currentTrack.id, 0);
      
      if (success) {
        toast.success(`"${currentTrack.title}" ajoutée à la playlist "${playlistName}"`);
        setShowDialog(false);
      } else {
        toast.error("Erreur lors de l'ajout à la playlist");
      }
    } catch (error) {
      toast.error("Erreur lors de l'ajout à la playlist");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8" title="Ajouter à une playlist">
          <PlusCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter à une playlist</DialogTitle>
          {currentTrack && (
            <DialogDescription>
              Ajouter "{currentTrack.title}" à une playlist
            </DialogDescription>
          )}
        </DialogHeader>
        
        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-t-2 border-medical-blue rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {playlists.length > 0 && (
                <ScrollArea className="h-60">
                  <Accordion type="single" collapsible className="w-full">
                    {playlists.map((playlist) => (
                      <AccordionItem value={playlist.id} key={playlist.id}>
                        <div className="flex items-center justify-between">
                          <AccordionTrigger className="flex-grow">
                            {playlist.name}
                          </AccordionTrigger>
                          <Button
                            onClick={() => handleAddToPlaylist(playlist.id, playlist.name)}
                            variant="ghost"
                            size="sm"
                            className="mr-2"
                            disabled={isLoading}
                          >
                            <Plus className="h-4 w-4 mr-1" /> Ajouter
                          </Button>
                        </div>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </ScrollArea>
              )}
              
              {isCreatingPlaylist ? (
                <div className="flex items-center gap-2 mt-4">
                  <Input
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="Nom de la playlist"
                    className="flex-grow"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleCreatePlaylist}
                    disabled={!newPlaylistName.trim() || isLoading}
                    size="sm"
                  >
                    Créer
                  </Button>
                  <Button
                    onClick={() => setIsCreatingPlaylist(false)}
                    variant="outline"
                    size="sm"
                    disabled={isLoading}
                  >
                    Annuler
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsCreatingPlaylist(true)}
                  className="w-full mt-4"
                  variant="outline"
                  disabled={isLoading}
                >
                  <ListMusic className="h-4 w-4 mr-2" /> Nouvelle playlist
                </Button>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
