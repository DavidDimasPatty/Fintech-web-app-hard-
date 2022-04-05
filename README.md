
# Fintech-web-app-hard

This project was carried out to meet the challenges of the top coder Fintech-web-app-hard

(https://www.topcoder.com/challenges/721432ba-e7cd-4b97-be2a-2cf408390a7d)

## Installation

# Requirement:

- Make sure you have npm version >8.5.0

# Install project with npm:

Clone this Repo

```bash
  git clone https://github.com/DavidDimasPatty/Fintech-web-app-hard-
```

After clone success, you have to install all the package (this may take several minute)  

```bash
  npm install
```

# Run project

After Installation success, you need to rename file env to .env and change the variables of
username_email and password_email with your email.

Because this project use node mailer, so :
- You have to turn on your less security on your google account, reference (https://hotter.io/docs/email-accounts/secure-app-gmail/)
- Disable two factor authentication on your google account, reference (https://support.google.com/accounts/answer/1064203?hl=en&co=GENIE.Platform%3DDesktop)
 
And then you have to open 3 terminal
- for express server

```bash
  npm run dev
```

- for JSON SERVER (local database)

```bash
  npm run server
```

- for react to start (this command line will open your default browser immediately)

```bash
  npm start
```

# How To Deploy

- Make sure you have clean all the dummy files in public folder
- Make sure you have clean all the dummy data in db.json
- DEPLOY TO BRANCH DEVELOPMENT FIRST!

And then: 
```bash
  git checkout development 
  git add .
  git commit -m "commit messages"
  git push origin development
```