import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Review {
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Business {
  id: number;
  name: string;
  ownerName: string;
  category: string;
  city: string;
  address?: string;
  phone: string;
  description?: string;
  verified: boolean;
  rating?: number;
  reviews?: Review[];
  createdAt: string;
}

interface BusinessContextType {
  businesses: Business[];
  addBusiness: (business: Omit<Business, "id" | "createdAt" | "verified" | "reviews">) => void;
  updateBusinessVerification: (id: number, verified: boolean) => void;
  addReview: (businessId: number, review: Omit<Review, "created_at">) => void;
  getBusinessById: (id: number) => Business | undefined;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

const initialBusinesses: Business[] = [
  {
    id: 1,
    name: "QuickFix Plumbing Services",
    ownerName: "Rajesh Kumar",
    category: "Plumbing",
    city: "Mumbai",
    address: "Shop 12, Andheri West, Mumbai, Maharashtra",
    phone: "+91 98765 43210",
    description: "Professional plumbing services available 24/7. Licensed and insured with over 15 years of experience serving Mumbai.",
    verified: true,
    rating: 4.8,
    reviews: [
      { user_name: "Priya Sharma", rating: 5, comment: "Excellent service! Fixed our leak quickly.", created_at: "2024-01-10" },
      { user_name: "Amit Patel", rating: 4, comment: "Professional and affordable.", created_at: "2024-01-08" },
    ],
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Dr. Priya Health Clinic",
    ownerName: "Dr. Priya Mehta",
    category: "Healthcare",
    city: "Delhi",
    address: "Green Park, New Delhi",
    phone: "+91 98765 43211",
    description: "Family medicine and preventive care. Accepting new patients. MBBS, MD with 10+ years experience.",
    verified: true,
    rating: 4.9,
    reviews: [
      { user_name: "Sneha Reddy", rating: 5, comment: "Dr. Priya is amazing! Very caring and thorough.", created_at: "2024-01-12" },
    ],
    createdAt: "2024-01-14",
  },
  {
    id: 3,
    name: "Brilliant Minds Tutoring",
    ownerName: "Vikram Singh",
    category: "Education",
    city: "Bangalore",
    address: "Koramangala, Bangalore, Karnataka",
    phone: "+91 98765 43212",
    description: "Expert tutoring for all subjects, from Class 1 to IIT-JEE preparation. Experienced faculty.",
    verified: true,
    rating: 4.7,
    createdAt: "2024-01-13",
  },
  {
    id: 4,
    name: "Home Renovation Experts",
    ownerName: "Suresh Iyer",
    category: "Home Repair",
    city: "Chennai",
    address: "T Nagar, Chennai, Tamil Nadu",
    phone: "+91 98765 43213",
    description: "Complete home renovation and interior design services. Quality work guaranteed.",
    verified: false,
    rating: 4.5,
    createdAt: "2024-01-12",
  },
  {
    id: 5,
    name: "City Auto Care",
    ownerName: "Anil Kapoor",
    category: "Auto Services",
    city: "Pune",
    address: "Kothrud, Pune, Maharashtra",
    phone: "+91 98765 43214",
    description: "Full-service auto repair and maintenance for all car brands. Certified mechanics.",
    verified: false,
    rating: 4.6,
    createdAt: "2024-01-11",
  },
];

const DATA_VERSION = "v2_indian"; // Update this when initialBusinesses changes

export const BusinessProvider = ({ children }: { children: ReactNode }) => {
  const [businesses, setBusinesses] = useState<Business[]>(() => {
    try {
      const saved = localStorage.getItem("businesses");
      const savedVersion = localStorage.getItem("businessesVersion");
      
      // Reset to initial data if version doesn't match (e.g., after updating to Indian data)
      if (saved && savedVersion === DATA_VERSION) {
        const parsed = JSON.parse(saved);
        // Validate parsed data is an array
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      // If no valid saved data, use initial businesses
      localStorage.setItem("businessesVersion", DATA_VERSION);
      return initialBusinesses;
    } catch (error) {
      console.error("Error loading businesses from localStorage:", error);
      localStorage.setItem("businessesVersion", DATA_VERSION);
      return initialBusinesses;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("businesses", JSON.stringify(businesses));
    } catch (error) {
      console.error("Error saving businesses to localStorage:", error);
    }
  }, [businesses]);

  const addBusiness = (business: Omit<Business, "id" | "createdAt" | "verified" | "reviews">) => {
    const newBusiness: Business = {
      ...business,
      id: businesses.length > 0 ? Math.max(...businesses.map(b => b.id), 0) + 1 : 1,
      createdAt: new Date().toISOString(),
      verified: false,
      reviews: [],
    };
    setBusinesses(prev => [newBusiness, ...prev]);
  };

  const updateBusinessVerification = (id: number, verified: boolean) => {
    setBusinesses(prev =>
      prev.map(business =>
        business.id === id ? { ...business, verified } : business
      )
    );
  };

  const addReview = (businessId: number, review: Omit<Review, "created_at">) => {
    setBusinesses(prev =>
      prev.map(business => {
        if (business.id === businessId) {
          const newReview: Review = {
            ...review,
            created_at: new Date().toISOString(),
          };
          const updatedReviews = [...(business.reviews || []), newReview];
          const avgRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
          return {
            ...business,
            reviews: updatedReviews,
            rating: Math.round(avgRating * 10) / 10,
          };
        }
        return business;
      })
    );
  };

  const getBusinessById = (id: number) => {
    return businesses.find(b => b.id === id);
  };

  return (
    <BusinessContext.Provider value={{ businesses, addBusiness, updateBusinessVerification, addReview, getBusinessById }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusinesses = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error("useBusinesses must be used within BusinessProvider");
  }
  return context;
};
