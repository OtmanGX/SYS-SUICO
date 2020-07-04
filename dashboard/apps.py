from django.apps import AppConfig
from datetime import datetime, timedelta
from itertools import groupby
import concurrent
from django.db.models import Sum
from django.utils import timezone
from dashboard.models import Energie, Phase


class DashboardConfig(AppConfig):
    name = 'dashboard'


def set_limits(data, LIMITS):
    LIMITS["TENSION"]["max"] = data.get("tensionMax")
    LIMITS["TENSION"]["theo"] = data.get("tensionTheo")

    LIMITS["COURANT"]["max"] = data.get("courantMax")
    LIMITS["COURANT"]["theo"] = data.get("courantTheo")

    LIMITS["PUISSANCE"]["max"] = data.get("puissanceMax")
    LIMITS["PUISSANCE"]["theo"] = data.get("puissanceTheo")

    LIMITS["ENERGIE"]["max"] = data.get("EnergieMax")
    LIMITS["ENERGIE"]["theo"] = data.get("EnergieTheo")

    LIMITS["PUISSANCE_TOT"]["max"] = data.get("PuissanceTotMax")
    LIMITS["PUISSANCE_TOT"]["theo"] = data.get("PuissanceTotTheo")

    for itemkey in LIMITS.keys():
        for key, value in LIMITS[itemkey].items():
            LIMITS[itemkey][key] = float(value)
    print(LIMITS)




def puissance_day():
    now = timezone.now()
    query = Phase.objects.values('created_at').annotate(
                            puissance=Sum('puissance__value')).filter(created_at__day=now.day)
    return query


def energie_day():
    res = []
    today = datetime.today()
    dt = today.replace(hour=0, minute=0, second=0, microsecond=0, tzinfo=timezone.utc)
    for i in range(23):
        query = Energie.objects.filter(phase__created_at__range=[dt + timedelta(hours=i),
                                                                 dt + timedelta(hours=i + 1)])
        if query.count() > 2:
            value = (query.filter(phase__phase=1).last().value -
                     query.filter(phase__phase=1).first().value)
            value2 = (query.filter(phase__phase=2).last().value -
                      query.filter(phase__phase=2).first().value)
            value3 = (query.filter(phase__phase=3).last().value -
                      query.filter(phase__phase=3).first().value)
            res.append({
                'phase1': round(value, 3),
                'phase2': round(value2, 3),
                'phase3': round(value3, 3),
            })
        else:
            res.append({
                'phase1': 0,
                'phase2': 0,
                'phase3': 0,
            })
    return res


def energie_year(percent=False):
    res = []
    today = datetime.today()
    dt = today.replace(day=1, month=1, hour=0, minute=0, second=0, microsecond=0, tzinfo=timezone.utc)
    dt = dt - timedelta(dt.weekday())
    for i in range(1, 13):
        first_date = dt.replace(month=i)
        if i == 12:
            last_date = dt.replace(year=dt.year+1)
        else:
            last_date = dt.replace(month=i+1)
        query = Energie.objects.filter(phase__created_at__range=[first_date,
                                                                 last_date])
        if query.count() > 2:
            value = (query.filter(phase__phase=1).last().value -
                     query.filter(phase__phase=1).first().value) * 100
            value2 = (query.filter(phase__phase=1).last().value -
                      query.filter(phase__phase=1).first().value) * 100
            value3 = (query.filter(phase__phase=1).last().value -
                      query.filter(phase__phase=1).first().value) * 100
            res.append({
                'phase1': round(value, 3),
                'phase2': round(value2, 3),
                'phase3': round(value3, 3),
            })
            if percent:
                total_sum = sum(res)
                res = [i*100/total_sum for i in res]
        else:
            res.append({
                'phase1': 0,
                'phase2': 0,
                'phase3': 0,
            })
    return res


def energie_week():
    res = []
    today = datetime.today()
    dt = today.replace(hour=0, minute=0, second=0, microsecond=0, tzinfo=timezone.utc)
    dt = dt - timedelta(dt.weekday())
    for i in range(7):
        query = Energie.objects.filter(phase__created_at__range=[dt + timedelta(i),
                                                                 dt + timedelta(i + 1)])
        if query.count() > 2:
            value = (query.filter(phase__phase=1).last().value -
                     query.filter(phase__phase=1).first().value) * 100
            value2 = (query.filter(phase__phase=1).last().value -
                      query.filter(phase__phase=1).first().value) * 100
            value3 = (query.filter(phase__phase=1).last().value -
                      query.filter(phase__phase=1).first().value) * 100
            res.append({
                'phase1': round(value, 3),
                'phase2': round(value2, 3),
                'phase3': round(value3, 3),
            })
        else:
            res.append({
                'phase1': 0,
                'phase2': 0,
                'phase3': 0,
            })
    return res


def energie_stats(format='Day'):
    if format == 'Day':
        return energie_day()
    elif format == 'Week':
        return energie_week()
    elif format == 'Year':
        return energie_year()
