'use server';

import { client } from '@/sanity/lib/client';

// Define the interface for contact messages
interface ContactMessage {
  _type: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  sentAt: string;
}

export async function sendContactMessage(formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    // Validate the form data
    if (!formData.name || !formData.email || !formData.message) {
      return {
        success: false,
        message: 'Name, email, and message are required fields.'
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return {
        success: false,
        message: 'Please provide a valid email address.'
      };
    }

    // Create the contact message document in Sanity
    const newMessage: ContactMessage = {
      _type: 'contactMessage',
      name: formData.name,
      email: formData.email,
      subject: formData.subject || 'Contact Form Message',
      message: formData.message,
      sentAt: new Date().toISOString(),
    };

    await client.create(newMessage);

    return {
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.'
    };
  } catch (error) {
    console.error('Error sending contact message:', error);
    return {
      success: false,
      message: 'There was an error sending your message. Please try again later.'
    };
  }
}