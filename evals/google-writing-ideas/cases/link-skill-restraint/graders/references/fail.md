Split the function into `inspectLink`, `planLinkAction`, and `executeLinkAction`. Return
action objects from the pure planner, inject a filesystem interface, and add a class for
each link state. Unit-test every planner branch and retain the current integration tests.
