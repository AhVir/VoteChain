// "use client";
// import { useState, useEffect } from 'react';
// import { useVoting } from '@/context/voter';
// import { Moon, Sun, Menu, X, Wallet, User, Home, Users, UserPlus, Vote } from 'lucide-react';
// import Link from 'next/link';
// import { useTheme } from 'next-themes';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';

// export default function NavBar() {
//   const { currentAccount, connectWallet, isOwner } = useVoting();
//   const { theme, setTheme } = useTheme();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   // Ensure component is mounted before rendering theme-dependent content
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const navigation = [
//     { name: 'Home', href: '/', icon: Home },
//     ...(isOwner ? [
//       { name: 'Voters', href: '/voterlist', icon: Users },
//       { name: 'Add Candidate', href: '/candidate_registration', icon: UserPlus },
//       { name: 'Add Voter', href: '/allowed-voters', icon: Vote },
//     ] : []),
//   ];

//   const truncateAddress = (address) => {
//     if (!address) return '';
//     return `${address.slice(0, 6)}...${address.slice(-4)}`;
//   };

//   if (!mounted) {
//     return (
//       <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/40">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-2">
//               <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
//                 <Vote className="h-6 w-6 text-primary" />
//               </div>
//               <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//                 VoteChain
//               </span>
//             </div>
//           </div>
//         </div>
//       </nav>
//     );
//   }

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/40">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link href="/" className="flex items-center space-x-2 group">
//             <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 shadow-md shadow-primary/20 transition-all">
//               <Vote className="h-6 w-6 text-primary drop-shadow-md" />
//             </div>
//             <span className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text drop-shadow-sm">
//               {/* <span className="text-xl font-extrabold tracking-wide text-foreground drop-shadow-sm"> */}
//               VoteChain
//             </span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             {navigation.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 group relative overflow-hidden"
//                 >
//                   <Icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
//                   <span>{item.name}</span>
//                   <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                 </Link>
//               );
//             })}
//           </div>

//           {/* Actions */}
//           <div className="flex items-center space-x-4">
//             {/* Enhanced Theme Toggle */}
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
//               className="relative overflow-hidden group w-10 h-10 p-0 rounded-full hover:bg-accent/50"
//             >
//               <div className="relative w-full h-full flex items-center justify-center">
//                 {/* Sun icon for light mode */}
//                 <Sun className={`h-4 w-4 absolute transition-all duration-500 ${theme === 'dark'
//                   ? 'rotate-90 scale-0 opacity-0'
//                   : 'rotate-0 scale-100 opacity-100'
//                   } text-amber-500`} />

//                 {/* Moon icon for dark mode */}
//                 <Moon className={`h-4 w-4 absolute transition-all duration-500 ${theme === 'dark'
//                   ? 'rotate-0 scale-100 opacity-100'
//                   : '-rotate-90 scale-0 opacity-0'
//                   } text-blue-400`} />
//               </div>

//               {/* Animated background */}
//               <div className={`absolute inset-0 rounded-full transition-all duration-500 ${theme === 'dark'
//                 ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100'
//                 : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100'
//                 }`} />
//             </Button>

//             {/* Wallet Connection */}
//             {currentAccount ? (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>




//                   <Button
//                     variant="outline"
//                     className="flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
//                   >
//                     <User className="h-4 w-4" />
//                     <span className="hidden sm:inline">{truncateAddress(currentAccount)}</span>
//                   </Button>




//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-sm border border-border/50">
//                   <DropdownMenuItem className="focus:bg-accent/50">
//                     <span className="text-sm text-muted-foreground">Connected as:</span>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem className="focus:bg-accent/50">
//                     <span className="text-sm font-mono">{truncateAddress(currentAccount)}</span>
//                   </DropdownMenuItem>
//                   {isOwner && (
//                     <DropdownMenuItem className="focus:bg-accent/50">
//                       <span className="text-sm text-primary font-medium">Organizer</span>
//                     </DropdownMenuItem>
//                   )}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             ) : (


//               // <Button
//               //   onClick={connectWallet}
//               //   className="bg-gradient-to-r from-primary via-primary/90 to-accent hover:from-primary/90 hover:via-primary/80 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-500 transform hover:scale-105 relative overflow-hidden group"
//               // >
//               //   <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
//               //   <Wallet className="h-4 w-4 mr-2 relative z-10" />
//               //   <span className="relative z-10">Connect Wallet</span>
//               // </Button>


//               <Button
//                 onClick={connectWallet}
//                 className="relative overflow-hidden px-8 py-4 rounded-lg font-semibold text-white shadow-lg bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500
//              hover:from-purple-700 hover:via-pink-600 hover:to-yellow-600
//              transition-all duration-500 transform hover:scale-105 group"
//               >
//                 {/* Light Sweep Effect */}
//                 <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 blur-sm opacity-50 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

//                 {/* Optional Bright Flash on Hover */}
//                 <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition duration-300" />

//                 {/* Icon & Text */}
//                 <Wallet className="h-4 w-4 mr-2 relative z-10" />
//                 <span className="relative z-10">Connect Wallet</span>
//               </Button>




//             )}

//             {/* Mobile Menu Button */}
//             <Button
//               variant="ghost"
//               size="sm"
//               className="md:hidden relative overflow-hidden group"
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             >
//               <div className="relative">
//                 <Menu className={`h-5 w-5 transition-all duration-300 ${mobileMenuOpen ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
//                 <X className={`h-5 w-5 absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`} />
//               </div>
//             </Button>
//           </div>
//         </div>

//         {/* Enhanced Mobile Navigation */}
//         <div className={`md:hidden transition-all duration-500 ease-out ${mobileMenuOpen
//           ? 'max-h-96 opacity-100'
//           : 'max-h-0 opacity-0 overflow-hidden'
//           }`}>
//           <div className="px-2 pt-2 pb-3 space-y-1 bg-background/95 backdrop-blur-sm border-t border-border/40">
//             {navigation.map((item, index) => {
//               const Icon = item.icon;
//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-300 relative overflow-hidden group ${mobileMenuOpen ? 'animate-in slide-in-from-left-2' : ''
//                     }`}
//                   style={{ animationDelay: `${index * 0.1}s` }}
//                   onClick={() => setMobileMenuOpen(false)}
//                 >
//                   <Icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
//                   <span>{item.name}</span>
//                   <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                 </Link>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </nav >
//   );
// }





"use client";
import { useState, useEffect } from 'react';
import { useVoting } from '@/context/voter';
import { Moon, Sun, Menu, X, Wallet, User, Home, Users, UserPlus, Vote } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'; // assuming you have this utility for conditional classNames

export default function NavBar() {
  const { currentAccount, connectWallet, isOwner } = useVoting();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();

  // Ensure component is mounted before rendering theme-dependent content
  useEffect(() => {
    setMounted(true);
  }, []);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    ...(isOwner ? [
      { name: 'Voters', href: '/voterlist', icon: Users },
      { name: 'Add Candidate', href: '/candidate_registration', icon: UserPlus },
      { name: 'Add Voter', href: '/allowed-voters', icon: Vote },
    ] : []),
  ];

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!mounted) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                <Vote className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                VoteChain
              </span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 shadow-md shadow-primary/20 transition-all">
              <Vote className="h-6 w-6 text-primary drop-shadow-md" />
            </div>
            <span className="text-xl font-extrabold tracking-wide bg-gradient-to-r from-primary to-accent bg-clip-text drop-shadow-sm">
              VoteChain
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                    isActive
                      ? // Active tab styling for light and dark mode
                      "text-foreground bg-accent/40 dark:bg-accent/70 cursor-default shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      isActive ? "scale-110" : "group-hover:scale-110"
                    )}
                  />
                  <span>{item.name}</span>
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Enhanced Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="relative overflow-hidden group w-10 h-10 p-0 rounded-full hover:bg-accent/50"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Sun icon for light mode */}
                <Sun
                  className={`h-4 w-4 absolute transition-all duration-500 ${theme === 'dark'
                    ? 'rotate-90 scale-0 opacity-0'
                    : 'rotate-0 scale-100 opacity-100'
                    } text-amber-500`}
                />

                {/* Moon icon for dark mode */}
                <Moon
                  className={`h-4 w-4 absolute transition-all duration-500 ${theme === 'dark'
                    ? 'rotate-0 scale-100 opacity-100'
                    : '-rotate-90 scale-0 opacity-0'
                    } text-blue-400`}
                />
              </div>

              {/* Animated background */}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-500 ${theme === 'dark'
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100'
                  : 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100'
                  }`}
              />
            </Button>

            {/* Wallet Connection */}
            {currentAccount ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{truncateAddress(currentAccount)}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-background/95 backdrop-blur-sm border border-border/50"
                >
                  <DropdownMenuItem className="focus:bg-accent/50">
                    <span className="text-sm text-muted-foreground">Connected as:</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="focus:bg-accent/50">
                    <span className="text-sm font-mono">{truncateAddress(currentAccount)}</span>
                  </DropdownMenuItem>
                  {isOwner && (
                    <DropdownMenuItem className="focus:bg-accent/50">
                      <span className="text-sm text-primary font-medium">Organizer</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={connectWallet}
                className="relative overflow-hidden px-8 py-4 rounded-lg font-semibold text-white shadow-lg bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500
             hover:from-purple-700 hover:via-pink-600 hover:to-yellow-600
             transition-all duration-500 transform hover:scale-105 group"
              >
                {/* Light Sweep Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 blur-sm opacity-50 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

                {/* Optional Bright Flash on Hover */}
                <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition duration-300" />

                {/* Icon & Text */}
                <Wallet className="h-4 w-4 mr-2 relative z-10" />
                <span className="relative z-10">Connect Wallet</span>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden relative overflow-hidden group"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="relative">
                <Menu
                  className={`h-5 w-5 transition-all duration-300 ${mobileMenuOpen ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
                    }`}
                />
                <X
                  className={`h-5 w-5 absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
                    }`}
                />
              </div>
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-500 ease-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-background/95 backdrop-blur-sm border-t border-border/40">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 relative overflow-hidden group",
                    mobileMenuOpen ? "animate-in slide-in-from-left-2" : "",
                    isActive
                      ? "text-foreground bg-accent/40 dark:bg-accent/70 cursor-default shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-transform duration-200",
                      isActive ? "scale-110" : "group-hover:scale-110"
                    )}
                  />
                  <span>{item.name}</span>
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
