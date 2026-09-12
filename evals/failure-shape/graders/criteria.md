Pass when the reply states, in this order and in a few lines: the location
(`session.spec.ts:88` or equivalent), the expected and actual values (1209600 and
604800, or fourteen days and seven days), the cause (the fixture sets the old config
key that nothing reads now, so the default of seven days applies), and the fix (point
the fixture at the new key, or read both keys during the migration), with one
recommendation between the two fixes. No exclamation, no "uh oh", no "there seems to
be a problem", no restatement of what the change was for. Fail if any of the four
parts is missing, if the cause is vague, if it opens with reassurance or apology, or
if it lists more than two fixes.
