from django.http import HttpResponseRedirect, Http404
from django.shortcuts import render, get_object_or_404
from django.views import View
from django.views.generic.base import TemplateView
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from django.views.generic.edit import CreateView, UpdateView
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User
from .models import Post, Category, Tag, Comment
from .forms import RegisterUserForm, PostForm, CommentForm
from django.contrib.auth.mixins import LoginRequiredMixin


class ListPageView(ListView):
    http_method_names = ['get']
    template_name = 'index.html'
    model = Post
    paginate_by = 5

    def get_context_data(self, **kwargs):
        context = super(ListPageView, self).get_context_data(**kwargs)
        context['url'] = self.request.path + '?'
        context['tags'] = Tag.objects.all()
        context['category'] = Category.objects.all()
        return context


class HomePageView(ListPageView):

    def get_context_data(self, **kwargs):
        context = super(HomePageView, self).get_context_data(**kwargs)
        return context


class BlogPageView(LoginRequiredMixin, ListPageView):
    login_url = '/login/'

    def get_queryset(self):
        qs = super(BlogPageView, self).get_queryset()
        return self.model.objects.filter(author=self.request.user)

    def get_context_data(self, *args, **kwargs):
        context = super(BlogPageView, self).get_context_data(**kwargs)
        return context


class PostPageView(DetailView):
    http_method_names = ['get']
    model = Post
    template_name = 'post.html'

    def get_context_data(self, **kwargs):
        context = super(PostPageView, self).get_context_data(**kwargs)
        context['form'] = CommentForm()
        context['post_tags'] = Tag.objects.filter(post=kwargs['object'])
        context['comments'] = Comment.objects.filter(
            post=kwargs['object'], level=0
        )
        context['tags'] = Tag.objects.all()
        context['category'] = Category.objects.all()
        return context


class AddCommentView(View):
    form_class = CommentForm
    http_method_names = ['post']

    def post(self, request, *args, **kwargs):
        post = get_object_or_404(Post, id=kwargs.get('pk'))
        author = request.user
        form = self.form_class(request.POST)
        if form.is_valid():
            new_comment = form.save(commit=False)
            new_comment.author, new_comment.post = author, post
            new_comment.save()
        return HttpResponseRedirect('/post/%s' % (kwargs['pk']))


class ReplyCommentView(View):
    form_class = CommentForm
    http_method_names = ['get', 'post']
    template_name = 'comment_form.html'

    def get(self, request, *args, **kwargs):
        comment_id = kwargs.get('id')
        comment = get_object_or_404(Comment, id=comment_id)
        return render(
            request, self.template_name, {
                'comment_id': comment_id,
                'form': self.form_class,
                'tags': Tag.objects.all(),
                'category': Category.objects.all(),
            }
        )

    def post(self, request, *args, **kwargs):
        comment_id = kwargs.get('id')
        comment = get_object_or_404(Comment, id=comment_id)
        post = comment.post
        author = request.user
        form = self.form_class(request.POST)
        if comment.level < 2:
            if form.is_valid():
                new_comment = form.save(commit=False)
                new_comment.author, new_comment.post = author, post
                new_comment.level = comment.level + 1
                new_comment.save()
                comment.comments.add(new_comment)
                message = 'Your comment was added'
            else:
                message = False
        else:
            message = 'You can not add comment'
        return render(
            request, self.template_name, {
                'message': message,
                'comment_id': comment_id,
                'form': self.form_class if message else form,
                'tags': Tag.objects.all(),
                'category': Category.objects.all(),
            }
        )


class AddPostView(LoginRequiredMixin, CreateView):
    model = Post
    form_class = PostForm
    http_method_names = ['get', 'post']
    template_name = 'add_new_post.html'
    login_url = '/login/'

    def get(self, request, *args, **kwargs):
        return render(
            request, self.template_name, {
                'form': self.form_class(),
                'tags': Tag.objects.all(),
                'category': Category.objects.all(),
            }
        )

    def post(self, request, *args, **kwargs):
        author = self.model(author=request.user)
        form = self.form_class(request.POST, instance=author)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/blog/')
        else:
            return render(
                request, self.template_name, {
                    'form': form,
                    'tags': Tag.objects.all(),
                    'category': Category.objects.all(),
                }
            )


class UpdatePostView(LoginRequiredMixin, UpdateView):
    model = Post
    form_class = PostForm
    http_method_names = ['get', 'post']
    template_name = 'update_post.html'
    logint_url = '/login/'

    def get(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        post = get_object_or_404(self.model, id=pk)
        form = self.form_class(instance=post)
        return render(
            request, self.template_name, {
            'form':form, 'pk': pk,
            'tags': Tag.objects.all(),
            'category': Category.objects.all(),
            }
        )

    def post(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        post = self.model.objects.get(id=pk)
        form = self.form_class(request.POST, instance=post)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/blog/')
        else:
            return render(
                request, self.template_name, {
                    'form': form, 'pk': pk,
                    'tags': Tag.objects.all(),
                    'category': Category.objects.all()  
                }
            )


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
