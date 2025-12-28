"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Trophy, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimerProps {
  endTime: number;
  onTimeUp?: () => void;
}

export default function Timer({ endTime, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0
  });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!endTime || endTime === 0) {
      setIsActive(false);
      return;
    }

    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds, total: difference });
        setIsActive(true);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
        setIsActive(false);
        if (onTimeUp) {
          onTimeUp();
        }
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [endTime, onTimeUp]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const getUrgencyLevel = () => {
    if (timeLeft.total <= 0) return 'ended';
    if (timeLeft.total <= 300000) return 'critical'; // 5 minutes
    if (timeLeft.total <= 1800000) return 'warning'; // 30 minutes
    return 'normal';
  };

  const urgencyLevel = getUrgencyLevel();

  if (!endTime || endTime === 0) {
    return (
      <Card className="bg-gradient-to-br from-muted/50 to-muted/30 border-muted/40">
        <CardHeader className="text-center pb-2">
          <CardTitle className="flex items-center justify-center space-x-2 text-muted-foreground">
            <Clock className="h-5 w-5" />
            <span>Voting Not Started</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            Waiting for the organizer to start the voting process
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-500",
      urgencyLevel === 'ended' && "bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20",
      urgencyLevel === 'critical' && "bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20 animate-pulse",
      urgencyLevel === 'warning' && "bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20",
      urgencyLevel === 'normal' && "bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20"
    )}>
      {/* Animated background */}
      <div className={cn(
        "absolute inset-0 opacity-20 transition-opacity duration-1000",
        urgencyLevel === 'critical' && "bg-gradient-to-r from-red-500/20 via-transparent to-red-500/20 animate-pulse",
        urgencyLevel === 'warning' && "bg-gradient-to-r from-yellow-500/20 via-transparent to-yellow-500/20",
        urgencyLevel === 'normal' && "bg-gradient-to-r from-primary/20 via-transparent to-accent/20"
      )} />

      <CardHeader className="text-center pb-4 relative z-10">
        <div className="flex items-center justify-center space-x-2 mb-2">
          {urgencyLevel === 'ended' ? (
            <Trophy className="h-6 w-6 text-green-500" />
          ) : urgencyLevel === 'critical' ? (
            <AlertCircle className="h-6 w-6 text-red-500 animate-pulse" />
          ) : (
            <Clock className="h-6 w-6 text-primary" />
          )}
          <CardTitle className={cn(
            "text-xl font-bold",
            urgencyLevel === 'ended' && "text-green-600",
            urgencyLevel === 'critical' && "text-red-600",
            urgencyLevel === 'warning' && "text-yellow-600",
            urgencyLevel === 'normal' && "bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          )}>
            {urgencyLevel === 'ended' ? 'Voting Ended' : 'Voting Ends In'}
          </CardTitle>
        </div>
        
        <Badge 
          variant={urgencyLevel === 'ended' ? 'default' : 'secondary'}
          className={cn(
            "transition-all duration-300",
            urgencyLevel === 'ended' && "bg-green-500 text-white",
            urgencyLevel === 'critical' && "bg-red-500 text-white animate-pulse",
            urgencyLevel === 'warning' && "bg-yellow-500 text-white",
            urgencyLevel === 'normal' && "bg-primary/10 text-primary"
          )}
        >
          {urgencyLevel === 'ended' ? 'Results Available' : 
           urgencyLevel === 'critical' ? 'Urgent - Vote Now!' :
           urgencyLevel === 'warning' ? 'Ending Soon' : 'Active'}
        </Badge>
      </CardHeader>

      <CardContent className="relative z-10">
        {urgencyLevel === 'ended' ? (
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-green-600 animate-bounce">
              🏆
            </div>
            <p className="text-lg font-semibold text-green-600">
              Voting has concluded!
            </p>
            <p className="text-sm text-muted-foreground">
              Check the results to see the winner
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4 text-center">
            {/* Days */}
            <div className="space-y-2">
              <div className={cn(
                "text-3xl font-bold transition-all duration-300",
                urgencyLevel === 'critical' && "text-red-500 animate-pulse",
                urgencyLevel === 'warning' && "text-yellow-500",
                urgencyLevel === 'normal' && "bg-gradient-to-b from-primary to-accent bg-clip-text text-transparent"
              )}>
                {formatNumber(timeLeft.days)}
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                {timeLeft.days === 1 ? 'Day' : 'Days'}
              </div>
            </div>

            {/* Hours */}
            <div className="space-y-2">
              <div className={cn(
                "text-3xl font-bold transition-all duration-300",
                urgencyLevel === 'critical' && "text-red-500 animate-pulse",
                urgencyLevel === 'warning' && "text-yellow-500",
                urgencyLevel === 'normal' && "bg-gradient-to-b from-primary to-accent bg-clip-text text-transparent"
              )}>
                {formatNumber(timeLeft.hours)}
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                {timeLeft.hours === 1 ? 'Hour' : 'Hours'}
              </div>
            </div>

            {/* Minutes */}
            <div className="space-y-2">
              <div className={cn(
                "text-3xl font-bold transition-all duration-300",
                urgencyLevel === 'critical' && "text-red-500 animate-pulse",
                urgencyLevel === 'warning' && "text-yellow-500",
                urgencyLevel === 'normal' && "bg-gradient-to-b from-primary to-accent bg-clip-text text-transparent"
              )}>
                {formatNumber(timeLeft.minutes)}
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                {timeLeft.minutes === 1 ? 'Min' : 'Mins'}
              </div>
            </div>

            {/* Seconds */}
            <div className="space-y-2">
              <div className={cn(
                "text-3xl font-bold transition-all duration-300",
                urgencyLevel === 'critical' && "text-red-500 animate-pulse",
                urgencyLevel === 'warning' && "text-yellow-500",
                urgencyLevel === 'normal' && "bg-gradient-to-b from-primary to-accent bg-clip-text text-transparent"
              )}>
                {formatNumber(timeLeft.seconds)}
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                {timeLeft.seconds === 1 ? 'Sec' : 'Secs'}
              </div>
            </div>
          </div>
        )}

        {/* Progress bar for visual representation */}
        {isActive && urgencyLevel !== 'ended' && (
          <div className="mt-6 space-y-2">
            <div className="w-full bg-secondary/50 rounded-full h-2 overflow-hidden">
              <div 
                className={cn(
                  "h-2 rounded-full transition-all duration-1000 ease-out",
                  urgencyLevel === 'critical' && "bg-gradient-to-r from-red-500 to-red-600 animate-pulse",
                  urgencyLevel === 'warning' && "bg-gradient-to-r from-yellow-500 to-yellow-600",
                  urgencyLevel === 'normal' && "bg-gradient-to-r from-primary to-accent"
                )}
                style={{
                  width: `${Math.max(0, Math.min(100, (timeLeft.total / (24 * 60 * 60 * 1000)) * 100))}%`
                }}
              />
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                {urgencyLevel === 'critical' ? 'Last chance to vote!' :
                 urgencyLevel === 'warning' ? 'Vote before time runs out' :
                 'Make sure to cast your vote'}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}