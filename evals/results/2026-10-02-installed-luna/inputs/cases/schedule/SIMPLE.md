# Morning digest

## Reality
The team uses the production morning digest. A local fix changes the send time from 07:45 to 08:15. All 18 local checks passed. The production service still runs the old version; the fix has not been installed. No production send has been observed with the fix.

## Preserve
Until the fix is installed and its first production send is checked, the operator sends the digest manually at 08:15. A local check does not prove production timing.

## Authority
The current task is read-only. Installation and release are separate actions requiring an explicit request.
