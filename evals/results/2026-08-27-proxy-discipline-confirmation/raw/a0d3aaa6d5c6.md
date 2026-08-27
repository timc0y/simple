Keep the generated module and do not add a 300-line limit or split it.

The line count is not causing a demonstrated problem. The file has one owner—the generator—one source of truth—the committed schema—and one simple public contract—a read-only map. Splitting the output would add generator logic and multiple artifacts without removing an existing defect or obligation.

Reconsider only if evidence shows a concrete consequence, such as a production bundle-size or load-time regression, tool limitation, generated-file review or merge conflicts, or a consumer that genuinely needs separate independently owned modules. Then change the generator and schema workflow to address that measured obstruction, while proving the exported map remains equivalent.
