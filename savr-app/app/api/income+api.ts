const APP_TOKEN = process.env.APP_TOKEN
const USER_TOKEN = process.env.USER_TOKEN

export async function GET(request: Request) {
  if (!APP_TOKEN || !USER_TOKEN) {
    return new Response(JSON.stringify({ error: 'Missing required tokens' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const url = new URL(request.url)
    const startDate = url.searchParams.get('start')
    const endDate = url.searchParams.get('end')
    const response = await fetch(
      `https://api.akahu.io/v1/income?start=${startDate}&end=${endDate}`,
      {
        headers: {
          accept: 'application/json',
          'X-Akahu-Id': APP_TOKEN,
          authorization: `Bearer ${USER_TOKEN}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('API Error:', error)

    return new Response(JSON.stringify({ error: 'Something went wrong!' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
