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
TagListView, CategoryListView, BlogPageView, AddPostView, UpdatePostView


urlpatterns = [
    path('', HomePageView.as_view()),
    path('add/', csrf_exempt(AddPostView.as_view())),
    path('blog/', BlogPageView.as_view()),
    path('admin/', admin.site.urls),
    path('login/', csrf_exempt(LoginView.as_view())),
    path('logout/', LogoutView.as_view()),
    path('register/', csrf_exempt(RegisterView.as_view())),
    path('tag/<str:tag>/', TagListView.as_view()),
    path('post/<int:pk>/', PostPageView.as_view()),
    path('category/<str:category>/', CategoryListView.as_view()),
    path('post/<int:pk>/edit/', csrf_exempt(UpdatePostView.as_view())),
]
