from django.urls import path

from .views import (
    RegisterView,
    MeView,
    ReminderListCreateView,
    ReminderDetailView,
    TriggerView,
)

from django.http import JsonResponse


def home(request):
    return JsonResponse({
        "message": "ReachMe API is running successfully!",
        "status": "success"
    })


urlpatterns = [

    path(
        "",
        home,
        name="home"
    ),

    path(
        "register/",
        RegisterView.as_view()
    ),

    path(
        "me/",
        MeView.as_view()
    ),

    path(
        "reminders/",
        ReminderListCreateView.as_view()
    ),

    path(
        "reminders/<int:pk>/",
        ReminderDetailView.as_view()
    ),

    path(
        "reminders/<int:pk>/trigger/",
        TriggerView.as_view()
    ),
]