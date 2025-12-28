"use client";
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, XCircle, MapPin, Briefcase, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoterCardProps {
  voter: {
    id: number;
    name: string;
    image: string;
    address: string;
    position: string;
    hasVoted: boolean;
  };
}

export default function VoterCard({ voter }: VoterCardProps) {
  const { id, name, image, address, position, hasVoted } = voter;

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm hover:from-card/70 hover:to-card/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Voting status indicator */}
      <div className="absolute top-3 right-3 z-10">
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg transition-all duration-300",
          hasVoted 
            ? "bg-gradient-to-br from-green-400/20 to-green-600/20 border-green-500/30" 
            : "bg-gradient-to-br from-gray-300/20 to-gray-500/20 border-gray-400/30"
        )}>
          {hasVoted ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      <CardHeader className="relative pb-2">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-16 w-16 ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-300">
              <AvatarImage src={image} alt={name} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-semibold">
                {name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
              <span className="text-xs text-primary-foreground font-bold">#{id}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-300">
              {name}
            </h3>
            <div className="flex items-center space-x-3 mt-1 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Briefcase className="h-3 w-3" />
                <span>{position}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="font-mono">{truncateAddress(address)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge 
              variant={hasVoted ? "default" : "secondary"}
              className={cn(
                "transition-all duration-300",
                hasVoted 
                  ? "bg-gradient-to-r from-green-500/90 to-green-600/90 text-white hover:from-green-500 hover:to-green-600 shadow-lg" 
                  : "bg-gradient-to-r from-gray-400/20 to-gray-500/20 text-gray-600 hover:from-gray-400/30 hover:to-gray-500/30"
              )}
            >
              <User className="h-3 w-3 mr-1" />
              {hasVoted ? 'Voted' : 'Not Voted'}
            </Badge>
            
            <div className="text-right">
              <div className="text-sm font-medium text-muted-foreground">
                Status: {hasVoted ? 'Complete' : 'Pending'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}