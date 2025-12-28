"use client";
import { useEffect } from 'react';
import { useVoting } from '@/context/voter';
import VoterCard from '@/components/votercard/votercard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX, Shield, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function VoterList() {
  const {
    currentAccount,
    voterArray,
    voterLength,
    loading,
    getAllVoterData,
    connectWallet,
  } = useVoting();

  useEffect(() => {
    if (currentAccount) {
      getAllVoterData();
    }
  }, [currentAccount]);

  const votedCount = voterArray.filter(voter => voter.hasVoted).length;
  const notVotedCount = voterLength - votedCount;
  const participationRate = voterLength > 0 ? Math.round((votedCount / voterLength) * 100) : 0;

  if (!currentAccount) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-background flex items-center justify-center">
        <div className="text-center space-y-8 max-w-md mx-auto px-4">
          <div className="space-y-4">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Shield className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {/* <h1 className="text-4xl font-bold bg-clip-text text-transparent text-foreground"> */}
              Voter Registry
            </h1>
            <p className="text-xl text-muted-foreground">
              View authorized voters and participation
            </p>
          </div>
          <button
            onClick={connectWallet}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Connect Wallet to Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-background">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-8">


          {/* <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Registered Voters
          </h1> */}

          <h1 className="text-4xl font-bold text-foreground mb-2">
            Registered Voters
          </h1>


          <p className="text-xl text-muted-foreground">
            View all authorized voters and their participation status
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Voters</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{voterLength}</div>
              <p className="text-xs text-muted-foreground">
                Authorized voters
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Voted</CardTitle>
              <UserCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{votedCount}</div>
              <p className="text-xs text-muted-foreground">
                Completed voting
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <UserX className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{notVotedCount}</div>
              <p className="text-xs text-muted-foreground">
                Not voted yet
              </p>
            </CardContent>
          </Card>


          <Card className="bg-gradient-to-br from-accent/30 to-accent/20 border border-accent/60 rounded-md shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 text-accent">
              <CardTitle className="text-sm font-bold text-accent text-foreground">Participation</CardTitle>
              <Shield className="h-4 w-4 text-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent text-foreground">{participationRate}%</div>
              <p className="text-xs text-muted-foreground">Voter turnout</p>
            </CardContent>
          </Card>

        </div>

        {/* Participation Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Voting Participation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{participationRate}% ({votedCount}/{voterLength})</span>
              </div>
              <div className="w-full bg-secondary/50 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out"
                  style={{ width: `${participationRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voters List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Voter Directory</h2>
              <p className="text-muted-foreground">
                All registered voters and their status
              </p>
            </div>
            {loading && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </div>
            )}
          </div>

          {voterArray.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {voterArray.map((voter, index) => (
                <div
                  key={voter.id}
                  className="animate-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <VoterCard voter={voter} />
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
                  <h3 className="font-semibold text-lg">No Voters Registered</h3>
                  <p className="text-muted-foreground">
                    Voters will appear here once they are authorized.
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