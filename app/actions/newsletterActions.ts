'use server';

import { client } from '@/sanity/lib/client';

export async function subscribeToNewsletter(email: string) {
  try {
    // Check if email is already subscribed
    const existingSubscription = await client.fetch(
      `*[_type == "newsletterSubscription" && email == $email][0]`,
      { email }
    );

    if (existingSubscription) {
      // If already subscribed and active, return error
      if (existingSubscription.isActive) {
        return {
          success: false,
          message: 'This email is already subscribed to our newsletter.'
        };
      } else {
        // If previously unsubscribed, reactivate
        await client.patch(existingSubscription._id).set({ isActive: true }).commit();
        return {
          success: true,
          message: 'Thank you for subscribing! Your subscription has been reactivated.'
        };
      }
    }

    // Create new subscription
    await client.create({
      _type: 'newsletterSubscription',
      email,
      subscribedAt: new Date().toISOString(),
      isActive: true,
    });

    return {
      success: true,
      message: 'Thank you for subscribing to our newsletter!'
    };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return {
      success: false,
      message: 'There was an error processing your subscription. Please try again.'
    };
  }
}