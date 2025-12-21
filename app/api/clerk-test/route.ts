export async function GET() {
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'Clerk authentication integration is set up successfully!' 
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}