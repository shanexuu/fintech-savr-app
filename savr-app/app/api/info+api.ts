const APP_TOKEN = process.env.APP_TOKEN
const USER_TOKEN = process.env.USER_TOKEN

export async function GET(request: Request) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'X-Akahu-Id': 'app_token_clyrzexpp000108me6x5l89li',
      authorization: 'Bearer user_token_clyrzexpp000208meapkzh10a',
    },
  }

  fetch('https://api.akahu.io/v1/accounts', options)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err))
}
