import mptt
from django.db import models
from mptt.models import MPTTModel, TreeForeignKey
from django.contrib.auth.models import User


class Category(models.Model):
    title = models.CharField('Category title', max_length=100, blank=False)
    description = models.CharField('Description', max_length=200, blank=True)
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


class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    comment = models.TextField()

    def __str__(self):
        return self.comment


class Post(models.Model):
    title = models.CharField('Title', max_length=250, blank=False)
    category = TreeForeignKey(
        Category, on_delete=models.DO_NOTHING, blank=False
    )
    tags = models.ManyToManyField(Tag, blank=False)
    content = models.TextField()
    comments = models.ForeignKey(Comment, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    pub_date = models.DateField(auto_now_add=False)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-pub_date']
        managed = True
