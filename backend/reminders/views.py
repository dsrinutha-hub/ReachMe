from rest_framework import status

from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)

from rest_framework.permissions import (
    IsAuthenticated,
)

from rest_framework.response import Response

from rest_framework.views import APIView

from django.contrib.auth.models import User

from rest_framework_simplejwt.tokens import RefreshToken

from .models import Reminder

from .serializers import ReminderSerializer


class RegisterView(APIView):

    permission_classes = []

    def post(self, request):

        username = request.data.get(
            "username",
            ""
        ).strip()

        email = request.data.get(
            "email",
            ""
        ).strip()

        password = request.data.get(
            "password",
            ""
        )

        if not username or not email or not password:

            return Response(
                {
                    "detail":
                    "Username, email and password are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(
            username=username
        ).exists():

            return Response(
                {
                    "detail":
                    "Username already exists."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(
            email=email
        ).exists():

            return Response(
                {
                    "detail":
                    "Email already exists."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                },

                "access":
                    str(refresh.access_token),

                "refresh":
                    str(refresh),
            },

            status=status.HTTP_201_CREATED
        )


class MeView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        return Response(
            {
                "id":
                    request.user.id,

                "username":
                    request.user.username,

                "email":
                    request.user.email,
            }
        )


class ReminderListCreateView(
    ListCreateAPIView
):

    serializer_class = ReminderSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):

        return Reminder.objects.filter(
            user=self.request.user
        )

    def perform_create(self, serializer):

        serializer.save(
            user=self.request.user
        )


class ReminderDetailView(
    RetrieveUpdateDestroyAPIView
):

    serializer_class = ReminderSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def get_queryset(self):

        return Reminder.objects.filter(
            user=self.request.user
        )


class TriggerView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request, pk):

        try:

            reminder = Reminder.objects.get(
                pk=pk,
                user=request.user
            )

        except Reminder.DoesNotExist:

            return Response(
                {
                    "detail":
                    "Reminder not found."
                },
                status=404
            )

        reminder.is_triggered = True

        reminder.is_active = False

        reminder.save()

        return Response(
            ReminderSerializer(reminder).data
        )