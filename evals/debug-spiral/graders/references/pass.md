Stopping the edits. Three changes to the click have not moved the failure, so the
click is probably not what fails.

The assumption I have been working under is that the submit happens and the request
is slow. The failure pattern says otherwise: the request never fires at all, one run
in five. That is what a browser does when the form is invalid at the moment of the
click, because it refuses to submit and shows no error the test is looking for.

One check settles it: on the next failing run, capture the form's validity and each
field's value right before the click. If a required field is empty in the failing
run and filled in the passing runs, the fix is in the fill order, not the click.
