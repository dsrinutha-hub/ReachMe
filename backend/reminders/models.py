from django.db import models

from django.contrib.auth.models import User


class Reminder(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="reminders"
    )

    title = models.CharField(
        max_length=150
    )

    description = models.TextField(
        blank=True
    )

    location_name = models.CharField(
        max_length=200
    )

    latitude = models.DecimalField(
        max_digits=10,
        decimal_places=7
    )

    longitude = models.DecimalField(
        max_digits=10,
        decimal_places=7
    )

    radius = models.PositiveIntegerField(
        default=100
    )

    remind_at = models.DateTimeField(
        null=True,
        blank=True
    )

    is_active = models.BooleanField(
        default=True
    )

    is_triggered = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:

        ordering = [
            "-created_at"
        ]

    def __str__(self):

        return f"{self.title} - {self.location_name}"