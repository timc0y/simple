# Report lifecycle overview

The system uses a sophisticated asynchronous workflow. First, several components work
together to manage state. There are also retries and eventual consistency concerns.

| Component | Responsibility |
| --- | --- |
| API | Creates things |
| Worker | Does background work |
| UI | Shows status |

The UI can sometimes update before other operations finish.

```js
// Set the status to ready.
report.status = "ready";
```
