from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from faker import Faker
from blog.models import Tag, Category, Comment, Post


TEST_NAME = 'test'
TEST_EMAIL = 'test@email.com'
TEST_PASSWORD = 'testpassword'
ADMIN_NAME = 'admin'
ADMIN_EMAIL = 'admin@email.com'
ADMIN_PASSWORD = 'admin123456'

fake = Faker()

name = fake.first_name()
email = fake.email()
password = fake.password()
invalid_email = fake.text(max_nb_chars=10)


class CustomAPITestCase(APITestCase):

    def login_user_and_set_credentials(self, username, password):
        url = reverse('user_login')
        data = {'username': username, 'password': password}
        response = self.client.post(url, data)
        token = response.data['token']
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def login_admin_and_set_credentials(self):
        self.login_user_and_set_credentials(ADMIN_NAME, ADMIN_PASSWORD)


class AccountTest(CustomAPITestCase):

    @classmethod
    def setUpTestData(cls):
        User.objects.create_user(
            username=TEST_NAME,
            email=TEST_EMAIL,
            password=TEST_PASSWORD,
        )
        User.objects.create_user(
            username=ADMIN_NAME,
            email=ADMIN_EMAIL,
            password=ADMIN_PASSWORD,
            is_staff=True,
            is_superuser=True
        )

    def test_get_user_list(self):
        url = reverse('user_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_register_user(self):
        url = reverse('user_register')
        data = {
            'username': name,
            'email': email,
            'password': password,
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            User.objects.get(username=name).email, email
        )

    def test_register_user_with_an_existing_name(self):
        url = reverse('user_register')
        data = {
            'username': TEST_NAME,
            'email': fake.email(),
            'password': fake.password(),
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_with_an_existing_email(self):
        url = reverse('user_register')
        data = {
            'username': fake.name(),
            'email': TEST_EMAIL,
            'password': fake.password(),
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_user_with_invalid_email(self):
        url = reverse('user_register')
        data = {
            'username': fake.name(),
            'email': invalid_email,
            'password': password
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_registered_user(self):
        url = reverse('user_login')
        data = {'username': TEST_NAME, 'password': TEST_PASSWORD}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_login_user_with_invalid_password(self):
        url = reverse('user_login')
        data = {'username': TEST_NAME, 'password': fake.password()}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_user_with_invalid_username(self):
        url = reverse('user_login')
        data = {'username': fake.name(), 'password': TEST_PASSWORD}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_user(self):
        self.login_admin_and_set_credentials()
        user_to_delete = User.objects.get(username=TEST_NAME)
        response = self.client.delete(
            'http://0.0.0.0/api/v1/user/{}/'.format(user_to_delete.id)
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.get(username=TEST_NAME).is_active)

    def test_delete_user_without_permissions(self):
        user_to_delete = User.objects.get(username=TEST_NAME)
        response = self.client.delete(
            'http://0.0.0.0/api/v1/user/{}/'.format(user_to_delete.id)
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertTrue(User.objects.get(username=TEST_NAME).is_active)


class TagTest(CustomAPITestCase):

    @classmethod
    def setUpTestData(cls):
        Tag.objects.create(title='testtag')
        User.objects.create_user(
            username=ADMIN_NAME,
            email=ADMIN_EMAIL,
            password=ADMIN_PASSWORD,
            is_staff=True,
            is_superuser=True
        )

    def test_get_tag_list(self):
        url = reverse('tag_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_not_unique_tag(self):
        self.login_admin_and_set_credentials()
        url = reverse('tag_list')
        data = {'title': 'testtag'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_not_unique_tag_without_permissions(self):
        url = reverse('tag_list')
        data = {'title': 'testtag'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_unique_tag(self):
        self.login_admin_and_set_credentials()
        url = reverse('tag_list')
        data = {'title': 'unique'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_update_existing_tag(self):
        self.login_admin_and_set_credentials()
        tag = Tag.objects.get(title='testtag')
        response = self.client.patch(
            'http://0.0.0.0/api/v1/tag/{}/'.format(tag.id),
            {'title': 'new_title'}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Tag.objects.get(title='new_title'))

    def test_update_existing_tag_without_permissions(self):
        tag = Tag.objects.get(title='testtag')
        response = self.client.patch(
            'http://0.0.0.0/api/v1/tag/{}/'.format(tag.id),
            {'title': 'new_title'}
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_existing_tag(self):
        self.login_admin_and_set_credentials()
        tag = Tag.objects.get(title='testtag')
        response = self.client.delete(
            'http://0.0.0.0/api/v1/tag/{}/'.format(tag.id)
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(
            self.client.get(
                'http://0.0.0.0/api/v1/tag/{}/'.format(tag.id)
            ).status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_delete_existing_tag_without_permissions(self):
        tag = Tag.objects.get(title='testtag')
        response = self.client.delete(
            'http://0.0.0.0/api/v1/tag/{}/'.format(tag.id)
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CategoryTest(CustomAPITestCase):

    @classmethod
    def setUpTestData(cls):
        Category.objects.create(title='News')
        User.objects.create_user(
            username=ADMIN_NAME,
            email=ADMIN_EMAIL,
            password=ADMIN_PASSWORD,
            is_staff=True,
            is_superuser=True
        )

    def test_get_category_list(self):
        url = reverse('category_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_not_unique_category(self):
        self.login_admin_and_set_credentials()
        url = reverse('category_list')
        data = {'title': 'News'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_unique_category(self):
        self.login_admin_and_set_credentials()
        url = reverse('category_list')
        data = {'title': 'Python', 'parent': None}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_category_with_parent(self):
        self.login_admin_and_set_credentials()
        category = Category.objects.get(title='News')
        url = reverse('category_list')
        data = {'title': 'Python', 'parent': category.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Category.objects.get(title='Python'))
        self.assertTrue(
            Category.objects.get(title='Python').parent.title == 'News'
        )

    def test_create_category_without_permissions(self):
        url = reverse('category_list')
        data = {'title': 'Python', 'parent': None}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_category_title(self):
        self.login_admin_and_set_credentials()
        category = Category.objects.get(title='News')
        category_parent = category.parent
        response = self.client.patch(
            'http://0.0.0.0/api/v1/category/{}/'.format(category.id),
            {'title': 'New_title', 'parent': category_parent}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Category.objects.get(title='New_title'))

    def test_update_category_without_permissions(self):
        category = Category.objects.get(title='News')
        category_parent = category.parent
        response = self.client.patch(
            'http://0.0.0.0/api/v1/category/{}/'.format(category.id),
            {'title': 'New_title', 'parent': category_parent}
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_existing_category(self):
        self.login_admin_and_set_credentials()
        category = Category.objects.get(title='News')
        category_parent = category.parent
        response = self.client.delete(
            'http://0.0.0.0/api/v1/category/{}/'.format(category.id),
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(
            self.client.get(
                'http://0.0.0.0/api/v1/category/{}/'.format(category.id)
            ).status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_delete_category_without_permissions(self):
        category = Category.objects.get(title='News')
        category_parent = category.parent
        response = self.client.delete(
            'http://0.0.0.0/api/v1/category/{}/'.format(category.id),
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CommentTest(CustomAPITestCase):

    @classmethod
    def setUpTestData(cls):
        User.objects.create_user(
            username=ADMIN_NAME, 
            email=ADMIN_EMAIL,
            password=ADMIN_PASSWORD,
            is_staff=True,
            is_superuser=True
        )
        user = User.objects.get(username=ADMIN_NAME)
        Category.objects.create(title='News')
        category = Category.objects.get(title='News')
        Tag.objects.create(title='testtag')
        tag = Tag.objects.get(title='testtag')
        post = Post(
            title='First post',
            category=category,
            author=user,
            content='Test content'
        )
        post.save()
        post.tags.add(tag)
        post.save()
        Comment.objects.create(
            post=post,
            author=user,
            comment='Test comment'
        )

    def test_get_comment_list(self):
        url = reverse('comment_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_anonymous_user_create_comment(self):
        url = reverse('comment_list')
        post = Post.objects.get(title='First post')
        data = {'post': post.id, 'comment': 'First comment'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            Comment.objects.get(comment='First comment').author,
            None
        )

    def test_authenticated_user_create_comment(self):
        self.login_admin_and_set_credentials()
        url = reverse('comment_list')
        post = Post.objects.get(title='First post')
        data = {'post': post.id, 'comment': 'First comment'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            Comment.objects.get(comment='First comment').author.username,
            ADMIN_NAME
        )

    def test_update_comment(self):
        self.login_admin_and_set_credentials()
        comment = Comment.objects.get(author__username=ADMIN_NAME)
        data = {
            'comment': 'Second comment'
        }
        response = self.client.patch(
            'http://0.0.0.0/api/v1/comment/{}/'.format(comment.id),
            data
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Comment.objects.get(comment='Second comment'))

    def update_comment_without_permissions(self):
        comment = Comment.objects.get(author__username=ADMIN_NAME)
        data = {
            'level': 1,
            'comment': 'Second comment'
        }
        response = self.client.patch(
            'http://0.0.0.0/api/v1/comment/{}/'.format(comment.id),
            data
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_comment(self):
        self.login_admin_and_set_credentials()
        admin = User.objects.get(username=ADMIN_NAME)
        comment = Comment.objects.get(author=admin.id)
        response = self.client.delete(
            'http://0.0.0.0/api/v1/comment/{}/'.format(comment.id)
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_comment_without_permissions(self):
        admin = User.objects.get(username=ADMIN_NAME)
        comment = Comment.objects.get(author=admin.id)
        response = self.client.delete(
            'http://0.0.0.0/api/v1/comment/{}/'.format(comment.id)
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class PostTest(CustomAPITestCase):

    @classmethod
    def setUpTestData(cls):
        User.objects.create_user(
            username=ADMIN_NAME, 
            email=ADMIN_EMAIL,
            password=ADMIN_PASSWORD,
            is_staff=True,
            is_superuser=True
        )
        user = User.objects.get(username=ADMIN_NAME)
        Category.objects.create(title='News')
        category = Category.objects.get(title='News')
        Tag.objects.create(title='testtag')
        tag = Tag.objects.get(title='testtag')
        post = Post(
            title='First post',
            category=category,
            author=user,
            content='Test content'
        )
        post.save()
        post.tags.add(tag)
        post.save()

    def test_get_post_list(self):
        url = reverse('post_list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_new_post(self):
        self.login_admin_and_set_credentials()
        url = reverse('post_list')
        tag = Tag.objects.get(title='testtag')
        category = Category.objects.get(title='News')
        user = User.objects.get(username=ADMIN_NAME)
        data = {
            'title': 'New post',
            'category': category.id,
            'tags': [tag.id,],
            'content': 'New test content',
            'author': user.id
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Post.objects.get(title='New post'))

    def test_create_new_post_without_permissions(self):
        url = reverse('post_list')
        tag = Tag.objects.get(title='testtag')
        category = Category.objects.get(title='News')
        user = User.objects.get(username=ADMIN_NAME)
        data = {
            'title': 'New post',
            'category': category.id,
            'tags': [tag.id,],
            'content': 'New test content',
            'author': user.id
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_upadte_post(self):
        self.login_admin_and_set_credentials()
        post = Post.objects.get(title='First post')
        data = {
            'title': 'Updated post',
            'content': 'Changed content',
        }
        response = self.client.patch(
            'http://0.0.0.0/api/v1/post/{}/'.format(post.id),
            data
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(Post.objects.get(title='Updated post'))
        self.assertEqual(
            Post.objects.get(title='Updated post').content,
            'Changed content'
        )

    def test_update_post_without_permissions(self):
        post = Post.objects.get(title='First post')
        data = {
            'title': 'Updated post',
            'content': 'Changed content',
        }
        response = self.client.patch(
            'http://0.0.0.0/api/v1/post/{}/'.format(post.id),
            data
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_post(self):
        self.login_admin_and_set_credentials()
        post = Post.objects.get(title='First post')
        response = self.client.delete(
            'http://0.0.0.0/api/v1/post/{}/'.format(post.id)
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_post_without_permissions(self):
        post = Post.objects.get(title='First post')
        response = self.client.delete(
            'http://0.0.0.0/api/v1/post/{}/'.format(post.id)
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
