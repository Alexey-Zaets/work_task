"""webblog URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.views import LogoutView
from blog.views import LoginView, HomePageView, RegisterView, PostPageView, \
TagListView, CategoryListView, BlogPageView, AddPostView, UpdatePostView, \
AddCommentView, ReplyCommentView
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework.schemas import get_schema_view
from rest_framework_jwt.views import obtain_jwt_token
from blog.api import RegisterUserView, PostViewSet, TagViewSet, \
CategoryViewSet, CommentViewSet, LastTenCommentsViewSet, UserViewSet


urlpatterns = [
    path('', HomePageView.as_view(), name='home'),
    path('add/', csrf_exempt(AddPostView.as_view()), name='add_post'),
    path('blog/', BlogPageView.as_view(), name='blog'),
    path('admin/', admin.site.urls),
    path('login/', csrf_exempt(LoginView.as_view()), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', csrf_exempt(RegisterView.as_view()), name='register'),
    path('tag/<str:tag>/', TagListView.as_view(), name='tag'),
    path('post/<int:pk>/', PostPageView.as_view(), name='post'),
    path(
        'category/<str:category>/',
        CategoryListView.as_view(),
        name='category'
    ),
    path(
        'post/<int:pk>/edit/',
        csrf_exempt(UpdatePostView.as_view()),
        name='post_edit'
    ),
    path(
        'post/<int:pk>/addcomment/',
        csrf_exempt(AddCommentView.as_view()),
        name='add_comment'
    ),
    path(
        'reply/comment/<int:id>/',
        csrf_exempt(ReplyCommentView.as_view()),
        name='reply_comment'
    ),
]

schema_view = get_schema_view(title='Blog API')

urlpatterns += format_suffix_patterns([
    path('api/v1/', schema_view),
    path(
        'api/v1/user/',
        UserViewSet.as_view({'get': 'list'}),
        name='user_list'
    ),
    path(
        'api/v1/user/<int:pk>/',
        UserViewSet.as_view({'get': 'retrieve', 'delete': 'destroy'}),
        name='user_detail'
    ),
    path('api/v1/user/login/', obtain_jwt_token, name='user_login'),
    path(
        'api/v1/user/register/',
        RegisterUserView.as_view(),
        name='user_register'
    ),
    path(
        'api/v1/post/',
        PostViewSet.as_view({'get': 'list', 'post': 'create'}),
        name='post_list',
    ),
    path(
        'api/v1/post/<int:pk>/',
        PostViewSet.as_view({
            'get': 'retrieve',
            'patch': 'partial_update',
            'delete': 'destroy'
        }),
        name='post_detail',
    ),
    path(
        'api/v1/tag/',
        TagViewSet.as_view({'get': 'list', 'post': 'create'}),
        name='tag_list'
    ),
    path(
        'api/v1/tag/<int:pk>/',
        TagViewSet.as_view({
            'get': 'retrieve',
            'patch': 'partial_update',
            'delete': 'destroy'
        }),
        name='tag_detail'
    ),
    path(
        'api/v1/category/',
        CategoryViewSet.as_view({'get': 'list', 'post': 'create'}),
        name='category_list',
    ),
    path(
        'api/v1/category/<int:pk>/',
        CategoryViewSet.as_view({
            'get': 'retrieve',
            'patch': 'partial_update',
            'delete': 'destroy'
        }),
        name='category_detail'
    ),
    path(
        'api/v1/comment/',
        CommentViewSet.as_view({'get': 'list', 'post': 'create'}),
        name='comment_list'
    ),
    path(
        'api/v1/comment/<int:pk>/',
        CommentViewSet.as_view({
            'get': 'retrieve',
            'patch': 'partial_update',
            'delete': 'destroy'
        }),
        name='comment_detail'
    ),
    path(
        'api/v1/lastcomment/',
        LastTenCommentsViewSet.as_view({'get': 'list'}),
        name='lastcomment_list'
    ),
])