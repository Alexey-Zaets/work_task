from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .models import Post, Comment


class RegisterUserForm(UserCreationForm):
    '''
    The class describes a template form for user registration.
    Expands the built-in registration form.
    '''
    email = forms.EmailField()

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')


class PostForm(forms.ModelForm):
    '''
    The class describes a template form for creating new posts.
    '''

    class Meta:
        model = Post
        fields = ['title', 'category', 'tags', 'content']


class CommentForm(forms.ModelForm):
    '''
    The class describes a tamplate form for creating new comments.
    '''
    
    class Meta:
        model = Comment
        fields = ['comment']
