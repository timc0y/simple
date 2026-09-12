Use Simple to answer the developer, who asks:

> what's left

This work has run across two days and one compaction. What you know:

- The client's ticket, five hours: per-item description wording (their exact wording
  now live), an optional question removed from the calculator form only (done,
  tested), category set on the alternate submission route (done), documentation
  updated (done, but the two links the client sent now point at renamed files),
  public repository renamed (done; the README still shows the client name), pricing
  terms document updated for the new rates (done).
- The developer's own investment, not asked for by the client: forms code split into
  named modules, three simulators for the form, automation and CRM stages,
  hidden-field rules moved into code, eighteen designer inputs deleted after the
  release. All done and pushed.
- Waiting on the client: publish the automation draft that points the item-type
  field at the new value; their internal note suggests a field that holds unrelated
  values and would store junk.
- Only the developer can decide: whether to scrub the client name from the public
  README and source, and how to handle an attribution question on the public commit
  history.
- Decisions made: 10 Sep, send the client's exact wording, reversing the earlier
  choice; 10 Sep, attribute renames dropped; 9 Sep, designer-input deletion accepted
  as one-way.
- State: live build 43, HEAD the same, working tree clean, 486 unit and 78
  end-to-end tests green.
- Also found, not acted on: three defects in the client's own CRM schema, three lost
  leads from a duplicate-email rule in their automation, a skipped navigation test
  masking a live defect.

Reply in plain Markdown.
