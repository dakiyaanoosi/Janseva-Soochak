import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useBusinesses } from "@/contexts/BusinessContext";

// Mock business data
const mockBusiness = {
  id: 1,
  name: "QuickFix Plumbing",
  ownerName: "John Doe",
  category: "Plumbing",
  city: "New York",
  address: "123 Main Street, New York, NY 10001",
  phone: "+1 (555) 123-4567",
  description:
    "24/7 emergency plumbing services with certified professionals. We handle everything from leaky faucets to full bathroom renovations. Over 15 years of experience serving the NYC area.",
  verified: true,
  reviews: [
    {
      id: 1,
      userName: "John Smith",
      rating: 5,
      comment: "Excellent service! Fixed my leak in no time. Very professional and affordable.",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      userName: "Sarah Johnson",
      rating: 5,
      comment: "Quick response and great work. Highly recommend!",
      createdAt: "2024-01-10",
    },
    {
      id: 3,
      userName: "Mike Brown",
      rating: 4,
      comment: "Good service, arrived on time and fixed the issue.",
      createdAt: "2024-01-05",
    },
  ],
};

const Business = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { getBusinessById, addReview } = useBusinesses();
  const [reviewForm, setReviewForm] = useState({
    userName: "",
    rating: 5,
    comment: "",
  });

  const business = getBusinessById(Number(id));
  
  if (!business) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Business Not Found</h2>
            <p className="text-muted-foreground mb-6">The business you're looking for doesn't exist.</p>
            <Link to="/">
              <Button>Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const averageRating = business.reviews && business.reviews.length > 0
    ? (business.reviews.reduce((sum, r) => sum + r.rating, 0) / business.reviews.length).toFixed(1)
    : "N/A";

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reviewForm.userName || !reviewForm.comment) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    addReview(business.id, {
      user_name: reviewForm.userName,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    });

    toast({
      title: "Review Submitted!",
      description: "Thank you for your feedback.",
    });

    setReviewForm({ userName: "", rating: 5, comment: "" });
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
            <Link to="/">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Business Details */}
      <section className="py-12">
        <div className="container mx-auto max-w-5xl px-4">
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h1 className="text-3xl font-bold">{business.name}</h1>
                    {business.verified && (
                      <Badge variant="default" className="bg-success">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <Badge variant="secondary" className="mb-4">
                    {business.category}
                  </Badge>
                  <div className="mb-2 flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{business.address}</span>
                  </div>
                  <div className="mb-4 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${business.phone}`} className="text-primary hover:underline">
                      {business.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-warning text-warning" />
                      <span className="text-xl font-semibold">{averageRating}</span>
                    </div>
                    <span className="text-muted-foreground">
                      ({business.reviews?.length || 0} reviews)
                    </span>
                  </div>
                </div>
                <Button size="lg" className="md:w-auto">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Now
                </Button>
              </div>

              <div>
                <h2 className="mb-2 text-xl font-semibold">About</h2>
                <p className="text-muted-foreground">{business.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {business.reviews && business.reviews.length > 0 ? (
                business.reviews.map((review, idx) => (
                  <div key={idx} className="border-b pb-6 last:border-b-0 last:pb-0">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{review.user_name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No reviews yet. Be the first to review!
                </p>
              )}
            </CardContent>
          </Card>

          {/* Add Review Form */}
          <Card>
            <CardHeader>
              <CardTitle>Write a Review</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userName">Your Name</Label>
                  <Input
                    id="userName"
                    value={reviewForm.userName}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, userName: e.target.value })
                    }
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Rating</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating })}
                        className="transition-all hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            rating <= reviewForm.rating
                              ? "fill-warning text-warning"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Your Review</Label>
                  <Textarea
                    id="comment"
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, comment: e.target.value })
                    }
                    placeholder="Share your experience..."
                    rows={4}
                    required
                  />
                </div>

                <Button type="submit">Submit Review</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Business;
