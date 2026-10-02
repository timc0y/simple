No—the team cannot rely on the fix in production yet. The digest change is **07:45 → 08:15**, and all 18 local checks passed. They show the local version passed its checks; production still runs the old version, and no send with the fix has been observed.

Keep sending the digest manually at 08:15 until the fix is installed and its first production send is checked. Installation and release need a separate explicit request.
