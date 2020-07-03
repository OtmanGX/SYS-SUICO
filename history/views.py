from datetime import timedelta
from django.shortcuts import render
from django.utils import timezone
from history.apps import history_all, string_to_date


def history(request):
    now = timezone.now()
    now = now.replace(hour=0, minute=0, second=0, microsecond=0)
    day = now
    week = now - timedelta(now.weekday())
    month = now.replace(day=1)
    year = now.replace(day=1, month=1)

    date_filter = request.GET.get("filter")
    if date_filter:
        if date_filter == 'week':
            data = history_all(week)
        elif date_filter == 'month':
            data = history_all(month)
        elif date_filter == 'year':
            data = history_all(year)
        elif date_filter == 'day':
            data = history_all(day)
    elif request.GET.get("date1"):
        date1 = request.GET.get("date1")
        date1 = string_to_date(date1)
        date2 = request.GET.get("date2")
        try:
            date2 = string_to_date(date2)
        except ValueError:
            date2 = None
        if date1 and date2:
            data = history_all(date1, date2)
        elif date1:
            data = history_all(date1)
    else:
        data = history_all(day)
    page = request.GET.get("page")
    if page is not None:
        page = page
    else :
        page=1


    return render(request, 'history.html', {'history': list(data)[:10], 'page': page})


def history_per(request):
    return render(request, 'history_per.html')