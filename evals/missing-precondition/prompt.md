## The room with no door

A visual design platform has reusable objects that may contain instances of other
reusable objects.

One property carries a structured document: headings, paragraphs, lists, links,
images, and inline formatting.

When that property is connected directly to its final document, the public SDK
returns a structured editor handle. The tool can create blocks, move them into the
property, and read them back.

When the same property is passed through one or more nested objects, the public SDK
returns no editor handle.

Three observations are proven:

1. The human editor can change the nested document's block structure.
2. Different placed instances retain different structured documents.
3. The canvas renders those structures correctly at arbitrary nesting depth.

Therefore the structure exists and the platform can persist it.

But the public SDK sees two misleading views:

- the outer property reader returns one flattened string with invisible separators;
- walking the reusable-object definition reaches the final document but reads its
  default content, not the placed instance's override.

The SDK's ordinary identifier names a reusable-object definition and an element. It
contains no path through placed instances.

The tool has one operator. It must write structured blocks to the nested property
without flattening them, unlinking the object, automating the UI, or constructing
private collaboration messages.

It may use only supported public operations. The result must remain editable by the
platform and must be proved at the original placed instance.

What problem is this really?

Find the smallest design that makes the ordinary structured-document write path
sufficient. Describe the experiment that would prove or disprove your idea before
building it.
