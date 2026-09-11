Use Simple to answer the developer. They paste back a sentence you wrote earlier and
ask:

> is this safe to do now? "Delete the eleven display-none inputs. This is a one-way
> door: delete them and you can no longer roll the site script back to release 41,
> because that release has no source for the booking length and the end time empties
> on every booking. Defer until you'd never roll back."

Facts established since you wrote that:

- Release 42 went live at 10:24 today. A real test booking submitted after that
  carried the end date and time into the CRM; you checked the record.
- The end time is mandatory on the CRM's booking module, confirmed from the schema. A
  rollback below release 42 after the deletion would make bookings fail to save.
- Nothing else depends on the eleven inputs. Re-authoring them by hand would take
  about thirty minutes if ever needed.
- The developer has said they do not intend to roll back.

Reply in plain Markdown.
