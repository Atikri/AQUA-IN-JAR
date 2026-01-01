import calendar

months = list(calendar.month_name)[1:]
output = []

for i, month in enumerate(months, 1):
    output.append(f'<details>')
    output.append(f'  <summary style="cursor: pointer; font-weight: bold; margin: 10px 0;">{month}</summary>')
    output.append(f'  <ul>')
    
    # Get number of days in the month (using 2024 for leap year just in case, or generic 2025)
    # The user didn't specify a year, but Daily Laws is usually generic. Let's use 2024 to include Feb 29 if needed, 
    # or arguably The Daily Laws book has 366 days? Yes, "366 Meditations".
    # Robert Greene's book usually has Feb 29.
    
    _, num_days = calendar.monthrange(2024, i)
    
    for day in range(1, num_days + 1):
        output.append(f'    <li>{month} {day}</li>')
    
    output.append(f'  </ul>')
    output.append(f'</details>')
    output.append(f'') # Empty line for spacing

print('\n'.join(output))
