## Member Only App - The Odin Project

Includes:
- Authentication
- Password Hashing
- Database store with messages
- Sanitzation and validation of inputs

## What I learned
This project took quite some time, getting everything separated properly and remembering what part does what i.e. Passport for logging in, bcrypt for hashing, pgSession for sessions in the db .. Quite a bit.

In total this took me 9 hours to complete with all the requirements.

The deployment also took me about an hour to properly do, I was using [railway.com](https://railway.com) for the first time and getting the hang of everything was time consuming. Eventually after powering through and pushing, I got it all setup.

## What else can be done?
- Password protected admin, but I thought a toggle would be easier for everyone to plat around with

- Best-practice to populate the DB? I'm not sure, I SSH'd into the Postres and directly used SQL on the terminal to populate it. Using a seed.js is also possible as a postinstall script, or at the beginning of the app. Something to consider and figure out.