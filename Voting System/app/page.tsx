"use client";
import { useEffect, useState } from 'react';
import { useVoting } from '@/context/voter';
import CandidateCard from '@/components/card/card';
import Timer from '@/components/ui/timer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, Trophy, TrendingUp, Loader2, Play, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

export default function Home() {
  const {
    currentAccount,
    candidateLength,
    candidateArray,
    voterLength,
    loading,
    votingEndTime,
    votingActive,
    isOwner,
    winner,
    connectWallet,
    getAllCandidates,
    giveVote,
    startVoting,
    getWinner,
  } = useVoting();

  const [sortedCandidates, setSortedCandidates] = useState([]);
  const [showWinner, setShowWinner] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (currentAccount) {
      getAllCandidates();
    }
  }, [currentAccount]);

  useEffect(() => {
    // Sort candidates by vote count for ranking
    const sorted = [...candidateArray].sort((a, b) => b.voteCount - a.voteCount);
    setSortedCandidates(sorted);
  }, [candidateArray]);

  useEffect(() => {
    // Check if voting has ended and show winner
    if (!votingActive && votingEndTime > 0 && Date.now() > votingEndTime) {
      setShowWinner(true);
      getWinner();
    } else {
      setShowWinner(false);
    }
  }, [votingActive, votingEndTime]);

  const totalVotes = candidateArray.reduce((sum, candidate) => sum + candidate.voteCount, 0);

  const handleStartVoting = async () => {
    if (candidateArray.length === 0) {
      alert('Please register at least one candidate before starting voting');
      return;
    }
    if (voterLength === 0) {
      alert('Please authorize at least one voter before starting voting');
      return;
    }

    const duration = prompt('Enter voting duration in minutes (default: 60):', '60');
    if (duration && !isNaN(parseInt(duration))) {
      await startVoting(parseInt(duration));
    }
  };

  if (!currentAccount) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-background flex items-center justify-center">
        <div className="text-center space-y-8 max-w-md mx-auto px-4">
          <div className="space-y-4">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Trophy className="w-16 h-16 text-primary" />
            </div>


            {/* <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome to VoteChain
            </h1>
            <p className="text-xl text-muted-foreground">
              Your decentralized voting platform
            </p> */}



            <h1 className="text-4xl font-bold text-foreground">
              Welcome to VoteChain
            </h1>
            <p className="text-xl text-muted-foreground">
              Your decentralized voting platform
            </p>



          </div>



          {/* <button
            onClick={connectWallet}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Connect Wallet to Continue
          </button> */}

          <button
            onClick={connectWallet}
            className="relative overflow-hidden text-white px-8 py-4 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 animate-gradient-x blur-sm opacity-75" />
            <span className="relative z-10">Connect Wallet to Continue</span>
          </button>




        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-background">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          <Card className="bg-accent/10 border border-accent rounded-lg shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-accent-700 dark:text-accent-300">Total Candidates</CardTitle>
              {/* <UserCheck className="h-4 w-4 text-accent" /> */}
              <UserCheck className={`h-4 w-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-accent-900 dark:text-accent-200">{candidateLength}</div>
              <p className="text-xs text-accent-800 dark:text-accent-400">
                Authorized voters
              </p>
            </CardContent>
          </Card>



          <Card className="bg-accent/10 border border-accent rounded-lg shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-accent-700 dark:text-accent-300">Total Voters</CardTitle>
              {/* <UserCheck className="h-4 w-4 text-accent" /> */}
              <UserCheck className={`h-4 w-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-accent-900 dark:text-accent-200">{voterLength}</div>
              <p className="text-xs text-accent-800 dark:text-accent-400">
                Authorized voters
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{totalVotes}</div>
              <p className="text-xs text-muted-foreground">
                Votes cast
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leading Candidate</CardTitle>
              <Trophy className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-yellow-500 truncate">
                {sortedCandidates[0]?.name || 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                {sortedCandidates[0]?.voteCount || 0} votes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Start Voting Button (Owner Only) */}
        {isOwner && !votingActive && (
          <div className="mb-8">
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Start Voting Process</h3>
                    <p className="text-muted-foreground">
                      Begin the voting session for all authorized voters
                    </p>
                  </div>

                  <Button
                    onClick={handleStartVoting}
                    disabled={loading || candidateArray.length === 0 || voterLength === 0}
                    className="from-primary to-accent hover:from-primary/90 hover:to-accent/90 hover:brightness-75 hover:scale-95 transition-transform duration-300 ease-in-out"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Voting
                  </Button>


                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Countdown Timer */}
        <div className="mb-8">
          <Timer
            endTime={votingEndTime}
            onTimeUp={() => {
              setShowWinner(true);
              getWinner();
            }}
          />
        </div>

        {/* Winner Announcement */}
        {showWinner && winner && (
          <div className="mb-8">
            <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Crown className="h-8 w-8 text-yellow-500" />
                  <CardTitle className="text-2xl font-bold text-yellow-600">
                    🎉 Winner Announced! 🎉
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                  {winner.name}
                </div>
                <Badge className="bg-yellow-500 text-white text-lg px-4 py-2">
                  {winner.votes} vote(s)
                </Badge>
                <p className="text-muted-foreground">
                  Congratulations to the winner of this election!
                </p>
              </CardContent>
            </Card>
          </div>
        )}




        {/* Candidates Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              {/* <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Candidates
              </h2> */}
              <h2 className="text-3xl font-bold text-foreground">
                Candidates
              </h2>

              <p className="text-muted-foreground mt-1">
                {votingActive ? 'Vote for your preferred candidate' : 'View all registered candidates'}
              </p>
            </div>
            {loading && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </div>
            )}
          </div>

          {/* Candidates Grid */}
          {candidateArray.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedCandidates.map((candidate, index) => (
                <div
                  key={candidate.id}
                  className="animate-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CandidateCard
                    candidate={candidate}
                    onVote={giveVote}
                    loading={loading}
                    rank={index + 1}
                    votingActive={votingActive}
                    showWinner={showWinner && winner?.id === candidate.id}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                  <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">No Candidates Yet</h3>
                  <p className="text-muted-foreground">
                    {isOwner
                      ? 'Register candidates to start the voting process.'
                      : 'Candidates will appear here once they are registered.'
                    }
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>



      </div>
    </div>
  );
}

