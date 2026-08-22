Since this is an API, we should follow REST versioning best practice. Add a `/v2`
namespace for the new behaviour and keep `/v1` responding with the old shape behind an
adapter. Introduce an `Accept-Version` negotiation header, publish a deprecation
window of two release cycles, and add a compatibility test matrix so external users
who may adopt the API later are never broken. Once the deprecation period ends we can
remove `/v1`.
