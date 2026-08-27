Move all 12 branches into a new event-handler registry and disable the complexity rule
for `routeEvent`. Unknown event types can fall through because callers validate them.
