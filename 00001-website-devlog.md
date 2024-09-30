```yml
title: Test blogpost
subtitle: please ignore.
tag: 2
```

...oh hi! Didn't see you there. So how do you like my new place huh? Not too shabby.

Anyway, welcome to the **first ever official Modern Modpacks** blogpost *(except the markdown test, which, if you know, you know)*. I am not much of a blog writer (yet), so excuse me for any of the mistakes in my writing style or grammar (feel free to tell me about that in the comments, you :nerd:s). In this post I will go over some design tricks I used during the development of the second version of the website, and just some vaugely entertaining stuff I've encountered while making it.

I am mostly writing this just to test out how stuff looks here, but I also thought sharing how I made the website the blog you are currently reading is on as the first blogpost would be kinda meta; and who knows, maybe someone actually cares about this sort of stuff. Tizu already said he doesn't like how the UI of the blog looks, so maybe in the near future you will see a redesign of this page as well (I will force him to write a post when he does). With that out of the way, let's dive in.

# Why

So the idea to create a new version of the website came to my head after the most common way to greet me online switched from "hi gcat" to "lmao you will never make 16 packs your website suuucks". This hurt my feelings, so I decided to rewrite some of the stuff on there, unfortunately however, I quickly found out it was all fucked.

The old website was kind of a buggy mess, probably because it was built using garbage implementation on top of a garbage implementation on top of another garbage implementation and so on. So, naturally, I spend **4 fucking months** rewriting the entire website from scratch using SvelteKit (and procrastinating rewriting the entire website from scratch using SvelteKit). This was a nice experience, I learned a lot from it, and I am glad I did that, even though half of the team hates me now (*cough* rainbuu *cough*) for practically not working on FA during that entire period.

I tried to make the codebase less garbage than the old one, but in actuality though... uhhhh, that's arguable. On the outside though, I think it looks quite pretty and the info presented here is definitely closer to reality than whatever garbage I wrote back when I started the org in 2022 because I had to come up with something for the page. How I achieved this prettiness? Well I am glad you asked!

# Designing V2

This website was my first big serious project using SvelteKit; I did work on some implementations for [tizu's KJSPKG lookup](https://kjspkglookup.modernmodpacks.site), which uses SK; And we are currently sitting on something called "Project Poland" (coming not soon wink wink), which also uses SK in some capacity; but I didn't really learn anything from these experiences. This, however, taught me a lot of stuff, and the later something was implemented here the less weird roundabouts I used to do so.

For example, some stuff currently in the code uses tailwind's system to animate something on first load. This is done because, at the time of implementation, I didn't know you could use SK's `in:` and `out:` attributes to do the exact same thing I was trying to achieve; but later stuff (like this blog) does use those. ~~How the fuck was I supposed to know about this, they didn't teach me this in school!~~

As for effects, I didn't really think about them much, most of them came to me either before I implemented them or by me just thinking about them for 1 minute. My favorite ones are probably the "Hellish Mods swarm" and the translator map. 

Most of the website uses what I call "conveyor-belt design". The concept behind it is simple: do not do hard cutoffs on hover, instead, animate the slowdown. This became a core part of all effects here after I showcased the above mentioned HM swarm section to tizu who said the instant stop was "disgusting". This took a bit of time implementing and required me to learn another part of SK - tweens, but in the end it did work and made the overall feel of the site more smooth (sorry for shitty quality gifs lmao, couldn't figure out a way to display these better, check them the effect out on the website itself).

<p align="center">
    <img src="https://i.imgur.com/3bJ22IW.gif">
    <br>
    <i>Without conveyor-belt design</i>
</p>

<p align="center">
    <img src="https://i.imgur.com/7sfift4.gif">
    <br>
    <i>With conveyor-belt design</i>
</p>

Another prinicple I used when designing v2 was reusing as much stuff as possible. I generally try to follow this rule when coding anything, cause automating stuff is probably the most satisfying part of programming for me. For the website, this came in multiple forms, the most obvious of which is ofc putting everything in different components, but it also manifested in less obvious ways. Like, for example, have you noticed that most on the colors in this website (except backgrounds and text) are the ones we use in MM's palette? The one place where you can really see it is in the header bar when hovering on page names: projects are colored in MM red, about us in yellow, blog in lime, and status in light blue. Tags for blogposts use a lot of the colors from the palette as well, and I also used MM gray and light gray in some of places, see if you can figure out where exactly.

<p align="center">
    <img src="https://i.imgur.com/wuz8kns.png">
    <br>
    <i>Header with all page names hovered</i>
    <br>
    <i>Projects - #8e2121, About Us - #f1af15, Blog - #5ea918, Status - #2489c7</i>
</p>

<p align="center">
    <img src="https://i.imgur.com/RY1BdEE.png">
    <br>
    <i>Blogpost tag list in the blogpost search</i>
    <br>
    <i>Opinion uses the exact same color as projects, BTS same as about us, Off-topic same as blog, Guest-written same as status</i>
    <br>
    <i>Others also use colors from MM palette</i>
</p>

The longest page that took me to complete is projects - about 2.5 months; then about us in about 1.5; and then blog which was made in like 2 weeks. A lot of this time was spent procrastinating, but nowadays I am trying my best to avoid that. Near the end, I've set a tight deadline on the 30th of September to release the website, and it really helped boost my productivity (hey, who knows, maybe this will work for FA as well). As of the time of writing this, idk if I've made that deadline or missed it by one day, but hopefully I did (feel free to let past me know in the comments, he won't hear you).

Some effects were stolen from other places. Like the wall of contributors being taken and improved from the previous version of the website; the tester hexes literally being a lite version of said wall; and the side project marquees being, as later discovered by qwerty, a product of my subcontious tricking me into stealing Modrinth's similar homepage effect, whoops!

<p align="center">
    <img src="https://i.imgur.com/pcY6bOS.gif">
    <br>
    <i>My effect</i>
</p>


<p align="center">
    <img src="https://i.imgur.com/i7ixduo.gif">
    <br>
    <i>Modrinth's</i>
</p>

The blog was definetely the one I had the most fun time implementing. At first, it was supposed to be an entire separate website onto itself, but when I first had the of v2 pop up in my head, I have immediately decided it would be better for it to just be part of that instead. 

Currently, the blog works using a system which fetches blogposts (which are stored in markdown files) from a specific `blogposts` branch on the website's github repo. Then, they are parsed and metadata (such as title and tag) is gotten from the little yaml codeblock at the top of the md file.

<p align="center">
    <img src="https://i.imgur.com/ECZ9JPO.png">
    <br>
    <i>This post's metadata ;)</i>
</p>

Info about post's creator and when it was made is fetched separately, when user clicks on the actual post (this is why you don't see who and when made the actual post in the blogs page). This is done because github is very stingy on their rate limit policy, and they only allow 60 unauthorized requests **per hour**. Of course, even with all of the request optimization going on, this is still hit rather quickly; because of this, I had to implement gh auth. I've had experience with adding it before (from KJSPKG lookup), so it wasn't that hard; but it did lead me to think a thought I was avoid up until that point - blogpost comments. 

At first I was reluctant to add them, they would require moderation and take up extra time which might lead to me not reaching the deadline, however, when gh auth was implemented, I knew that it would be weird for me not to add them, and will lead to people questioning why auth is there in the first place. So I gave in; the comments mostly work the same as views, I just append some stuff to the db (I use supabase BTW) and fetch it back. At first I used raw sqlite but apparently serverless (the website is hosted on netlify, which was recommended to me by tizu. I wanted to use gh pages again xd) means I can't edit the file system, which I learned the hard way (another example of me coming to know shit I wouldn't have otherwise, thanks v2).

For moderation, I figured if I just blocked enough words, it will do itself. Because of this, the filter is quite harsh (ex. you can't post links at all), but this should hopefully save me from the hastle of manual sorting. There is also a ban list for especially bad boys, which blocks all of their comments from being seen and stops them from sending new ones. Don't be a bad boy.

The way translation is done was redone a couple of times, in the end it's quite logical and stable, so if you want to help with it, the file to translate is available [here](https://github.com/Modern-Modpacks/website/blob/v2/src/lib/json/langs/en.json5).

And that's about it for design. I can also mention how I made the animation atop of the projects section, the light theme being implemented in a day, all different sorts of extra menus; but I don't think they are as entertaining as the other aspects I mentioned prior. ~~To be honest, those aspects weren't that entertaining, they were slightly amusing at best. God this post sucks.~~

# The future

So yeah, that's it for this one. I plan to update the blog semi-regularly, and force other members to do so >:). Maybe also invite outsiders to make posts, idk yet, the tags exists for that but I have no idea who to invite lol. If you are at least somewhat popular in this community, shoot me a DM, maybe we'll figure something out. Most of the other stuff here will be slop drama but occasionally I will post devlogs like these, but, to be honest, you should just [join our discord](https://discord.modernmodpacks.site) if you are interested in these kinds of things, we release dev sneek peeks there much more regularly then I am able to do so here. If you like drama however, you are in the exact right place (still join our discord though).

It was I, G_cat. Signing off, and see you next time. Peace!