import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Utensils } from "lucide-react";
import { Button } from "../components/ui/Button";

export const NotFound: React.FC = () => {
  return (
    <div className="py-24 max-w-md mx-auto text-center space-y-6 px-4">
      <div className="w-20 h-20 rounded-full bg-[var(--bg-secondary)] text-[var(--accent-primary)] flex items-center justify-center mx-auto shadow-md">
        <Utensils className="w-10 h-10 stroke-[1.5]" />
      </div>
      <h1 className="font-serif-heading font-extrabold text-4xl text-[var(--text-primary)]">
        404 - Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
        The bakery page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="inline-block pt-2">
        <Button variant="primary" size="md">
          <ArrowLeft className="w-4 h-4 mr-1" /> Return to Bakery Home
        </Button>
      </Link>
    </div>
  );
};
