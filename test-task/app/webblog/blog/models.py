from django.urls import reverse
from django.db import models
from django.contrib.auth.models import User
import mptt


class Category(models.Model):
    '''
    The class describes the category table in the database.
    '''
    title = models.CharField(
        'Category title', max_length=100, blank=False, unique=True
    )
    parent = mptt.models.TreeForeignKey(
        'self', on_delete=models.CASCADE, null=True,
        blank=True, related_name='children'
    )

    def __str__(self):
        '''
        The method describes the presentation of data when calling
        an instance of a class.
        '''
        return self.title

    class Meta:
        ordering = ('tree_id', 'level')

    class MPTTMeta:
        order_isertion_by = ['title']


mptt.register(Category, order_isertion_by=['title'])


class Tag(models.Model):
    '''
    The class describes the tag table in the database.
    '''
    title = models.CharField('Tag title', max_length=60, unique=True)

    def __str__(self):
        '''
        The method describes the presentation of data when calling
        an instance of a class.
        '''
        return self.title


class Post(models.Model):
    '''
    The class describes the post table in the database.
    '''
    title = models.CharField('Title', max_length=250, blank=False)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, blank=False, null=True
    )
    tags = models.ManyToManyField(Tag, blank=False)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    pub_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        '''
        The method describes the presentation of data when calling
        an instance of a class.
        '''
        return self.title

    class Meta:
        ordering = ['-pub_date']
        managed = True


class Comment(models.Model):
    '''
    The class describes the comment table in the database.
    '''
    post = models.ForeignKey(Post, on_delete=models.DO_NOTHING)
    author = models.ForeignKey(
        User, on_delete=models.DO_NOTHING, blank=True, null=True
    )
    level = models.IntegerField(default=0)
    comments = models.ManyToManyField(
        'self', related_name='parent+', symmetrical=False, blank=True
    )
    comment = models.TextField()
    pub_date = models.DateTimeField(auto_now_add=True)

    @property
    def get_children(self):
        '''
        The method returns nested responses to the comment.
        '''
        return self.comments.all()
    

    def get_absolute_url(self):
        '''
        The method returns the URL of the post to which the comment belongs.
        '''
        return reverse('post', args=(self.post.id,))

    def __str__(self):
        '''
        The method describes the presentation of data when calling
        an instance of a class.
        '''
        return self.comment
