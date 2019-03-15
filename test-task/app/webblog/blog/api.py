from django.contrib.auth.models import User
from rest_framework.generics import CreateAPIView
from blog.serializers import RegisterUserSerializer, PostSerializer
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from blog.models import Post


class RegisterUserView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterUserSerializer
    permission_classes = (AllowAny,)
    

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (AllowAny,)