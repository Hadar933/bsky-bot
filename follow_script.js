const { BskyAgent } = require('@atproto/api');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

const argv = yargs(hideBin(process.argv))
    .option('personal', {
        alias: 'p',
        type: 'boolean',
        description: 'Run script for personal user'
    })
    .option('actors', {
        alias: 'a',
        type: 'array',
        description: 'List of actors to process',
        default: []
    })
    .argv;

const userType = argv.personal ? 'personal' : 'locator';
const defaultActors = userType === 'personal' ? [
    'hadars.bsky.social'
] : [
    'hadars.bsky.social'
];
const actors = argv.actors.length > 0 ? argv.actors : defaultActors;

(async () => {
    const agent = new BskyAgent({
        service: 'https://bsky.social'
    });

    let username;

    if (userType === 'personal') {
        await agent.login({
            identifier: process.env.PERSONAL_USERNAME,
            password: process.env.PERSONAL_PASSWORD
        });
        username = process.env.PERSONAL_USERNAME;
    } else {
        await agent.login({
            identifier: process.env.LOCATOR_USERNAME,
            password: process.env.LOCATOR_PASSWORD
        });
        username = process.env.LOCATOR_USERNAME;
    }

    console.log(`Logged in as: ${username}`);

    console.log(`Processing actors: ${actors.join(', ')}`);

    const getFollowedDIDs = async () => {
        const following = new Set();
        let cursor = '';
        const actor = userType === 'personal' ? 'hadars.bsky.social' : 'locatorai.bsky.social';
        console.log(`Retrieving follows for actor: ${actor}`);
        do {
            const result = await agent.getFollows({ actor, limit: 100, cursor });
            result.data.follows.forEach((user) => {
                following.add(user.did);
                console.log(`Already following: ${user.did}`);
            });
            cursor = result.data.cursor;
            await timer(1000); // Avoid hitting rate limits
        } while (cursor);
        return following;
    };

    const followingSet = await getFollowedDIDs();

    const allFollowers = [];

    for (const actor of actors) {
        console.log(`Retrieving followers for actor: ${actor}`);
        let cursor = '';
        let total = 0;
        while (cursor !== undefined) {
            const all = await agent.getFollowers({ actor, limit: 100, cursor });
            cursor = all.data.cursor;
            total += all.data.followers.length;
            allFollowers.push(...all.data.followers.map(p => p.did));
            console.log(`Fetched ${all.data.followers.length} followers from ${actor}. Total so far: ${total}`);
            await timer(1000);
        }
    }

    console.log(`Total followers collected: ${allFollowers.length}`);

    for (const did of allFollowers) {
        if (!followingSet.has(did)) {
            await agent.follow(did);
            console.log(`Followed: ${did}`);
            followingSet.add(did); // Add newly followed DID to the set
            await timer(10000); // Throttle API calls
        } else {
            console.log(`Already following: ${did}`);
        }
    }

    console.log("Finished following new users.");
})();