from rest_framework import serializers

from .models import Reminder


class ReminderSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Reminder

        fields = "__all__"

        read_only_fields = [
            "user",
            "is_triggered",
            "created_at",
            "updated_at",
        ]

    def validate_radius(self, value):

        if value < 20:

            raise serializers.ValidationError(
                "Radius must be at least 20 meters."
            )

        if value > 5000:

            raise serializers.ValidationError(
                "Radius cannot exceed 5000 meters."
            )

        return value