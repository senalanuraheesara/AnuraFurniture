import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject) {
      toast.error('Please select a subject');
      return;
    }
    setLoading(true);
    try {
      await api.post('/contact', formData);
      setSent(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      toast.success('Message sent! We\'ll reply within 24 hours.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not send message. Try WhatsApp or call us.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us – Anura Furniture</title>
        <meta name="description" content="Get in touch with Anura Furniture – Dekatana. Visit our showroom, call us, or send a message." />
      </Helmet>

      <div className="min-h-screen bg-white dark:bg-dark-bg">
        {/* Hero — pt clears fixed navbar */}
        <div className="bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 text-white pt-24 lg:pt-28 pb-14 px-4 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}
          />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
            <p className="text-blue-200 text-lg">We'd love to hear from you. Come visit our showroom or reach out online.</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16 pb-28">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h2>
                <div className="space-y-5">
                  {[
                    { icon: MapPin, label: 'Showroom Address', value: 'Dekatana, Western Province, Sri Lanka', href: 'https://maps.google.com' },
                    { icon: Phone, label: 'Phone / WhatsApp', value: '+94 72 330 3946', href: 'tel:+94723303946' },
                    { icon: Mail, label: 'Email', value: 'anurafurniture238@gmail.com', href: 'mailto:anurafurniture238@gmail.com' },
                    { icon: Clock, label: 'Working Hours', value: 'Mon – Sat: 8:30 AM – 6:30 PM\nSunday: 10:00 AM – 4:00 PM', href: null },
                  ].map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary-700 dark:text-primary-300" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm mb-0.5">{label}</p>
                        {href ? (
                          <a href={href} target={href.startsWith('http') ? '_blank' : undefined} className="text-gray-600 dark:text-gray-400 text-sm hover:text-primary-700 dark:hover:text-primary-300 transition-colors whitespace-pre-line">
                            {value}
                          </a>
                        ) : (
                          <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-line">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Contact */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Quick Contact</h3>
                <a href="https://wa.me/94723303946" target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-green-500 flex-shrink-0 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Chat on WhatsApp</p>
                    <p className="text-gray-600 dark:text-gray-300 text-xs">Typically replies within 1 hour</p>
                  </div>
                </a>

                <div className="flex gap-3">
                  {[
                    { href: 'https://facebook.com', icon: Facebook, label: 'Facebook', color: 'bg-blue-600' },
                    { href: 'https://instagram.com', icon: Instagram, label: 'Instagram', color: 'bg-pink-600' },
                  ].map(({ href, icon: Icon, label, color }) => (
                    <a key={label} href={href} target="_blank" rel="noreferrer"
                      className={`flex-1 flex items-center gap-2 p-3 rounded-xl ${color} text-white text-sm font-medium hover:opacity-90 transition-opacity`}>
                      <Icon className="w-4 h-4" /> {label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Map placeholder */}
              <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Dekatana, Western Province, Sri Lanka</p>
                  <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="text-primary-600 dark:text-primary-400 text-xs hover:underline mt-1 block">
                    Open in Google Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card p-8">
              {sent ? (
                <div className="text-center py-8">
                  <span className="text-5xl mb-4 block">✅</span>
                  <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-3">Message Sent!</h3>
                  <p className="text-gray-500 dark:text-gray-400">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="btn-primary mt-6">Send Another Message</button>
                </div>
              ) : (
                <>
                  <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">Send us a Message</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Fill out the form and we'll get back to you shortly</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name *</label>
                        <input value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} required placeholder="Your name" className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
                        <input value={formData.phone} onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))} placeholder="07X XXXXXXX" className="input-field" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
                      <input type="email" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} required placeholder="you@example.com" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject *</label>
                      <select value={formData.subject} onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))} required className="input-field">
                        <option value="">Select a subject</option>
                        <option value="Product Inquiry">Product Inquiry</option>
                        <option value="Custom Furniture Order">Custom Furniture Order</option>
                        <option value="Delivery & Installation">Delivery & Installation</option>
                        <option value="Warranty Claim">Warranty Claim</option>
                        <option value="Interior Design Consultation">Interior Design Consultation</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message *</label>
                      <textarea value={formData.message} onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))} required rows={5} placeholder="Tell us how we can help you..." className="input-field resize-none" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-base justify-center">
                      {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send className="w-4 h-4" /> Send Message</>}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
