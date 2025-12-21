'use client';
import { useState } from 'react';
import Link from 'next/link';
import { sendContactMessage } from '@/app/actions/contactActions';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = 'Full Name is required.';
    if (!formData.email) {
      newErrors.email = 'Email Address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email Address is invalid.';
    }
    if (!formData.message) newErrors.message = 'Message is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setStatus('loading');
    try {
      const result = await sendContactMessage(formData);
      if (result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        // Show error message from server action
        alert(result.message);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
      alert('There was an error sending your message. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen bg-[#9ECFD4]">
      {/* Header Section */}
      <div className="bg-[#9ECFD4] pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-black mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-gray-800 max-w-2xl mx-auto">
              We&apos;d love to hear from you. Get in touch with us.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Contact Form */}
          <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg border-2 border-transparent hover:border-black transition-all duration-300">
            <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-black">Send a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Full Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-black focus:border-black'
                  }`}
                  disabled={status === 'loading'}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-black focus:border-black'
                  }`}
                  disabled={status === 'loading'}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject" 
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-300"
                  disabled={status === 'loading'}
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows={5} 
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                    errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-black focus:border-black'
                  }`}
                  disabled={status === 'loading'}
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-black text-white py-4 rounded-xl hover:bg-gray-800 transition-all duration-300 font-bold border-2 border-transparent hover:border-white transform hover:scale-105"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>

              {status === 'success' && (
                <p className="mt-4 text-center text-green-600 font-semibold">Message sent successfully!</p>
              )}
              {status === 'error' && (
                <p className="mt-4 text-center text-red-500 font-semibold">Failed to send message. Please try again later.</p>
              )}
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-6 lg:space-y-8">
            <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg border-2 border-transparent hover:border-black transition-all duration-300">
              <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-black">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#016B61] rounded-full flex items-center justify-center mr-4">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <Link href="mailto:juneedkhen@gmail.com" className="text-gray-700 hover:text-black transition-colors duration-300">
                    meyuzasdesigen@gmail.com
                  </Link>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#016B61] rounded-full flex items-center justify-center mr-4">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <Link href="tel:+923122401741" className="text-gray-700 hover:text-black transition-colors duration-300">
                    +92 312 2401741
                  </Link>
                </div>

                <div className="flex items-center">
                  <div className="w-8 h-8 bg-[#016B61] rounded-full flex items-center justify-center mr-4">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-700">3E-8 Comm Area Nazimabad no.3, Karachi, Pakistan</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg border-2 border-transparent hover:border-black transition-all duration-300">
              <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-black">Our Location</h2>
              <div className="h-64 lg:h-80 rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.203670980599!2d67.0268185!3d24.9155013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f0011093519%3A0xe4567cbbc2cab16a!2sMeyuza's%20designs!5e0!3m2!1sen!2s!4v1678255909090!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Our Location - Meyuza's Designs, Karachi, Pakistan"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;