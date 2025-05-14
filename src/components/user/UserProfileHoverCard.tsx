
import React from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Calendar, Briefcase, GraduationCap } from 'lucide-react';

interface UserProfileHoverCardProps {
  userId: string;
  userName: string;
  userAvatar?: string | null;
  userRole?: string;
  specialty?: string;
  university?: string;
  children: React.ReactNode;
}

const UserProfileHoverCard: React.FC<UserProfileHoverCardProps> = ({
  userId,
  userName,
  userAvatar,
  userRole,
  specialty,
  university,
  children
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="cursor-pointer">
          {children}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={userAvatar || undefined} />
            <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="space-y-1 flex-1">
            <h4 className="text-sm font-semibold">{userName}</h4>
            {userRole && (
              <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
            )}
            <div className="flex items-center pt-1">
              <Button variant="outline" size="sm" asChild className="text-xs">
                <Link to={`/profile/${userId}`}>Voir le profil</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {(specialty || university) && (
          <div className="mt-3 space-y-2">
            {specialty && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Briefcase className="mr-2 h-3 w-3" />
                <span>Spécialité: {specialty}</span>
              </div>
            )}
            {university && (
              <div className="flex items-center text-xs text-muted-foreground">
                <GraduationCap className="mr-2 h-3 w-3" />
                <span>Université: {university}</span>
              </div>
            )}
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default UserProfileHoverCard;
