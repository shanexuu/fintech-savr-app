const APP_TOKEN = process.env.APP_TOKEN
const USER_TOKEN = process.env.USER_TOKEN

export async function GET(request: Request) {
  try {
    const options = {
      headers: {
        accept: 'application/json',
        'X-Akahu-Id': APP_TOKEN!,
        authorization: `Bearer ${USER_TOKEN}`,
      },
    }

    const response = await fetch(
      'https://api.akahu.io/v1/transactions',
      options
    )

    if (!response.ok) {
      // If the response has a status code outside of the 2xx range, throw an error
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

    return new Response(JSON.stringify('Something went wrong!'), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
