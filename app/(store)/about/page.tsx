import { getSiteConfig } from "@/lib/site-config";
import { Leaf, Heart, Shield, Users } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  const config = await getSiteConfig();

  const values = [
    { icon: Leaf, title: "100% Organic", desc: "Every product is certified organic, free from pesticides and artificial additives." },
    { icon: Heart, title: "Farm to Table", desc: "We work directly with small-scale farmers to bring you the freshest produce." },
    { icon: Shield, title: "Quality Assured", desc: "Rigorous quality checks at every stage to ensure purity and authenticity." },
    { icon: Users, title: "Community First", desc: "Supporting farming communities and sustainable agriculture practices." },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-puratva-green text-white py-20">
        <div className="container text-center max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-puratva-gold rounded-full flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-8 h-8 text-puratva-green-dark" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-4">{config.aboutHeroTitle}</h1>
          <p className="text-white/80 text-lg leading-relaxed">{config.aboutHeroText}</p>
        </div>
      </section>

      {/* Story */}
      <section className="container py-16 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-display font-bold text-puratva-green-dark mb-4">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{config.aboutStory}</p>
            <p className="text-muted-foreground leading-relaxed">{config.aboutMission}</p>
          </div>
          <div className="bg-puratva-cream rounded-2xl p-8 text-center">
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: "50+", label: "Partner Farms" },
                { value: "10K+", label: "Happy Customers" },
                { value: "100%", label: "Organic Certified" },
                { value: "5â˜…", label: "Avg. Rating" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-3xl font-bold text-puratva-green">{value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-puratva-cream py-16">
        <div className="container max-w-4xl mx-auto">
          <h2 className="text-2xl font-display font-bold text-puratva-green-dark text-center mb-10">Our Values</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 flex gap-4">
                <div className="w-12 h-12 bg-puratva-green/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-puratva-green" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
