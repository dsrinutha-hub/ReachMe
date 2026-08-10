from django.contrib import admin

from .models import Reminder


@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):

    list_display = (
        "title",
        "user",
        "location_name",
        "radius",
        "is_active",
        "is_triggered",
    )

    search_fields = (
        "title",
        "location_name",
        "user__username",
    )

    list_filter = (
        "is_active",
        "is_triggered",
    )