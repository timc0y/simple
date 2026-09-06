Both JSON and SQLite are viable. Since a database helper exists, first revisit the
storage decision with the user and ask which backend they prefer. Then introduce a
storage interface so either backend can be selected later.
