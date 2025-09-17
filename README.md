# Quickstart

This repo forked the quick-start template for [OpenAI Assistants](https://platform.openai.com/docs/assistants/overview) which uses [Next.js](https://nextjs.org/docs) as the Frontend and Backend framework.

### 1. Clone repo

```shell
git clone https://github.com/getmangohealth/erp-guide
cd erp-guide
```

### 2. Install NVM

[NVM Guide](https://github.com/nvm-sh/nvm)

### 3. Setup .env file. C

- Create a .env file and copy the contents of .env.example into it. <br/>
- Create a new [OpenAI API Key](https://platform.openai.com/api-keys) for the project and save it into .env file. <br/>
- Create your own assistants on OpenAI's platform; name it [YOUR NAME] X Assistant
- Copy that assistant ID found on OpenAI, it starts with "asst\_"

### 4. Install dependencies (and add missing packages later)

```shell
npm install
```

### 5. Run

This will track changes to your code files and auto update your localhost.

```shell
npm run dev
```

# Deployment

### Local

Navigate to [http://localhost:3000](http://localhost:3000).

#### Mobile Testing Local

Grab your private IP address (on mac go to system settings -> network -> click on your wifi network 'details'
Ensure you've started running locally on your computer via 'npm run dev'
On your phone, go to http://IP_ADDRESS:3000
Ex. http://192.168.0.221:3000

### Production

A hook for the repo was setup to deploy to heroku upon pushing to main.

You can only read the logs from the deployed app. But if you'd like to debug
you can hop into a new instance and try testing things out.

- heroku run bash -a mangohealth //hop into a new dyno instance
- npm run start > app.log 2>&1 & //run the app in the background
- cat app.log //print the port the nextjs server is running on
- curl -X POST -v http://localhost:$PORT/api/assistants //hit api

TODO: fill in heroku directions

# Adding a New Module

1. in /types/types.ts -> add the new module to the SessionType enum
   2.in /app/meta/modules/ -> Create the file
2. in /app/meta/modules/registry.ts -> Import + Add the module to the moduleRegistry
3. Add the UI. If a lesson, in /app/lessons -> add it in the lesson.utils file.
   test it out!

# Useful Tips

### Creating a test account

- In the page right after signup, before payment, click on all three icons to unlock the popup. This will allow you to mark it as a test account which so you are added to the allowlist and skip payment. It will also flag as a test account in the BE which is passed to posthog.
- In the settings page, you can also mark it as a test account by clicking "Settings" and "Account".

### Updating Dev Assistant Instructions

- After changing assistant instructions in copy/ or tools in tools; run the following terminal command
  `npm run update-assistants` to update the development assistants

### Env variables

NextJS automatically loads the environment variables form the .env file for server-side code. This means when the openai constant is imported the OPENAI_API_KEY is available. But when running a typescript file with `npm run run-ts file.ts` the env variables must be loaded in.

### Run any ts file

`npm run run-ts filename.ts`

### Heroku Config Var BUG

- Heroku has a bug where the config vars (i.e. env variables) are not set when you update them on their dashboard. For example, if you have OPENAI_MY_NAME, and create another var called OPENAI_MY_NAME_2, it won't actually create it.

# Coding Conventions and Standards

Linter

- We are using the "Prettier - code formatter" extension in VSCode/Cursor.

Next.js

- We are using Next.js [App Routing](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating) NOT Page Routing. Navigate using the \<Link> component, useRouter hook, and redirect function. Do NOT use the \<a> href tag, use the \<Link> .

PostHog

- Do [not directly](https://posthog.com/docs/libraries/react#using-posthog-js-functions) import posthog. This will likely cause errors as the library might not be initialized yet. Import usePostHog from the 'posthog-js/react' library instead.

Components

- Only place components in the app/components folder if they are reusable and shared across multiple pages.

Call Back Hell

- Avoid writing nested callbacks i.e. .then().then().then(), this is known as "callback hell". This leads to harder to read and maintain code. Instead, use async/await.
