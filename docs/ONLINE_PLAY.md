# Online play (class and versus)

Two modes run on the same Worker and D1 database as accounts, with no account required.

- **Class game:** a host creates a game and shares a 6-letter code. Players join with a nickname. The host controls the pace (start, show answer, next).
- **Versus:** a player waits about 10 seconds for another student; if nobody is waiting they may choose a practice bot. Bots are always labelled "bot".

## How it works
Browsers poll `/api/room/state` about once a second. Rooms live in D1 and are deleted after 3 hours. Nicknames are filtered, and creating and joining are rate limited per IP.

## Honest limits
The question bank ships in the browser, so the server cannot know the right answer. The server bounds what a client can claim: capped points per question, answer times clamped to what the server measured, one answer per player per question, and late answers rejected. A determined cheater can still report every answer as correct. Use these modes for fun and class review, not for grades. Coins earned online are cosmetic.

## Data
Per game: nickname, avatar id, and for each question whether the answer was right and how long it took. See the privacy page.
