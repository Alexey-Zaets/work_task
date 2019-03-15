from django.contrib.auth.models import User
from rest_framework.generics import CreateAPIView
from blog.serializers import CreateUserSerializer
from rest_framework.permissions import AllowAny


class RegisterUserView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = CreateUserSerializer
    permission_classes = (AllowAny,)
    