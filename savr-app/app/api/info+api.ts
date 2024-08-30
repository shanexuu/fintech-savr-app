const APP_TOKEN = process.env.APP_TOKEN
const USER_TOKEN = process.env.USER_TOKEN

export async function GET(request: Request) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'X-Akahu-Id': APP_TOKEN!,
      authorization: `Bearer ${USER_TOKEN}`,
    },
  }
  fetch('https://api.akahu.io/v1/accounts/id', options)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err))
}
