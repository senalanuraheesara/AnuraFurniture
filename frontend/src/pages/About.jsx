import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Award, Users, Heart, Truck, Star, ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FOUNDING_YEAR, getYearsInBusiness } from '../utils/dates';

const values = [
  { icon: '🎨', title: 'Craftsmanship', desc: 'Every piece is crafted by skilled artisans with decades of experience in traditional and modern woodworking techniques.' },
  { icon: '💡', title: 'Innovation', desc: 'We blend traditional craftsmanship with cutting-edge technology, including AI-powered design tools for our customers.' },
  { icon: '🌿', title: 'Sustainability', desc: 'We source responsibly from certified suppliers and use eco-friendly materials whenever possible.' },
  { icon: '❤️', title: 'Customer First', desc: 'Your satisfaction is our priority. From selection to delivery to after-sales support, we\'re with you every step.' },
];

const team = [
  { name: 'U.A. Piyasena', role: 'Founder', desc: 'Furniture maestro with 30+ years of craftsmanship expertise', emoji: '👨‍💼' },
  { name: 'U.A.M. Chandika', role: 'Owner & Managing Director', desc: 'Leading Anura Furniture\'s vision, growth and day-to-day operations', emoji: '👨‍💼' },
  { name: 'Chamari Silva', role: 'Head of Design', desc: 'Award-winning interior designer shaping Sri Lanka\'s furniture aesthetic', emoji: '👩‍🎨' },
  { name: 'Ruwan Fernando', role: 'Operations Director', desc: 'Ensuring seamless delivery and customer experience island-wide', emoji: '👨‍💻' },
];

export default function About() {
  const yearsInBusiness = getYearsInBusiness();

  return (
    <>
      <Helmet>
        <title>About Us – Anura Furniture Dekatana</title>
        <meta name="description" content={`Learn about Anura Furniture – Dekatana, Sri Lanka's premier furniture destination since ${FOUNDING_YEAR}. Our story, mission, and team.`} />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary-950 via-primary-900 to-slate-900 text-white pt-32 pb-24 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }}
          />
          {/* Glowing background elements */}
          <div className="absolute -top-20 -right-20 w-[30rem] h-[30rem] bg-cyan-500/20 rounded-full blur-[120px]" />
          <div className="absolute -bottom-20 -left-20 w-[30rem] h-[30rem] bg-primary-500/20 rounded-full blur-[120px]" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <div className="flex justify-center mb-6">
                <span className="px-5 py-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 backdrop-blur-md text-cyan-300 font-semibold tracking-wide shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                  Our Story
                </span>
              </div>
              
              <h1 className="font-display text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
                Furniture <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-primary-300 filter drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">කලාවේ</span><br />
                <span className="text-white drop-shadow-md">මහ ගෙදර</span>
              </h1>
              
              <p className="text-blue-100/90 text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto font-light">
                For over {yearsInBusiness} years, we have been transforming Sri Lankan homes and offices with furniture that tells a story of quality, passion, and timeless beauty.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white dark:bg-dark-bg border-b border-gray-100 dark:border-gray-800 py-10 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: String(FOUNDING_YEAR), label: 'Founded' },
              { value: '15,000+', label: 'Happy Customers' },
              { value: '500+', label: 'Products' },
              { value: '4.9/5', label: 'Rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-4xl font-bold text-primary-800 dark:text-primary-300">{stat.value}</p>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Story */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <span className="badge-primary mb-4">Who We Are</span>
                <h2 className="section-title mb-6">A Legacy of Excellence</h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                  <p>
                    Anura Furniture – Dekatana began in {FOUNDING_YEAR} as a small workshop in Kadawatha with a simple vision: to bring world-class furniture craftsmanship to every Sri Lankan home at an accessible price.
                  </p>
                  <p>
                    Founded by master craftsman U.A. Piyasena, our journey began with hand-crafting custom furniture for clients across Colombo. Today, we have grown into Sri Lanka's most trusted AI-powered furniture destination, with a showroom spanning 15,000 sq. ft. and an online store serving customers island-wide.
                  </p>
                  <p>
                    We blend {yearsInBusiness} years of traditional craftsmanship with modern technology – including AI-powered design tools, virtual room visualization, and smart recommendation engines – to deliver an unmatched furniture experience.
                  </p>
                </div>
                <div className="flex gap-4 mt-8">
                  <Link to="/shop" className="btn-primary">Explore Collection <ArrowRight className="w-4 h-4" /></Link>
                  <Link to="/custom-order" className="btn-secondary">Custom Order</Link>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
                <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-primary-900 to-cyan-900 flex items-center justify-center text-8xl">
                  🏭
                </div>
                <div className="absolute -bottom-6 -left-6 card p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center">
                      <Award className="w-5 h-5 text-gold-600 dark:text-gold-400" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-white">Best Furniture Store</p>
                      <p className="text-gray-500 text-xs">Sri Lanka Awards 2023</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900/30">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <span className="badge-gold mb-4">Our Values</span>
              <h2 className="section-title">What Drives Us</h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, i) => (
                <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6 text-center hover:-translate-y-1">
                  <span className="text-4xl mb-4 block">{value.icon}</span>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <span className="badge-cyan mb-4">Our Team</span>
              <h2 className="section-title">Meet the People Behind the Magic</h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, i) => (
                <motion.div key={member.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card p-6 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-cyan-100 dark:from-primary-900/30 dark:to-cyan-900/30 flex items-center justify-center text-5xl mx-auto mb-4">
                    {member.emoji}
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-primary-600 dark:text-primary-400 text-sm font-medium mt-0.5">{member.role}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-2 leading-relaxed">{member.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="py-20 px-4 bg-gray-950 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl font-bold mb-6">Visit Our Showroom</h2>
            <div className="flex items-center justify-center gap-3 mb-4">
              <MapPin className="w-5 h-5 text-cyan-400" />
              <p className="text-gray-300">Dekatana, Western Province, Sri Lanka</p>
            </div>
            <p className="text-gray-400 mb-8">Monday – Saturday: 8:30 AM – 6:30 PM | Sunday: 10:00 AM – 4:00 PM</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact" className="btn-cyan">Contact Us</Link>
              <a href="https://wa.me/94723303946" target="_blank" rel="noreferrer" className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
