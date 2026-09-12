Uh oh, there seems to be a problem with one of the session tests after the change.

I went through the suite and there's a failure related to the cookie expiry. The
change I made was to move the expiry handling to a new configuration key so that it
can be set in days rather than seconds, which is cleaner. It looks like the test is
not happy with the value it is getting back. There are a few ways we could go about
resolving this: update the test, update the config, add backwards compatibility for
the old key, or adjust the default. Let me know how you'd like to proceed and I'll
take care of it.
