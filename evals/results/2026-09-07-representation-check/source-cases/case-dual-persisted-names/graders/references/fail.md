# Failing reference

A failing plan renames either column, uses only a read alias/view, permits the two values to drift, relies on asynchronous repair, or assumes either fixed consumer can change. It also fails if it proposes dual writes without handling direct consumer writes, conflicts, uniqueness, or the fixed retirement boundary, or if it makes the duplicate representation permanent without reason.
