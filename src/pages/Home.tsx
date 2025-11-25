import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Star, CheckCircle2, Wrench, Heart, GraduationCap, Home as HomeIcon, Car, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBusinesses } from "@/contexts/BusinessContext";
import { SearchAutocomplete } from "@/components/SearchAutocomplete";

const INDIAN_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad", 
  "Pune", "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur",
  "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna"
];

const SERVICE_CATEGORIES = [
  "Plumbing", "Healthcare", "Education", "Home Repair", "Auto Services",
  "Electrical", "Painting", "Cleaning", "Carpentry", "Beauty & Spa"
];

const categoryIcons = [
  { name: "Plumbing", icon: Wrench },
  { name: "Healthcare", icon: Heart },
  { name: "Education", icon: GraduationCap },
  { name: "Home Repair", icon: HomeIcon },
  { name: "Auto Services", icon: Car },
];

const Home = () => {
  const { businesses } = useBusinesses();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCity, setSearchCity] = useState("");
  
  // Calculate actual provider counts dynamically
  const categories = useMemo(() => {
    return categoryIcons.map(cat => ({
      ...cat,
      count: businesses.filter(b => b.category === cat.name).length
    }));
  }, [businesses]);
  
  const featuredBusinesses = businesses.filter(b => b.verified).slice(0, 4);
  const recentReviews = businesses
    .flatMap(b => (b.reviews || []).map(r => ({ ...r, businessName: b.name })))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to search page with query params using React Router
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (searchCity) params.set("city", searchCity);
    window.location.href = `/search${params.toString() ? `?${params.toString()}` : ''}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-primary">
              जनसेवा सूचक
            </Link>
            <nav className="flex items-center gap-4">
              <Link to="/add">
                <Button variant="outline">Add Listing</Button>
              </Link>
              <Link to="/admin">
                <Button variant="ghost">Admin</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 py-20 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-5xl font-bold">Find Local Services You Can Trust</h1>
            <p className="mb-8 text-xl opacity-90">
              Connect with verified professionals in your area for all your service needs
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mx-auto max-w-2xl">
              <Card className="bg-card shadow-lg">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 md:flex-row">
                    <SearchAutocomplete
                      value={searchQuery}
                      onChange={setSearchQuery}
                      placeholder="What service are you looking for?"
                      suggestions={SERVICE_CATEGORIES}
                      className="flex-1"
                    />
                    <SearchAutocomplete
                      value={searchCity}
                      onChange={setSearchCity}
                      placeholder="City"
                      suggestions={INDIAN_CITIES}
                      className="flex-1"
                    />
                    <Button type="submit" size="lg">
                      Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Popular Categories</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => (
              <Link key={category.name} to={`/search?category=${category.name}`}>
                <Card className="transition-all hover:shadow-md">
                  <CardContent className="flex flex-col items-center p-6 text-center">
                    <category.icon className="mb-3 h-12 w-12 text-primary" />
                    <h3 className="mb-1 font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} providers</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold">Featured Service Providers</h2>
            <Link to="/search">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredBusinesses.map((business) => (
              <Link key={business.id} to={`/business/${business.id}`}>
                <Card className="h-full transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-3 flex items-start justify-between">
                      <h3 className="font-semibold">{business.name}</h3>
                      {business.verified && (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      )}
                    </div>
                    <Badge variant="secondary" className="mb-3">
                      {business.category}
                    </Badge>
                    <p className="mb-3 text-sm text-muted-foreground">{business.description}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{business.city}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="font-semibold">{business.rating || "New"}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({business.reviews?.length || 0} reviews)
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Reviews */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Recent Reviews</h2>
          <div className="mx-auto max-w-4xl space-y-6">
            {recentReviews.map((review, idx) => (
              <Card key={idx}>
                <CardContent className="p-6">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{review.businessName}</h4>
                      <p className="text-sm text-muted-foreground">by {review.user_name}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm">{review.comment}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Are You a Service Provider?</h2>
          <p className="mb-8 text-xl opacity-90">
            Join thousands of professionals connecting with customers in their area
          </p>
          <Link to="/add">
            <Button size="lg" variant="secondary">
              Add Your Business
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 जनसेवा सूचक. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
