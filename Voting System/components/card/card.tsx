"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Vote, MapPin, Calendar, Trophy, Crown, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CandidateCardProps {
  candidate: {
    id: number;
    name: string;
    image: string;
    age: number;
    address: string;
    voteCount: number;
  };
  onVote: (id: number) => void;
  loading?: boolean;
  rank?: number;
  votingActive?: boolean;
  showWinner?: boolean;
}

export default function CandidateCard({
  candidate,
  onVote,
  loading,
  rank,
  votingActive = true,
  showWinner = false
}: CandidateCardProps) {
  const { id, name, image, age, address, voteCount } = candidate;

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getRankColor = (rank?: number) => {
    if (!rank) return 'text-muted-foreground';
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-amber-600';
    return 'text-muted-foreground';
  };

  const getRankIcon = (rank?: number) => {
    if (showWinner) return Crown;
    if (rank === 1) return Trophy;
    return Trophy;
  };

  const RankIcon = getRankIcon(rank);

  return (
    <Card className={cn(
      "group relative overflow-hidden border-0 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2",
      showWinner
        ? "bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-2 border-yellow-500/40 shadow-2xl shadow-yellow-500/20"
        : "bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm hover:from-card/70 hover:to-card/50 hover:shadow-primary/20"
    )}>
      {/* Animated background gradient */}
      <div className={cn(
        "absolute inset-0 transition-opacity duration-500",
        showWinner
          ? "bg-gradient-to-br from-yellow-500/10 via-transparent to-yellow-600/10 opacity-100"
          : "bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100"
      )} />

      {/* Winner crown animation */}
      {showWinner && (
        <div className="absolute top-4 right-2 z-10">
          <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center shadow-md animate-bounce ring-2 ring-white dark:ring-background">
            <Crown className="h-5 w-5 text-white" />
          </div>
        </div>
      )}




      {/* Rank indicator */}
      {rank && rank <= 3 && !showWinner && (
        <div className="absolute top-3 right-3 z-10">
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg",
            rank === 1 && "bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border-yellow-500/30",
            rank === 2 && "bg-gradient-to-br from-gray-300/20 to-gray-500/20 border-gray-400/30",
            rank === 3 && "bg-gradient-to-br from-amber-400/20 to-amber-600/20 border-amber-500/30"
          )}>
            <RankIcon className={cn("h-4 w-4", getRankColor(rank))} />
          </div>
        </div>
      )}

      <CardHeader className="relative pb-2">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className={cn(
              "h-16 w-16 ring-2 transition-all duration-300",
              showWinner
                ? "ring-yellow-500/60 shadow-lg shadow-yellow-500/20"
                : "ring-primary/20 group-hover:ring-primary/40"
            )}>
              <AvatarImage src={image} alt={name} className="object-cover" />
              <AvatarFallback className={cn(
                "font-semibold",
                showWinner
                  ? "bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 text-yellow-600"
                  : "bg-gradient-to-br from-primary/20 to-accent/20 text-primary"
              )}>
                {name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className={cn(
              "absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-lg",
              showWinner
                ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                : "bg-gradient-to-br from-primary to-accent"
            )}>
              <span className="text-xs text-primary-foreground font-bold">#{id}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className={cn(
              "text-lg transition-colors duration-300",
              showWinner
                ? "text-yellow-600 font-bold"
                : "group-hover:text-primary"
            )}>
              {name}
              {showWinner && (
                <span className="ml-2 text-yellow-500 animate-pulse">👑</span>
              )}
            </CardTitle>
            <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{age} years</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-3 w-3" />
                <span className="font-mono text-xs">{truncateAddress(address)}</span>
              </div>
            </div>

          </div>
        </div>
      </CardHeader>

      <CardContent className="relative pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className={cn(
                "absolute inset-0 rounded-full blur-sm transition-all duration-300",
                showWinner
                  ? "bg-gradient-to-r from-yellow-500/40 to-yellow-600/40"
                  : "bg-gradient-to-r from-primary/20 to-accent/20 group-hover:blur-md"
              )} />
              <Badge
                variant="secondary"
                className={cn(
                  "relative transition-all duration-300",
                  showWinner
                    ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-600 border-yellow-500/30"
                    : "bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-primary/20 hover:from-primary/20 hover:to-accent/20"
                )}
              >
                <Vote className="h-3 w-3 mr-1" />
                {voteCount} votes
              </Badge>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">
              {voteCount}
            </div>
            <div className="text-xs font-bold text-muted-foreground">Total Votes</div>
          </div>


        </div>
      </CardContent>


      <CardFooter className="relative pt-2">
        {showWinner ? (
          <div className="w-full flex justify-center items-center mt-2 px-2 overflow-hidden">
            <Badge
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 text-sm font-semibold rounded-full shadow-md flex items-center justify-center"
            >
              <Crown className="h-4 w-4 mr-2" />
              WINNER!
            </Badge>
          </div>

        ) : votingActive ? (

          <Button
            onClick={() => onVote(id)}
            disabled={loading}
            className="w-full relative overflow-hidden font-bold text-white shadow-xl rounded-md
             bg-[linear-gradient(270deg,_#a855f7,_#ec4899,_#facc15,_#22d3ee,_#a855f7)]
             bg-[length:400%_400%] animate-gradient-slow
             hover:shadow-2xl hover:scale-105 transition-all duration-500 group"
          >
            {/* Optional White Sweep Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 blur-sm opacity-20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

            <Vote className="h-4 w-4 mr-2 relative z-10" />
            <span className="relative z-10">
              {loading ? 'Voting...' : 'Give Vote'}
            </span>
          </Button>

        ) : (

          <Button
            disabled
            variant="secondary"
            className="w-full relative bg-muted/60 text-muted-foreground border border-border/40 shadow-inner rounded-md
             cursor-not-allowed opacity-90 group overflow-hidden"
          >
            {/* Optional subtle shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 blur-sm opacity-0 group-hover:opacity-10 transition-opacity duration-1000 animate-pulse pointer-events-none" />

            <CheckCircle className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="font-semibold tracking-wide">Voting Ended</span>
          </Button>
        )}
      </CardFooter>

    </Card>
  );
}
