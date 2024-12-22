from atproto import Client
import time
from dotenv import load_dotenv
import os
posts = [
    # Problem-Solution Pair 1
    "You saw a TikTok about NYC’s hidden rooftop bars 🍸, saved it, and now... you can’t find it. Between bookmarks, screenshots, and notes, those gems get lost in the chaos. Trip planning shouldn’t feel like a scavenger hunt. 🗺️",
    "Trip planning doesn’t have to feel like a scavenger hunt. With Locator, share that TikTok, and it pulls every rooftop bar into a mapped list. Everything saved, organized, and ready for your NYC adventure. 🍸🗽 Try it: https://play.google.com/store/apps/details?id=locator.android",

    # Problem-Solution Pair 2
    "Ever saved a blog about Paris cafés, only to lose it in your browser tabs? Or forgot the spots mentioned because the list wasn’t handy? Finding recommendations should be easier. 🥖☕",
    "With Locator, share that blog link, and every café gets mapped out for you. No more digging through tabs—just your Paris trip, perfectly planned. 🗺️ Start here: https://play.google.com/store/apps/details?id=locator.android",

    # Problem-Solution Pair 3
    "You follow travel influencers for inspiration but can’t keep track of all their tips. TikToks about hidden beaches and Reels with top restaurants—gone when you need them most. 🏖️",
    "Locator makes travel tips actionable. Share those TikToks and Reels, and it extracts locations into an interactive map. Everything organized for your next trip. ✈️🌍 Try it now: https://play.google.com/store/apps/details?id=locator.android",

    # Problem-Solution Pair 4
    "Planning your Tokyo trip? 🍣 You’ve saved posts, bookmarked blogs, and screenshotted must-visit spots, but finding them again is overwhelming. Your itinerary shouldn’t be this stressful. 🗼",
    "Locator simplifies trip planning. Share posts and links, and it organizes all your Tokyo recommendations into a single map. Stress-free travel starts here: https://play.google.com/store/apps/details?id=locator.android",

    # Problem-Solution Pair 5
    "Have you ever found an amazing restaurant guide on Instagram, only to lose it in your saves? You deserve a better way to organize foodie finds. 🍴",
    "With Locator, share that Instagram post, and every restaurant gets added to your map. Now, you’ll never lose track of places you want to try. 🗺️ Start exploring: https://play.google.com/store/apps/details?id=locator.android",

    # Problem-Solution Pair 6
    "You’re dreaming of Miami 🏖️ but your list of beaches and bars is scattered across screenshots and notes. Where’s the fun in piecing it all together? 🌴",
    "Locator takes the mess out of planning. Share your travel guides and TikToks, and it maps out every spot for you. Your Miami getaway, organized: https://play.google.com/store/apps/details?id=locator.android",

    # Problem-Solution Pair 7
    "Hidden gems from blogs are great—until you lose the links. Who has time to copy-paste every location into a map? Finding cool spots shouldn’t be a chore. ✈️",
    "Locator makes it effortless. Share the blog link, and every spot is automatically mapped out. Less hassle, more exploring. 🌍 Try it today: https://play.google.com/store/apps/details?id=locator.android",

    # Problem-Solution Pair 8
    "Anyone else have hundreds of screenshots saved, but no idea what’s in half of them? Your best travel ideas are buried and forgotten. 📸",
    "With Locator, just share the content directly. It organizes your travel ideas into a clear, interactive map. Say goodbye to screenshot chaos. 🗺️ Download now: https://play.google.com/store/apps/details?id=locator.android",

    # Problem-Solution Pair 9
    "Have you ever seen an Instagram guide to your city and thought, ‘I need this’? Then forgot all about it? Keeping track of places shouldn’t be this hard. 🌆",
    "With Locator, share the Instagram guide, and it saves every place as a map marker. Your city, rediscovered. 🌃 Try it here: https://play.google.com/store/apps/details?id=locator.android",

    # Problem-Solution Pair 10
    "You’re heading to Italy 🇮🇹 and saved guides with must-visit restaurants. But now they’re buried in bookmarks, and you’re scrambling to plan. Sound familiar?",
    "Locator organizes your Italy guides into a map in seconds. Just share the links, and every restaurant and landmark is ready to explore. 🍝🗺️ Start here: https://play.google.com/store/apps/details?id=locator.android",

    # Problem-Solution Pair 11
    "TikToks about hidden cocktail bars? Instagram Reels with top brunch spots? You save them, but when it’s time to go, you can’t find anything. 🍹🥞",
    "Locator saves and maps all those spots for you. Share content directly to the app, and every location is there when you need it. 🗺️ Simplify your plans: https://play.google.com/store/apps/details?id=locator.android",

    # Problem-Solution Pair 12
    "Does this sound familiar? A blog with ‘10 must-see spots’ becomes a forgotten bookmark. Travel inspiration shouldn’t go to waste. 🚀",
    "Locator turns inspiration into action. Share the blog, and every spot is mapped out for you. No more wasted recommendations. 🗺️ Try it: https://play.google.com/store/apps/details?id=locator.android",

    # Problem-Solution Pair 13
    "You saw a foodie guide on Instagram with 5 incredible ramen spots 🍜. But now you’re scrolling endlessly trying to find it. Where’s the fun in that?",
    "With Locator, share the foodie guide and get every spot saved and mapped instantly. Your next meal is just a tap away: https://play.google.com/store/apps/details?id=locator.android",

    # Problem-Solution Pair 14
    "Travel planning shouldn’t feel like solving a puzzle. Scattered lists, saved posts, and forgotten screenshots make it exhausting. 🧩",
    "Locator organizes it all. Share your favorite guides, and it creates an interactive map. Travel planning made simple. 🗺️ Start here: https://play.google.com/store/apps/details?id=locator.android",

    # Problem-Solution Pair 15
    "Your saved Instagram posts are packed with places to visit, but finding them again is a nightmare. Why is organizing travel ideas so frustrating? 😩",
    "Locator changes that. Share Instagram posts, and every place is saved as a map marker. No more frustration—just easy planning. 🗺️ Try it now: https://play.google.com/store/apps/details?id=locator.android",

    # Problem-Solution Pair 16
    "Ever found a blog with hidden gems, only to forget where you saw it? Your travel ideas deserve better. 🌟",
    "Locator lets you share that blog and maps every gem automatically. No more losing great ideas. 🌍 Get started: https://play.google.com/store/apps/details?id=locator.android",

    # Problem-Solution Pair 17
    "Rooftop bars, hidden beaches, foodie spots—you’ve saved them all. But they’re scattered across apps and screenshots. Sound familiar? 🌇",
    "Locator organizes every saved spot into one map. Share links, and everything is ready when you are. Explore smarter: https://play.google.com/store/apps/details?id=locator.android",

    # Problem-Solution Pair 18
    "Does planning your next trip feel like a research project? Too many guides, too little organization. It’s overwhelming. 🗺️",
    "Locator makes planning easy. Share guides, and it creates an organized map of every spot. Travel planning simplified: https://play.google.com/store/apps/details?id=locator.android",

    # Problem-Solution Pair 19
    "You love saving hidden gems, but they always get lost in the shuffle—saved posts, bookmarks, screenshots. It’s chaos. 📚",
    "Locator ends the chaos. Share content, and it organizes every location for you. Travel inspiration, finally actionable. 🗺️ Try it now: https://play.google.com/store/apps/details?id=locator.android",

    # Problem-Solution Pair 20
    "Your bookmarks are full of saved places, but when it’s time to plan, you don’t know where to start. Organizing ideas shouldn’t be this hard. 📍",
    "Locator organizes your saved places into an interactive map. Everything in one place, ready for your next adventure. 🌍 Start here: https://play.google.com/store/apps/details?id=locator.android"
]

client = Client()
load_dotenv()
username = os.getenv('LOCATOR_USERNAME')
password = os.getenv('LOCATOR_PASSWORD')

client.login(username, password)
one_hour = 60 * 60
for i, post in enumerate(posts):
    print(f'[{i + 1}/{len(posts)}] Posting...')
    client.send_post(post)
    time.sleep(one_hour)
