from rest_framework import status
from django.contrib.auth.models import User
from rest_framework.generics import CreateAPIView, ListAPIView
from blog.serializers import RegisterUserSerializer, PostSerializer, \
TagSerializer, CategorySerializer, CommentSerializer, UserSerializer
from rest_framework.permissions import AllowAny, IsAdminUser
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from blog.models import Post, Tag, Category, Comment


class CustomPermissionMixin:

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAdminUser]
        return [permission() for permission in self.permission_classes]
    

class UserViewSet(CustomPermissionMixin, viewsets.ModelViewSet):
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()


class RegisterUserView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterUserSerializer
    permission_classes = (AllowAny,)


class PostViewSet(CustomPermissionMixin, viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


class TagViewSet(CustomPermissionMixin, viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class CategoryViewSet(CustomPermissionMixin, viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class LastTenCommentsViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()[:10]
    serializer_class = CommentSerializer
    permission_classes = (AllowAny,)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'create']:
            self.permission_classes = [AllowAny]
        else:
            self.permission_classes = [IsAdminUser]
        return [permission() for permission in self.permission_classes]
