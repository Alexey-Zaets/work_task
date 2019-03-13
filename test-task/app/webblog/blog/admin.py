from django.contrib import admin
from .models import Category, Tag, Post, Comment


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    '''
    The class creates an administrator interface for working 
    with the contents of the post model.
    '''
    fields = [
        ('title', 'category'), 'tags', 'content', 'author'
    ]
    list_display = ['title', 'author', 'pub_date']
    filter_horizontal = ['tags']
    search_fields = ['title']
    ordering = ['pub_date', 'title']


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    '''
    The class creates an administrator interface for working 
    with the contents of the comment model.
    '''
    fields = [('post', 'author', 'level'), 'comments', 'comment']
    list_display = ['post', 'comment', 'author', ]


class CategoryAdmin(admin.ModelAdmin):
    '''
    The class creates an administrator interface for working 
    with the contents of the category model.
    '''
    fields = [('title', 'parent')]
    list_display = ['title', 'parent']

admin.site.register(Category, CategoryAdmin)
admin.site.register(Tag)
