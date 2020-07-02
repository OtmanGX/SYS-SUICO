from django.shortcuts import render
from django.http import JsonResponse
import threading
import time
from dashboard.apps import energie_stats, puissance_day, set_limits
from dashboard.models import LIMITS


time.sleep(1)
thread = None
for t in threading.enumerate():
    print(t.name)
    if t.name == 'serialThread':
        thread = t


def dashboard(request):
    global LIMITS
    if request.POST:
        set_limits(request.POST, LIMITS)

    energieDay = energie_stats()
    # energieWeek = energie_stats()
    return render(request, 'dashboard.html', {'energieDay': energieDay, 'LIMITS': LIMITS})


def puissanceday_view(request):
    puissanceDay = puissance_day()
    return JsonResponse(data={
        'puissanceDay': tuple(puissanceDay)
    })

# def year_history():
#     queryset = Temperature.objects.filter(created_at__year=timezone.now().year)
#     data = map(lambda x: {'date': x.created_at.isoformat(), 'value': x.value}, queryset)
#     return JsonResponse(data={'data': data})


def realtime_api(request):
    try:
        data = thread.q.get_nowait()
    except Exception:
        data = None
    return JsonResponse(data={
        'data': data
        # 'data': {'value': randrange(12, 27), 'date': datetime.now().replace(tzinfo=timezone.utc).isoformat()}
    })
