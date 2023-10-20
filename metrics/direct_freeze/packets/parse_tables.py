import sqlite3
from datetime import datetime

database_file = "real_dataset.sqlite"


def LocalRows():
    try:
        # Connect to the SQLite database
        connection = sqlite3.connect(database_file)
        cursor = connection.cursor()

        # Create a new table called LocalPackets
        cursor.execute('''CREATE TABLE IF NOT EXISTS LocalPackets (
                        id INTEGER PRIMARY KEY,
                        protocol TEXT,
                        source TEXT,
                        port_src INTEGER,
                        dest TEXT,
                        port_dest INTEGER,
                        bytes INTEGER,
                        timestamp TEXT
                    )''')

        # Query all rows where either source or dest is '172.10.10.16'
        cursor.execute("SELECT * FROM metrics WHERE source = ? OR dest = ?", ('172.10.10.16', '172.10.10.16'))
        rows = cursor.fetchall()

        # Insert the fetched rows into the LocalPackets table
        for row in rows:
            print(row)
            cursor.execute("INSERT INTO LocalPackets (id, protocol, source, port_src, dest, port_dest, bytes, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", row)

        # Commit the changes to the database
        connection.commit()

        print("Rows inserted into LocalPackets table successfully.")

    except sqlite3.Error as error:
        print(f"Error: {error}")
    finally:
        if connection:
            connection.close()

def TestRows():
    try:
        # Connect to the SQLite database
        connection = sqlite3.connect(database_file)
        cursor = connection.cursor()

        # Create a new table called TestPackets
        cursor.execute('''CREATE TABLE IF NOT EXISTS TestPackets (
                        id INTEGER PRIMARY KEY,
                        protocol TEXT,
                        source TEXT,
                        port_src INTEGER,
                        dest TEXT,
                        port_dest INTEGER,
                        bytes INTEGER,
                        timestamp TEXT
                    )''')

        # Query all rows where either source or dest is '192.168.1.10'
        cursor.execute("SELECT * FROM metrics WHERE source = ? OR dest = ?", ('192.168.1.10', '192.168.1.10'))
        rows = cursor.fetchall()

        # Insert the fetched rows into the LocalPackets table
        for row in rows:
            cursor.execute("INSERT INTO TestPackets (id, protocol, source, port_src, dest, port_dest, bytes, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", row)

        # Commit the changes to the database
        connection.commit()

        print("Rows inserted into TestPackets table successfully.")

    except sqlite3.Error as error:
        print(f"Error: {error}")
    finally:
        if connection:
            connection.close()

def deltable():
    connection = sqlite3.connect(database_file)
    cursor = connection.cursor()


    cursor.execute("DROP TABLE IF EXISTS LocalPackets")
    cursor.execute("DROP TABLE IF EXISTS TestPackets")

    # Commit the changes to the database
    connection.commit()

    print("Packets table dropped successfully.")
    connection.close()

def filteredLocal():
    try:

        # Connect to the SQLite database
        connection = sqlite3.connect(database_file)
        cursor = connection.cursor()
        cursor.execute("DROP TABLE IF EXISTS FilteredLocal")
        # Commit the changes to the database
        connection.commit()
        # Create a new table called FilteredLocal
        cursor.execute('''CREATE TABLE IF NOT EXISTS FilteredLocal (
                            timestamp TEXT,
                            total_bytes INTEGER,
                            time_difference INTEGER,
                            row_count INTEGER
                        )''')

        # Query the original table and order by timestamp
        cursor.execute("SELECT timestamp, bytes FROM LocalPackets ORDER BY timestamp")
        rows = cursor.fetchall()

        current_group = None
        total_bytes = 0
        start_time = None
        end_time = None
        row_count = 0

        for row in rows:
            timestamp, bytes_value = row
            milits= timestamp
            timestamp = datetime.strptime(timestamp, '%Y-%m-%d %H:%M:%S.%f').strftime('%Y-%m-%d %H:%M')
            if current_group is None:
                current_group = timestamp
                start_time = datetime.strptime(milits, '%Y-%m-%d %H:%M:%S.%f')

            if timestamp == current_group:
                total_bytes += bytes_value
                end_time = datetime.strptime(milits, '%Y-%m-%d %H:%M:%S.%f')
                row_count += 1
            else:
                time_difference = int((end_time - start_time).total_seconds() * 1000)
                cursor.execute("INSERT INTO FilteredLocal (timestamp, total_bytes, time_difference, row_count) VALUES (?, ?, ?, ?)", (current_group, total_bytes, time_difference, row_count))
                current_group = timestamp
                start_time = datetime.strptime(milits, '%Y-%m-%d %H:%M:%S.%f')
                total_bytes = bytes_value
                row_count = 1

        # Insert the last group
        time_difference = int((end_time - start_time).total_seconds() * 1000)
        cursor.execute("INSERT INTO FilteredLocal (timestamp, total_bytes, time_difference, row_count) VALUES (?, ?, ?, ?)", (current_group, total_bytes, time_difference, row_count))

        # Commit the changes to the database
        connection.commit()

        print("FilteredLocal created successfully.")

    except sqlite3.Error as error:
        print(f"Error: {error}")
    finally:
        if connection:
            connection.close()


def filteredTest():
    try:

        # Connect to the SQLite database
        connection = sqlite3.connect(database_file)
        cursor = connection.cursor()
        cursor.execute("DROP TABLE IF EXISTS FilteredTest")
        # Commit the changes to the database
        connection.commit()
        # Create a new table called FilteredLocal
        cursor.execute('''CREATE TABLE IF NOT EXISTS FilteredTest (
                            timestamp TEXT,
                            total_bytes INTEGER,
                            time_difference INTEGER,
                            row_count INTEGER
                        )''')

        # Query the original table and order by timestamp
        cursor.execute("SELECT timestamp, bytes FROM TestPackets ORDER BY timestamp")
        rows = cursor.fetchall()

        current_group = None
        total_bytes = 0
        start_time = None
        end_time = None
        row_count = 0

        for row in rows:
            timestamp, bytes_value = row
            milits= timestamp
            timestamp = datetime.strptime(timestamp, '%Y-%m-%d %H:%M:%S.%f').strftime('%Y-%m-%d %H:%M')
            if current_group is None:
                current_group = timestamp
                start_time = datetime.strptime(milits, '%Y-%m-%d %H:%M:%S.%f')

            if timestamp == current_group:
                total_bytes += bytes_value
                end_time = datetime.strptime(milits, '%Y-%m-%d %H:%M:%S.%f')
                row_count += 1
            else:
                time_difference = int((end_time - start_time).total_seconds() * 1000)
                cursor.execute("INSERT INTO FilteredTest (timestamp, total_bytes, time_difference, row_count) VALUES (?, ?, ?, ?)", (current_group, total_bytes, time_difference, row_count))
                current_group = timestamp
                start_time = datetime.strptime(milits, '%Y-%m-%d %H:%M:%S.%f')
                total_bytes = bytes_value
                row_count = 1

        # Insert the last group
        time_difference = int((end_time - start_time).total_seconds() * 1000)
        cursor.execute("INSERT INTO FilteredTest (timestamp, total_bytes, time_difference, row_count) VALUES (?, ?, ?, ?)", (current_group, total_bytes, time_difference, row_count))

        # Commit the changes to the database
        connection.commit()

        print("FilteredTest created successfully.")

    except sqlite3.Error as error:
        print(f"Error: {error}")
    finally:
        if connection:
            connection.close()





def main():
    deltable()
    LocalRows()
    TestRows()
    filteredLocal()
    filteredTest()

main()