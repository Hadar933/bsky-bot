const { BskyAgent } = require('@atproto/api');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
require('dotenv').config();

// Utility function to pause execution (async sleep)
const timer = (ms) => new Promise((res) => setTimeout(res, ms));

// Parse command-line arguments
const argv = yargs(hideBin(process.argv))
    .option('personal', {
        alias: 'p',
        type: 'boolean',
        description: 'Run script for personal user'
    })
    .argv;

const userType = argv.personal ? 'personal' : 'locator';

// Main script
(async () => {
    // Initialize the Bluesky agent
    const agent = new BskyAgent({
        service: 'https://bsky.social',
    });

    try {
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
        console.log('Successfully authenticated to:', userType);
    } catch (error) {
        console.error('Authentication failed:', error.message);
        process.exit(1); // Stop the script if authentication fails
    }

    // Fetch the list of users you are following
    const following = [];
    let cursor = null;
    console.log('Fetching users you are following...');
    try {
        do {
            const response = await agent.getFollows({
                actor: agent.session.did,
                cursor,
            });
            following.push(...response.data.follows);
            cursor = response.data.cursor || null;
            await timer(1000); // Pause to respect API limits
        } while (cursor);
        console.log(`You are following ${following.length} users.`);
    } catch (error) {
        console.error('Error fetching following list:', error.message);
        process.exit(1); // Stop the script if fetching fails
    }

    // Fetch the list of users following you
    const followers = [];
    cursor = null;
    console.log('Fetching users following you...');
    try {
        do {
            const response = await agent.getFollowers({
                actor: agent.session.did,
                cursor,
            });
            followers.push(...response.data.followers);
            cursor = response.data.cursor || null;
            await timer(1000); // Pause to respect API limits
        } while (cursor);
        console.log(`You have ${followers.length} followers.`);
    } catch (error) {
        console.error('Error fetching followers list:', error.message);
        process.exit(1); // Stop the script if fetching fails
    }

    // Identify users you follow who don’t follow you back
    const followersSet = new Set(followers.map(user => user.did));
    const nonFollowers = following.filter(user => !followersSet.has(user.did));
    console.log(`You are following ${nonFollowers.length} users who do not follow you back.`);

    // Unfollow those users
    for (const user of nonFollowers) {
        try {
            console.log(`Unfollowing: ${user.handle}`);
            // Remove the follow record via its URI
            if (user.viewer?.following) {
                await agent.deleteFollow(user.viewer.following);
                console.log(`Successfully unfollowed: ${user.handle}`);
            } else {
                console.log(`No follow record found for: ${user.handle}`);
            }
            await timer(2000); // Pause to respect API limits
        } catch (error) {
            console.error(`Error unfollowing ${user.handle}:`, error.message);
        }
    }

    console.log('Script completed.');
})();