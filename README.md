# CSCI112-FINALS

## Before you start

Make sure you have the MongoDB Shell CLI (`mongosh`) installed. If you're on Windows, I recommend using **Git Bash** to run the scripts. Make sure `mongosh` is available in that terminal too.

## Set up your credentials

I added an `.env.example` so you don't have to set everything up from scratch. Copy it to `.env.local` first:

```bash
cp .env.example .env.local
```

Then open `.env.local` and put in the database username and password I gave. Leave the host and database name pointing to the shared cloud database.

It should look like this. Don't add quotes or spaces around `=`:

```dotenv
MONGODB_HOST=csci112finals.bktd5kl.mongodb.net
MONGODB_DATABASE=csci112_finals
MONGODB_USERNAME=YOUR_DATABASE_USERNAME
MONGODB_PASSWORD=YOUR_DATABASE_PASSWORD
```

Keep your actual credentials in `.env.local`.

## Run the queries

Open your terminal in the repo folder. If you're on Windows, use **Git Bash** here.
If using any Linux based CLI, execute with the ff:
```bash
./myshellscript.sh
```

Make sure to have mongosh installed there, or if you really want to use windows native (i.e. PW or CMD), just use the sample script below:


```bash
bash filename.sh
```

For example, here's how to run the aggregation queries:

```bash
bash run-aggregate.sh
```

## Writing your queries

You can use [`queries/part-e-aggregate.js`](queries/part-e-aggregate.js) as a reference for the format and comments.

When you add a query, include a short explanation of the business insight it gives us from the sample database and how the dorm management would use it. That way, we can understand what each query is for when reviewing our work.
