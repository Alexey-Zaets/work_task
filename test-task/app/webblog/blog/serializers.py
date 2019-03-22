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
        fields = ('id', 'username')


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
        required=False,
    )

    class Meta:
        model = Category
        fields = ('id', 'title', 'parent')


class TagSerializer(serializers.ModelSerializer):
    '''
    Serialization of Tag model data
    '''
    class Meta:
        model = Tag
        fields = '__all__'


class CommentReadSerializer(serializers.ModelSerializer):
    '''
    Serialization of Comment model data for Post model
    '''
    author = UserSerializer()

    class Meta:
        model = Comment
        fields = ('id', 'author', 'comment', 'comments', 'level')


class PostReadSerializer(serializers.ModelSerializer):
    '''
    Serializetion of Post model data to read
    '''
    author = UserSerializer()
    category = CategorySerializer()
    tags = TagSerializer(many=True)
    comment_set = CommentReadSerializer(read_only=True, many=True)

    class Meta:
        model = Post
        fields = '__all__'


class PostSerializer(serializers.ModelSerializer):
    '''
    Serialization of Post model data
    '''
    comment_set = CommentReadSerializer(read_only=True, many=True)

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
        read_only_fields = ('pub_date',)
