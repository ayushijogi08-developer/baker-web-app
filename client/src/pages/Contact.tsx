import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/Button";
import { PlatformDeliveryButtons } from "../components/ui/PlatformDeliveryButtons";
import { fadeInUpVariants, staggerContainerVariants, staggerItemVariants } from "../utils/animationUtils";

export const Contact: React.FC = () => {
  const { storeSettings } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "General Inquiry / Custom Cake Request",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone && formData.message) {
      const mailtoUrl = `mailto:${storeSettings?.email}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
        `Name: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`;
      window.open(mailtoUrl, "_blank");
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 overflow-hidden">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainerVariants(0.1, 0.05)}
        className="text-center max-w-2xl mx-auto space-y-2"
      >
        <motion.span variants={staggerItemVariants} className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)] block">
          Get In Touch
        </motion.span>
        <motion.h1 variants={staggerItemVariants} className="font-serif-heading font-extrabold text-3xl sm:text-4xl text-[var(--text-primary)]">
          Contact {storeSettings?.storeName || "The Hidden Bakers"}
        </motion.h1>
        <motion.p variants={staggerItemVariants} className="text-xs sm:text-sm text-[var(--text-secondary)]">
          Have a question about custom cake designs, party orders, or delivery timing in Akola? Call us directly or send a message below.
        </motion.p>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Info Card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUpVariants}
          className="space-y-6"
        >
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 sm:p-8 rounded-3xl space-y-5 shadow-sm">
            <h3 className="font-serif-heading font-bold text-xl text-[var(--text-primary)]">
              Store Contact Details
            </h3>

            <div className="space-y-4 text-xs text-[var(--text-secondary)]">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[var(--text-primary)] block font-bold">Address:</strong>
                  <span>{storeSettings?.address}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[var(--accent-primary)] shrink-0" />
                <div>
                  <strong className="text-[var(--text-primary)] block font-bold">Phone Number:</strong>
                  <a href={`tel:${storeSettings?.phone?.replace(/\s+/g, "")}`} className="text-[var(--accent-primary)] font-extrabold hover:underline">
                    {storeSettings?.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[var(--accent-primary)] shrink-0" />
                <div>
                  <strong className="text-[var(--text-primary)] block font-bold">Email:</strong>
                  <span>{storeSettings?.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[var(--accent-primary)] shrink-0" />
                <div>
                  <strong className="text-[var(--text-primary)] block font-bold">Operating Hours:</strong>
                  <span>{storeSettings?.openingHours}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a href={`tel:${storeSettings?.phone?.replace(/\s+/g, "")}`}>
                <Button variant="primary" size="md">
                  <Phone className="w-4 h-4 mr-1" /> Call Store Now
                </Button>
              </a>
              <a
                href={`https://wa.me/${storeSettings?.whatsappNumber}?text=${encodeURIComponent("Hello! I have a question about custom cakes.")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="md">
                  <MessageCircle className="w-4 h-4 mr-1 text-emerald-600" /> WhatsApp Chat
                </Button>
              </a>
            </div>
          </div>

          {/* Online Delivery Platforms Card */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 sm:p-7 rounded-3xl space-y-4 shadow-sm">
            <PlatformDeliveryButtons variant="cards" />
          </div>
        </motion.div>

        {/* Right Message Form */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeInUpVariants}
          className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 sm:p-8 rounded-3xl shadow-sm space-y-6"
        >
          <h3 className="font-serif-heading font-bold text-xl text-[var(--text-primary)]">
            Send Us a Message
          </h3>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[var(--text-primary)] mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="097650 13112"
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--text-primary)] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="priya@example.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--text-primary)] mb-1">
                  Your Message / Requirements *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your cake theme, flavor preferences, date needed, or general inquiry..."
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] resize-none"
                />
              </div>

              <Button type="submit" variant="primary" size="lg" className="w-full">
                <Send className="w-4 h-4 mr-1" /> Submit Message
              </Button>
            </form>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-12 text-center space-y-4"
            >
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="font-serif-heading font-bold text-xl text-[var(--text-primary)]">
                Thank You For Reaching Out!
              </h4>
              <Button onClick={() => setSubmitted(false)} variant="secondary" size="sm">
                Send Another Message
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
