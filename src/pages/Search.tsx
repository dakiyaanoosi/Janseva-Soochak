import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search as SearchIcon, MapPin, Star, CheckCircle2, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const categories = ["All", ...SERVICE_CATEGORIES];

const Search = () => {
  const { businesses } = useBusinesses();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [searchCity, setSearchCity] = useState(searchParams.get("city") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [filteredBusinesses, setFilteredBusinesses] = useState(businesses);

  useEffect(() => {
    // Filter businesses based on search params
    let results = businesses;

    if (searchQuery) {
      results = results.filter(
        (b) =>
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (b.description && b.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (searchCity) {
      results = results.filter((b) => b.city.toLowerCase().includes(searchCity.toLowerCase()));
    }

    if (selectedCategory && selectedCategory !== "All") {
      results = results.filter((b) => b.category === selectedCategory);
    }

    setFilteredBusinesses(results);
  }, [searchQuery, searchCity, selectedCategory, businesses]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (searchCity) params.set("city", searchCity);
    if (selectedCategory && selectedCategory !== "All") params.set("category", selectedCategory);
    setSearchParams(params);
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

      {/* Search Bar */}
      <section className="border-b bg-muted py-8">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex flex-col gap-4 md:flex-row">
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
                  <Button onClick={handleSearch}>Search</Button>
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Filter by:</span>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              {filteredBusinesses.length} Results Found
            </h2>
            <p className="text-muted-foreground">
              {searchQuery && `Showing results for "${searchQuery}"`}
              {searchCity && ` in ${searchCity}`}
            </p>
          </div>

          {filteredBusinesses.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">
                  No businesses found matching your criteria. Try adjusting your search.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredBusinesses.map((business) => (
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
                      <p className="mb-3 text-sm text-muted-foreground">
                        {business.description}
                      </p>
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
          )}
        </div>
      </section>
    </div>
  );
};

export default Search;
