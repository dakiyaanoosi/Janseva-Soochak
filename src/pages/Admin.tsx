import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, ExternalLink, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useBusinesses } from "@/contexts/BusinessContext";

const DEFAULT_PASSWORD = "admin@123";

// Get or initialize admin password
const getAdminPassword = () => {
  const stored = localStorage.getItem("adminPassword");
  if (!stored) {
    localStorage.setItem("adminPassword", DEFAULT_PASSWORD);
    return DEFAULT_PASSWORD;
  }
  return stored;
};

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { businesses, updateBusinessVerification } = useBusinesses();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  
  // Change password states
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("adminAuth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = getAdminPassword();
    if (password === adminPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem("adminAuth", "true");
      toast({
        title: "Access Granted",
        description: "Welcome to the admin dashboard.",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminAuth");
    navigate("/");
  };

  const handleVerificationToggle = (id: number, currentStatus: boolean) => {
    updateBusinessVerification(id, !currentStatus);
    toast({
      title: currentStatus ? "Business Unverified" : "Business Verified",
      description: currentStatus
        ? "The business has been marked as unverified."
        : "The business has been marked as verified.",
    });
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate current password
    const adminPassword = getAdminPassword();
    if (currentPassword !== adminPassword) {
      toast({
        title: "Error",
        description: "Current password is incorrect.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate new password
    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "New password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    
    // Update password
    localStorage.setItem("adminPassword", newPassword);
    
    // Clear form and close dialog
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsPasswordDialogOpen(false);
    
    toast({
      title: "Password Changed",
      description: "Your admin password has been updated successfully.",
    });
  };

  const verifiedCount = businesses.filter((b) => b.verified).length;
  const pendingCount = businesses.filter((b) => !b.verified).length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Admin Access</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Login
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/")}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-primary">
              जनसेवा सूचक
            </Link>
            <div className="flex gap-2">
              <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Lock className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Admin Password</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleChangePassword} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min 6 characters)"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">Change Password</Button>
                      <Button type="button" variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
              <Link to="/">
                <Button variant="ghost">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Panel */}
      <section className="py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage and verify business listings in the directory
            </p>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-primary">{businesses.length}</div>
                <div className="text-sm text-muted-foreground">Total Listings</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-success">{verifiedCount}</div>
                <div className="text-sm text-muted-foreground">Verified Listings</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-warning">{pendingCount}</div>
                <div className="text-sm text-muted-foreground">Pending Verification</div>
              </CardContent>
            </Card>
          </div>

          {/* Listings Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Business Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {businesses.map((business) => (
                  <div
                    key={business.id}
                    className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <h3 className="font-semibold">{business.name}</h3>
                        {business.verified ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="mb-2 flex flex-wrap gap-2">
                        <Badge variant="secondary">{business.category}</Badge>
                        <Badge variant="outline">{business.city}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Owner: {business.ownerName}</p>
                        <p>Phone: {business.phone}</p>
                        <p>Added: {new Date(business.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          id={`verify-${business.id}`}
                          checked={business.verified}
                          onCheckedChange={() =>
                            handleVerificationToggle(business.id, business.verified)
                          }
                        />
                        <Label htmlFor={`verify-${business.id}`} className="cursor-pointer">
                          Verified
                        </Label>
                      </div>
                      <Link to={`/business/${business.id}`}>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Admin;
