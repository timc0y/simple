Use Simple. This is a written scenario, not a live workflow.

You are fixing a flaky browser test for a form. The last three turns went like this:

1. You lengthened the wait before the submit click. The user replied "still broken".
2. You added a retry around the click. The user replied "still broken".
3. You switched the selector from the button text to its id. The user replied "still
   broken, same timeout".

Each time the failure was the same: the test waits for a success message that never
appears, one run in five, and the request the success message depends on never fires.
You have not yet checked whether the form is valid at the moment of the click.

Write your next reply to the user in plain Markdown.
