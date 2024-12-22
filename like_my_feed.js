const { BskyAgent } = require('@atproto/api');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const timer = (ms) => new Promise((res) => setTimeout(res, ms));

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // Swap elements
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

// Add this to define your blacklist
const blacklist = [
    "andreboso.bsky.social",
    "kapitar.bsky.social",
    "drbitwise.bsky.social",
    "kawsu6112.bsky.social",
    "abusayedopu.bsky.social",
    "julianharris.bsky.social",
    "conquestace.com",
    "bkva.bsky.social",
    "nataliawayne099.bsky.social",
    "krupal79.bsky.social",
    "rohanpradyumna.bsky.social",
    "ilyathedev.bsky.social",
    "berksky.bsky.social",
    "dagorenouf.com",
    "sousadev.com",
    "fredrivett.com",
    "0xgokuz.bsky.social",
    "rebeccabardess.bsky.social",
    "scottietakeson.bsky.social",
    "drandreaperino.bsky.social",
    "ratankabir.bsky.social",
    "akaasten.bsky.social",
    "rahulkrishnaa28.bsky.social",
    "snappyfreelancer.bsky.social",
    "gislover.bsky.social",
    "jawo444.bsky.social",
    "markoschmitt.bsky.social",
    "nursingfront.com",
    "krystianzun.com",
    "riehle.co",
    "createwithrahul.bsky.social",
    "erwin.blue",
    "daniel.indiethinkers.com",
    "octocode.bsky.social",
    "parthkoshti.com",
    "richardnesbitt.com",
    "ondrejbartos.bsky.social",
    "annedevj.bsky.social",
    "akash03.bsky.social",
    "bopito.com",
    "adrianacostapr.bsky.social",
    "alexkadyrov.bsky.social",
    "adama90.bsky.social",
    "mhalawa.bsky.social",
    "italianhorne.bsky.social",
    "saulsutcher.bsky.social",
    "sas1610.bsky.social",
    "kurt.scalinginpublic.com",
    "nichovski.com",
    "muhammedbojang7.bsky.social",
    "elenaa16.bsky.social",
    "builditn0w.bsky.social",
    "jakobjelling.bsky.social"
];

// Function to check if a user is blacklisted
function isBlacklisted(username) {
    return blacklist.includes(username);
}

// At the top of the script, add stats object
const stats = {
    likesDone: 0,
    totalIterations: 0,
};


async function getRandomFeed(agent, timeline_limit) {
    // If rotate is not enabled, always return personal feed
    if (!argv.rotate) {
        console.log("Fetching PERSONAL feed...");
        return await agent.getTimeline({ limit: timeline_limit });
    }

    // Existing rotation logic when --rotate is enabled
    const random = Math.random();
    console.log("Feed Rotation Random Number: ", random);
    if (random < 1/3) {
        console.log("Fetching BIP feed...")
        return await agent.app.bsky.feed.getFeed({
            feed: "at://did:plc:oio4hkxaop4ao4wz2pp3f4cr/app.bsky.feed.generator/build",
            limit: timeline_limit 
        });
    } else if (random < 2/3) {
        console.log("Fetching PERSONAL feed...")
        return await agent.getTimeline({ limit: timeline_limit });
    } else {
        console.log("Fetching DEV feed...")
        return await agent.app.bsky.feed.getFeed({
            feed: "at://did:plc:vpkhqolt662uhesyj6nxm7ys/app.bsky.feed.generator/devfeed",
            limit: timeline_limit 
        });
    }
}


// Add function to print stats
function printStats(hours, minutes, seconds, histogram) {
    console.clear();
    console.log(`Elapsed Time: ${hours}h ${minutes}m ${seconds}s`);
    console.log(`Total Iterations: ${stats.totalIterations}`);
    console.log(`Likes Performed: ${stats.likesDone}`);
    console.log(histogram)
}

const likeMyFeed = async (userType) => {
    const agent = new BskyAgent({
        service: 'https://bsky.social'
    });

    if (userType === 'personal') {
        await agent.login({
            identifier: process.env.PERSONAL_USERNAME,
            password: process.env.PERSONAL_PASSWORD
        });
    } else {
        await agent.login({
            identifier: process.env.LOCATOR_USERNAME,
            password: process.env.LOCATOR_PASSWORD
        });
    }

    console.log("Logged in to user: ", userType);
    const second = 1000;
    const minute = 60 * second;
    const hour = 60 * minute;
    userLikeCount = {};
    iteration_count = 0;
    liked_post = false;
    use_my_feed = true;

    // CHANGE THOSE:
    const user_like_limit = 4;
    const timeline_limit = 50;
    const sleep_between_likes = 5 * second;
    const sleep_between_get_timeline =  5 * minute;
    const reset_histogram = 3 * hour;
    const like_reply_prob = 0.01;
    const like_post_prob = 0.9;
    // ===============================
    
    const startTime = new Date();
    let lastHistogramResetTime = startTime;
    while (true) {
        try {
            feedResponse = await getRandomFeed(agent, timeline_limit);
            const shuffledFeed = shuffle(feedResponse.data.feed);
            for (const item of shuffledFeed) {

                liked_post = false;
                stats.totalIterations++;

                const { uri, cid } = item.post;
                const handle = item.post.author.handle;

                if (item.post.record.reply) {
                    if (Math.random() > like_reply_prob) {
                        continue; 
                    }
                }

                // Check if the user is blacklisted
                if (isBlacklisted(handle)) {
                    continue;
                }

                // Check if the user has been liked more than 3 times
                if ((userLikeCount[handle] || 0) >= user_like_limit) {
                    continue;
                }

                try {
                    // Check if you have already liked the post
                    const likesResponse = await agent.getLikes({ uri });
                    const alreadyLiked = likesResponse.data.likes.some(
                        (like) => like.actor.did === agent.session?.did
                    );

                    if (!alreadyLiked) {
                        if (Math.random() > 1 - like_post_prob) { 
                            await agent.like(uri, cid);
                            liked_post = true;
                            stats.likesDone++;
                            if (userLikeCount[handle]) {
                                userLikeCount[handle]++;
                            } else {
                                userLikeCount[handle] = 1;
                            }
                        }
                        else {
                        }
                        // Log the histogram sorted by like count, only first 30 entries
                        const sortedHistogram = Object.entries(userLikeCount)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 30);

                        const elapsedTime = Date.now() - startTime;
                        const hours = Math.floor(elapsedTime / hour);
                        const minutes = Math.floor((elapsedTime % hour) / minute);
                        const seconds = Math.floor((elapsedTime % minute) / second);

                        // Check if it's time to reset the histogram
                        if (Date.now() - lastHistogramResetTime >= reset_histogram) {
                            console.log('Resetting histogram');
                            userLikeCount = {};
                            lastHistogramResetTime = Date.now();
                        }


                        printStats(hours, minutes, seconds, sortedHistogram);

                        if (liked_post) {
                            await timer(sleep_between_likes);
                        }
                    }
                } catch (error) {
                    console.error(`Failed to like post: ${uri}`, error);
                }

            }
            console.log(`Sleeping before fetching next timeline...`);
            await timer(sleep_between_get_timeline);
        } catch (error) {
            console.error('Failed to fetch timeline', error);
        }
    }
};

// Parse command-line arguments
const argv = yargs(hideBin(process.argv))
    .option('personal', {
        alias: 'p',
        type: 'boolean',
        description: 'Run script for personal user'
    })
    .option('rotate', {
        type: 'boolean',
        description: 'Rotate between different feeds',
        default: false
    })
    .argv;


const userType = argv.personal ? 'personal' : 'locator';

likeMyFeed(userType);