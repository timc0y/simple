Treat HTTP 410 with `provider-retired` as permanent. Change the existing billing
router's default to the already-integrated, compatibility-tested secondary and remove
the retired primary from the retry path. Keep the stored provider-neutral customer ID
and existing billing records unchanged; only the provider route changes. Prove it with
a routing test, a real test charge or approved sandbox charge, and a readback that the
same customer ID and billing record are retained. Record the retired provider as a
reconsideration trigger only if the secondary fails measured requirements.
