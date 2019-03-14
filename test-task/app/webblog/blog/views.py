from django.http import HttpResponseRedirect, Http404
from django.shortcuts import render, get_object_or_404, redirect
from django.views import View
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from django.views.generic.edit import CreateView, UpdateView
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.models import User
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Post, Category, Tag, Comment
from .forms import RegisterUserForm, PostForm, CommentForm



class ListPageView(ListView):
    '''
    The class contains general data for the classes using it.
    '''
    http_method_names = ['get']
    template_name = 'index.html'
    model = Post
    paginate_by = 5

    def get_context_data(self, **kwargs):
        '''
        The method adds general data to the template.
        '''
        context = super(ListPageView, self).get_context_data(**kwargs)
        context['url'] = self.request.path + '?'
        context['tags'] = Tag.objects.all()
        context['category'] = Category.objects.all()
        context['ten'] = Comment.objects.all().order_by('-pub_date')
        return context


class HomePageView(ListPageView):
    '''
    The class describes the presentation of the home page.
    '''

    def get_context_data(self, **kwargs):
        context = super(HomePageView, self).get_context_data(**kwargs)
        return context


class BlogPageView(LoginRequiredMixin, ListPageView):
    '''
    The class describes the presentation of the home page.
    '''
    login_url = '/login/'

    def get_queryset(self):
        '''
        The method determines the data that will be presented
        by another method.
        '''
        qs = super(BlogPageView, self).get_queryset()
        return self.model.objects.filter(author=self.request.user)

    def get_context_data(self, *args, **kwargs):
        '''
        The method adds the data defined in the get_queryset method
        to the template.
        '''
        context = super(BlogPageView, self).get_context_data(**kwargs)
        return context


class PostPageView(DetailView):
    '''
    The class describes the presentation of the post page and processes
    the requests.
    '''
    http_method_names = ['get']
    model = Post
    template_name = 'post.html'

    def get_context_data(self, **kwargs):
        '''
        The method defines and adds data to the template.
        '''
        context = super(PostPageView, self).get_context_data(**kwargs)
        context['form'] = CommentForm()
        context['post_tags'] = Tag.objects.filter(post=kwargs['object'])
        context['comments'] = Comment.objects.filter(
            post=kwargs['object'], level=0
        )
        context['tags'] = Tag.objects.all()
        context['category'] = Category.objects.all()
        context['ten'] = Comment.objects.all().order_by('-pub_date')
        return context


class AddCommentView(CreateView):
    '''
    The class handles requests related to creating and adding comments.
    '''
    form_class = CommentForm
    http_method_names = ['post']

    def post(self, request, *args, **kwargs):
        '''
        The method processes the request to save the comment in the database.
        '''
        post = get_object_or_404(Post, id=kwargs.get('pk'))
        author = request.user
        form = self.form_class(request.POST)
        if form.is_valid():
            new_comment = form.save(commit=False)
            new_comment.author = author if isinstance(author, User) else None
            new_comment.post = post
            new_comment.save()
        return redirect(new_comment.get_absolute_url())


class ReplyCommentView(CreateView):
    '''
    The class handles requests related to replying comments.
    '''
    form_class = CommentForm
    http_method_names = ['get', 'post']
    template_name = 'comment_form.html'
    model = Comment

    def get(self, request, *args, **kwargs):
        '''
        The method returns form to user for reply.
        '''
        comment_id = kwargs.get('id')
        comment = get_object_or_404(self.model, id=comment_id)
        return render(
            request, self.template_name, {
                'comment_id': comment_id,
                'form': self.form_class,
                'tags': Tag.objects.all(),
                'category': Category.objects.all(),
            }
        )

    def post(self, request, *args, **kwargs):
        '''
        The method processes the request to save the reply in the database.
        '''
        comment_id = kwargs.get('id')
        comment = get_object_or_404(self.model, id=comment_id)
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
        return redirect(comment.get_absolute_url())


class AddPostView(LoginRequiredMixin, CreateView):
    '''
    The class handles requests related to creating post.
    '''
    model = Post
    form_class = PostForm
    http_method_names = ['get', 'post']
    template_name = 'add_new_post.html'
    login_url = '/login/'

    def get(self, request, *args, **kwargs):
        '''
        The method returns form to user for create post.
        '''
        return render(
            request, self.template_name, {
                'form': self.form_class(),
                'tags': Tag.objects.all(),
                'category': Category.objects.all(),
                'ten': Comment.objects.all().order_by('-pub_date')
            }
        )

    def post(self, request, *args, **kwargs):
        '''
        The method processes the request to save the post in the database.
        '''
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
                    'ten': Comment.objects.all().order_by('-pub_date')
                }
            )


class UpdatePostView(LoginRequiredMixin, UpdateView):
    '''
    The class handles requests related to updating post.
    '''
    model = Post
    form_class = PostForm
    http_method_names = ['get', 'post']
    template_name = 'update_post.html'
    logint_url = '/login/'

    def get(self, request, *args, **kwargs):
        '''
        The method returns form to user for update post.
        '''
        pk = kwargs.get('pk')
        post = get_object_or_404(self.model, id=pk)
        form = self.form_class(instance=post)
        return render(
            request, self.template_name, {
                'form':form,
                'pk': pk,
                'tags': Tag.objects.all(),
                'category': Category.objects.all(),
                'ten': Comment.objects.all().order_by('-pub_date')
            }
        )

    def post(self, request, *args, **kwargs):
        '''
        The method processes the request to save the updated post
        in the database.
        '''
        pk = kwargs.get('pk')
        post = self.model.objects.get(id=pk)
        form = self.form_class(request.POST, instance=post)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/blog/')
        else:
            return render(
                request, self.template_name, {
                    'form': form,
                    'pk': pk,
                    'tags': Tag.objects.all(),
                    'category': Category.objects.all()  
                }
            )


class TagListView(ListPageView):
    '''
    The class handles requests to receive posts on the corresponding tag
    '''

    def get_queryset(self):
        '''
        The method determines the data that will be presented
        by another method.
        '''
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
    '''
    The class handles requests to receive posts on the corresponding category
    '''

    def get_queryset(self):
        '''
        The method determines the data that will be presented
        by another method.
        '''
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
    '''
    The class handles user authentication.
    '''
    http_method_names = ['get', 'post']
    form_class = AuthenticationForm
    template_name = 'login.html'

    def get(self, request, *args, **kwargs):
        '''
        The method returns form to user for authenticate.
        '''
        form = self.form_class()
        return render(request, self.template_name, {'form': form})

    def post(self, request, *args, **kwargs):
        '''
        The method checks the data specified by the user and
        authenticates the user or not.
        '''
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
    '''
    The class handles user registration.
    '''
    http_method_names = ['get', 'post']
    form_class = RegisterUserForm
    template_name = 'register.html'

    def get(self, request, *args, **kwargs):
        '''
        The method returns form to user for registrate.
        '''
        form = self.form_class()
        return render(request, self.template_name, {'form': form})

    def post(self, request, *args, **kwargs):
        '''
        The method checks the data specified by the user and
        registers the user.
        '''
        form = self.form_class(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/')
        else:
            return render(request, self.template_name, {'form': form})
