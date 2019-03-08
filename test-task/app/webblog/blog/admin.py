from django.contrib import admin
from .models import Category, Tag, Post, Comment


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    fieldsets = [
        ('Post', {
            'fields':(
                'title', ('category', 'tags'),
                'content', ('pub_date', 'author'),
            ),
        }),
    ]
    ordering = ['pub_date', 'title']

admin.site.register(Category)
admin.site.register(Tag)
admin.site.register(Comment)
