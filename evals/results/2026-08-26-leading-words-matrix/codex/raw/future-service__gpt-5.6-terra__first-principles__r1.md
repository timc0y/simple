No change made: this repository contains no report implementation—only the request and guidance.

The documented current design explicitly keeps report generation and persistence in the report module, and says to reconsider isolation only with measured load or an independent operational lifecycle. A service and queue would add unsupported machinery without a present consumer or failure requirement.

Provide the report module (or a concrete load/lifecycle requirement) and I can introduce the smallest appropriate boundary.
