from django.db import models


class Tension(models.Model):
    # phase = models.SmallIntegerField(blank=False)
    phase = models.ForeignKey('Phase', on_delete=models.CASCADE)
    value = models.FloatField()


class Courant(models.Model):
    phase = models.ForeignKey('Phase', on_delete=models.CASCADE)
    value = models.FloatField()


class Puissance(models.Model):
    phase = models.ForeignKey('Phase', on_delete=models.CASCADE)
    value = models.FloatField()


class Energie(models.Model):
    phase = models.ForeignKey('Phase', on_delete=models.CASCADE)
    value = models.FloatField()


class Phase(models.Model):
    created_at = models.DateTimeField()
    phase = models.SmallIntegerField(blank=False)


LIMITS = {"TENSION":
              {"max": 225, "theo": 222},
          "COURANT":
              {"max": 1, "theo": 0.82},
          "PUISSANCE":
              {"max": 206, "theo": 193},
          "ENERGIE":
              {"max": 225, "theo": 222},
          "PUISSANCE_TOT":
              {"max": 630, "theo": 550},
          }
