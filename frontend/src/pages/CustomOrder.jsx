import { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Upload, Send, Check, Wand2, X, Sparkles } from 'lucide-react';
import api from '../services/api';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const FURNITURE_TYPES = ['Sofa Set', 'Bed Frame', 'Wardrobe', 'Dining Table & Chairs', 'TV Unit', 'Bookshelf', 'Office Desk', 'Outdoor Furniture', 'Kitchen Cabinet', 'Other'];
const MATERIALS = ['Teak Wood', 'Mahogany', 'Pine Wood', 'Rubber Wood', 'MDF', 'Metal Frame', 'Glass', 'Rattan', 'Fabric Upholstery', 'Leather'];
const COLORS_OPTIONS = ['Natural Wood', 'White', 'Black', 'Walnut Brown', 'Light Oak', 'Dark Espresso', 'Grey', 'Navy Blue', 'Beige'];

export default function CustomOrder() {
  const { user } = useSelector((state) => state.auth);
  const fileRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    furnitureType: '',
    description: '',
    dimensions: { length: '', width: '', height: '', unit: 'cm' },
    materials: [],
    colors: [],
    budget: { min: '', max: '' },
    timeline: '',
    notes: '',
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState('');

  const toggleArray = (key, value) => {
    setFormData((p) => ({
      ...p,
      [key]: p[key].includes(value) ? p[key].filter((v) => v !== value) : [...p[key], value],
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((f) => ({ file: f, url: URL.createObjectURL(f), name: f.name }));
    setImages((p) => [...p, ...previews].slice(0, 5));
  };

  const removeImage = (i) => setImages((p) => p.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.furnitureType) { toast.error('Please select furniture type'); return; }
    setLoading(true);
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === 'object' && !Array.isArray(value)) {
          form.append(key, JSON.stringify(value));
        } else if (Array.isArray(value)) {
          value.forEach((v) => form.append(key, v));
        } else {
          form.append(key, value);
        }
      });
      images.forEach((img) => { if (img.file) form.append('images', img.file); });

      const { data } = await api.post('/custom-orders', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setReference(data.customOrder.reference);
      setSubmitted(true);
      toast.success('Custom order request submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900/30 px-4 py-16">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card p-12 max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-4">Request Submitted!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-3">
            Your custom furniture request has been received. Our team will review and contact you within 24-48 hours.
          </p>
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4 mb-6">
            <p className="text-primary-700 dark:text-primary-300 font-semibold text-sm">Reference Number</p>
            <p className="text-primary-900 dark:text-primary-200 font-mono text-xl font-bold mt-1">{reference}</p>
          </div>
          <p className="text-gray-500 text-sm mb-6">A confirmation email has been sent to <strong>{formData.email}</strong></p>
          <div className="flex gap-3">
            <button onClick={() => setSubmitted(false)} className="btn-secondary flex-1">Submit Another</button>
            <a href="/" className="btn-primary flex-1 text-center">Go Home</a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Custom Furniture Order – Anura Furniture</title>
        <meta name="description" content="Order custom-made furniture tailored to your exact specifications. Upload inspiration images, specify dimensions and materials." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900/30">
        <div className="bg-gradient-to-br from-primary-900 to-primary-800 text-white pt-32 pb-16 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-80 h-80 bg-cyan-400 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-primary-400 rounded-full blur-3xl" />
          </div>
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="flex justify-center mb-8 relative"
            >
              <div className="relative group">
                {/* Glowing aura */}
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-cyan-400/30 rounded-3xl blur-xl" 
                />
                
                {/* Main icon container */}
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-white/10 to-white/30 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-[0_0_40px_rgba(34,211,238,0.3)] animate-float">
                  <Wand2 className="w-12 h-12 text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
                  
                  {/* Rotating dashed border */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-4px] border border-dashed border-cyan-300/40 rounded-[28px]"
                  />
                </div>
                
                {/* Sparkle decorators */}
                <motion.div
                  animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="absolute -top-4 -right-4"
                >
                  <Sparkles className="w-6 h-6 text-yellow-300" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-2 -left-4"
                >
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                </motion.div>
              </div>
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">Custom Furniture Order</h1>
            <p className="text-blue-200 text-lg">Tell us your dream furniture and we'll bring it to life</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Info */}
            <div className="card p-6 space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
                  <input value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} required className="input-field" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone *</label>
                  <input value={formData.phone} onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))} required placeholder="07X XXXXXXX" className="input-field" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} required className="input-field" />
                </div>
              </div>
            </div>

            {/* Furniture Type */}
            <div className="card p-6 space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Furniture Type *</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {FURNITURE_TYPES.map((type) => (
                  <button key={type} type="button"
                    onClick={() => setFormData(p => ({ ...p, furnitureType: type }))}
                    className={`py-3 px-4 rounded-xl border-2 text-sm font-medium text-center transition-all ${formData.furnitureType === type ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-primary-300'}`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="card p-6 space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Description *</h3>
              <textarea value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} required rows={4} placeholder="Describe your furniture in detail. Include style preferences, usage, any special requirements..." className="input-field resize-none" />
            </div>

            {/* Dimensions */}
            <div className="card p-6 space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Dimensions (Optional)</h3>
              <div className="grid grid-cols-4 gap-3">
                {['length', 'width', 'height'].map((dim) => (
                  <div key={dim}>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 capitalize">{dim}</label>
                    <input type="number" value={formData.dimensions[dim]} onChange={(e) => setFormData(p => ({ ...p, dimensions: { ...p.dimensions, [dim]: e.target.value } }))} placeholder="0" min="0" className="input-field text-sm py-2" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Unit</label>
                  <select value={formData.dimensions.unit} onChange={(e) => setFormData(p => ({ ...p, dimensions: { ...p.dimensions, unit: e.target.value } }))} className="input-field text-sm py-2">
                    <option value="cm">cm</option>
                    <option value="inch">inch</option>
                    <option value="feet">feet</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Materials & Colors */}
            <div className="card p-6 space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-3">Preferred Materials</h3>
                <div className="flex flex-wrap gap-2">
                  {MATERIALS.map((mat) => (
                    <button key={mat} type="button"
                      onClick={() => toggleArray('materials', mat)}
                      className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${formData.materials.includes(mat) ? 'bg-primary-800 text-white border-primary-800' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary-400'}`}>
                      {mat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-3">Color Preferences</h3>
                <div className="flex flex-wrap gap-2">
                  {COLORS_OPTIONS.map((color) => (
                    <button key={color} type="button"
                      onClick={() => toggleArray('colors', color)}
                      className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${formData.colors.includes(color) ? 'bg-primary-800 text-white border-primary-800' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary-400'}`}>
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Budget & Timeline */}
            <div className="card p-6 space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Budget & Timeline</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Min Budget (Rs.)</label>
                  <input type="number" value={formData.budget.min} onChange={(e) => setFormData(p => ({ ...p, budget: { ...p.budget, min: e.target.value } }))} placeholder="50000" min="0" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Max Budget (Rs.)</label>
                  <input type="number" value={formData.budget.max} onChange={(e) => setFormData(p => ({ ...p, budget: { ...p.budget, max: e.target.value } }))} placeholder="150000" min="0" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Needed By</label>
                  <select value={formData.timeline} onChange={(e) => setFormData(p => ({ ...p, timeline: e.target.value }))} className="input-field">
                    <option value="">Flexible</option>
                    <option>Within 2 weeks</option>
                    <option>Within 1 month</option>
                    <option>1-2 months</option>
                    <option>2-3 months</option>
                    <option>No rush</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Inspiration Images */}
            <div className="card p-6 space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Inspiration Images (Optional)</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Upload up to 5 images for reference</p>
              <div className="flex flex-wrap gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center hover:border-primary-400 transition-colors text-gray-400 hover:text-primary-500">
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-xs">Upload</span>
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
            </div>

            {/* Notes */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-3">Additional Notes</h3>
              <textarea value={formData.notes} onChange={(e) => setFormData(p => ({ ...p, notes: e.target.value }))} rows={3} placeholder="Any other specific requirements or notes for our team..." className="input-field resize-none" />
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary py-5 text-lg justify-center">
              {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</> : <><Send className="w-5 h-5" /> Submit Custom Order Request</>}
            </button>

            <p className="text-center text-gray-400 text-sm">
              Our team will review your request and contact you within 24-48 hours with a quotation.
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
