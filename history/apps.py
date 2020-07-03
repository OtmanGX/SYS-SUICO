from datetime import datetime

from django.apps import AppConfig
from django.db.models import F
from django.utils import timezone
from dashboard.models import Phase
TABLES = ['tension', 'courant', 'puissance', 'energie']


class HomeConfig(AppConfig):
    name = 'history'



def string_to_date(date):
    if date:
        date = datetime.strptime(date, '%Y-%m-%d %H:%M')
        return date.replace(tzinfo=timezone.utc)
    return None


def join_dicts(*args):
    res = args[0]
    for d in args[1:]:
        res.update(d)
    p1 = res["p1"] if res["p1"] else 0
    p2 = res["p2"] if res["p2"] else 0
    p3 = res["p3"] if res["p3"] else 0
    res['p_total'] = p1+p2+p3
    return res


def history_all(date1, date2=None):
    # now = timezone.now()
    # dt = now.replace(hour=0, minute=0, second=0, microsecond=0)
    if date2 is None:
        filters = {'created_at__gte': date1}
    else:
        filters = {'created_at__range': [date1, date2]}
    history = []
    for i in range(1, 4):
        fields = {item[0] + str(i): F(item + '__value') for item in TABLES}
        p = Phase.objects.filter(phase=i, **filters) \
            .annotate(**fields).order_by('-created_at')\
            .values(*fields.keys(), 'created_at')
        history.append(p)
    return map(join_dicts, *history)

# p2 = Phase.objects.filter(phase=1).annotate(t1=F('tension__value'),
#                                                 c1=F('courant__value'),
#                                                 p1=F('puissance__value'),
#                                                 e1=F('energie__value'),
#                                                 ).values()
