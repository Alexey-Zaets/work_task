from django.contrib import admin
from mptt.admin import MPTTModelAdmin
from .models import Category, Tag, Post, Comment


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    fields = [
        ('title', 'category'), 'tags', 'content', 'author'
    ]
    list_display = ['title', 'author', 'pub_date']
    filter_horizontal = ['tags']
    search_fields = ['title']
    ordering = ['pub_date', 'title']


class CategoryAdmin(admin.ModelAdmin):
    fields = [('title', 'parent')]
    list_display = ['title', 'parent']

admin.site.register(Category, CategoryAdmin)
admin.site.register(Tag)
admin.site.register(Comment)
