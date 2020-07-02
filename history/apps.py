from django.apps import AppConfig
from django.db.models import F

from dashboard.models import Phase


class HomeConfig(AppConfig):
    name = 'history'


TABLES = ['tension', 'courant', 'puissance', 'energie']


def join_dicts(*args):
    res = args[0]
    for d in args[1:]:
        res.update(d)
    return res


def history_all():
    history = []
    for i in range(1, 4):
        fields = {item[0] + str(i): F(item + '__value') for item in TABLES}
        p = Phase.objects.filter(phase=i) \
            .annotate(fields) \
            .values(*fields.keys(), 'created_at')
        history.append(p)

    return map(join_dicts, *history)

# p2 = Phase.objects.filter(phase=1).annotate(t1=F('tension__value'),
#                                                 c1=F('courant__value'),
#                                                 p1=F('puissance__value'),
#                                                 e1=F('energie__value'),
#                                                 ).values()
