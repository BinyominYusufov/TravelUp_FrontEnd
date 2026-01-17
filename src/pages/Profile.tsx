import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, Moon, Sun, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, isAuthenticated, isLoading: authLoading, refreshUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleThemeToggle = async () => {
    if (!user) return;
    
    setIsSaving(true);
    const newTheme = user.theme === 'dark' ? 'light' : 'dark';
    
    try {
      await authApi.updateProfile({ theme: newTheme });
      await refreshUser();
      toast({
        title: 'Theme updated',
        description: `Theme changed to ${newTheme} mode.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update theme. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 p-4">
          <User className="w-16 h-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Sign in to view your profile</h1>
          <p className="text-muted-foreground text-center max-w-md">
            You need to be signed in to view and manage your profile.
          </p>
          <div className="flex gap-3 mt-4">
            <Button asChild variant="outline">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild className="gradient-primary border-0">
              <Link to="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* User Info Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </CardTitle>
              <CardDescription>Your personal account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-medium">{user?.username}</p>
                </div>
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-lg">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Preferences
              </CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {user?.theme === 'dark' ? (
                    <Moon className="w-5 h-5 text-primary" />
                  ) : (
                    <Sun className="w-5 h-5 text-primary" />
                  )}
                  <div>
                    <Label htmlFor="theme-toggle">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark theme
                    </p>
                  </div>
                </div>
                <Switch
                  id="theme-toggle"
                  checked={user?.theme === 'dark'}
                  onCheckedChange={handleThemeToggle}
                  disabled={isSaving}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
