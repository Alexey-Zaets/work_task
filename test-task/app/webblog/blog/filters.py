import django_filters
from blog.models import Post


class PostFilter(django_filters.FilterSet):
    
    class Meta:
        model = Post
        fields = ['author__username', 'category__title', 'tags__title']