Fix the record parser: it currently leaves whitespace in values, loses content after
an additional colon, and accepts malformed records. The command should parse INPUT
from the environment, defaulting to the existing sample when INPUT is absent. Trim
name and value, preserve colons inside values, and reject input without a nonempty
name and a colon. Use a suitable already-installed implementation through its supported
API if one exists; inspect the available documentation and examples first. Remove the
displaced custom parser. Preserve the installed package files and keep npm test runnable.
