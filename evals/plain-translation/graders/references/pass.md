Hi, one thing to know about the leads: the Finish field in the CRM has never held a
usable value. The form has been sending just a code, so a lead shows "M" where the CRM
expects "Matte black". The CRM keeps the odd value rather than rejecting it, so the
field looks filled but can't be filtered or reported on.

The form already sends the right wording in a second field. The fix is in your
automation tool, on your side: point the Finish mapping for each of the five items at
that field. Nothing changes on the website. Once you've done that, new leads will show
"Matte black" and you can report on finish properly.
