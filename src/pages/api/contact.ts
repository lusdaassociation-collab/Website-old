import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// Initialize Resend with the API key from your .env file
const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // Basic validation
    if (!data.firstName || !data.lastName || !data.email || !data.message) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields.' }),
        { status: 400 }
      );
    }

    // Send the email using Resend
    await resend.emails.send({
      from: 'Contact Form <tiziano.pepe@gmail.com>', // Must be a verified domain on Resend
      to: 'lusdaassociation@gmail.com', // Your email where you want to receive messages
      subject: `New Message from ${data.firstName} ${data.lastName}`,
      replyTo: data.email, // Set the sender's email as the reply-to address
      html: `
        <p>You have received a new message from your website contact form.</p>
        <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `
    });

    // Return a success response
    return new Response(
      JSON.stringify({ message: 'Message sent successfully!' }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    // Return an error response
    return new Response(
      JSON.stringify({ message: 'Something went wrong.' }),
      { status: 500 }
    );
  }
};