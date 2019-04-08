from django.contrib.auth.models import User
from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import BasePermission, AllowAny, IsAdminUser, \
IsAuthenticated, SAFE_METHODS
from rest_framework.response import Response
from django_filters import rest_framework as filters
from blog.models import Post, Tag, Category, Comment
from blog.filters import PostFilter
from blog.serializers import RegisterUserSerializer, PostSerializer, \
TagSerializer, CategorySerializer, CommentSerializer, UserSerializer, \
PostReadSerializer, CommentReadSerializer


class UpdatePost(BasePermission):

    def has_object_permission(self, request, view, obj):
        print(request.user)
        if request.method in SAFE_METHODS:
            return True
        return obj.author == request.user

class CustomPermissionMixin:
    '''
    The class defines a common method for its inherited classes
    '''

    def get_permissions(self):
        '''
        Method returns permission for a specific user
        '''
        if self.action in ['list', 'retrieve',]:
            permission_classes = (AllowAny,)
        else:
            permission_classes = (IsAdminUser,)
        return [permission() for permission in permission_classes]


class UserViewSet(CustomPermissionMixin, viewsets.ModelViewSet):
    '''
    Processes requests for data retrieval by users
    '''
    queryset = User.objects.filter(is_active=True)
    serializer_class = UserSerializer

    def perform_destroy(self, instance):
        '''
        Overrides the default method, making the user object inactive
        '''
        instance.is_active = False
        instance.save()


class RegisterUserView(CreateAPIView):
    '''
    Processes requests for create users
    '''
    queryset = User.objects.all()
    serializer_class = RegisterUserSerializer
    permission_classes = (AllowAny,)


class PostViewSet(viewsets.ModelViewSet):
    '''
    Processes requests for data retrieval by posts
    '''
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = PostFilter

    def get_permissions(self):
        if self.action in ['list', 'retrieve',]:
            permission_classes = (AllowAny,)
        elif self.action == 'create':
            permission_classes = (IsAuthenticated,)
        elif self.action == 'partial_update':
            permission_classes = (UpdatePost,)
        else:
            permission_classes = (IsAdminUser,)
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return PostReadSerializer
        return PostSerializer

    def create(self, request):
        author = User.objects.get(username=request.data.get('author'))
        request.data.update({'author': author.id})
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class TagViewSet(CustomPermissionMixin, viewsets.ModelViewSet):
    '''
    Processes requests for data retrieval by tags
    '''
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class CategoryViewSet(CustomPermissionMixin, viewsets.ModelViewSet):
    '''
    Processes requests for data retrieval by categories
    '''
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class LastTenCommentsViewSet(viewsets.ModelViewSet):
    '''
    Processes requests for data retrieval by last 10 comments
    '''
    queryset = Comment.objects.all().order_by('-pub_date')
    serializer_class = CommentReadSerializer
    permission_classes = (AllowAny,)


class CommentViewSet(viewsets.ModelViewSet):
    '''
    Processes requests for data retrieval by comments
    '''
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return CommentReadSerializer
        return CommentSerializer

    def create(self, request):
        '''
        Overrides the default method, creates a comment object with
        current user author
        '''
        author = request.data.get('author')
        author = User.objects.get(username=author).id if author else None
        request.data['author'] = author
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_permissions(self):
        '''
        Set permissions for users
        '''
        if self.action in ['list', 'retrieve', 'create', 'partial_update']:
            permission_classes = (AllowAny,)
        else:
            permission_classes = (IsAdminUser,)
        return [permission() for permission in permission_classes]
