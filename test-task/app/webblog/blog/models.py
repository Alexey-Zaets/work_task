import mptt
from django.db import models
from mptt.models import MPTTModel, TreeForeignKey
from django.contrib.auth.models import User


class Category(models.Model):
    title = models.CharField('Category title', max_length=100, blank=False)
    parent = TreeForeignKey(
        'self', on_delete=models.CASCADE, null=True,
        blank=True, related_name='children'
    )

    def __str__(self):
        return self.title

    class Meta:
        ordering = ('tree_id', 'level')

    class MPTTMeta:
        order_isertion_by = ['title']


mptt.register(Category, order_isertion_by=['title'])


class Tag(models.Model):
    title = models.CharField('Tag title', max_length=60)

    def __str__(self):
        return self.title


class Post(models.Model):
    title = models.CharField('Title', max_length=250, blank=False)
    category = TreeForeignKey(
        Category, on_delete=models.DO_NOTHING, blank=False
    )
    tags = models.ManyToManyField(Tag, blank=False)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    pub_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-pub_date']
        managed = True


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.DO_NOTHING)
    author = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    level = models.IntegerField(default=0)
    comments = models.ManyToManyField(
        'self', related_name='parent+', symmetrical=False, blank=True
    )
    comment = models.TextField()
    pub_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.comment

