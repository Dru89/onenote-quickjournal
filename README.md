# A Thing! <small>(...name pending, I guess)</small>

Remembering things is hard.  It's especially hard when you're in the middle of
something super important and just want to take a quick note:
> Found a bug in the camel shrinker.  Accidentally grows them to 200x the size.

So what do you do?  You have to remember the bug (that's a seriously big camel),
so you stop what you're doing, open up your notes, jot down the note, come back
to your super important thing... aaand what were you doing? It was important
right? Oh well, no big deal. I mean probably... right?

Seriously, though, context switching is a pain.  This is just a simple little
tool that I'm writing to jot down quick thoughts into a daily-journal style
section of OneNote.

## Organization

Your daily journal can take any tab in any notebook.  My recommendation is that
it is a completely separate tab, so it doesn't accidentally overwrite anything
else that you might have written down.  In the notebook, pages can be separated
out by:

* Month (default): Pages separated out by month will have a title like
  "January 2015".  Each day's notes will have their own header text titled
  something like "Monday, January 24", followed by a list of bullet points.
* Week: Pages separated out by week will have a title like
  "January 24 - January 30, 2015".  Each day's notes will have their own header
  text in the same way as the month would, like "Monday, January 24".  Notes
  will be a list of bullet points below the header.
* Day: I wouldn't recommend this unless you take a lot of notes every day.  Each
  page will have its title set to the day's title.  There will be no
  sub-headers, since each day gets its own page.  Notes will still be a list
  of bullet points below the header.

Notes are always listed as bullet points.  This is meant for short, sweet,
one or two sentence notes to jog your mind.  You probably shouldn't use this as
a total note replacement system.

## Authentication

So I do some pretty heinous things to get your authentication token to OneNote.
Nothing that should trouble you as a user, I think, though.  If your token isn't
already saved, I have to do the following in order to work with Office 365's
OAuth system:

1. Start an HTTP server on port `32567`.  (The exact port is important for the redirect.)
1. Open the user's browser to `https://login.live.com/oauth20_token.srf` with
   extra parameters.
1. User accepts terms (hopefully), and then is redirected to the running server
   with the token passed in the request.
1. We store the token, and redirect the user to a landing page that explains
   how to use the tool.  (A sort of `man` page, I guess.)
1. Shut down the service, because it's not needed anymore.

So that's a little bit gross, but I don't know of a better way to get the token
without doing something similar.  Another approach to this, I guess, would be to
use a dedicated Web Frame or something and use the
[special redirect URI](https://msdn.microsoft.com/en-us/library/office/dn631818.aspx#authcodegrant)
from Microsoft, but I didn't want to add the overhead of an entire UI bundle for
this simple tool (especially if it's only needed for the auth code).
