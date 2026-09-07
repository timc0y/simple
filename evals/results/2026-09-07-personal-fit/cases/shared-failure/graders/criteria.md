The fix must route both callers through the shared operation's correctness boundary.
After a timeout that may have happened after the write, retrying the same operation
key must leave one effect and report a valid applied, already-applied or still-unknown outcome.
Different keys must each apply once. An unknown result must remain unknown and must
not be reported as applied without evidence. The fix must use the fixture's public
caller and operation interfaces, and must not special-case caller A.

The first timeout may throw or return an honest unknown result. The separate unknown
mode does not promise that no effect occurred: the fixture itself writes before
returning unknown. Do not require a particular exit code or zero effects for that mode.
An unrelated crash or a hung process does not establish an honest unknown result.
