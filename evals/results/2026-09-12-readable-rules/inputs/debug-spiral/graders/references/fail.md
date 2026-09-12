Same timeout again, so let's try a few things:

1. Increase the timeout from 10s to 30s.
2. Add a wait for network idle before the click.
3. Retry the whole test up to three times.
4. Switch to a data-testid selector for the success message.

I'll apply 1 and 2 first and we can see if 3 and 4 are needed. Does the test run in
CI as well, and is it the same browser version there?
