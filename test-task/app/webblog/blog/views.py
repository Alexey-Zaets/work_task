from django.http import HttpResponseRedirect, Http404
from django.shortcuts import render
from django.views import View
from django.views.generic.base import TemplateView
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import AuthenticationForm
from .models import Post, Category, Tag
from .forms import RegisterUserForm


class ListPageView(ListView):
    http_method_names = ['get']
    template_name = 'index.html'
    model = Post
    paginate_by = 4

    def get_context_data(self, **kwargs):
        context = super(ListPageView, self).get_context_data(**kwargs)
        context['url'] = self.request.path + '?'
        context['tags'] = Tag.objects.all()
        context['category'] = Category.objects.all()
        return context


class HomePageView(ListPageView):
    template_name = 'index.html'

    def get_context_data(self, **kwargs):
        context = super(HomePageView, self).get_context_data(**kwargs)
        return context


class PostPageView(DetailView):
    http_method_names = ['get']
    model = Post
    template_name = 'post.html'

    def get_context_data(self, **kwargs):
        context = super(PostPageView, self).get_context_data(**kwargs)
        context['post_tags'] = Tag.objects.filter(post=kwargs['object'])
        context['tags'] = Tag.objects.all()
        context['category'] = Category.objects.all()
        return context


class TagListView(ListPageView):

    def get_queryset(self):
        qs = super(TagListView, self).get_queryset()
        tag = self.kwargs.get('tag')
        if tag is not None:
            try:
                qs = qs.filter(tags__title=tag)
            except Post.DoesNotExist:
                raise Http404
        return qs

    def get_context_data(self, **kwargs):
        context = super(TagListView, self).get_context_data(**kwargs)
        return context


class CategoryListView(ListPageView):

    def get_queryset(self):
        qs = super(CategoryListView, self).get_queryset()
        category = self.kwargs.get('category')
        if category is not None:
            try:
                qs = qs.filter(category__title=category)
            except Post.DoesNotExist:
                raise Http404
        return qs

    def get_context_data(self, **kwargs):
        context = super(CategoryListView, self).get_context_data(**kwargs)
        return context


class LoginView(View):
    http_method_names = ['get', 'post']
    form_class = AuthenticationForm
    template_name = 'login.html'

    def get(self, request, *args, **kwargs):
        form = self.form_class()
        return render(request, self.template_name, {'form': form})

    def post(self, request, *args, **kwargs):
        form = self.form_class(request, data=request.POST)
        if form.is_valid():
            username = request.POST.get('username')
            password = request.POST.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                if user.is_active:
                    login(request, user)
                    return HttpResponseRedirect('/')
                else:
                    return render(request, self.template_name, {'form': form})
            else:
                return render(request, self.template_name, {'form': form})
        else:
            return render(request, self.template_name, {'form': form})


class RegisterView(View):
    http_method_names = ['get', 'post']
    form_class = RegisterUserForm
    template_name = 'register.html'

    def get(self, request, *args, **kwargs):
        form = self.form_class()
        return render(request, self.template_name, {'form': form})

    def post(self, request, *args, **kwargs):
        form = self.form_class(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/')
        else:
            return render(request, self.template_name, {'form': form})
