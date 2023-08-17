import sqlite3
conn = sqlite3.connect('/home/es-admin/metrics.sqlite')
cursor = conn.cursor()

def main():
    query = '''
    SELECT SUM(bytes) 
    FROM (
        SELECT bytes, (ROW_NUMBER() OVER (ORDER BY id) - 1) / 44 AS group_num
        FROM measurements
    ) subquery
    GROUP BY group_num;
    '''

    cursor.execute(query)
    results = cursor.fetchall()
    val=0
    for row in results:
        sum_bytes = row[0]
        val += sum_bytes

    average = val/len(results)
    day = round(average*96/1000000, 3)
    print(f'Average bytes per 15-minute interval: {average}')
    print(f'Per Day (15-min interval): {day}MB')
    print(f'Per Month: {day*31}MB')
    print(f'Per Year: {day*365}MB')
    cursor.close()
    conn.close()


def t2():
    query = '''
    SELECT SUM(bytes) 
    FROM (
        SELECT bytes, (ROW_NUMBER() OVER (ORDER BY id) - 1) / 44 AS group_num
        FROM txmeasures
    ) subquery
    GROUP BY group_num;
    '''

    cursor.execute(query)
    results = cursor.fetchall()
    val=0
    for row in results:
        sum_bytes = row[0]
        val += sum_bytes

    average = val/len(results)
    day = round(average*96/1000000, 3)
    print(f'Average bytes per 15-minute interval: {average}')
    print(f'Per Day (15-min interval): {day}MB')
    print(f'Per Month: {day*31}MB')
    print(f'Per Year: {day*365}MB')
    cursor.close()
    conn.close()



t2()