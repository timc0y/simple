import sqlite3
connection = sqlite3.connect(':memory:')
connection.execute('CREATE TABLE items (id INTEGER PRIMARY KEY, item_title TEXT NOT NULL)')
connection.execute('INSERT INTO items VALUES (1, ?)', ('Before',))
# Old worker retains its unchanged physical-column query.
def old_read():
    return connection.execute('SELECT item_title FROM items WHERE id = 1').fetchone()[0]
# New internal vocabulary is independent of physical storage vocabulary.
def new_read():
    row = connection.execute('SELECT item_title AS label FROM items WHERE id = 1').fetchone()
    return {'label': row[0]}
def new_write(label):
    connection.execute('UPDATE items SET item_title = ? WHERE id = 1', (label,))
assert old_read() == new_read()['label'] == 'Before'
new_write('After')
assert old_read() == new_read()['label'] == 'After'
api = {'item_title': new_read()['label']}
assert api == {'item_title': 'After'}
assert [r[1] for r in connection.execute('PRAGMA table_info(items)')] == ['id', 'item_title']
print('Both readers, new writes and unchanged API work with one stored title value.')
