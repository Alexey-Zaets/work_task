from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from blog.models import Post, Category, Tag, Comment


class UserSerializer(serializers.ModelSerializer):
    '''
    Serialization of User model data
    '''
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'is_superuser')


class RegisterUserSerializer(serializers.ModelSerializer):
    '''
    Data serialization for user registration
    '''
    email = serializers.EmailField(
        validators=[UniqueValidator(
            queryset=User.objects.all(),
            message='Email already exists'
        )]
    )

    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        '''
        Create user. Returns user object
        '''
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class CategorySerializer(serializers.ModelSerializer):
    '''
    Serialization of Category model data
    '''
    parent = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        allow_null=True,
    )
    class Meta:
        model = Category
        fields = ('title', 'parent')


class TagSerializer(serializers.ModelSerializer):
    '''
    Serialization of Tag model data
    '''
    class Meta:
        model = Tag
        fields = '__all__'


class CommentPostSerializer(serializers.ModelSerializer):
    '''
    Serialization of Comment model data for Post model
    '''
    class Meta:
        model = Comment
        fields = ('id', 'author', 'comment', 'level')


class PostSerializer(serializers.ModelSerializer):
    '''
    Serialization of Post model data
    '''
    author = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all()
    )
    category = CategorySerializer()
    tags = TagSerializer(many=True)
    comment_set = CommentPostSerializer(read_only=True, many=True)

    class Meta:
        model = Post
        fields = (
            'id', 'title', 'category', 'tags',
            'content', 'comment_set', 'author', 'pub_date'
        )


class CommentSerializer(serializers.ModelSerializer):
    '''
    Serialization of Comment data
    '''
    post = serializers.PrimaryKeyRelatedField(queryset=Post.objects.all())

    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ('comments', 'pub_date',)
