import { getSiteConfig } from "@/lib/site-config";
import ContactForm from "@/components/store/ContactForm";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default async function ContactPage() {
  const config = await getSiteConfig();

  const info = [
    { icon: MapPin, label: "Address", value: config.address },
    { icon: Phone, label: "Phone", value: config.phone },
    { icon: Mail, label: "Email", value: config.email },
    { icon: Clock, label: "Hours", value: config.hours },
  ];

  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold text-puratva-green-dark">Get In Touch</h1>
          <p className="text-muted-foreground mt-2">We'd love to hear from you. Drop us a message and we'll respond promptly.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="bg-puratva-green text-white rounded-2xl p-6 space-y-5">
              <h2 className="font-bold text-lg">Contact Information</h2>
              {info.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="w-5 h-5 mt-0.5 text-puratva-gold shrink-0" />
                  <div>
                    <p className="text-xs text-white/60">{label}</p>
                    <p className="text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
