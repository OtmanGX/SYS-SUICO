from django.shortcuts import render


def history(request):
    return render(request, 'history.html')


def history_per(request):
    return render(request, 'history_per.html')