Do not refactor it. Filesystem effects are the function's purpose, and the temporary-home
tests already prove the meaningful states through the public `install` surface. With
one caller, no duplicate policy, and no defect, a pure planner would add another seam
without making the behaviour easier to prove. Reconsider only if policy becomes shared
or a failure cannot be reproduced through the current tests.
