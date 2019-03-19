from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from blog.models import Post, Category, Tag, Comment


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'is_superuser')


class RegisterUserSerializer(serializers.ModelSerializer):
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
            user = User(
                username=validated_data['username'],
                email=validated_data['email']
            )
            user.set_password(validated_data['password'])
            user.save()
            return user


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'title', 'parent')


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


class PostCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'comment')


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    category = CategorySerializer()
    tags = TagSerializer(many=True)
    comment_set = PostCommentSerializer(many=True)

    class Meta:
        model = Post
        fields = (
            'id', 'title', 'category', 'tags',
            'content', 'comment_set', 'author', 'pub_date'
        )


class CommentSerializer(serializers.ModelSerializer):
    post = PostSerializer()
    author = UserSerializer()

    class Meta:
        model = Comment
        fields = '__all__'
