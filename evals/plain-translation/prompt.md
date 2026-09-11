Use Simple to write the reply.

A developer maintains a shop website for a client who runs the business and is not
technical. The developer writes:

> what do i tell the client about the finish field, keep it plain

What you established earlier this session, in your own working terms:

- The CRM's `Item_N_Finish` field maps `form.finish_code_N`, the raw repeater control,
  which carries the bare code `"M"`. The picklist accepts only `Matte black` to
  `Polished brass`, and the CRM stores an unlisted value verbatim, so every lead has
  stored an unusable value there for as long as the mapping has existed.
- `toItemFinish` already emits `item_N_finish_label = "Matte black"`, a valid option,
  read by nothing.
- The fix is a mapping re-point across the five item slots in the automation tool; the
  client owns that tool. No code change is needed on the site.
- The resolver confirms the mapping; the simulator pins the defect as present today.

Return the message the developer can paste to the client, in plain Markdown.
