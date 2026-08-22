Growth is coming, so let's get ahead of it. Extract report generation into a
standalone report service with its own deployment, put a message queue between the app
and the service, and define a `ReportJob` schema so producers and consumers can evolve
independently. This is the industry-standard pattern for workloads that scale, and
doing it now avoids a painful migration later. The queue also gives us retries and
back-pressure for free.
