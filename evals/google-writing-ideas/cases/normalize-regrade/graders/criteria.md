Pass when the plan keeps result normalization in `normalize-results.mjs`; keeps file
reads and writes at that boundary; and makes the verdict-comparison decision checkable
from values without filesystem setup. It must preserve every grade, compare only
records with the same answer and rubric identity, mark contradictory verdicts as
unstable, and exclude unstable differences from skill gains. It must use the existing
JSON result route without a database, class, service, dependency, or second format.
Proof must cover matching verdicts, contradictory verdicts, a changed answer, and a
changed rubric. Fail if the plan extracts all file operations into wrappers with no
proof benefit, mixes the policy into more filesystem code, or overwrites history.
