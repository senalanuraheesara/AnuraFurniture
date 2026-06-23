import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { User, Camera, Lock, Bell, Shield, Save, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false });

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/api/auth/profile', form);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSaving(true);
    try {
      await api.put('/api/auth/change-password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <>
      <Helmet><title>My Profile – Anura Furniture</title></Helmet>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900/30 pt-24 lg:pt-28 py-8 px-4 pb-mobile-nav">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="card p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-700 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0)?.toUpperCase()
                  )}
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-800 text-white rounded-lg flex items-center justify-center shadow-md hover:bg-primary-700 transition-colors">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <h2 className="font-bold text-xl text-gray-900 dark:text-white">{user?.name}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
                <span className="badge bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 capitalize text-xs mt-1">{user?.role}</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-gray-200 dark:bg-gray-800 rounded-xl mb-6">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === id ? 'bg-white dark:bg-gray-900 text-primary-700 dark:text-primary-400 shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}>
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>

          {activeTab === 'profile' && (
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-5">Personal Information</h3>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                  <input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                  <input value={form.email} onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))} type="email" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Number</label>
                  <input value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} type="tel" className="input-field" />
                </div>
                <button type="submit" disabled={saving} className="btn-primary w-full justify-center">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2"><Shield className="w-5 h-5 text-primary-600" /> Change Password</h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                {[
                  { key: 'currentPassword', label: 'Current Password', showKey: 'current' },
                  { key: 'newPassword', label: 'New Password', showKey: 'new' },
                  { key: 'confirmPassword', label: 'Confirm New Password', showKey: 'confirm' },
                ].map(({ key, label, showKey }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                    <div className="relative">
                      <input
                        type={showPwd[showKey] ? 'text' : 'password'}
                        value={passwords[key]}
                        onChange={(e) => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                        className="input-field pr-12"
                      />
                      <button type="button" onClick={() => setShowPwd(p => ({ ...p, [showKey]: !p[showKey] }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPwd[showKey] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
                <button type="submit" disabled={saving} className="btn-primary w-full justify-center">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Lock className="w-4 h-4" /> Change Password</>}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
