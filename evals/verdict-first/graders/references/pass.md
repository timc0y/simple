Safe now, on one condition: you never roll the site script back below release 42.

The earlier blocker is gone. The live release supplies the booking end time, and a
real booking submitted after it carried the end time into the CRM. Deleting the
eleven inputs removes the only other source, so a rollback below the live release
would make every booking fail to save, because the CRM requires that field. You've
said you won't roll back, and if it were ever needed the inputs take about half an
hour to re-author. Delete them.
