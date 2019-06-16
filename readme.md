## Line notifier

This project was build for the mobile game [食之契約](https://food.efuntw.com/).

It sends out notifications using cron at preset times to [Line](https://line.me/en/) so that the user gets to prepare before hand or to complete tasks before they expire.

## Requirements
Current code is setup to connect to a PostgresSQL server, this can easily be done by deploying to Heroku and using their add-ons.
Though free Heroku instances goes to sleep after idling for a while, which will not allow the messages to be sent out, so you may need a paid account.

you will need a Line offical account to use their messaging API.

### ENV VARS


## TODOS

- Add create table script if table not already present
- Refactor handling user inputs
