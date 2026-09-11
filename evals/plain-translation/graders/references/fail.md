Quick summary of the finish issue.

`Item_N_Finish` maps `form.finish_code_N`, the raw repeater control, which carries
the bare code against a `Matte black`…`Polished brass` picklist. The CRM stores
unlisted values verbatim, so the field is silently junk. `toItemFinish` already emits
`item_N_finish_label = "Matte black"`, a valid option, but nothing reads it. The
resolver confirms the mapping and the simulator pins the defect.

Needs a five-slot mapping re-point. Let me know if you want me to draft it.
