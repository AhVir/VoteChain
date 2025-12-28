"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVoting } from '@/context/voter';
import CustomInput from '@/components/input/input';
import CustomButton from '@/components/button/button';
import VoterCard from '@/components/votercard/votercard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, MapPin, Briefcase, Upload, Vote, Shield, Info, IdCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isAddress } from 'ethers';

export default function AllowedVoters() {
  const router = useRouter();
  const {
    currentAccount,
    voterArray,
    isOwner,
    loading,
    createVoter,
    uploadToIPFS,
    connectWallet,
  } = useVoting();

  const [formInput, setFormInput] = useState({
    name: '',
    address: '',
    position: '',
  });
  const [fileUrl, setFileUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [nidUploading, setNidUploading] = useState(false);
  const [nidVerified, setNidVerified] = useState(false);
  const [age, setAge] = useState<number | null>(null);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormInput(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadToIPFS(file);
      setFileUrl(url);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleNIDUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setNidUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('http://localhost:8000/verify-age/', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.valid && data.age >= 18) {
        setNidVerified(true);
        setAge(data.age);
        setErrors(prev => ({ ...prev, nid: '' }));
      } else {
        setNidVerified(false);
        setErrors(prev => ({ ...prev, nid: 'User must be at least 18 years old' }));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to verify NID');
      setNidVerified(false);
      setErrors(prev => ({ ...prev, nid: 'NID verification failed' }));
    } finally {
      setNidUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<string, string>> = {};
    if (!formInput.name.trim()) newErrors.name = 'Name is required';
    if (!formInput.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (!isAddress(formInput.address.trim())) {
      newErrors.address = 'Invalid wallet address';
    }
    if (!formInput.position.trim()) newErrors.position = 'Position is required';
    if (!fileUrl) newErrors.image = 'Profile image is required';
    if (!nidVerified) newErrors.nid = 'NID verification required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    await createVoter(formInput, fileUrl, router);
  };

  if (!currentAccount) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-background flex items-center justify-center">
        <div className="text-center space-y-8 max-w-md mx-auto px-4">
          <div className="space-y-4">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Vote className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Voter Authorization
            </h1>
            <p className="text-xl text-muted-foreground">
              Authorize new voters for the election
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

  if (!isOwner) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-background flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center space-y-4">
            <Shield className="w-16 h-16 mx-auto text-destructive" />
            <h2 className="text-2xl font-bold">Access Denied</h2>
            <p className="text-muted-foreground">
              Only the organizer can authorize new voters.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-background">
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-8">

          {/* <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Voter Authorization
          </h1> */}

          <h1 className="text-4xl font-bold text-foreground mb-2">
            Voter Authorization
          </h1>



          <p className="text-xl text-muted-foreground">
            Authorize new voters to participate in the election
          </p>
        </div>

        {/* NID Verification Card */}
        <div className="max-w-lg mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <IdCard className="h-5 w-5" />
                <span>NID Card Verification</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="file"
                accept="image/*"
                onChange={handleNIDUpload}
                disabled={nidUploading || loading}
                className="mb-4"
              />
              {nidUploading && (
                <p className="text-sm text-muted-foreground">Verifying NID, please wait...</p>
              )}
              {errors.nid && (
                <p className="text-sm text-destructive">{errors.nid}</p>
              )}
              {nidVerified && age !== null && (
                <p className="text-sm text-emerald-600 font-semibold">
                  ✅ Verified Age: {age}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Show form only if NID verified */}
        {nidVerified && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Preview/Info */}
            <div className="space-y-6">
              {fileUrl && formInput.name ? (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Preview</h2>
                  <VoterCard
                    voter={{
                      id: voterArray.length + 1,
                      name: formInput.name,
                      image: fileUrl,
                      address: formInput.address,
                      position: formInput.position,
                      hasVoted: false,
                    }}
                  />
                </div>
              ) : (
                <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Info className="h-5 w-5" />
                      <span>Authorization Info</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Fill out the form to authorize a new voter. A preview will appear here once you provide the required information.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Requirements:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Full name</li>
                        <li>• Valid wallet address</li>
                        <li>• Position/Role</li>
                        <li>• Profile image</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Existing Voters */}
              {voterArray.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold">Current Voters</h2>
                  <div className="grid gap-4 max-h-96 overflow-y-auto">
                    {voterArray.slice(0, 3).map((voter) => (
                      <div key={voter.id} className="transform scale-75 origin-top-left">
                        <VoterCard voter={voter} />
                      </div>
                    ))}
                    {voterArray.length > 3 && (
                      <div className="text-center text-muted-foreground">
                        +{voterArray.length - 3} more voters
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Vote className="h-5 w-5" />
                    <span>Voter Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <CustomInput
                      label="Full Name"
                      name="name"
                      value={formInput.name}
                      onChange={handleInputChange}
                      placeholder="Enter voter's full name"
                      icon={User}
                      error={errors.name}
                      required
                    />

                    <CustomInput
                      label="Wallet Address"
                      name="address"
                      value={formInput.address}
                      onChange={handleInputChange}
                      placeholder="0x..."
                      icon={MapPin}
                      error={errors.address}
                      required
                    />

                    <CustomInput
                      label="Position/Role"
                      name="position"
                      value={formInput.position}
                      onChange={handleInputChange}
                      placeholder="e.g., Software Engineer, Manager"
                      icon={Briefcase}
                      error={errors.position}
                      required
                    />

                    {/* Profile Image Upload */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Profile Image
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          disabled={uploading}
                        />
                        <div className={cn(
                          "border-2 border-dashed border-border/40 rounded-lg p-8 text-center hover:border-primary/40 transition-colors duration-300",
                          uploading && "opacity-50 cursor-not-allowed",
                          fileUrl && "border-primary/40 bg-primary/5"
                        )}>
                          {uploading ? (
                            <div className="space-y-2">
                              <div className="w-8 h-8 mx-auto animate-spin rounded-full border-2 border-primary border-t-transparent" />
                              <p className="text-sm text-muted-foreground">Uploading...</p>
                            </div>
                          ) : fileUrl ? (
                            <div className="space-y-2">
                              <div className="w-16 h-16 mx-auto rounded-full overflow-hidden">
                                <img src={fileUrl} alt="Preview" className="w-full h-full object-cover" />
                              </div>
                              <p className="text-sm text-primary font-medium">Image uploaded successfully</p>
                              <p className="text-xs text-muted-foreground">Click to change</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Click to upload voter image
                              </p>
                              <p className="text-xs text-muted-foreground">
                                PNG, JPG up to 5MB
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
                    </div>

                    <CustomButton
                      type="submit"
                      variant="gradient"
                      className="w-full"
                      loading={loading}
                      disabled={uploading}
                    >
                      <Vote className="h-4 w-4 mr-2" />
                      Authorize Voter
                    </CustomButton>
                  </form>
                </CardContent>
              </Card>

              {/* Notice */}
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Only the organizer can authorize new voters. All voter information will be stored on the blockchain and cannot be modified after authorization.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
