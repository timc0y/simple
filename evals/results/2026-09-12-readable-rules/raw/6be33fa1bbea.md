The timeout is a downstream symptom: the success message cannot appear because the request never fires.

Before changing the wait or selector again, I’ll check the form’s validity at the moment of the click. I’ll capture the validation state and confirm whether the submit event runs:

- If the form is invalid, I’ll fix the test data or wait for the required fields to become valid.
- If it is valid but no request fires, I’ll trace the submit handler and any event interception.

Can you confirm whether the form reports valid immediately before the click?
